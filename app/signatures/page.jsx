"use client";

import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { useWallet } from "@solana/wallet-adapter-react";

// const options = [
//   { label: "Ed25519 (EdDSA) - Normal", value: "Algorithm1" },
//   { label: "ECDSA (secp256k1) - Normal", value: "secp256k1" },
//   { label: "Schnorr (secp256k1) - Normal", value: "Algorithm3" },
//   { label: "Schnorr (secp256k1) - Normal", value: "Algorithm4" },
//   { label: "RSA-PSS - Normal", value: "Algorithm5" },
//   { label: "ML-DSA (Dilithium) - PQC", value: "Algorithm6" },
//   { label: "SLH-DSA (SPHINCS+) - PQC", value: "Algorithm7" },
//   { label: "FN-DSA (Falcon) - PQC", value: "Algorithm8" },
//   { label: "DSA (legacy) - Normal", value: "Algorithm9" },
// ];

const options = [
  { label: "Ed25519", value: "Ed25519" },
  { label: "ECDSA (secp256k1)", value: "ECDSA (secp256k1)" },
  { label: "Schnorr (secp256k1)", value: "Schnorr (secp256k1)" },
  { label: "RSA-PSS", value: "RSA-PSS" },
  { label: "ML-DSA (Dilithium)", value: "ML-DSA (Dilithium)" },
  { label: "SLH-DSA (SPHINCS+)", value: "SLH-DSA (SPHINCS+)" },
];

export default function Page() {
  const wallet = useWallet();

  const handleGenerateKey = async (option) => {
  console.log("Generate key for:", option);

  const res = await fetch("/api/generate-keys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: option.label,
      value: option.value,
      walletAddress: wallet.publicKey?.toString(),
    }),
    
  });

  const data = await res.json();
  console.log("API Response:", data);
};

  return (
 <div className="p-10">
      <Dropdown
        options={options}
        label="Select Algorithms"
        onGenerateKey={handleGenerateKey}
      />
    </div>
  );
}