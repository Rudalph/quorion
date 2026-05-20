import { NextResponse } from "next/server";
import { db } from "@/lib/database/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    const userRef = doc(db, "Users", walletAddress);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const userData = snap.data();
    const selectedOptions = userData.selectedOptions || [];
    
    const filteredKeys = {};
    
    selectedOptions.forEach(algo => {
      if (userData[algo]) {
        filteredKeys[algo] = userData[algo];
      }
    });

    return NextResponse.json({ 
      data: filteredKeys,
      selectedCount: selectedOptions.length 
    });

  } catch (err) {
    console.error("Error fetching selected keys:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
