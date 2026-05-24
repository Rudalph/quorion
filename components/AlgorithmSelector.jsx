"use client";

import Dropdown from "@/components/Dropdown";
import { useWallet } from "@solana/wallet-adapter-react";

import { useRegistry } from "@/hooks/useRegistry";

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

  const { options1, loading } = useRegistry();
  console.log("Registry Options:", options1);

  const handleGenerateKey = async (option) => {
    console.log("Selected:", option);

    // wallet check
    if (!wallet.publicKey) {
      alert("Please connect wallet first");
      return;
    }

    const res = await fetch("/api/generate-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: option.label,
        value: option.value, // ✅ FIXED
        walletAddress: wallet.publicKey.toString(),
      }),
    });

    const data = await res.json();

    console.log("API Response:", data);
  };

  return (
   <div className="w-full">
    <Dropdown
      options={options}
      label="Select Algorithm"
      onGenerateKey={handleGenerateKey}
    />
  </div>
    );
}