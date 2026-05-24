import { NextResponse } from "next/server";
import * as secp from "@noble/secp256k1";
import { generateKeyPairSync } from "crypto";

import { db } from "../../../lib/database/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, value, walletAddress } = body;

    if (!name || !value || !walletAddress) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    let publicKey = null;
    let privateKey = null;

    // ======================================================
    // ECDSA
    // ======================================================
    if (value === "ECDSA (secp256k1)") {
      const priv = secp.utils.randomPrivateKey();
      const pub = secp.getPublicKey(priv);

      publicKey = Buffer.from(pub).toString("hex");
      privateKey = Buffer.from(priv).toString("hex");
    }

    // ======================================================
    // SCHNORR
    // ======================================================
    else if (value === "Schnorr (secp256k1)") {
      const priv = secp.utils.randomPrivateKey();
      const pub = secp.schnorr.getPublicKey(priv);

      publicKey = Buffer.from(pub).toString("hex");
      privateKey = Buffer.from(priv).toString("hex");
    }

    // ======================================================
    // RSA-PSS
    // ======================================================
    else if (value === "RSA-PSS") {
      const { publicKey: pub, privateKey: priv } =
        generateKeyPairSync("rsa", {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

      publicKey = pub;
      privateKey = priv;
    }

    // ======================================================
    // Ed25519
    // ======================================================
    else if (value === "Ed25519") {
      const { publicKey: pub, privateKey: priv } =
        generateKeyPairSync("ed25519", {
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });

      publicKey = pub;
      privateKey = priv;
    }

    // ======================================================
    // POST QUANTUM
    // ======================================================
    else if (
      value === "ML-DSA (Dilithium)" ||
      value === "SLH-DSA (SPHINCS+)"
    ) {
      try {
        console.log("Calling PQC backend...");

        const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
          const response = await fetch(
            `${pythonApiUrl}/generate-keys`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify
            ({
              algorithm: value,
            }),
          }
        );

        const data = await response.json();

        console.log("PQC Response:", data);

        if (!response.ok || data.error) {
          throw new Error(
            data.details || data.error || "PQC failed"
          );
        }

        publicKey = data.publicKey;
        privateKey = data.privateKey;
      } catch (err) {
        console.error("PQC ERROR:", err);

        return NextResponse.json(
          {
            error: "PQC backend failed",
            details: err.message,
          },
          { status: 500 }
        );
      }
    }

    // ======================================================
    // SAVE TO FIREBASE
    // ======================================================
    const userRef = doc(db, "Users", walletAddress);

    await setDoc(
      userRef,
      {
        [name]: {
          algorithm: value,
          publicKey,
          privateKey,
          createdAt: new Date().toISOString(),
        },
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      algorithm: value,
      publicKey,
      privateKey,
    });

  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}