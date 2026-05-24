"use client";

import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import AlgorithmSelector from "@/components/AlgorithmSelector";

import {
  getVaultProgram,
  initializeVault,
  depositToVault,
  transferFromVault,
  getVaultBalance,
} from "../../lib/vault";

import SHA256 from "crypto-js/sha256";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function TransactPage() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [depositAmount, setDepositAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [signature, setSignature] = useState("");
  const [vaultBalance, setVaultBalance] = useState(null);
  const [vaultAddress, setVaultAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);

  const program = useMemo(() => {
    if (!wallet.publicKey) return null;
    return getVaultProgram(connection, wallet);
  }, [connection, wallet.publicKey]);

  async function handleInitializeVault() {
    try {
      if (!program || !wallet.publicKey) {
        alert("Connect wallet first");
        return;
      }

      setLoading(true);
      setSignature("");

      const { tx } = await initializeVault({
        program,
        ownerPublicKey: wallet.publicKey,
      });

      setSignature(tx);
      alert("Vault initialized successfully");
    } catch (error) {
      console.error(error);
      alert("Vault may already be initialized or transaction failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewVaultBalance() {
    try {
      if (!wallet.publicKey) {
        alert("Connect wallet first");
        return;
      }

      const { vaultPda, balanceSol } = await getVaultBalance({
        connection,
        ownerPublicKey: wallet.publicKey,
      });

      setVaultAddress(vaultPda.toBase58());
      setVaultBalance(balanceSol);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch vault balance");
    }
  }

  async function handleDeposit() {
    try {
      if (!program || !wallet.publicKey) {
        alert("Connect wallet first");
        return;
      }

      if (!depositAmount) {
        alert("Enter deposit amount");
        return;
      }

      setLoading(true);
      setSignature("");

      const { tx } = await depositToVault({
        program,
        ownerPublicKey: wallet.publicKey,
        amountSol: depositAmount,
      });

      setSignature(tx);
      alert("Deposit successful");
      await handleViewVaultBalance();
    } catch (error) {
      console.error(error);
      alert("Deposit failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer() {
    try {
      if (!program || !wallet.publicKey) {
        alert("Connect wallet first");
        return;
      }

      if (!receiver || !transferAmount) {
        alert("Enter receiver address and amount");
        return;
      }
       
      setLoading(true);
      setSignature("");

      const senderAddress = wallet.publicKey.toString();
      const receiverAddress = receiver;
      const amountToSend = transferAmount;
      const messageString = `${senderAddress}-${receiverAddress}-${amountToSend}`;
      const messageHash = SHA256(messageString).toString();
      console.log("Transaction Message:", messageString);
      console.log("Transaction Message Hash:", messageHash);

      try {
        const res =await fetch("/api/signing-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: messageHash,
            walletAddress: wallet.publicKey?.toString() 
          }),
        });
        const data = await res.json();
        console.log("Signatures:", data.signatures);
        console.log("Verification:", data.verification);
        const statusArray = Object.values(data.verification).map(v => v.status.toLowerCase());
        console.log("Statuses:", statusArray);
      } catch (apiError) {
        console.error("Error calling signing-message API:", apiError);
      }

      const { tx } = await transferFromVault({
        program,
        ownerPublicKey: wallet.publicKey,
        receiverAddress: receiver,
        amountSol: transferAmount,
        verificationResults: statuses,
      });

      setSignature(tx);
      alert("Transfer from vault successful");
      await handleViewVaultBalance();
    } catch (error) {
      console.error(error);
      alert(
        "Transfer failed. Verification may be invalid or vault has insufficient funds."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* DASHBOARD PANEL */}
        <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">Crypto Agile Vault</h1>
            <p className="text-slate-300 mt-3 text-sm">
              Vault-based SOL transfer with simulated multi-algorithm
              verification.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>

            <button
              onClick={handleInitializeVault}
              disabled={loading || !wallet.connected}
              className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              Initialize Vault
            </button>

            <button
              onClick={handleViewVaultBalance}
              disabled={!wallet.connected}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              View Vault Balance
            </button>
          </div>

          {vaultBalance !== null && (
            <div className="mt-6 bg-slate-800 rounded-xl p-4 text-sm">
              <p className="text-slate-400">Vault Balance</p>
              <p className="text-2xl font-bold mt-1">{vaultBalance} SOL</p>

              <p className="text-slate-400 mt-4">Vault Address</p>
              <p className="break-all text-xs mt-1">{vaultAddress}</p>
            </div>
          )}
        </div>

        {/* ALGORITHM PANEL */}
        <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Select Algorithm
          </h2>

          <p className="text-sm text-slate-500">
            Select cryptographic algorithms and generate keys for verification.
          </p>

          <div className="w-full">
            <AlgorithmSelector />
          </div>
        </div>

        {/* DEPOSIT PANEL */}
        <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Deposit Assets
          </h2>

          <p className="text-sm text-slate-500">
            Move SOL from your wallet into your secure vault.
          </p>

          <input
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount in SOL"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />

          <button
            onClick={handleDeposit}
            disabled={loading || !wallet.connected}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Deposit to Vault
          </button>
        </div>

        {/* TRANSFER PANEL */}
        <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Transfer from Vault
          </h2>

          <p className="text-sm text-slate-500">
            Transfer SOL only after simulated algorithm verification passes.
          </p>

          <input
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Receiver wallet address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />

          <input
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Amount in SOL"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />

          <button
            onClick={handleTransfer}
            disabled={loading || !wallet.connected}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            Submit Transfer
          </button>
        </div>

        {/* TRANSACTION SIGNATURE */}
        {signature && (
          <div className="lg:col-span-4 bg-slate-100 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-slate-900">
              Transaction Signature
            </p>
            <p className="break-all text-slate-600 mt-1">{signature}</p>
          </div>
        )}
      </div>
    </main>
  );
}