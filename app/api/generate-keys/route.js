import { NextResponse } from "next/server";
import * as secp from "@noble/secp256k1";
import { generateKeyPairSync } from "crypto";

import { db } from "../../../lib/database/firebase";
import { doc, setDoc } from "firebase/firestore";

import * as oqs from "liboqs-js";

console.log(Object.keys(oqs));

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

    // ---------------- ECDSA ----------------
    if (value === "ECDSA (secp256k1)") {
      const priv = secp.utils.randomSecretKey();
      const pub = secp.getPublicKey(priv);

      publicKey = Buffer.from(pub).toString("hex");
      privateKey = Buffer.from(priv).toString("hex");
    }

    // ---------------- Schnorr ----------------
    else if (value === "Schnorr (secp256k1)") {
      const priv = secp.utils.randomSecretKey();
      const pub = secp.schnorr.getPublicKey(priv);

      publicKey = Buffer.from(pub).toString("hex");
      privateKey = Buffer.from(priv).toString("hex");
    }

    // ---------------- RSA-PSS ----------------
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

    // ---------------- Ed25519 ----------------
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

    // ---------------- Save to Firebase ----------------
    const userRef = doc(db, "Users", walletAddress);

    await setDoc(
      userRef,
      {
        [name]: {
          publicKey,
          privateKey,
        },
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Key generation successful",
      algorithm: { name, value },
      keys: {
        publicKey,
        privateKey,
      },
      status: "success",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}