import React, { useState } from 'react';
import { db } from '../../lib/database/firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProposalSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cards = [
    { id: 'add', title: 'Add New Algorithm', description: 'Register a new algorithm into the DAO system.', icon: '🚀' },
    { id: 'default', title: 'Set a Default Algorithm', description: 'Configure the primary algorithm for the network.', icon: '⭐' },
    { id: 'delete', title: 'Delete an Algorithm', description: 'Remove an obsolete algorithm from the registry.', icon: '🗑️' },
    { id: 'deprecate', title: 'Depricate an Algorithm', description: 'Mark an algorithm as deprecated for users.', icon: '⚠️' },
    { id: 'risk', title: 'Assign a Risk Score', description: 'Evaluate and assign risk metrics to an algorithm.', icon: '🛡️' },
  ];

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Document name should be the type (id) of the proposal
      const docId = selectedCard.id;
      
      // We use setDoc with merge: true if we want to keep previous entries, 
      // but the user said "stored every time", usually implying a log or unique entries.
      // However, they specified "document name should be name of the proposal Type",
      // which means only one document per type. To store "every time", 
      // we should probably use a sub-collection or an array.
      // Given the specific request "document name should be name of the proposal Type",
      // I will implement it as a document that gets updated, or use a timestamped ID 
      // if they meant a collection of proposals.
      // Re-reading: "document name should be name of the proposal Type" -> this is very specific.
      // I'll use a sub-collection called 'entries' under the type document to store every instance.
      
      await setDoc(doc(db, 'adminProposals', docId, 'entries', Date.now().toString()), {
        ...formData,
        timestamp: new Date().toISOString(),
        proposalType: selectedCard.title
      });

      console.log(`Successfully stored ${selectedCard.title} in Firestore`);
      setIsModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save proposal to Firebase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (selectedCard?.id) {
      case 'add':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter description" rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </>
        );
      case 'default':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason to set it default</label>
              <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </>
        );
      case 'delete':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Algorithm</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason to delete the algorithm</label>
              <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </>
        );
      case 'deprecate':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deprecation</label>
              <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </>
        );
      case 'risk':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Score value</label>
              <input type="number" name="score" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="0-100" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for giving this score</label>
              <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Add New Proposal</h2>
      <p className="text-gray-600 mb-8">Select an action to create a new proposal for the DAO.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer group border-gray-200"
            onClick={() => handleCardClick(card)}
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.description}</p>
            <div className="mt-4 text-blue-600 text-sm font-medium group-hover:underline">
              Configure →
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedCard?.title}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white rounded-lg transition shadow-md ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalSection;

