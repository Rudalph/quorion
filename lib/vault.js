import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import idl from "./vault.json";

export const VAULT_PROGRAM_ID = new PublicKey(
  "HYMteAnf2z3BmBMEQDDiukeq5pL2T73yimf35JjjuWWJ"
);

export function getVaultProgram(connection, wallet) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  return new anchor.Program(idl, VAULT_PROGRAM_ID, provider);
}

export function getVaultPda(ownerPublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), ownerPublicKey.toBuffer()],
    VAULT_PROGRAM_ID
  );
}

export async function initializeVault({ program, ownerPublicKey }) {
  const [vaultPda] = getVaultPda(ownerPublicKey);

  const tx = await program.methods
    .initializeVault()
    .accounts({
      vault: vaultPda,
      owner: ownerPublicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { tx, vaultPda };
}

export async function depositToVault({ program, ownerPublicKey, amountSol }) {
  const [vaultPda] = getVaultPda(ownerPublicKey);

  const amountLamports = new anchor.BN(
    Math.floor(Number(amountSol) * LAMPORTS_PER_SOL)
  );

  const tx = await program.methods
    .deposit(amountLamports)
    .accounts({
      vault: vaultPda,
      owner: ownerPublicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { tx, vaultPda };
}

export async function transferFromVault({
  program,
  ownerPublicKey,
  receiverAddress,
  amountSol,
  verificationResults = ["valid", "valid", "valid"],
}) {
  const [vaultPda] = getVaultPda(ownerPublicKey);
  const receiver = new PublicKey(receiverAddress);

  const amountLamports = new anchor.BN(
    Math.floor(Number(amountSol) * LAMPORTS_PER_SOL)
  );

  const tx = await program.methods
    .transferFromVault(amountLamports, verificationResults)
    .accounts({
      vault: vaultPda,
      owner: ownerPublicKey,
      receiver,
    })
    .rpc();

  return { tx, vaultPda };
}

export async function getVaultBalance({ connection, ownerPublicKey }) {
  const [vaultPda] = getVaultPda(ownerPublicKey);

  const balanceLamports = await connection.getBalance(vaultPda);
  const balanceSol = balanceLamports / LAMPORTS_PER_SOL;

  return {
    vaultPda,
    balanceLamports,
    balanceSol,
  };
}