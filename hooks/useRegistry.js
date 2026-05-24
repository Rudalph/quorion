"use client";

import { useEffect, useMemo, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "@/lib/finalStateData_registry.json";

const PROGRAM_ID = new PublicKey("GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt");

export function useRegistry() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [registryData, setRegistryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    return new Program(idl, PROGRAM_ID, provider);
  }, [connection, wallet]);

  useEffect(() => {
    if (!program) return;

    async function fetchRegistry() {
      try {
        setLoading(true);
        const [registryPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("final-state-registry")],
          PROGRAM_ID
        );
        const data = await program.account.finalStateRegistry.fetch(registryPda);
        setRegistryData(data);
      } catch (err) {
        console.error("Error fetching registry:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistry();
  }, [program]);

  // Derive the options array from registryData
const options = useMemo(() => {
  if (!registryData?.items) return [];
  return registryData.items.map((item) => ({
    ...item,             
    label: item.name,
    value: item.name,
  }));
}, [registryData]);

  return { registryData, loading, options1: options };
}