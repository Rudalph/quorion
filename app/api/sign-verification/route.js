import { NextResponse } from "next/server";
import elliptic from "elliptic";

const ec = new elliptic.ec("secp256k1");

export async function POST(req) {
  try {
    const body = await req.json();
    const { verificationData } = body;

    if (!verificationData || !Array.isArray(verificationData)) {
      return NextResponse.json(
        { error: "Invalid or missing verification data" },
        { status: 400 }
      );
    }

    console.log("--- Received Verification Data for Processing ---");
    
    const validityResults = {};

    // Iterate over the verification data structure
    verificationData.forEach((item, index) => {
      const { digitalSignature, originalMessage, publicKey, algorithmUsed } = item;
      
      try {
        let isValid = false;

        if (algorithmUsed === "ECDSA (secp256k1)") {
          // ECDSA (secp256k1) Verification
          const key = ec.keyFromPublic(publicKey, "hex");
          isValid = key.verify(originalMessage, digitalSignature);
        } 
        else if (algorithmUsed === "Algorithm1") {
          // Placeholder for Ed25519 (EdDSA) Verification
          isValid = "VERIFICATION_PLACEHOLDER_ED25519";
        } 
        else if (algorithmUsed === "Algorithm3") {
          // Placeholder for Schnorr Verification
          isValid = "VERIFICATION_PLACEHOLDER_SCHS";
        } 
        else {
          // Placeholder for other algorithms
          isValid = "VERIFICATION_PLACEHOLDER_GENERIC";
        }

        validityResults[algorithmUsed || `algo_${index}`] = {
          status: isValid === true ? "Valid" : (isValid === false ? "Invalid" : "Pending/Placeholder"),
          algorithm: algorithmUsed,
          timestamp: new Date().toISOString()
        };

      } catch (err) {
        console.error(`Verification error for ${algorithmUsed}:`, err);
        validityResults[algorithmUsed || `algo_${index}`] = {
          status: "Error",
          error: err.message
        };
      }
    });

    console.log("--- Signature Validity Results ---");
    console.log(JSON.stringify(validityResults, null, 2));
    console.log("----------------------------------");

    return NextResponse.json({ 
      success: true, 
      validityResults: validityResults
    });

  } catch (err) {
    console.error("Error in sign-verification API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
