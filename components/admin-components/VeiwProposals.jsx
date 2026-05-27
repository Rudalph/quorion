// import React, { useState, useEffect } from 'react';
// import { db } from '../../lib/database/firebase';
// import { collection, getDocs, doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
// import { useWallet } from '@solana/wallet-adapter-react';

// const ViewProposals = () => {
//   const { publicKey } = useWallet();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProposal, setSelectedProposal] = useState(null);
//   const [isVoting, setIsVoting] = useState(false);

//   const categories = [
//     { id: 'add', label: 'Add' },
//     { id: 'delete', label: 'Delete' },
//     { id: 'deprecate', label: 'Deprecate' },
//     { id: 'risk', label: 'Risk' },
//     { id: 'default', label: 'Default' },
//   ];

//   useEffect(() => {
//     const fetchProposals = async () => {
//       try {
//         setLoading(true);
//         const allProposals = [];
//         const now = new Date().toISOString();

//         for (const cat of categories) {
//           const entriesRef = collection(db, 'adminProposals', cat.id, 'entries');
//           const snapshot = await getDocs(entriesRef);
          
//           snapshot.forEach((doc) => {
//             const data = doc.data();
//             // Only include if end time is in the future
//             if (data.endTime && new Date(data.endTime) > new Date()) {
//               allProposals.push({ id: doc.id, type: cat.id, ...data });
//             }
//           });
//         }
//         setProposals(allProposals);
//       } catch (error) {
//         console.error("Error fetching proposals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProposals();
//   }, []);

//   if (loading) {
//     return <div className="p-8 text-center text-gray-500">Loading proposals...</div>;
//   }

//   const handleVote = async (voteType) => {
//     if (!publicKey) {
//       alert("Please connect your Phantom wallet to vote.");
//       return;
//     }

//     setIsVoting(true);
//     const proposalId = selectedProposal.id;
//     const walletAddress = publicKey.toBase58();

//     try {
//       // 1. Check if user has already voted on this proposal
//       const proposalRef = doc(db, 'adminProposals', selectedProposal.type, 'entries', proposalId);
//       const proposalSnap = await getDoc(proposalRef);
//       const proposalData = proposalSnap.data();

//       if (proposalData?.voters?.includes(walletAddress)) {
//         alert("You have already voted on this proposal.");
//         setIsVoting(false);
//         return;
//       }

//       // 2. Update vote counters and add voter to list
//       const updateData = {
//         voters: arrayUnion(walletAddress),
//         [voteType === 'positive' ? 'positiveVoteCounter' : 'negativeVoteCounter']: increment(1)
//       };

//       await updateDoc(proposalRef, updateData);
      
//       alert(`Successfully voted ${voteType}!`);
//       setSelectedProposal(null);
      
//       // Refresh proposals list to update counters in UI if needed
//       // (Though we only show counters in the modal, we can re-fetch)
//       setProposals([]); // Trigger useEffect to re-fetch
//     } catch (error) {
//       console.error("Voting error:", error);
//       alert("An error occurred while voting.");
//     } finally {
//       setIsVoting(false);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-6">Active Proposals</h2>
      
//       <div className="space-y-8">
//         {categories.map((cat) => {
//           const catProposals = proposals.filter(p => p.type === cat.id);
//           if (catProposals.length === 0) return null;

//           return (
//             <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//                 <h3 className="font-bold text-gray-700">{cat.label} Proposals</h3>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {catProposals.map((prop) => (
//                   <div 
//                     key={prop.id} 
//                     className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center"
//                     onClick={() => setSelectedProposal(prop)}
//                   >
//                     <div>
//                       <p className="font-medium text-gray-900">{prop.name || 'Unnamed Proposal'}</p>
//                       <p className="text-xs text-gray-500">Ends: {new Date(prop.endTime).toLocaleString()}</p>
//                     </div>
//                     <span className="text-blue-600 text-sm font-medium">View Details →</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {proposals.length === 0 && (
//         <div className="text-center py-20 text-gray-500">
//           No active proposals found.
//         </div>
//       )}

//       {selectedProposal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold">Proposal Details</h3>
//               <button onClick={() => setSelectedProposal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
//             </div>
            
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
//                   <p className="text-gray-800 font-medium">{selectedProposal.proposalType}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-400 uppercase">Algorithm</label>
//                   <p className="text-gray-800 font-medium">{selectedProposal.name}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="text-xs font-bold text-gray-400 uppercase">Description/Reason</label>
//                 <p className="text-gray-800">{selectedProposal.description || selectedProposal.reason || 'N/A'}</p>
//               </div>

//               {selectedProposal.score && (
//                 <div>
//                   <label className="text-xs font-bold text-gray-400 uppercase">Risk Score</label>
//                   <p className="text-gray-800 font-bold text-lg">{selectedProposal.score}</p>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
//                 <div>
//                   <label className="text-xs font-bold text-gray-400 uppercase">Start Time</label>
//                   <p className="text-gray-800 text-sm">{new Date(selectedProposal.startTime).toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-gray-400 uppercase">End Time</label>
//                   <p className="text-gray-800 text-sm">{new Date(selectedProposal.endTime).toLocaleString()}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-between items-center">
//               <div className="flex space-x-3">
//                 <button 
//                   onClick={() => handleVote('positive')} 
//                   disabled={isVoting}
//                   className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium disabled:opacity-50"
//                 >
//                   {isVoting ? 'Voting...' : 'Vote Positive'}
//                 </button>
//                 <button 
//                   onClick={() => handleVote('negative')} 
//                   disabled={isVoting}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium disabled:opacity-50"
//                 >
//                   {isVoting ? 'Voting...' : 'Vote Negative'}
//                 </button>
//               </div>
//               <button 
//                 onClick={() => setSelectedProposal(null)} 
//                 className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewProposals;


import React, { useState, useEffect } from "react";
import { db } from "../../lib/database/firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";
import { useWallet } from "@solana/wallet-adapter-react";

const CATEGORIES = [
  { id: "add",       label: "Add",       color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", border: "rgba(110,231,183,0.3)"  },
  { id: "delete",    label: "Delete",    color: "#f87171", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.25)"   },
  { id: "deprecate", label: "Deprecate", color: "#fde68a", bg: "rgba(253,230,138,0.1)",  border: "rgba(253,230,138,0.25)" },
  { id: "risk",      label: "Risk",      color: "#f9a8d4", bg: "rgba(249,168,212,0.1)",  border: "rgba(249,168,212,0.25)" },
  { id: "default",   label: "Default",   color: "#93c5fd", bg: "rgba(147,197,253,0.1)",  border: "rgba(147,197,253,0.25)" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const CATEGORY_ICONS = {
  add:       "M12 4v16m8-8H4",
  delete:    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  deprecate: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  risk:      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  default:   "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
};

function TypeBadge({ type }) {
  const cat = CAT_MAP[type];
  if (!cat) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 11px", borderRadius: 999,
      fontSize: 11, fontWeight: 800, letterSpacing: "0.07em",
      color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`,
    }}>
      {cat.label.toUpperCase()}
    </span>
  );
}

export default function ViewProposals() {
  const { publicKey } = useWallet();
  const [proposals, setProposals]             = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isVoting, setIsVoting]               = useState(false);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const all = [];
      for (const cat of CATEGORIES) {
        const snap = await getDocs(collection(db, "adminProposals", cat.id, "entries"));
        snap.forEach((d) => {
          const data = d.data();
          if (data.endTime && new Date(data.endTime) > new Date()) {
            all.push({ id: d.id, type: cat.id, ...data });
          }
        });
      }
      setProposals(all);
    } catch (err) {
      console.error("Error fetching proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProposals(); }, []);

  const handleVote = async (voteType) => {
    if (!publicKey) { alert("Please connect your wallet to vote."); return; }
    setIsVoting(true);
    const walletAddress = publicKey.toBase58();
    try {
      const ref  = doc(db, "adminProposals", selectedProposal.type, "entries", selectedProposal.id);
      const snap = await getDoc(ref);
      if (snap.data()?.voters?.includes(walletAddress)) {
        alert("You have already voted on this proposal.");
        setIsVoting(false);
        return;
      }
      await updateDoc(ref, {
        voters: arrayUnion(walletAddress),
        [voteType === "positive" ? "positiveVoteCounter" : "negativeVoteCounter"]: increment(1),
      });
      setSelectedProposal(null);
      fetchProposals();
    } catch (err) {
      console.error("Voting error:", err);
      alert("An error occurred while voting.");
    } finally {
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", color: "#64748b", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ width: 16, height: 16, border: "2px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin_ 0.7s linear infinite" }}/>
        <span style={{ fontSize: 14, fontWeight: 500 }}>Loading proposals…</span>
        <style>{`@keyframes spin_{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const totalActive = proposals.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .vp-wrap { font-family: 'Inter', sans-serif; }
        .vp-summary-bar {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 16px; margin-bottom: 22px;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 11px;
          font-size: 13px; font-weight: 600; color: #c4b5fd;
        }
        .vp-section { margin-bottom: 20px; }
        .vp-section-head {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.12em;
          margin-bottom: 9px;
        }
        .vp-section-head svg { opacity: 0.7; }
        .vp-list { display: flex; flex-direction: column; gap: 7px; }
        .vp-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.14s;
        }
        .vp-row:hover { border-color: rgba(124,58,237,0.35); background: rgba(124,58,237,0.06); }
        .vp-row-name { font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 3px; }
        .vp-row-end  { font-size: 11px; color: #64748b; font-weight: 500; }
        .vp-row-link { font-size: 11px; font-weight: 700; color: #7c3aed; letter-spacing: 0.03em; white-space: nowrap; }
        .vp-empty {
          text-align: center; padding: 56px 0; color: #4b5563;
          font-size: 14px; font-weight: 600;
        }

        .vp-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          font-family: 'Inter', sans-serif;
        }
        .vp-modal {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 26px 24px;
          width: 460px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 64px);
          overflow-y: auto;
        }
        .vp-modal::-webkit-scrollbar { width: 3px; }
        .vp-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .vp-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .vp-modal-title { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
        .vp-close-btn { background: none; border: none; color: #64748b; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
        .vp-close-btn:hover { color: #cbd5e1; }
        .vp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .vp-detail-key { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
        .vp-detail-val { font-size: 13px; color: #e2e8f0; font-weight: 600; line-height: 1.5; }
        .vp-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 16px 0; }
        .vp-vote-row { display: flex; gap: 10px; margin-top: 18px; }
        .vp-vote-pos {
          flex: 1; padding: 11px;
          border-radius: 10px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80; font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: all 0.14s;
        }
        .vp-vote-pos:hover:not(:disabled) { background: rgba(34,197,94,0.18); }
        .vp-vote-neg {
          flex: 1; padding: 11px;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171; font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: all 0.14s;
        }
        .vp-vote-neg:hover:not(:disabled) { background: rgba(239,68,68,0.16); }
        .vp-vote-pos:disabled, .vp-vote-neg:disabled { opacity: 0.4; cursor: not-allowed; }
        .vp-close-footer { width: 100%; margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 9px; color: #64748b; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.14s; }
        .vp-close-footer:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
        .vp-risk-display { font-size: 28px; font-weight: 800; color: #f9a8d4; letter-spacing: -1px; }
      `}</style>

      <div className="vp-wrap">
        {totalActive > 0 && (
          <div className="vp-summary-bar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
            {totalActive} active proposal{totalActive !== 1 ? "s" : ""} open for voting
          </div>
        )}

        {CATEGORIES.map((cat) => {
          const catProposals = proposals.filter((p) => p.type === cat.id);
          if (catProposals.length === 0) return null;
          return (
            <div className="vp-section" key={cat.id}>
              <div className="vp-section-head">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2">
                  <path d={CATEGORY_ICONS[cat.id]} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: cat.color }}>{cat.label}</span> proposals
              </div>
              <div className="vp-list">
                {catProposals.map((prop) => (
                  <div className="vp-row" key={prop.id} onClick={() => setSelectedProposal(prop)}>
                    <div>
                      <div className="vp-row-name">{prop.name || "Unnamed Proposal"}</div>
                      <div className="vp-row-end">Ends {new Date(prop.endTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                    </div>
                    <span className="vp-row-link">View details →</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {proposals.length === 0 && (
          <div className="vp-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }}>
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            No active proposals found
          </div>
        )}
      </div>

      {selectedProposal && (
        <div className="vp-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedProposal(null)}>
          <div className="vp-modal">
            <div className="vp-modal-head">
              <span className="vp-modal-title">Proposal details</span>
              <button className="vp-close-btn" onClick={() => setSelectedProposal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>
            </div>

            <TypeBadge type={selectedProposal.type} />
            <div style={{ marginTop: 16 }} />

            <div className="vp-detail-grid">
              <div>
                <div className="vp-detail-key">Algorithm</div>
                <div className="vp-detail-val">{selectedProposal.name || "—"}</div>
              </div>
              <div>
                <div className="vp-detail-key">Proposal type</div>
                <div className="vp-detail-val">{selectedProposal.proposalType}</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div className="vp-detail-key">Description / reason</div>
              <div className="vp-detail-val" style={{ marginTop: 4, lineHeight: 1.7, color: "#94a3b8", fontWeight: 400 }}>
                {selectedProposal.description || selectedProposal.reason || "No reason provided."}
              </div>
            </div>

            {selectedProposal.score && (
              <div style={{ marginBottom: 14 }}>
                <div className="vp-detail-key">Risk score</div>
                <div className="vp-risk-display">{selectedProposal.score}</div>
              </div>
            )}

            <div className="vp-divider"/>

            <div className="vp-detail-grid">
              <div>
                <div className="vp-detail-key">Start time</div>
                <div className="vp-detail-val">{new Date(selectedProposal.startTime).toLocaleString()}</div>
              </div>
              <div>
                <div className="vp-detail-key">End time</div>
                <div className="vp-detail-val">{new Date(selectedProposal.endTime).toLocaleString()}</div>
              </div>
            </div>

            <div className="vp-vote-row">
              <button className="vp-vote-pos" onClick={() => handleVote("positive")} disabled={isVoting}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 11V17M11 7C11 7 11.5 9 9 11H15.5C15.5 11 17 11 16.5 13L15.5 17H7" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 7V5C11 4 11.5 3 13 3L15 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {isVoting ? "Voting…" : "Vote positive"}
              </button>
              <button className="vp-vote-neg" onClick={() => handleVote("negative")} disabled={isVoting}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 13V7M13 17C13 17 12.5 15 15 13H8.5C8.5 13 7 13 7.5 11L8.5 7H17" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 17V19C13 20 12.5 21 11 21L9 17" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {isVoting ? "Voting…" : "Vote negative"}
              </button>
            </div>
            <button className="vp-close-footer" onClick={() => setSelectedProposal(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}