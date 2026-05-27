"use client";
import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

function shortSig(sig) {
  return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
}

function formatSOL(value) {
  if (value == null) return "—";
  const abs = Math.abs(value);
  return abs === 0 ? "0 SOL" : `${abs.toFixed(6).replace(/\.?0+$/, "")} SOL`;
}

function BalanceChange({ value }) {
  if (value == null) return <span style={{ color: "#888" }}>—</span>;
  if (value === 0) return <span style={{ color: "#888" }}>0 SOL</span>;
  const isPos = value > 0;
  return (
    <span style={{ color: isPos ? "#16a34a" : "#dc2626", fontWeight: 500 }}>
      {isPos ? "+" : "−"}{formatSOL(value)}
    </span>
  );
}

function StatusBadge({ status }) {
  const ok = status === "Success";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.04em",
      padding: "3px 10px",
      borderRadius: 99,
      background: ok ? "#dcfce7" : "#fee2e2",
      color: ok ? "#15803d" : "#b91c1c",
    }}>
      {ok ? "✓" : "✗"} {status}
    </span>
  );
}

function TxRow({ tx }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "14px 18px",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
        marginBottom: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <StatusBadge status={tx.status} />
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>
            {shortSig(tx.signature)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BalanceChange value={tx.balanceChange} />
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{tx.timestamp}</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid #f3f4f6",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}>
          {[
            ["Signature", tx.signature, true],
            ["Slot", tx.slot ?? "—"],
            ["Fee", tx.fee != null ? `${tx.fee.toFixed(6).replace(/\.?0+$/, "")} SOL` : "—"],
            ["Instructions", tx.instructions],
            ["Timestamp", tx.timestamp],
          ].map(([label, val, mono]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{
                fontSize: 12,
                color: "#111827",
                fontFamily: mono ? "monospace" : "inherit",
                wordBreak: "break-all",
              }}>{val}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Explorer</div>
            <a
              href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 12, color: "#7c3aed" }}
            >
              View on Solana Explorer ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionsPage() {
  const { publicKey, connected } = useWallet();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchTxs = useCallback(async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/txns?wallet=${publicKey.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`);

      setTxs(data.transactions ?? []);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  // Auto-fetch when wallet connects
  useEffect(() => {
    if (publicKey) fetchTxs();
  }, [publicKey]);

  const successCount = txs.filter(t => t.status === "Success").length;
  const totalFees = txs.reduce((sum, t) => sum + (t.fee ?? 0), 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#111827" }}>
            Transaction History
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {connected && publicKey
              ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)} · Devnet`
              : "Connect your wallet to continue"}
          </p>
        </div>
        {fetched && (
          <button
            onClick={fetchTxs}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#7c3aed",
              border: "1px solid #7c3aed",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          fontSize: 13,
          color: "#b91c1c",
        }}>
          {error}
        </div>
      )}

      {/* Stats */}
      {fetched && txs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            ["Transactions", txs.length],
            ["Success Rate", `${Math.round((successCount / txs.length) * 100)}%`],
            ["Total Fees", `${totalFees.toFixed(6).replace(/\.?0+$/, "")} SOL`],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: "#f9fafb",
              borderRadius: 8,
              padding: "12px 14px",
              border: "1px solid #f3f4f6",
            }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions */}
      {txs.length > 0
        ? txs.map((tx) => <TxRow key={tx.signature} tx={tx} />)
        : fetched && !loading && (
          <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            No transactions found for this wallet on devnet.
          </p>
        )
      }
    </div>
  );
}