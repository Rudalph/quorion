import React, { useState, useEffect } from 'react';
import { db } from '../../lib/database/firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { useWallet } from '@solana/wallet-adapter-react';

const ViewProposals = () => {
  const { publicKey } = useWallet();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const categories = [
    { id: 'add', label: 'Add' },
    { id: 'delete', label: 'Delete' },
    { id: 'deprecate', label: 'Deprecate' },
    { id: 'risk', label: 'Risk' },
    { id: 'default', label: 'Default' },
  ];

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const allProposals = [];
        const now = new Date().toISOString();

        for (const cat of categories) {
          const entriesRef = collection(db, 'adminProposals', cat.id, 'entries');
          const snapshot = await getDocs(entriesRef);
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            // Only include if end time is in the future
            if (data.endTime && new Date(data.endTime) > new Date()) {
              allProposals.push({ id: doc.id, type: cat.id, ...data });
            }
          });
        }
        setProposals(allProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading proposals...</div>;
  }

  const handleVote = async (voteType) => {
    if (!publicKey) {
      alert("Please connect your Phantom wallet to vote.");
      return;
    }

    setIsVoting(true);
    const proposalId = selectedProposal.id;
    const walletAddress = publicKey.toBase58();

    try {
      // 1. Check if user has already voted on this proposal
      const proposalRef = doc(db, 'adminProposals', selectedProposal.type, 'entries', proposalId);
      const proposalSnap = await getDoc(proposalRef);
      const proposalData = proposalSnap.data();

      if (proposalData?.voters?.includes(walletAddress)) {
        alert("You have already voted on this proposal.");
        setIsVoting(false);
        return;
      }

      // 2. Update vote counters and add voter to list
      const updateData = {
        voters: arrayUnion(walletAddress),
        [voteType === 'positive' ? 'positiveVoteCounter' : 'negativeVoteCounter']: increment(1)
      };

      await updateDoc(proposalRef, updateData);
      
      alert(`Successfully voted ${voteType}!`);
      setSelectedProposal(null);
      
      // Refresh proposals list to update counters in UI if needed
      // (Though we only show counters in the modal, we can re-fetch)
      setProposals([]); // Trigger useEffect to re-fetch
    } catch (error) {
      console.error("Voting error:", error);
      alert("An error occurred while voting.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Active Proposals</h2>
      
      <div className="space-y-8">
        {categories.map((cat) => {
          const catProposals = proposals.filter(p => p.type === cat.id);
          if (catProposals.length === 0) return null;

          return (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-700">{cat.label} Proposals</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {catProposals.map((prop) => (
                  <div 
                    key={prop.id} 
                    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center"
                    onClick={() => setSelectedProposal(prop)}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{prop.name || 'Unnamed Proposal'}</p>
                      <p className="text-xs text-gray-500">Ends: {new Date(prop.endTime).toLocaleString()}</p>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">View Details →</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No active proposals found.
        </div>
      )}

      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Proposal Details</h3>
              <button onClick={() => setSelectedProposal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                  <p className="text-gray-800 font-medium">{selectedProposal.proposalType}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Algorithm</label>
                  <p className="text-gray-800 font-medium">{selectedProposal.name}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Description/Reason</label>
                <p className="text-gray-800">{selectedProposal.description || selectedProposal.reason || 'N/A'}</p>
              </div>

              {selectedProposal.score && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Risk Score</label>
                  <p className="text-gray-800 font-bold text-lg">{selectedProposal.score}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Start Time</label>
                  <p className="text-gray-800 text-sm">{new Date(selectedProposal.startTime).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">End Time</label>
                  <p className="text-gray-800 text-sm">{new Date(selectedProposal.endTime).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleVote('positive')} 
                  disabled={isVoting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm font-medium disabled:opacity-50"
                >
                  {isVoting ? 'Voting...' : 'Vote Positive'}
                </button>
                <button 
                  onClick={() => handleVote('negative')} 
                  disabled={isVoting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium disabled:opacity-50"
                >
                  {isVoting ? 'Voting...' : 'Vote Negative'}
                </button>
              </div>
              <button 
                onClick={() => setSelectedProposal(null)} 
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;
