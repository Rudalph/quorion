import { getLastTransactions } from "@/lib/solana";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return Response.json({ error: "Wallet address required" }, { status: 400 });
  }

  try {
    const transactions = await getLastTransactions(wallet, 10);
    return Response.json({ transactions });
  } catch (err) {
    console.error("[/api/txns] Error:", err);
    return Response.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}