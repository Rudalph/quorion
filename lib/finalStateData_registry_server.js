import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "./finalStateData_registry.json";

const PROGRAM_ID = new PublicKey(
  "GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt"
);

const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

const secretKey = Uint8Array.from([
   56,  81, 236, 148, 182,  72,  34, 240,  30,  23, 110,
   71, 226,   7, 140, 157, 135, 127, 245,  67, 246,   5,
   63, 107, 207, 144,  56,  91, 195, 103, 130, 217, 210,
   47,   1, 253,  71, 158,  72,  88, 245, 237, 174, 246,
  185, 137, 155, 189, 119,  12, 251, 219,  68,  45,  76,
   42, 255,   2, 156,  71, 189, 101,  77,  39
]);

const serverKeypair = Keypair.fromSecretKey(secretKey);

const wallet = {
  publicKey: serverKeypair.publicKey,
  signTransaction: async (tx) => {
    tx.partialSign(serverKeypair);
    return tx;
  },
  signAllTransactions: async (txs) => {
    txs.forEach((tx) => tx.partialSign(serverKeypair));
    return txs;
  },
};

const provider = new AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

const program = new Program(idl, PROGRAM_ID, provider);

export function getFinalStateRegistryPda() {
  const [registryPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("final-state-registry")],
    PROGRAM_ID
  );

  return registryPda;
}

export async function saveFinalStateDataToBlockchain(finalStateData) {
  const registryPda = getFinalStateRegistryPda();

  const items = finalStateData.map((item) => ({
    id: String(item.id),
    name: String(item.name),
    riskScore: Number(item.riskScore || 0),
    isDeprecated: Boolean(item.isDeprecated),
    isDefault: Boolean(item.isDefault),
  }));

  const tx = await program.methods
    .saveFinalState(items)
    .accounts({
      registry: registryPda,
      authority: serverKeypair.publicKey,
    })
    .rpc();

  return tx;
}

export async function initializeRegistry() {
  const registryPda = getFinalStateRegistryPda();

  const tx = await program.methods
    .initialize()
    .accounts({
      registry: registryPda,
      authority: serverKeypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}