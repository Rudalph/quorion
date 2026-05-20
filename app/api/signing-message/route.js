import { NextResponse } from "next/server";
import { db } from "@/lib/database/firebase";
import { doc, getDoc } from "firebase/firestore";
import elliptic from "elliptic";

const ec = new elliptic.ec("secp256k1");

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, walletAddress } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log("Received message for signing:", message);

    if (walletAddress) {
      const userRef = doc(db, "Users", walletAddress);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const userData = snap.data();
        const selectedOptions = userData.selectedOptions || [];
        
        const filteredKeys = {};
        selectedOptions.forEach(algo => {
          if (userData[algo]) {
            filteredKeys[algo] = userData[algo];
          }
        });

        console.log("Keys for selected algorithms:", filteredKeys);

        // Iterate over the map of keys and sign based on the algorithm
        const signatures = {};
        for (const [algo, keys] of Object.entries(filteredKeys)) {
          try {
            if (algo === "secp256k1") {
              // ECDSA (secp256k1) Signing
              const keyPair = ec.keyFromPrivate(keys.privateKey);
              const signature = keyPair.sign(message).toDER('hex');
              signatures[algo] = signature;
              console.log(`Signed with secp256k1: ${signature}`);
            } 
            else if (algo === "Algorithm1") {
              // Placeholder for Ed25519 (EdDSA)
              signatures[algo] = "SIGNATURE_PLACEHOLDER_ED25519";
              console.log(`Placeholder sign for ${algo}`);
            }
            else if (algo === "Algorithm3") {
              // Placeholder for Schnorr
              signatures[algo] = "SIGNATURE_PLACEHOLDER_SCHS";
              console.log(`Placeholder sign for ${algo}`);
            }
            else {
              // Placeholder for any other algorithm
              signatures[algo] = "SIGNATURE_PLACEHOLDER_GENERIC";
              console.log(`Placeholder sign for unknown algo: ${algo}`);
            }
          } catch (signError) {
            console.error(`Error signing with ${algo}:`, signError);
            signatures[algo] = "SIGNING_ERROR";
          }
        }

        return NextResponse.json({ 
          success: true, 
          receivedMessage: message,
          signatures: signatures
        });

      } else {
        console.log("No user document found for walletAddress:", walletAddress);
      }
    } else {
      console.log("No walletAddress provided in request body to fetch keys.");
    }

    return NextResponse.json({ 
      success: true, 
      receivedMessage: message 
    });

  } catch (err) {
    console.error("Error in signing-message API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
