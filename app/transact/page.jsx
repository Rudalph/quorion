// "use client";

// import { useMemo, useState } from "react";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import dynamic from "next/dynamic";
// import AlgorithmSelector from "@/components/AlgorithmSelector";

// import {
//   getVaultProgram,
//   initializeVault,
//   depositToVault,
//   transferFromVault,
//   getVaultBalance,
// } from "../../lib/vault";

// import SHA256 from "crypto-js/sha256";

// const WalletMultiButton = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );

// export default function TransactPage() {
//   const { connection } = useConnection();
//   const wallet = useWallet();

//   const [depositAmount, setDepositAmount] = useState("");
//   const [receiver, setReceiver] = useState("");
//   const [transferAmount, setTransferAmount] = useState("");
//   const [signature, setSignature] = useState("");
//   const [vaultBalance, setVaultBalance] = useState(null);
//   const [vaultAddress, setVaultAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [statuses, setStatuses] = useState([]);

//   const program = useMemo(() => {
//     if (!wallet.publicKey) return null;
//     return getVaultProgram(connection, wallet);
//   }, [connection, wallet.publicKey]);

//   async function handleInitializeVault() {
//     try {
//       if (!program || !wallet.publicKey) {
//         alert("Connect wallet first");
//         return;
//       }

//       setLoading(true);
//       setSignature("");

//       const { tx } = await initializeVault({
//         program,
//         ownerPublicKey: wallet.publicKey,
//       });

//       setSignature(tx);
//       alert("Vault initialized successfully");
//     } catch (error) {
//       console.error(error);
//       alert("Vault may already be initialized or transaction failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleViewVaultBalance() {
//     try {
//       if (!wallet.publicKey) {
//         alert("Connect wallet first");
//         return;
//       }

//       const { vaultPda, balanceSol } = await getVaultBalance({
//         connection,
//         ownerPublicKey: wallet.publicKey,
//       });

//       setVaultAddress(vaultPda.toBase58());
//       setVaultBalance(balanceSol);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to fetch vault balance");
//     }
//   }

//   async function handleDeposit() {
//     try {
//       if (!program || !wallet.publicKey) {
//         alert("Connect wallet first");
//         return;
//       }

//       if (!depositAmount) {
//         alert("Enter deposit amount");
//         return;
//       }

//       setLoading(true);
//       setSignature("");

//       const { tx } = await depositToVault({
//         program,
//         ownerPublicKey: wallet.publicKey,
//         amountSol: depositAmount,
//       });

//       setSignature(tx);
//       alert("Deposit successful");
//       await handleViewVaultBalance();
//     } catch (error) {
//       console.error(error);
//       alert("Deposit failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleTransfer() {
//     try {
//       if (!program || !wallet.publicKey) {
//         alert("Connect wallet first");
//         return;
//       }

//       if (!receiver || !transferAmount) {
//         alert("Enter receiver address and amount");
//         return;
//       }
       
//       setLoading(true);
//       setSignature("");

//       const senderAddress = wallet.publicKey.toString();
//       const receiverAddress = receiver;
//       const amountToSend = transferAmount;
//       const messageString = `${senderAddress}-${receiverAddress}-${amountToSend}`;
//       const messageHash = SHA256(messageString).toString();
//       console.log("Transaction Message:", messageString);
//       console.log("Transaction Message Hash:", messageHash);

//       let statusArray = [];

//       try {
//         const res =await fetch("/api/signing-message", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ 
//             message: messageHash,
//             walletAddress: wallet.publicKey?.toString() 
//           }),
//         });
//         const data = await res.json();
//         console.log("Signatures:", data.signatures);
//         console.log("Verification:", data.verification);
//         statusArray = Object.values(data.verification).map(v => v.status.toLowerCase());
//         console.log("Statuses:", statusArray);
//       } catch (apiError) {
//         console.error("Error calling signing-message API:", apiError);
//       }

//       const { tx } = await transferFromVault({
//         program,
//         ownerPublicKey: wallet.publicKey,
//         receiverAddress: receiver,
//         amountSol: transferAmount,
//         verificationResults: statusArray,
//       });

//       setSignature(tx);
//       alert("Transfer from vault successful");
//       await handleViewVaultBalance();
//     } catch (error) {
//       console.error(error);
//       alert(
//         "Transfer failed. Verification may be invalid or vault has insufficient funds."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6">
//       <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* DASHBOARD PANEL */}
//         <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Crypto Agile Vault</h1>
//             <p className="text-slate-300 mt-3 text-sm">
//               Vault-based SOL transfer with simulated multi-algorithm
//               verification.
//             </p>
//           </div>

//           <div className="space-y-4 mt-8">
//             <div className="flex justify-center">
//               <WalletMultiButton />
//             </div>

//             <button
//               onClick={handleInitializeVault}
//               disabled={loading || !wallet.connected}
//               className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold disabled:opacity-50"
//             >
//               Initialize Vault
//             </button>

//             <button
//               onClick={handleViewVaultBalance}
//               disabled={!wallet.connected}
//               className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
//             >
//               View Vault Balance
//             </button>
//           </div>

//           {vaultBalance !== null && (
//             <div className="mt-6 bg-slate-800 rounded-xl p-4 text-sm">
//               <p className="text-slate-400">Vault Balance</p>
//               <p className="text-2xl font-bold mt-1">{vaultBalance} SOL</p>

//               <p className="text-slate-400 mt-4">Vault Address</p>
//               <p className="break-all text-xs mt-1">{vaultAddress}</p>
//             </div>
//           )}
//         </div>

//         {/* ALGORITHM PANEL */}
//         <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
//           <h2 className="text-2xl font-bold text-slate-900">
//             Select Algorithm
//           </h2>

//           <p className="text-sm text-slate-500">
//             Select cryptographic algorithms and generate keys for verification.
//           </p>

//           <div className="w-full">
//             <AlgorithmSelector />
//           </div>
//         </div>

//         {/* DEPOSIT PANEL */}
//         <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
//           <h2 className="text-2xl font-bold text-slate-900">
//             Deposit Assets
//           </h2>

//           <p className="text-sm text-slate-500">
//             Move SOL from your wallet into your secure vault.
//           </p>

//           <input
//             className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Amount in SOL"
//             value={depositAmount}
//             onChange={(e) => setDepositAmount(e.target.value)}
//           />

//           <button
//             onClick={handleDeposit}
//             disabled={loading || !wallet.connected}
//             className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
//           >
//             Deposit to Vault
//           </button>
//         </div>

//         {/* TRANSFER PANEL */}
//         <div className="lg:col-span-1 border rounded-2xl p-6 space-y-5">
//           <h2 className="text-2xl font-bold text-slate-900">
//             Transfer from Vault
//           </h2>

//           <p className="text-sm text-slate-500">
//             Transfer SOL only after simulated algorithm verification passes.
//           </p>

//           <input
//             className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Receiver wallet address"
//             value={receiver}
//             onChange={(e) => setReceiver(e.target.value)}
//           />

//           <input
//             className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Amount in SOL"
//             value={transferAmount}
//             onChange={(e) => setTransferAmount(e.target.value)}
//           />

//           <button
//             onClick={handleTransfer}
//             disabled={loading || !wallet.connected}
//             className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
//           >
//             Submit Transfer
//           </button>
//         </div>

//         {/* TRANSACTION SIGNATURE */}
//         {signature && (
//           <div className="lg:col-span-4 bg-slate-100 rounded-2xl p-4 text-sm">
//             <p className="font-semibold text-slate-900">
//               Transaction Signature
//             </p>
//             <p className="break-all text-slate-600 mt-1">{signature}</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


"use client";
import { useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import {
  getVaultProgram, initializeVault, depositToVault,
  transferFromVault, getVaultBalance,
} from "../../lib/vault";
import SHA256 from "crypto-js/sha256";
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const ALGO_META = {
  "ML-DSA (Dilithium)":  { short:"ML-DSA",  color:"#d8b4fe", bg:"rgba(196,181,253,0.18)",  border:"rgba(196,181,253,0.35)" },
  "SLH-DSA (SPHINCS+)": { short:"SLH-DSA", color:"#6ee7b7", bg:"rgba(110,231,183,0.15)",  border:"rgba(110,231,183,0.35)" },
  "Ed25519":             { short:"Ed25519", color:"#93c5fd", bg:"rgba(147,197,253,0.15)",  border:"rgba(147,197,253,0.35)" },
  "ECDSA (secp256k1)":  { short:"ECDSA",   color:"#86efac", bg:"rgba(134,239,172,0.15)",  border:"rgba(134,239,172,0.35)" },
  "Schnorr (secp256k1)":{ short:"Schnorr", color:"#f9a8d4", bg:"rgba(249,168,212,0.15)",  border:"rgba(249,168,212,0.35)" },
  "RSA-PSS":            { short:"RSA-PSS", color:"#fde68a", bg:"rgba(253,230,138,0.15)",  border:"rgba(253,230,138,0.35)" },
};
const ALL_ALGOS = Object.keys(ALGO_META);
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{animation:"spin_ 0.7s linear infinite",flexShrink:0}}>
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5"/>
      <path d="M9 2a7 7 0 0 1 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
      <style>{`@keyframes spin_{to{transform:rotate(360deg);transform-origin:9px 9px}}`}</style>
    </svg>
  );
}
function VerifyRow({ algo, status }) {
  const ok   = status === "valid";
  const fail = status === "invalid" || status === "failed";
  const m    = ALGO_META[algo];
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:12,
      padding:"13px 16px", borderRadius:12,
      background: ok ? "rgba(34,197,94,0.09)" : fail ? "rgba(239,68,68,0.09)" : "rgba(255,255,255,0.04)",
      border:`1px solid ${ok?"rgba(34,197,94,0.3)":fail?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.1)"}`,
    }}>
      <div style={{
        width:9,height:9,borderRadius:"50%",flexShrink:0,
        background: ok?"#22c55e":fail?"#ef4444":"#4b5563",
        boxShadow: ok?"0 0 8px rgba(34,197,94,0.9)":fail?"0 0 8px rgba(239,68,68,0.9)":"none",
      }}/>
      {m && (
        <span style={{
          fontSize:12,fontWeight:800,padding:"4px 11px",borderRadius:999,
          color:m.color,background:m.bg,border:`1px solid ${m.border}`,
          flexShrink:0,letterSpacing:"0.04em",
        }}>{m.short}</span>
      )}
      <span style={{flex:1,fontSize:14,color:"#cbd5e1",fontWeight:500}}>{algo}</span>
      <span style={{
        fontSize:11,fontWeight:800,letterSpacing:"0.1em",
        color:ok?"#4ade80":fail?"#f87171":"#6b7280",
        background:ok?"rgba(34,197,94,0.12)":fail?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.06)",
        border:`1px solid ${ok?"rgba(34,197,94,0.3)":fail?"rgba(239,68,68,0.3)":"rgba(255,255,255,0.1)"}`,
        padding:"4px 12px",borderRadius:999,
      }}>{ok?"VERIFIED":fail?"FAILED":"PENDING"}</span>
    </div>
  );
}
export default function TransactPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [depositAmount, setDepositAmount]   = useState("");
  const [receiver, setReceiver]             = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [signature, setSignature]           = useState("");
  const [vaultBalance, setVaultBalance]     = useState(null);
  const [vaultAddress, setVaultAddress]     = useState("");
  const [loading, setLoading]               = useState(false);
  const [tab, setTab]                       = useState("deposit");
  const [copied, setCopied]                 = useState(false);
  const [verifyMap, setVerifyMap]           = useState({});
  const program = useMemo(() => {
    if (!wallet.publicKey) return null;
    return getVaultProgram(connection, wallet);
  }, [connection, wallet.publicKey]);
  async function handleInitializeVault() {
    try {
      if (!program || !wallet.publicKey) { alert("Connect wallet first"); return; }
      setLoading(true); setSignature("");
      const { tx } = await initializeVault({ program, ownerPublicKey: wallet.publicKey });
      setSignature(tx); alert("Vault initialized successfully");
    } catch (e) { console.error(e); alert("Vault may already be initialized or transaction failed"); }
    finally { setLoading(false); }
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
      if (!program || !wallet.publicKey) { alert("Connect wallet first"); return; }
      if (!depositAmount) { alert("Enter deposit amount"); return; }
      setLoading(true); setSignature("");
      const { tx } = await depositToVault({ program, ownerPublicKey: wallet.publicKey, amountSol: depositAmount });
      setSignature(tx); alert("Deposit successful");
      await handleViewVaultBalance();
    } catch (e) { console.error(e); alert("Deposit failed"); }
    finally { setLoading(false); }
  }
  async function handleTransfer() {
    try {
      if (!program || !wallet.publicKey) { alert("Connect wallet first"); return; }
      if (!receiver || !transferAmount) { alert("Enter receiver address and amount"); return; }
      setLoading(true); setSignature(""); setVerifyMap({});
      const msg  = `${wallet.publicKey.toString()}-${receiver}-${transferAmount}`;
      const hash = SHA256(msg).toString();
      let statusArray = [];
      try {
        const res  = await fetch("/api/signing-message", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ message: hash, walletAddress: wallet.publicKey?.toString() }),
        });
        const data = await res.json();
        statusArray = Object.values(data.verification).map(v => v.status.toLowerCase());
        const vm = {};
        Object.entries(data.verification).forEach(([a,v]) => { vm[a] = v.status.toLowerCase(); });
        setVerifyMap(vm);
      } catch (apiErr) { console.error("Error calling signing-message API:", apiErr); }
      const { tx } = await transferFromVault({
        program, ownerPublicKey: wallet.publicKey,
        receiverAddress: receiver, amountSol: transferAmount,
        verificationResults: statusArray,
      });
      setSignature(tx); alert("Transfer from vault successful");
      await handleViewVaultBalance();
    } catch (e) { console.error(e); alert("Transfer failed. Verification may be invalid or vault has insufficient funds."); }
    finally { setLoading(false); }
  }
  function copyAddr() {
    if (!vaultAddress) return;
    navigator.clipboard.writeText(vaultAddress);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  }
  const verifyAlgos = Object.keys(verifyMap);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html,body,#__next{height:100%;margin:0;padding:0}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#08080e;font-family:'Inter',sans-serif}

        /* ── shell ── */
        .shell{
          display:grid;
          grid-template-columns:310px 1fr;
          height:100vh;
          background:#08080e;
          color:#f1f5f9;
          overflow:hidden;
        }

        /* ── sidebar ── */
        .sidebar{
          background:#0d0d1a;
          border-right:1px solid rgba(255,255,255,0.09);
          display:flex;
          flex-direction:column;
          overflow:hidden;
        }
        .sidebar-top{
          padding:24px 22px 20px;
          display:flex;
          align-items:center;
          gap:12px;
          border-bottom:1px solid rgba(255,255,255,0.09);
          flex-shrink:0;
        }
        .brand-icon{
          width:42px;height:42px;border-radius:12px;flex-shrink:0;
          background:linear-gradient(135deg,#7c3aed,#4338ca);
          display:flex;align-items:center;justify-content:center;
        }
        .brand-name{font-size:19px;font-weight:800;color:#ffffff;letter-spacing:-0.5px}
        .brand-sub{font-size:10px;font-weight:700;color:#8b7fd4;letter-spacing:0.14em;text-transform:uppercase;margin-top:2px}

        /* balance card */
        .bal-card{
          margin:18px 18px 0;
          padding:20px 22px;
          border-radius:16px;
          background:rgba(124,58,237,0.13);
          border:1px solid rgba(124,58,237,0.3);
          flex-shrink:0;
        }
        .bal-eyebrow{font-size:11px;font-weight:700;color:#a78bfa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px}
        .bal-row{display:flex;align-items:baseline;gap:8px}
        .bal-num{font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.8px;line-height:1}
        .bal-denom{font-size:14px;font-weight:700;color:#a78bfa}
        .bal-addr-row{
          display:flex;align-items:center;gap:6px;
          margin-top:14px;padding:8px 12px;
          background:rgba(0,0,0,0.4);border-radius:9px;
          border:1px solid rgba(255,255,255,0.08);
        }
        .bal-addr-text{font-family:'JetBrains Mono',monospace;font-size:11px;color:#94a3b8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .copy-btn{background:none;border:none;cursor:pointer;color:#64748b;padding:2px;display:flex;align-items:center;flex-shrink:0;transition:color .15s}
        .copy-btn:hover{color:#cbd5e1}
        .bal-empty{margin-top:12px;font-size:13px;color:#64748b;font-style:italic}

        /* sidebar actions */
        .s-actions{display:flex;flex-direction:column;gap:9px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.09);flex-shrink:0}
        .s-btn{
          display:flex;align-items:center;gap:10px;
          padding:11px 15px;border-radius:10px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          color:#cbd5e1;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;
          cursor:pointer;transition:all .15s;text-align:left;
        }
        .s-btn:hover:not(:disabled){background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.18);color:#f1f5f9}
        .s-btn:disabled{opacity:0.25;cursor:not-allowed}
        .s-btn svg{flex-shrink:0;color:#94a3b8}

        /* algo section */
        .s-algos{
          padding:16px 18px;
          flex:1;
          overflow-y:auto;
          overflow-x:hidden;
          min-height:0;
        }
        .s-algos::-webkit-scrollbar{width:3px}
        .s-algos::-webkit-scrollbar-track{background:transparent}
        .s-algos::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
        .s-section-label{
          font-size:11px;font-weight:700;color:#6b7280;
          text-transform:uppercase;letter-spacing:0.12em;
          margin-bottom:12px;display:flex;align-items:center;gap:6px;
        }
        .s-section-label svg{color:#4b5563;flex-shrink:0}
        .pill-wrap{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px}
        .pill{font-size:12px;font-weight:700;padding:5px 13px;border-radius:999px;border:1px solid;letter-spacing:0.02em}
        .s-divider{height:1px;background:rgba(255,255,255,0.08);margin:0 0 16px}

        /* ── main right panel ── */
        .main{display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .topbar{
          height:62px;flex-shrink:0;
          background:#0d0d1a;
          border-bottom:1px solid rgba(255,255,255,0.09);
          display:flex;align-items:center;justify-content:space-between;
          padding:0 28px;gap:16px;
        }
        .topbar-title{font-size:16px;font-weight:800;color:#ffffff;letter-spacing:-0.3px}
        .topbar-sub{font-size:12px;color:#ffffff;margin-top:3px;font-weight:500}
        .topbar-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
        .net-badge{
          display:flex;align-items:center;gap:7px;
          background:rgba(34,197,94,0.1);
          border:1px solid rgba(34,197,94,0.25);
          border-radius:999px;padding:7px 16px;
          font-size:13px;font-weight:700;color:#4ade80;white-space:nowrap;
        }
        .net-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 6px rgba(34,197,94,0.8)}

        /* main scroll */
        .main-scroll{
          flex:1;
          overflow-y:auto;
          overflow-x:hidden;
          padding:28px;
          display:flex;
          flex-direction:column;
          gap:24px;
          min-height:0;
        }
        .main-scroll::-webkit-scrollbar{width:4px}
        .main-scroll::-webkit-scrollbar-track{background:transparent}
        .main-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.09);border-radius:99px}

        /* ── two-column layout ── */
        .content-grid{
          display:grid;
          grid-template-columns:1fr 360px;
          gap:20px;
          align-items:start;
          flex:1;
        }

        /* ── tab card ── */
        .tab-card{
          background:#0d0d1a;
          border:1px solid rgba(255,255,255,0.09);
          border-radius:18px;
          overflow:hidden;
        }
        .tabs-row{
          display:flex;
          border-bottom:1px solid rgba(255,255,255,0.09);
          padding:0 24px;
        }
        .tab-btn{
          padding:18px 22px 16px;
          font-size:15px;font-weight:600;font-family:'Inter',sans-serif;
          color:#64748b;background:none;border:none;cursor:pointer;
          border-bottom:2px solid transparent;margin-bottom:-1px;
          transition:all .15s;
        }
        .tab-btn:hover{color:#94a3b8}
        .tab-btn.active{color:#c4b5fd;border-bottom-color:#7c3aed;font-weight:800}
        .tab-body{padding:28px}

        .desc{font-size:14px;color:#94a3b8;line-height:1.75;margin-bottom:24px;font-weight:400}

        /* flow indicator */
        .flow-bar{
          display:flex;align-items:center;gap:10px;
          padding:13px 20px;margin-bottom:24px;
          background:rgba(124,58,237,0.07);
          border:1px solid rgba(124,58,237,0.18);
          border-radius:12px;
        }
        .flow-node{
          display:flex;align-items:center;gap:8px;
          font-size:13px;font-weight:700;
        }
        .flow-node-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .flow-track{flex:1;height:1px;background:rgba(124,58,237,0.25);position:relative;overflow:hidden}
        .flow-track::after{
          content:'';position:absolute;
          top:-3px;width:20px;height:7px;
          border-radius:99px;background:#7c3aed;opacity:0.8;
          animation:flowslide 2s ease-in-out infinite;
        }
        @keyframes flowslide{0%{left:-20px}100%{left:110%}}

        /* fields */
        .field{margin-bottom:20px}
        .field:last-of-type{margin-bottom:0}
        .field-label{
          display:block;
          font-size:12px;font-weight:700;
          color:#94a3b8;
          text-transform:uppercase;letter-spacing:0.1em;
          margin-bottom:9px;
        }
        .field-wrap{position:relative}
        .field-input{
          width:100%;
          background:rgba(0,0,0,0.45);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:11px;
          padding:14px 18px;
          font-size:15px;color:#f1f5f9;
          font-family:'Inter',sans-serif;outline:none;
          transition:border-color .2s,box-shadow .2s;
          font-weight:500;
        }
        .field-input::placeholder{color:#374151}
        .field-input:focus{
          border-color:rgba(124,58,237,0.6);
          box-shadow:0 0 0 3px rgba(124,58,237,0.12);
        }
        .field-suffix{
          position:absolute;right:16px;top:50%;transform:translateY(-50%);
          font-size:13px;font-weight:700;color:#64748b;pointer-events:none;
          font-family:'JetBrains Mono',monospace;
        }
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}

        /* buttons */
        .btn-purple{
          width:100%;padding:15px 20px;
          border-radius:12px;border:none;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          color:#fff;
          font-size:15px;font-weight:700;font-family:'Inter',sans-serif;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          transition:opacity .15s,transform .1s;
          margin-top:22px;
          box-shadow:0 4px 20px rgba(124,58,237,0.3);
        }
        .btn-purple:hover:not(:disabled){opacity:0.88}
        .btn-purple:active:not(:disabled){transform:scale(0.99)}
        .btn-purple:disabled{opacity:0.25;cursor:not-allowed}
        .btn-green{
          width:100%;padding:15px 20px;
          border-radius:12px;border:none;
          background:linear-gradient(135deg,#059669,#047857);
          color:#fff;
          font-size:15px;font-weight:700;font-family:'Inter',sans-serif;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          transition:opacity .15s,transform .1s;
          margin-top:22px;
          box-shadow:0 4px 20px rgba(5,150,105,0.25);
        }
        .btn-green:hover:not(:disabled){opacity:0.88}
        .btn-green:active:not(:disabled){transform:scale(0.99)}
        .btn-green:disabled{opacity:0.25;cursor:not-allowed}

        /* sig box */
        .sig-box{
          margin-top:22px;
          padding:15px 18px;
          background:rgba(0,0,0,0.4);
          border:1px solid rgba(255,255,255,0.08);
          border-left:3px solid #7c3aed;
          border-radius:0 10px 10px 0;
        }
        .sig-label{font-size:11px;font-weight:700;color:#a78bfa;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px}
        .sig-val{font-family:'JetBrains Mono',monospace;font-size:11px;color:#94a3b8;word-break:break-all;line-height:1.7}

        /* ── right info panel ── */
        .info-panel{
          display:flex;flex-direction:column;gap:16px;
        }
        .info-card{
          background:#0d0d1a;
          border:1px solid rgba(255,255,255,0.09);
          border-radius:16px;
          padding:22px;
        }
        .info-card-title{
          font-size:11px;font-weight:800;color:#64748b;
          text-transform:uppercase;letter-spacing:0.14em;
          margin-bottom:16px;display:flex;align-items:center;gap:7px;
        }
        .info-card-title svg{color:#4b5563}

        /* step list */
        .step-list{display:flex;flex-direction:column;gap:0}
        .step-item{
          display:flex;align-items:flex-start;gap:13px;
          padding:12px 0;
          border-bottom:1px solid rgba(255,255,255,0.06);
        }
        .step-item:last-child{border-bottom:none;padding-bottom:0}
        .step-num{
          width:24px;height:24px;border-radius:7px;flex-shrink:0;
          background:rgba(124,58,237,0.18);border:1px solid rgba(124,58,237,0.35);
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:800;color:#c4b5fd;
          margin-top:1px;
        }
        .step-text{font-size:13px;color:#94a3b8;line-height:1.6;font-weight:400}
        .step-text strong{color:#e2e8f0;font-weight:700}

        /* algo status mini list */
        .algo-mini-list{display:flex;flex-direction:column;gap:7px}
        .algo-mini-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:9px 13px;border-radius:9px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
        }
        .algo-mini-name{font-size:13px;font-weight:700}

        /* verify rows */
        .verify-head{font-size:11px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;margin-top:22px}
        .verify-list{display:flex;flex-direction:column;gap:8px}

        /* network status rows */
        .net-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0}
        .net-key{font-size:13px;color:#64748b;font-weight:500}
        .net-val{font-size:13px;font-weight:700;color:#94a3b8}
      `}</style>
      <div className="shell">
        {/* ═══ SIDEBAR ═══ */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Quorion</div>
              <div className="brand-sub">Quantum Vault</div>
            </div>
          </div>

          <div className="bal-card" style={{margin:"18px 18px 0"}}>
            <div className="bal-eyebrow">Vault balance</div>
            <div className="bal-row">
              <span className="bal-num">{vaultBalance !== null ? vaultBalance : "0.00"}</span>
              <span className="bal-denom">SOL</span>
            </div>
            {vaultAddress ? (
              <div className="bal-addr-row">
                <span className="bal-addr-text">{vaultAddress}</span>
                <button className="copy-btn" onClick={copyAddr}>
                  {copied
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  }
                </button>
              </div>
            ) : (
              <div className="bal-empty">Connect wallet to view vault</div>
            )}
          </div>

          <div className="s-actions" style={{marginTop:16}}>
            <button className="s-btn" onClick={handleInitializeVault} disabled={loading || !wallet.connected}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
              Initialize vault
            </button>
            <button className="s-btn" onClick={handleViewVaultBalance} disabled={!wallet.connected}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Refresh balance
            </button>
          </div>

          <div className="s-algos">

            <div className="s-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></svg>
              Manage keys
            </div>
            <AlgorithmSelector />
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <div className="main">
          <header className="topbar">
            <div>
              <div className="topbar-title">Vault Operations</div>
              <div className="topbar-sub">Quantum-safe multi-algorithm signing &amp; verification</div>
            </div>
            <div className="topbar-right">
              <div className="net-badge">
                <div className="net-dot"/>
                Solana Devnet
              </div>
              <WalletMultiButton />
            </div>
          </header>

          <div className="main-scroll">
            <div className="content-grid">
              {/* LEFT — tab card */}
              <div className="tab-card">
                <div className="tabs-row">
                  <button className={`tab-btn${tab==="deposit"?" active":""}`} onClick={()=>setTab("deposit")}>
                    Deposit
                  </button>
                  <button className={`tab-btn${tab==="transfer"?" active":""}`} onClick={()=>setTab("transfer")}>
                    Transfer
                  </button>
                </div>
                <div className="tab-body">
                  {tab === "deposit" && (
                    <>
                      <p className="desc">
                        Move SOL from your connected wallet into your secure Quorion vault.
                        Every deposit is protected by your selected quantum-safe algorithms.
                      </p>
                      <div className="flow-bar">
                        <div className="flow-node">
                          <div className="flow-node-dot" style={{background:"#818cf8"}}/>
                          <span style={{color:"#a5b4fc"}}>Wallet</span>
                        </div>
                        <div className="flow-track"/>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        <div className="flow-track"/>
                        <div className="flow-node">
                          <div className="flow-node-dot" style={{background:"#a78bfa"}}/>
                          <span style={{color:"#c4b5fd"}}>Vault</span>
                        </div>
                      </div>
                      <div className="field">
                        <label className="field-label">Amount</label>
                        <div className="field-wrap">
                          <input className="field-input" placeholder="0.00" style={{paddingRight:56}}
                            value={depositAmount} onChange={e=>setDepositAmount(e.target.value)}/>
                          <span className="field-suffix">SOL</span>
                        </div>
                      </div>
                      <button className="btn-purple" onClick={handleDeposit} disabled={loading||!wallet.connected}>
                        {loading ? <Spinner/> : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                        )}
                        Deposit to vault
                      </button>
                      {signature && (
                        <div className="sig-box">
                          <div className="sig-label">Transaction confirmed</div>
                          <div className="sig-val">{signature}</div>
                        </div>
                      )}
                    </>
                  )}
                  {tab === "transfer" && (
                    <>
                      <p className="desc">
                        SOL is released only after every selected algorithm independently verifies the transaction.
                        Multi-algorithm quantum-safe protection on every transfer.
                      </p>
                      <div className="grid2">
                        <div className="field" style={{marginBottom:0}}>
                          <label className="field-label">Receiver address</label>
                          <input className="field-input" placeholder="Paste wallet address"
                            value={receiver} onChange={e=>setReceiver(e.target.value)}/>
                        </div>
                        <div className="field" style={{marginBottom:0}}>
                          <label className="field-label">Amount</label>
                          <div className="field-wrap">
                            <input className="field-input" placeholder="0.00" style={{paddingRight:56}}
                              value={transferAmount} onChange={e=>setTransferAmount(e.target.value)}/>
                            <span className="field-suffix">SOL</span>
                          </div>
                        </div>
                      </div>
                      {verifyAlgos.length > 0 && (
                        <>
                          <div className="verify-head">Algorithm verification</div>
                          <div className="verify-list">
                            {verifyAlgos.map(a => <VerifyRow key={a} algo={a} status={verifyMap[a]}/>)}
                          </div>
                        </>
                      )}
                      <button className="btn-green" onClick={handleTransfer} disabled={loading||!wallet.connected}>
                        {loading ? <Spinner/> : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                        )}
                        Submit transfer
                      </button>
                      {signature && (
                        <div className="sig-box">
                          <div className="sig-label">Transaction confirmed</div>
                          <div className="sig-val">{signature}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* RIGHT — info panel */}
              <div className="info-panel">
                {/* How it works */}
                <div className="info-card">
                  <div className="info-card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                    {tab === "deposit" ? "How deposits work" : "How transfers work"}
                  </div>
                  <div className="step-list">
                    {tab === "deposit" ? (
                      <>
                        <div className="step-item">
                          <div className="step-num">1</div>
                          <div className="step-text"><strong>Connect</strong> your Solana wallet above</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">2</div>
                          <div className="step-text"><strong>Enter</strong> the SOL amount to deposit</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">3</div>
                          <div className="step-text"><strong>Confirm</strong> the transaction in your wallet</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">4</div>
                          <div className="step-text">Funds are secured in your <strong>quantum-safe vault</strong></div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="step-item">
                          <div className="step-num">1</div>
                          <div className="step-text"><strong>Enter</strong> receiver address and amount</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">2</div>
                          <div className="step-text">Transaction is <strong>hashed</strong> with SHA-256</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">3</div>
                          <div className="step-text"><strong>All algorithms</strong> independently sign &amp; verify</div>
                        </div>
                        <div className="step-item">
                          <div className="step-num">4</div>
                          <div className="step-text">SOL is released only on <strong>full consensus</strong></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Protection layers */}
                <div className="info-card">
                  <div className="info-card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
                    Protection layers
                  </div>
                  <div className="algo-mini-list">
                    {ALL_ALGOS.map(a => {
                      const m = ALGO_META[a];
                      return (
                        <div className="algo-mini-row" key={a}>
                          <span className="algo-mini-name" style={{color:m.color}}>{m.short}</span>
                          <span style={{
                            fontSize:10,fontWeight:800,letterSpacing:"0.08em",
                            color:"#4ade80",
                            background:"rgba(34,197,94,0.1)",
                            border:"1px solid rgba(34,197,94,0.25)",
                            padding:"3px 10px",borderRadius:999,
                          }}>ACTIVE</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Network info */}
                <div className="info-card">
                  <div className="info-card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                    Network status
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      ["Network","Solana Devnet"],
                      ["Consensus","Proof of History"],
                      ["Finality","~400ms"],
                    ].map(([k,v]) => (
                      <div key={k} className="net-row">
                        <span className="net-key">{k}</span>
                        <span className="net-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}