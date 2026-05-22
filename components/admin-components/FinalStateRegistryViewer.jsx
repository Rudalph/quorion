"use client";

import { useEffect, useMemo, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import idl from "@/lib/finalStateData_registry.json";

const PROGRAM_ID = new PublicKey(
  "GswtVwhtr88FwZnv84S1uK7HJ1DBNamqczKRS7juEYWt"
);

export default function FinalStateRegistryViewer() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [registryData, setRegistryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    return new Program(idl, PROGRAM_ID, provider);
  }, [connection, wallet]);

  async function fetchRegistry() {
    try {
      setLoading(true);

      const [registryPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("final-state-registry")],
        PROGRAM_ID
      );

      const data = await program.account.finalStateRegistry.fetch(
        registryPda
      );

      setRegistryData(data);
    } catch (err) {
      console.error("Error fetching registry:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (program) {
      fetchRegistry();
    }
  }, [program]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Final State Registry
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && registryData && (
        <div className="space-y-4">
          <div>
            <p>
              <strong>Authority:</strong>{" "}
              {registryData.authority.toBase58()}
            </p>

            <p>
              <strong>Updated At:</strong>{" "}
              {registryData.updatedAt.toString()}
            </p>
          </div>

          <div className="space-y-3">
            {registryData.items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4"
              >
                <p>
                  <strong>ID:</strong> {item.id}
                </p>

                <p>
                  <strong>Name:</strong> {item.name}
                </p>

                <p>
                  <strong>Risk Score:</strong>{" "}
                  {item.riskScore}
                </p>

                <p>
                  <strong>Deprecated:</strong>{" "}
                  {item.isDeprecated ? "Yes" : "No"}
                </p>

                <p>
                  <strong>Default:</strong>{" "}
                  {item.isDefault ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}