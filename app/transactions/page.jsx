"use client";

import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import crypto from "crypto-js";

import {
  getSolTransferProgram,
  sendSol,
} from "../../lib/solTransfer";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const program = useMemo(() => {
    return getSolTransferProgram(connection, wallet);
  }, [connection, wallet.publicKey]);

  async function handleTransferSol() {
    try {
      setLoading(true);
      setSignature("");

      
      const senderAddress = wallet.publicKey?.toString() || "";
      const receiverAddress = receiver;
      const transferAmount = amount;
      const messageString = `${senderAddress}-${receiverAddress}-${transferAmount}`;
      const messageHash = crypto.SHA256(messageString).toString();
      console.log("Transaction Message Hash:", messageHash);

      // Call the signing-message API
      try {
        await fetch("/api/signing-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: messageHash,
            walletAddress: wallet.publicKey?.toString() 
          }),
        });
      } catch (apiError) {
        console.error("Error calling signing-message API:", apiError);
      }

      const tx = await sendSol({
        program,
        senderPublicKey: wallet.publicKey,
        receiver,
        amount,
      });

      setSignature(tx);
    } catch (error) {
      console.error(error);
      alert(error.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center">SOL Transfer DApp</h1>

        <div className="flex justify-center">
          <WalletMultiButton />
        </div>

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Receiver wallet address"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Amount in SOL"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={handleTransferSol}
          disabled={loading || !wallet.connected}
          className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send SOL"}
        </button>

        {signature && (
          <p className="text-sm break-all">
            Transaction Signature:{" "}
            <a
              className="text-blue-600 underline"
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
            >
              {signature}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
