"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { db } from "../lib/database/firebase";
import { doc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const ALGO_META = {
  "Ed25519":             { color: "#93c5fd", bg: "rgba(147,197,253,0.12)", border: "rgba(147,197,253,0.3)" },
  "ECDSA (secp256k1)":  { color: "#86efac", bg: "rgba(134,239,172,0.12)", border: "rgba(134,239,172,0.3)" },
  "Schnorr (secp256k1)":{ color: "#f9a8d4", bg: "rgba(249,168,212,0.12)", border: "rgba(249,168,212,0.3)" },
  "RSA-PSS":            { color: "#fde68a", bg: "rgba(253,230,138,0.12)", border: "rgba(253,230,138,0.3)" },
  "ML-DSA (Dilithium)": { color: "#c4b5fd", bg: "rgba(196,181,253,0.12)", border: "rgba(196,181,253,0.3)" },
  "SLH-DSA (SPHINCS+)": { color: "#6ee7b7", bg: "rgba(110,231,183,0.12)", border: "rgba(110,231,183,0.3)" },
};

export default function Dropdown({ options = [], label = "Select Options", onGenerateKey }) {
  const [selected, setSelected]                       = useState([]);
  const [generatedAlgorithms, setGeneratedAlgorithms] = useState([]);
  const [loadingKey, setLoadingKey]                   = useState(null);

  const wallet      = useWallet();
  const currentUser = wallet.publicKey;

  useEffect(() => {
    async function loadSavedData() {
      if (!currentUser) return;
      try {
        const snap = await getDoc(doc(db, "Users", currentUser.toString()));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.selectedOptions)) setSelected(data.selectedOptions);
          setGeneratedAlgorithms(Object.keys(data).filter(k => k !== "selectedOptions"));
        }
      } catch (e) { console.error(e); }
    }
    loadSavedData();
  }, [currentUser]);

  const toggleCheckbox = async (value) => {
    setSelected(prev => {
      const removing    = prev.includes(value);
      const newSelected = removing ? prev.filter(v => v !== value) : [...prev, value];
      if (currentUser) {
        (async () => {
          try {
            await setDoc(
              doc(db, "Users", currentUser.toString()),
              { selectedOptions: removing ? arrayRemove(value) : arrayUnion(value) },
              { merge: true }
            );
          } catch (e) { console.error(e); }
        })();
      }
      return newSelected;
    });
  };

  const handleGenerateKeyClick = async (option) => {
    if (option.disabled || generatedAlgorithms.includes(option.label) || loadingKey) return;
    setLoadingKey(option.value);
    await onGenerateKey(option);
    setGeneratedAlgorithms(prev => [...prev, option.label]); // ← add this line
    setLoadingKey(null);
  };

  return (
    <>
      <style>{`
        .qd-list { width: 100%; }

        .qd-row {
          display: grid;
          grid-template-columns: 20px 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 8px 4px;
          border-radius: 10px;
          transition: background 0.12s;
        }
        .qd-row:hover { background: rgba(255,255,255,0.04); }

        .qd-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .qd-checkbox.on {
          background: #7c3aed;
          border-color: #7c3aed;
        }

        .qd-pill {
          display: block;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .qd-gen {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.03em;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid;
        }
        .qd-gen.avail {
          background: rgba(124,58,237,0.18);
          border-color: rgba(124,58,237,0.45);
          color: #c4b5fd;
        }
        .qd-gen.avail:hover {
          background: rgba(124,58,237,0.32);
          border-color: rgba(124,58,237,0.7);
          color: #ddd6fe;
        }
        .qd-gen.done {
          background: rgba(34,197,94,0.08);
          border-color: rgba(34,197,94,0.25);
          color: #4ade80;
          cursor: default;
        }
        .qd-gen.busy {
          background: rgba(124,58,237,0.1);
          border-color: rgba(124,58,237,0.2);
          color: #6b7280;
          cursor: not-allowed;
        }

        .qd-spin {
          width: 10px; height: 10px;
          border: 1.5px solid rgba(196,181,253,0.25);
          border-top-color: #c4b5fd;
          border-radius: 50%;
          animation: qdsp 0.7s linear infinite;
        }
        @keyframes qdsp { to { transform: rotate(360deg); } }

        .qd-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .qd-clear {
          background: none; border: none;
          font-size: 11px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          color: #4b5563; cursor: pointer;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 0; transition: color 0.15s;
        }
        .qd-clear:hover { color: #9ca3af; }
        .qd-count {
          font-size: 11px; font-weight: 700;
          color: #4b5563; text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="qd-list">
        {options.map((opt) => {
          const isChecked = selected.includes(opt.value);
          const isDone    = generatedAlgorithms.includes(opt.label) || opt.disabled;
          const isLoading = loadingKey === opt.value;
          const meta      = ALGO_META[opt.label] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" };

          return (
            <div className="qd-row" key={opt.value}>

              {/* Checkbox */}
              <div
                className={`qd-checkbox${isChecked ? " on" : ""}`}
                onClick={() => toggleCheckbox(opt.value)}
              >
                {isChecked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>

              {/* Colored pill label */}
              <span
                className="qd-pill"
                style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                onClick={() => toggleCheckbox(opt.value)}
              >
                {opt.label}
              </span>

              {/* Gen / Generated button */}
              <button
                className={`qd-gen${isDone ? " done" : isLoading ? " busy" : " avail"}`}
                onClick={() => handleGenerateKeyClick(opt)}
                disabled={isDone || isLoading}
              >
                {isLoading ? (
                  <div className="qd-spin" />
                ) : isDone ? (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    Generated
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="7.5" cy="15.5" r="4.5"/>
                      <path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/>
                    </svg>
                    Gen key
                  </>
                )}
              </button>

            </div>
          );
        })}

        <div className="qd-footer">
          <button className="qd-clear" onClick={() => setSelected([])}>Clear all</button>
          <span className="qd-count">{selected.length} selected</span>
        </div>
      </div>
    </>
  );
}