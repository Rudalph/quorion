import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export async function getLastTransactions(walletAddress, limit = 10) {
  const pubKey = new PublicKey(walletAddress);

  const signatures = await connection.getSignaturesForAddress(pubKey, { limit });

  if (!signatures.length) return [];

  const transactions = await Promise.all(
    signatures.map(async (sigInfo) => {
      try {
        const tx = await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
        });

        const accountKeys = tx?.transaction?.message?.accountKeys ?? [];
        const walletIndex = accountKeys.findIndex(
          (k) => k.pubkey.toString() === walletAddress
        );
        const index = walletIndex >= 0 ? walletIndex : 0;

        const balanceChange =
          tx?.meta
            ? (tx.meta.postBalances[index] - tx.meta.preBalances[index]) / 1e9
            : null;

        return {
          signature: sigInfo.signature,
          timestamp: sigInfo.blockTime
            ? new Date(sigInfo.blockTime * 1000).toLocaleString()
            : "N/A",
          status: sigInfo.err ? "Failed" : "Success",
          fee: tx?.meta?.fee != null ? tx.meta.fee / 1e9 : null,
          balanceChange,
          instructions: tx?.transaction?.message?.instructions?.length ?? 0,
          slot: sigInfo.slot,
        };
      } catch {
        return {
          signature: sigInfo.signature,
          timestamp: "N/A",
          status: sigInfo.err ? "Failed" : "Success",
          fee: null,
          balanceChange: null,
          instructions: 0,
          slot: sigInfo.slot,
        };
      }
    })
  );

  return transactions;
}