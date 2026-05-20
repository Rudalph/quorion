import { NextResponse } from "next/server";
import * as secp from "@noble/secp256k1";

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

    if (value === "ECDSA (secp256k1)") {
      privateKey = secp.utils.randomSecretKey();
      publicKey = secp.getPublicKey(privateKey);
      privateKey = Buffer.from(privateKey).toString("hex");
      publicKey = Buffer.from(publicKey).toString("hex");
    }

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

    const response = {
      message: "Key generation successful",
      algorithm: { name, value },
      keys: {
        publicKey,
        privateKey,
      },
      status: "success",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}