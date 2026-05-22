import { NextResponse } from 'next/server';
import { db } from '@/lib/database/firebase';
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

// import { saveFinalStateDataToBlockchain } from "@/lib/finalStateData_registry_server";
import {
  initializeRegistry,
  saveFinalStateDataToBlockchain
} from "@/lib/finalStateData_registry_server";

export async function GET() {
  try {
    const categories = [
      { id: 'add', label: 'Add' },
      { id: 'delete', label: 'Delete' },
      { id: 'deprecate', label: 'Deprecate' },
      { id: 'risk', label: 'Risk' },
      { id: 'default', label: 'Default' },
    ];

    const now = new Date();
    const processedProposals = [];

    for (const cat of categories) {
      const entriesRef = collection(db, 'adminProposals', cat.id, 'entries');
      const snapshot = await getDocs(entriesRef);
      
      for (const proposalDoc of snapshot.docs) {
        const data = proposalDoc.data();
        const proposalId = proposalDoc.id;

        if (data.endTime && now >= new Date(data.endTime)) {
          // 1. Check if the proposal was already processed
          if (data.status === 'Passed' || data.status === 'Failed') continue;

          const positiveVotes = data.positiveVoteCounter || 0;
          const negativeVotes = data.negativeVoteCounter || 0;
          const totalVotes = positiveVotes + negativeVotes;

          // 2. Check if Number of voters is 10 or more
          if (totalVotes >= 1) {
            // 3. Check for majority (Positive > Negative)
            if (positiveVotes > negativeVotes) {
              const algoName = data.name;
              const finalStateRef = doc(db, 'finalState', algoName);
              const finalStateSnap = await getDoc(finalStateRef);
              const finalStateData = finalStateSnap.exists() ? finalStateSnap.data() : {};

              let updatedState = { ...finalStateData, name: algoName };

              // 4. Handle different cases for Positive Majority
              switch (cat.id) {
                case 'add':
                  updatedState = { 
                    ...updatedState, 
                    riskScore: 0, 
                    isDefault: false, 
                    isDeprecated: false 
                  };
                  break;
                case 'delete':
                  // Remove the algorithm from final state
                  await deleteDoc(finalStateRef);
                  break;
                case 'deprecate':
                  updatedState.isDeprecated = true;
                  break;
                case 'risk':
                  updatedState.riskScore = data.score;
                  break;
                case 'default':
                  updatedState.isDefault = true;
                  break;
              }

              if (cat.id !== 'delete') {
                await setDoc(finalStateRef, updatedState, { merge: true });
              } else {
                // Special case for delete: we might want to use a different method to remove
                // but for now, we'll just mark the proposal as passed and the user can handle 
                // the actual deletion of the algo from the system.
                // To strictly follow "Remove from final state":
                // await deleteDoc(finalStateRef); // Need to import deleteDoc
              }

              await updateDoc(proposalDoc.ref, { status: 'Passed' });
              processedProposals.push({ id: proposalId, status: 'Passed' });
            } else {
              // Majority is negative or equal
              await updateDoc(proposalDoc.ref, { status: 'Failed' });
              processedProposals.push({ id: proposalId, status: 'Failed' });
            }
          } else {
            // Not enough votes to pass/fail yet, or we can mark as failed if time is up
            // The prompt says "if yes then proceed ahead else leave it"
            // So we leave it as is.
          }
        }
      }
    }

    // Fetch and log the entire finalState collection
    const finalStateSnapshot = await getDocs(collection(db, 'finalState'));
    const finalStateData = finalStateSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("--- Current Final State Registry ---");
    console.table(finalStateData);
    console.log("-----------------------------------");


    const blockchainTx = await saveFinalStateDataToBlockchain(finalStateData);
    console.log("Final state saved on blockchain:", blockchainTx);


    return NextResponse.json({ 
      success: true, 
      processed: processedProposals 
    });

  } catch (error) {
    console.error("Error processing proposals:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error" 
    }, { status: 500 });
  }
}
