"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { db } from "../lib/database/firebase";
import { doc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

export default function Dropdown({
  options = [],
  label = "Select Options",
  onGenerateKey,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [generatedAlgorithms, setGeneratedAlgorithms] = useState([]);
  const dropdownRef = useRef(null);

  const wallet = useWallet();
  const currentUser = wallet.publicKey;

  useEffect(() => {
    async function loadSavedData() {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "Users", currentUser.toString());
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            if (data.selectedOptions && Array.isArray(data.selectedOptions)) {
              setSelected(data.selectedOptions);
            }

            const algorithms = Object.keys(data).filter(key => key !== 'selectedOptions');
            setGeneratedAlgorithms(algorithms);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    }
    loadSavedData();
  }, [currentUser]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCheckbox = async (value) => {
    setSelected((prev) => {
      const newSelected = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      if (currentUser) {
        (async () => {
          try {
            const userDocRef = doc(db, "Users", currentUser.toString());
            await setDoc(userDocRef, {
              selectedOptions: prev.includes(value) 
                ? arrayRemove(value) 
                : arrayUnion(value)
            }, { merge: true });
          } catch (error) {
            console.error("Error updating Firebase:", error);
          }
        })();
      }

      return newSelected;
    });
  };

  const handleGenerateKeyClick = (option) => {
    if (option.disabled) return;
    onGenerateKey(option);
  };

  return (
    <div className="w-full max-w-sm relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl bg-white shadow-sm hover:border-gray-400 transition"
      >
        <span className="text-sm text-gray-700">
          {selected.length > 0
            ? `${selected.length} selected`
            : label}
        </span>

        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isChecked = selected.includes(opt.value);
              const isAlreadyGenerated = generatedAlgorithms.includes(opt.label);

              return (
                <div
                  key={opt.value}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 transition"
                >
                  {/* Left: Checkbox + Label */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckbox(opt.value)}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm text-gray-700">
                      {opt.label}
                    </span>
                  </label>

                  {/* Right: Generate Key Button */}
                  <button
                    onClick={() => handleGenerateKeyClick(opt)}
                    disabled={opt.disabled || isAlreadyGenerated}
                    className={`text-xs px-2 py-1 rounded-md transition
                      ${
                        (opt.disabled || isAlreadyGenerated)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                  >
                    {(opt.disabled || isAlreadyGenerated) ? "Generated" : "Generate Key"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-3 py-2 flex justify-between">
            <button
              onClick={() => setSelected([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>

            <span className="text-xs text-gray-400">
              {selected.length} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}