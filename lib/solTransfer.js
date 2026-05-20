import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "./sol_transfer.json";

const PROGRAM_ID = new PublicKey(
  "Bq4smtjAymfow7ptoyBwwCW4kKV2hpCwX8HZNCWMWmjX"
);

export function getSolTransferProgram(connection, wallet) {
  if (!wallet?.publicKey) return null;

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  return new Program(idl, PROGRAM_ID, provider);
}

export async function sendSol({ program, senderPublicKey, receiver, amount }) {
  if (!program || !senderPublicKey) {
    throw new Error("Wallet not connected.");
  }

  const receiverPubkey = new PublicKey(receiver);
  const lamports = Number(amount) * 1_000_000_000;

  if (!lamports || lamports <= 0) {
    throw new Error("Enter a valid SOL amount.");
  }

  const tx = await program.methods
    .transferSol(new BN(lamports))
    .accounts({
      sender: senderPublicKey,
      receiver: receiverPubkey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}