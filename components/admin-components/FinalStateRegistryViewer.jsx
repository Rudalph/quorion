// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Connection, PublicKey } from "@solana/web3.js";
// import { AnchorProvider, Program } from "@coral-xyz/anchor";
// import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// import idl from "@/lib/finalStateData_registry.json";

// const PROGRAM_ID = new PublicKey(
//   "GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt"
// );

// export default function FinalStateRegistryViewer() {
//   const { connection } = useConnection();
//   const wallet = useWallet();

//   const [registryData, setRegistryData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const program = useMemo(() => {
//     if (!wallet) return null;

//     const provider = new AnchorProvider(
//       connection,
//       wallet,
//       AnchorProvider.defaultOptions()
//     );

//     return new Program(idl, PROGRAM_ID, provider);
//   }, [connection, wallet]);

//   async function fetchRegistry() {
//     try {
//       setLoading(true);

//       const [registryPda] = PublicKey.findProgramAddressSync(
//         [Buffer.from("final-state-registry")],
//         PROGRAM_ID
//       );

//       const data = await program.account.finalStateRegistry.fetch(
//         registryPda
//       );

//       setRegistryData(data);
//     } catch (err) {
//       console.error("Error fetching registry:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (program) {
//       fetchRegistry();
//     }
//   }, [program]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Final State Registry
//       </h1>

//       {loading && <p>Loading...</p>}

//       {!loading && registryData && (
//         <div className="space-y-4">
//           <div>
//             <p>
//               <strong>Authority:</strong>{" "}
//               {registryData.authority.toBase58()}
//             </p>

//             <p>
//               <strong>Updated At:</strong>{" "}
//               {registryData.updatedAt.toString()}
//             </p>
//           </div>

//           <div className="space-y-3">
//             {registryData.items.map((item, index) => (
//               <div
//                 key={index}
//                 className="border rounded-lg p-4"
//               >
//                 <p>
//                   <strong>ID:</strong> {item.id}
//                 </p>

//                 <p>
//                   <strong>Name:</strong> {item.name}
//                 </p>

//                 <p>
//                   <strong>Risk Score:</strong>{" "}
//                   {item.riskScore}
//                 </p>

//                 <p>
//                   <strong>Deprecated:</strong>{" "}
//                   {item.isDeprecated ? "Yes" : "No"}
//                 </p>

//                 <p>
//                   <strong>Default:</strong>{" "}
//                   {item.isDefault ? "Yes" : "No"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "@/lib/finalStateData_registry.json";

const PROGRAM_ID = new PublicKey("GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt");

const ALGO_STYLE = {
  "ML-DSA (Dilithium)":  { short: "ML-DSA",  color: "#c4b5fd", bg: "rgba(196,181,253,0.12)", border: "rgba(196,181,253,0.3)" },
  "SLH-DSA (SPHINCS+)":  { short: "SLH-DSA", color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", border: "rgba(110,231,183,0.3)" },
  "Ed25519":             { short: "Ed25519", color: "#93c5fd", bg: "rgba(147,197,253,0.12)", border: "rgba(147,197,253,0.3)" },
  "ECDSA (secp256k1)":   { short: "ECDSA",   color: "#86efac", bg: "rgba(134,239,172,0.12)", border: "rgba(134,239,172,0.3)" },
  "Schnorr (secp256k1)": { short: "Schnorr", color: "#f9a8d4", bg: "rgba(249,168,212,0.12)", border: "rgba(249,168,212,0.3)" },
  "RSA-PSS":             { short: "RSA-PSS", color: "#fde68a", bg: "rgba(253,230,138,0.12)", border: "rgba(253,230,138,0.3)" },
};

function getAlgoStyle(name) {
  return ALGO_STYLE[name] || { short: name?.slice(0,8) || "—", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" };
}

function RiskBar({ score }) {
  const pct = Math.min(100, Math.max(0, Number(score) || 0));
  const color = pct >= 70 ? "#f87171" : pct >= 40 ? "#fde68a" : "#4ade80";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s" }}/>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{pct}</span>
    </div>
  );
}

function StatusPill({ active, trueLabel = "Yes", falseLabel = "No" }) {
  return active ? (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 800, letterSpacing: "0.06em",
      color: "#4ade80", background: "rgba(34,197,94,0.1)",
      border: "1px solid rgba(34,197,94,0.3)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)", flexShrink: 0, display: "inline-block" }}/>
      {trueLabel}
    </span>
  ) : (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 800, letterSpacing: "0.06em",
      color: "#4b5563", background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#374151", flexShrink: 0, display: "inline-block" }}/>
      {falseLabel}
    </span>
  );
}

export default function FinalStateRegistryViewer() {
  const { connection } = useConnection();
  const wallet         = useWallet();
  const [registryData, setRegistryData] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return new Program(idl, PROGRAM_ID, provider);
  }, [connection, wallet]);

  async function fetchRegistry() {
    if (!program) return;
    try {
      setLoading(true);
      setError(null);
      const [registryPda] = PublicKey.findProgramAddressSync([Buffer.from("final-state-registry")], PROGRAM_ID);
      const data = await program.account.finalStateRegistry.fetch(registryPda);
      setRegistryData(data);
    } catch (err) {
      console.error("Error fetching registry:", err);
      setError("Failed to fetch registry data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (program) fetchRegistry(); }, [program]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .fsr-wrap { font-family: 'Inter', sans-serif; }
        .fsr-meta-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
        }
        .fsr-auth-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; flex: 1;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          min-width: 0;
        }
        .fsr-auth-key {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #94a3b8;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .fsr-refresh-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 9px; flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; font-size: 13px; font-weight: 600;
          font-family: inherit; cursor: pointer; transition: all 0.14s;
        }
        .fsr-refresh-btn:hover { background: rgba(255,255,255,0.09); color: #cbd5e1; }
        .fsr-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .fsr-table-wrap {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          overflow: hidden;
        }
        .fsr-table { width: 100%; border-collapse: collapse; }
        .fsr-th {
          font-size: 11px; font-weight: 700; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 14px 20px; text-align: left;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          white-space: nowrap;
        }
        .fsr-th:not(:first-child) { text-align: center; }
        .fsr-td { padding: 13px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
        .fsr-tr:last-child .fsr-td { border-bottom: none; }
        .fsr-tr:hover .fsr-td { background: rgba(255,255,255,0.02); }
        .fsr-td:not(:first-child) { text-align: center; }
        .fsr-algo-cell { display: flex; align-items: center; gap: 11px; }
        .fsr-algo-pill { font-size: 11px; font-weight: 700; padding: 4px 11px; border-radius: 999px; border: 1px solid; white-space: nowrap; }
        .fsr-algo-name { font-size: 13px; color: #cbd5e1; font-weight: 500; }
        .fsr-id-cell { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; }
        .fsr-loading { display: flex; align-items: center; gap: 10px; padding: 32px 0; color: #64748b; }
        .fsr-spinner { width: 15px; height: 15px; border: 2px solid rgba(124,58,237,0.25); border-top-color: #7c3aed; border-radius: 50%; animation: fsr-spin 0.65s linear infinite; flex-shrink: 0; }
        @keyframes fsr-spin { to { transform: rotate(360deg); } }
        .fsr-error { padding: 24px; color: #f87171; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
        .fsr-empty { text-align: center; padding: 56px; color: #4b5563; font-size: 13px; font-weight: 600; }
        .fsr-updated { font-size: 11px; font-weight: 600; color: #4b5563; padding: 10px 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 6px; }
      `}</style>

      <div className="fsr-wrap">
        <div className="fsr-meta-row">
          <div className="fsr-auth-card">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            <span className="fsr-auth-key">Program: {PROGRAM_ID.toBase58()}</span>
          </div>
          <button className="fsr-refresh-btn" onClick={fetchRegistry} disabled={loading}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transition: loading ? "transform 0.5s" : "none", animation: loading ? "fsr-spin 0.65s linear infinite" : "none" }}>
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {loading && !registryData && (
          <div className="fsr-loading">
            <div className="fsr-spinner"/>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Fetching on-chain registry…</span>
          </div>
        )}

        {error && (
          <div className="fsr-error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
            {error}
          </div>
        )}

        {!loading && registryData && (
          <div className="fsr-table-wrap">
            <table className="fsr-table">
              <thead>
                <tr>
                  <th className="fsr-th">Algorithm</th>
                  <th className="fsr-th">ID</th>
                  <th className="fsr-th">Risk score</th>
                  <th className="fsr-th">Deprecated</th>
                  <th className="fsr-th">Default</th>
                </tr>
              </thead>
              <tbody>
                {registryData.items.length === 0 && (
                  <tr><td colSpan={5} className="fsr-empty">No algorithms registered</td></tr>
                )}
                {registryData.items.map((item, i) => {
                  const s = getAlgoStyle(item.name);
                  return (
                    <tr key={i} className="fsr-tr">
                      <td className="fsr-td">
                        <div className="fsr-algo-cell">
                          <span className="fsr-algo-pill" style={{ color: s.color, background: s.bg, borderColor: s.border }}>{s.short}</span>
                          <span className="fsr-algo-name">{item.name}</span>
                        </div>
                      </td>
                      <td className="fsr-td"><span className="fsr-id-cell">{item.id}</span></td>
                      <td className="fsr-td" style={{ minWidth: 140 }}><RiskBar score={item.riskScore}/></td>
                      <td className="fsr-td"><StatusPill active={item.isDeprecated} trueLabel="Yes" falseLabel="No"/></td>
                      <td className="fsr-td"><StatusPill active={item.isDefault} trueLabel="Default" falseLabel="No"/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {registryData.updatedAt && (
              <div className="fsr-updated">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>
                Last updated: {registryData.updatedAt.toString()}
              </div>
            )}
          </div>
        )}

        {!loading && !registryData && !error && (
          <div className="fsr-empty" style={{ color: "#4b5563", fontSize: 13, fontWeight: 600, padding: "48px 0", textAlign: "center" }}>
            Connect your wallet to load registry data
          </div>
        )}
      </div>
    </>
  );
}