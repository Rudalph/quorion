// import { NextResponse } from "next/server";
// import { db } from "@/lib/database/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import elliptic from "elliptic";
// import crypto from "crypto";
// import * as secp from "@noble/secp256k1";
// import { sha256 } from "@noble/hashes/sha256";
// import { hmac } from "@noble/hashes/hmac";
// import {
//   logRequestTable,
//   logFirestoreTable,
//   logSigningTable,
//   logVerificationTable,
//   logTimingTable,
// } from "@/lib/tableLogger"; // adjust path to wherever you put tableLogger.js

// secp.utils.hmacSha256Sync = (key, ...msgs) =>
//   hmac(sha256, key, secp.utils.concatBytes(...msgs));

// const ec = new elliptic.ec("secp256k1");

// async function signWithAlgo(algo, keys, message) {
//   if (algo === "ECDSA (secp256k1)") {
//     try {
//       const keyPair = ec.keyFromPrivate(keys.privateKey);
//       const msgHash = crypto.createHash("sha256").update(message).digest();
//       const signature = keyPair.sign(msgHash).toDER("hex");
//       // console.log("ECDSA Signature:", signature);
//       logSigningTable(algo, signature, "success");
//       return signature;
//     } catch (err) {
//       // console.error("[ECDSA] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`ECDSA signing failed: ${err.message}`);
//     }
//   }

//   else if (algo === "RSA-PSS") {
//     try {
//       const signature = crypto
//         .sign("sha256", Buffer.from(message), {
//           key: keys.privateKey,
//           padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
//           saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
//         })
//         .toString("base64");
//       // console.log("RSA-PSS Signature:", signature);
//       logSigningTable(algo, signature, "success");
//       return signature;
//     } catch (err) {
//       // console.error("[RSA-PSS] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`RSA-PSS signing failed: ${err.message}`);
//     }
//   }

//   else if (algo === "Ed25519") {
//     try {
//       const signature = crypto
//         .sign(null, Buffer.from(message), {
//           key: keys.privateKey,
//           format: "pem",
//           type: "pkcs8",
//         })
//         .toString("base64");
//       // console.log(`[Ed25519] Signature: ${signature}`);
//       logSigningTable(algo, signature, "success");
//       return signature;
//     } catch (err) {
//       // console.error("[Ed25519] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`Ed25519 signing failed: ${err.message}`);
//     }
//   }

//   else if (algo === "Schnorr (secp256k1)") {
//     try {
//       const privKey = Uint8Array.from(Buffer.from(keys.privateKey, "hex"));
//       // console.log("Schnorr Private Key:", keys.privateKey);
//       const msgHash = sha256(new TextEncoder().encode(message));
//       // console.log("Schnorr Message Hash:", Buffer.from(msgHash).toString("hex"));
//       const sigBytes = await secp.schnorr.sign(msgHash, privKey);
//       const signature = Buffer.from(sigBytes).toString("hex");
//       // console.log(`[Schnorr] Signature: ${signature}`);
//       logSigningTable(algo, signature, "success");
//       return signature;
//     } catch (err) {
//       // console.error("[Schnorr] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`Schnorr signing failed: ${err.message}`);
//     }
//   }

//   else if (algo === "ML-DSA (Dilithium)") {
//     try {
//       const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
//       // console.log(`[ML-DSA] Calling Python API at ${pythonApiUrl}/sign-message`);
//       const res = await fetch(`${pythonApiUrl}/sign-message`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ algorithm: algo, privateKey: keys.privateKey, message }),
//       });
//       const data = await res.json();
//       // console.log("[ML-DSA] Python API response:", data);
//       if (!res.ok || data.error) throw new Error(data.details || data.error || "Python API failed");
//       logSigningTable(algo, data.signature, "success");
//       return data.signature;
//     } catch (err) {
//       // console.error("[ML-DSA] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`ML-DSA signing failed: ${err.message}`);
//     }
//   }

//   else if (algo === "SLH-DSA (SPHINCS+)") {
//     try {
//       const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
//       // console.log(`[SLH-DSA] Calling Python API at ${pythonApiUrl}/sign-message`);
//       const res = await fetch(`${pythonApiUrl}/sign-message`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ algorithm: algo, privateKey: keys.privateKey, message }),
//       });
//       const data = await res.json();
//       // console.log("[SLH-DSA] Python API response:", data);
//       if (!res.ok || data.error) throw new Error(data.details || data.error || "Python API failed");
//       logSigningTable(algo, data.signature, "success");
//       return data.signature;
//     } catch (err) {
//       // console.error("[SLH-DSA] Signing failed:", err);
//       logSigningTable(algo, err.message, "fail");
//       throw new Error(`SLH-DSA signing failed: ${err.message}`);
//     }
//   }

//   else {
//     // console.warn(`[SIGNING] Unsupported algorithm: ${algo}`);
//     return "UNSUPPORTED_ALGO";
//   }
// }

// export async function POST(req) {
//   const start = Date.now();
//   // console.log("\n========== POST /api/signing-message ==========");

//   // ── 1. Parse request ───────────────────────────────────────────────────────
//   let message, walletAddress;
//   try {
//     ({ message, walletAddress } = await req.json());
//     // console.log("[REQUEST] walletAddress:", walletAddress);
//     // console.log("[REQUEST] message:", message);
//     logRequestTable({ walletAddress, message });
//   } catch (err) {
//     // console.error("[REQUEST] Failed to parse body:", err);
//     return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
//   }

//   if (!message || !walletAddress) {
//     return NextResponse.json(
//       { error: "message and walletAddress are required" },
//       { status: 400 }
//     );
//   }

//   // ── 2. Fetch user from Firestore ───────────────────────────────────────────
//   let userData;
//   try {
//     // console.log("[FIRESTORE] Fetching user:", walletAddress);
//     const snap = await getDoc(doc(db, "Users", walletAddress));
//     if (!snap.exists()) {
//       // console.warn("[FIRESTORE] User not found:", walletAddress);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
//     userData = snap.data();
//     // console.log("[FIRESTORE] User data keys:", Object.keys(userData));
//     const selectedOptions = userData.selectedOptions || [];
//     // console.log("[SIGNING] Selected algorithms:", selectedOptions);
//     logFirestoreTable({
//       walletAddress,
//       keys: Object.keys(userData),
//       selectedAlgos: selectedOptions,
//     });
//   } catch (err) {
//     // console.error("[FIRESTORE] getDoc failed:", err);
//     return NextResponse.json(
//       { error: `Firestore error: ${err.message}` },
//       { status: 500 }
//     );
//   }

//   // ── 3. Sign with each algorithm ────────────────────────────────────────────
//   const selectedOptions = userData.selectedOptions || [];
//   const signatures = {};
//   const signingLogs = [];

//   for (const algo of selectedOptions) {
//     const keys = userData[algo];
//     if (!keys) {
//       // console.warn(`[SIGNING] No keys found for algo: ${algo}`);
//       continue;
//     }

//     // console.log(`[SIGNING] Signing with: ${algo}`);
//     let signature;
//     try {
//       signature = await signWithAlgo(algo, keys, message);
//     } catch (err) {
//       // console.error(`[SIGNING] Failed for ${algo}:`, err);
//       return NextResponse.json(
//         { error: err.message, failedAlgo: algo },
//         { status: 500 }
//       );
//     }

//     signatures[algo] = signature;
//     signingLogs.push({
//       digitalSignature: signature,
//       originalMessage: message,
//       publicKey: keys.publicKey,
//       algorithmUsed: algo,
//     });
//   }

//   // ── 4. Verify ──────────────────────────────────────────────────────────────
//   let verification = null;
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     // console.log("[VERIFICATION] Calling:", `${baseUrl}/api/sign-verification`);
//     const res = await fetch(`${baseUrl}/api/sign-verification`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ verificationData: signingLogs }),
//     });
//     if (res.ok) {
//       const json = await res.json();
//       verification = json.validityResults;
//       // console.log("[VERIFICATION] Results:", verification);
//       logVerificationTable(verification);
//     } else {
//       const errText = await res.text();
//       // console.warn("[VERIFICATION] Non-OK response:", res.status, errText);
//     }
//   } catch (err) {
//     // console.error("[VERIFICATION] Fetch failed:", err);
//   }

//   // ── 5. Timing + response ───────────────────────────────────────────────────
//   // console.log("[RESPONSE] Returning success");
//   logTimingTable("POST /api/signing-message", 200, Date.now() - start);

//   return NextResponse.json({ success: true, message, signatures, verification });
// }


import { NextResponse } from "next/server";
import { db } from "@/lib/database/firebase";
import { doc, getDoc } from "firebase/firestore";
import elliptic from "elliptic";
import crypto from "crypto";
import * as secp from "@noble/secp256k1";
import { sha256 } from "@noble/hashes/sha256";
import { hmac } from "@noble/hashes/hmac";
import { logSummaryTable, logSigningError } from "@/lib/tableLogger";

secp.utils.hmacSha256Sync = (key, ...msgs) =>
  hmac(sha256, key, secp.utils.concatBytes(...msgs));

const ec = new elliptic.ec("secp256k1");

async function signWithAlgo(algo, keys, message) {
  if (algo === "ECDSA (secp256k1)") {
    try {
      const keyPair = ec.keyFromPrivate(keys.privateKey);
      const msgHash = crypto.createHash("sha256").update(message).digest();
      const signature = keyPair.sign(msgHash).toDER("hex");
      // console.log("ECDSA Signature:", signature);
      return signature;
    } catch (err) {
      // console.error("[ECDSA] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`ECDSA signing failed: ${err.message}`);
    }
  }

  else if (algo === "RSA-PSS") {
    try {
      const signature = crypto
        .sign("sha256", Buffer.from(message), {
          key: keys.privateKey,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
        })
        .toString("base64");
      // console.log("RSA-PSS Signature:", signature);
      return signature;
    } catch (err) {
      // console.error("[RSA-PSS] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`RSA-PSS signing failed: ${err.message}`);
    }
  }

  else if (algo === "Ed25519") {
    try {
      const signature = crypto
        .sign(null, Buffer.from(message), {
          key: keys.privateKey,
          format: "pem",
          type: "pkcs8",
        })
        .toString("base64");
      // console.log(`[Ed25519] Signature: ${signature}`);
      return signature;
    } catch (err) {
      // console.error("[Ed25519] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`Ed25519 signing failed: ${err.message}`);
    }
  }

  else if (algo === "Schnorr (secp256k1)") {
    try {
      const privKey = Uint8Array.from(Buffer.from(keys.privateKey, "hex"));
      // console.log("Schnorr Private Key:", keys.privateKey);
      const msgHash = sha256(new TextEncoder().encode(message));
      // console.log("Schnorr Message Hash:", Buffer.from(msgHash).toString("hex"));
      const sigBytes = await secp.schnorr.sign(msgHash, privKey);
      const signature = Buffer.from(sigBytes).toString("hex");
      // console.log(`[Schnorr] Signature: ${signature}`);
      return signature;
    } catch (err) {
      // console.error("[Schnorr] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`Schnorr signing failed: ${err.message}`);
    }
  }

  else if (algo === "ML-DSA (Dilithium)") {
    try {
      const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
      // console.log(`[ML-DSA] Calling Python API at ${pythonApiUrl}/sign-message`);
      const res = await fetch(`${pythonApiUrl}/sign-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm: algo, privateKey: keys.privateKey, message }),
      });
      const data = await res.json();
      // console.log("[ML-DSA] Python API response:", data);
      if (!res.ok || data.error) throw new Error(data.details || data.error || "Python API failed");
      return data.signature;
    } catch (err) {
      // console.error("[ML-DSA] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`ML-DSA signing failed: ${err.message}`);
    }
  }

  else if (algo === "SLH-DSA (SPHINCS+)") {
    try {
      const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
      // console.log(`[SLH-DSA] Calling Python API at ${pythonApiUrl}/sign-message`);
      const res = await fetch(`${pythonApiUrl}/sign-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm: algo, privateKey: keys.privateKey, message }),
      });
      const data = await res.json();
      // console.log("[SLH-DSA] Python API response:", data);
      if (!res.ok || data.error) throw new Error(data.details || data.error || "Python API failed");
      return data.signature;
    } catch (err) {
      // console.error("[SLH-DSA] Signing failed:", err);
      logSigningError(algo, err.message);
      throw new Error(`SLH-DSA signing failed: ${err.message}`);
    }
  }

  else {
    // console.warn(`[SIGNING] Unsupported algorithm: ${algo}`);
    return "UNSUPPORTED_ALGO";
  }
}

export async function POST(req) {
  const start = Date.now();
  // console.log("\n========== POST /api/signing-message ==========");

  // ── 1. Parse request ───────────────────────────────────────────────────────
  let message, walletAddress;
  try {
    ({ message, walletAddress } = await req.json());
    // console.log("[REQUEST] walletAddress:", walletAddress);
    // console.log("[REQUEST] message:", message);
  } catch (err) {
    // console.error("[REQUEST] Failed to parse body:", err);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!message || !walletAddress) {
    return NextResponse.json(
      { error: "message and walletAddress are required" },
      { status: 400 }
    );
  }

  // ── 2. Fetch user from Firestore ───────────────────────────────────────────
  let userData;
  try {
    // console.log("[FIRESTORE] Fetching user:", walletAddress);
    const snap = await getDoc(doc(db, "Users", walletAddress));
    if (!snap.exists()) {
      // console.warn("[FIRESTORE] User not found:", walletAddress);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    userData = snap.data();
    // console.log("[FIRESTORE] User data keys:", Object.keys(userData));
    // console.log("[SIGNING] Selected algorithms:", userData.selectedOptions);
  } catch (err) {
    // console.error("[FIRESTORE] getDoc failed:", err);
    return NextResponse.json(
      { error: `Firestore error: ${err.message}` },
      { status: 500 }
    );
  }

  // ── 3. Sign with each algorithm ────────────────────────────────────────────
  const selectedOptions = userData.selectedOptions || [];
  const signatures = {};
  const signingLogs = [];

  for (const algo of selectedOptions) {
    const keys = userData[algo];
    if (!keys) {
      // console.warn(`[SIGNING] No keys found for algo: ${algo}`);
      continue;
    }

    // console.log(`[SIGNING] Signing with: ${algo}`);
    let signature;
    try {
      signature = await signWithAlgo(algo, keys, message);
    } catch (err) {
      // console.error(`[SIGNING] Failed for ${algo}:`, err);
      return NextResponse.json(
        { error: err.message, failedAlgo: algo },
        { status: 500 }
      );
    }

    signatures[algo] = signature;
    signingLogs.push({
      digitalSignature: signature,
      originalMessage: message,
      publicKey: keys.publicKey,
      algorithmUsed: algo,
    });
  }

  // ── 4. Verify ──────────────────────────────────────────────────────────────
  let verification = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // console.log("[VERIFICATION] Calling:", `${baseUrl}/api/sign-verification`);
    const res = await fetch(`${baseUrl}/api/sign-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationData: signingLogs }),
    });
    if (res.ok) {
      const json = await res.json();
      verification = json.validityResults;
      // console.log("[VERIFICATION] Results:", verification);
    } else {
      const errText = await res.text();
      // console.warn("[VERIFICATION] Non-OK response:", res.status, errText);
    }
  } catch (err) {
    // console.error("[VERIFICATION] Fetch failed:", err);
  }

  // ── 5. Print one clean summary table + return response ────────────────────
  // console.log("[RESPONSE] Returning success");
  logSummaryTable({
    walletAddress,
    message,
    algos: selectedOptions,
    signatures,
    verificationResults: verification,
    totalMs: Date.now() - start,
  });

  return NextResponse.json({ success: true, message, signatures, verification });
}