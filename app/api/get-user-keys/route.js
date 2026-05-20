import { NextResponse } from "next/server";
import { db } from "@/lib/database/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet" }, { status: 400 });
    }

    const userRef = doc(db, "Users", walletAddress);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return NextResponse.json({ data: {} });
    }

    return NextResponse.json({ data: snap.data() });
  } catch (err) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}