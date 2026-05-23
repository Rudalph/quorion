import { NextResponse } from "next/server";
import elliptic from "elliptic";
import crypto from "crypto";


import { sha256 } from "@noble/hashes/sha256";
import * as secp from "@noble/secp256k1";

const ec = new elliptic.ec("secp256k1");

export async function POST(req) {
  try {
    const { verificationData } = await req.json();

    if (!Array.isArray(verificationData)) {
      return NextResponse.json(
        { error: "Invalid verification data" },
        { status: 400 }
      );
    }

    const results = {};

    for (const [i, item] of verificationData.entries()) {
      const {
        digitalSignature,
        originalMessage,
        publicKey,
        algorithmUsed,
      } = item;

      let isValid = false;

      try {
        // ================= ECDSA =================
        if (algorithmUsed === "ECDSA (secp256k1)") {
          const key = ec.keyFromPublic(publicKey, "hex");

          const msgHash = crypto
            .createHash("sha256")
            .update(originalMessage)
            .digest();

          isValid = key.verify(msgHash, digitalSignature);
        }

        // ================= RSA-PSS =================
        else if (algorithmUsed === "RSA-PSS") {
          const verify = crypto.createVerify("sha256");

          verify.update(originalMessage);
          verify.end();

          isValid = verify.verify(
            {
              key: publicKey,
              padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
              saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
            },
            digitalSignature,
            "base64"
          );
        }

        // ================= Ed25519 =================
        else if (algorithmUsed === "Ed25519") {
          isValid = crypto.verify(
            null,
            Buffer.from(originalMessage),
            publicKey,
            Buffer.from(digitalSignature, "base64")
          );
        }

        // ================= Schnorr (FIXED) =================
       else if (algorithmUsed === "Schnorr (secp256k1)") {
          try {
            const msgHash = sha256(new TextEncoder().encode(originalMessage));
            const sigBytes = Uint8Array.from(Buffer.from(digitalSignature, "hex"));
            const pubBytes = Uint8Array.from(Buffer.from(publicKey, "hex"));

            isValid = secp.schnorr.verify(sigBytes, msgHash, pubBytes);
            console.log(`[Schnorr] Verification result: ${isValid}`);
          } catch (err) {
            console.error("[Schnorr] Verification failed:", err);
            isValid = false;
          }
     }
     
     // ================= ML-DSA (Dilithium) =================
    else if (algorithmUsed === "ML-DSA (Dilithium)") {
      try {
        const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
        console.log(`[ML-DSA] Calling Python API for verification`);

        const res = await fetch(`${pythonApiUrl}/verify-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            algorithm: algorithmUsed,
            publicKey: publicKey,
            message: originalMessage,
            signature: digitalSignature,
          }),
        });

        const data = await res.json();
        console.log("[ML-DSA] Verification response:", data);

        if (!res.ok || data.error) {
          throw new Error(data.details || data.error || "Python API verification failed");
        }

        isValid = data.isValid;
      } catch (err) {
        console.error("[ML-DSA] Verification failed:", err);
        isValid = false;
      }
    }

    // ================= SLH-DSA (SPHINCS+) =================
    else if (algorithmUsed === "SLH-DSA (SPHINCS+)") {
      try {
        const pythonApiUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
        console.log(`[SLH-DSA] Calling Python API for verification`);

        const res = await fetch(`${pythonApiUrl}/verify-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            algorithm: algorithmUsed,
            publicKey: publicKey,
            message: originalMessage,
            signature: digitalSignature,
          }),
        });

        const data = await res.json();
        console.log("[SLH-DSA] Verification response:", data);

        if (!res.ok || data.error) {
          throw new Error(data.details || data.error || "Python API verification failed");
        }

        isValid = data.isValid;
      } catch (err) {
        console.error("[SLH-DSA] Verification failed:", err);
        isValid = false;
      }
    }

        results[algorithmUsed || `algo_${i}`] = {
          status: isValid ? "Valid" : "Invalid",
          algorithm: algorithmUsed,
        };
      } catch (err) {
        results[algorithmUsed || `algo_${i}`] = {
          status: "Error",
          error: err.message,
        };
      }
    }

    return NextResponse.json({
      success: true,
      validityResults: results,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}