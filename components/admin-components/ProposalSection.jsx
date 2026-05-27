// import React, { useState } from 'react';
// import { db } from '../../lib/database/firebase';
// import { doc, setDoc } from 'firebase/firestore';

// const ProposalSection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const cards = [
//     { id: 'add', title: 'Add New Algorithm', description: 'Register a new algorithm into the DAO system.', icon: '🚀' },
//     { id: 'default', title: 'Set a Default Algorithm', description: 'Configure the primary algorithm for the network.', icon: '⭐' },
//     { id: 'delete', title: 'Delete an Algorithm', description: 'Remove an obsolete algorithm from the registry.', icon: '🗑️' },
//     { id: 'deprecate', title: 'Depricate an Algorithm', description: 'Mark an algorithm as deprecated for users.', icon: '⚠️' },
//     { id: 'risk', title: 'Assign a Risk Score', description: 'Evaluate and assign risk metrics to an algorithm.', icon: '🛡️' },
//   ];

//   const handleCardClick = (card) => {
//     setSelectedCard(card);
//     setFormData({});
//     setIsModalOpen(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       // Document name should be the type (id) of the proposal
//       const docId = selectedCard.id;
      
//       // We use setDoc with merge: true if we want to keep previous entries, 
//       // but the user said "stored every time", usually implying a log or unique entries.
//       // However, they specified "document name should be name of the proposal Type",
//       // which means only one document per type. To store "every time", 
//       // we should probably use a sub-collection or an array.
//       // Given the specific request "document name should be name of the proposal Type",
//       // I will implement it as a document that gets updated, or use a timestamped ID 
//       // if they meant a collection of proposals.
//       // Re-reading: "document name should be name of the proposal Type" -> this is very specific.
//       // I'll use a sub-collection called 'entries' under the type document to store every instance.
      
//       await setDoc(doc(db, 'adminProposals', docId, 'entries', Date.now().toString()), {
//         ...formData,
//         timestamp: new Date().toISOString(),
//         proposalType: selectedCard.title
//       });

//       console.log(`Successfully stored ${selectedCard.title} in Firestore`);
//       setIsModalOpen(false);
//       setFormData({});
//     } catch (error) {
//       console.error("Error adding document: ", error);
//       alert("Failed to save proposal to Firebase");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderFormFields = () => {
//     switch (selectedCard?.id) {
//       case 'add':
//         return (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
//               <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea name="description" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter description" rows="3" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                 <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//             </div>
//           </>
//         );
//       case 'default':
//         return (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
//               <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Reason to set it default</label>
//               <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                 <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//             </div>
//           </>
//         );
//       case 'delete':
//         return (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Algorithm</label>
//               <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Reason to delete the algorithm</label>
//               <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                 <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//             </div>
//           </>
//         );
//       case 'deprecate':
//         return (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
//               <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Reason for deprecation</label>
//               <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                 <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//             </div>
//           </>
//         );
//       case 'risk':
//         return (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name of Algorithm</label>
//               <input type="text" name="name" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Algorithm Name" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Score value</label>
//               <input type="number" name="score" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="0-100" />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Reason for giving this score</label>
//               <textarea name="reason" onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="Enter reason" rows="3" />
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//                 <input type="datetime-local" name="startTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//                 <input type="datetime-local" name="endTime" onChange={handleInputChange} className="w-full p-2 border rounded" />
//               </div>
//             </div>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-6">Add New Proposal</h2>
//       <p className="text-gray-600 mb-8">Select an action to create a new proposal for the DAO.</p>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card, index) => (
//           <div 
//             key={index} 
//             className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer group border-gray-200"
//             onClick={() => handleCardClick(card)}
//           >
//             <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
//             <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
//             <p className="text-sm text-gray-500">{card.description}</p>
//             <div className="mt-4 text-blue-600 text-sm font-medium group-hover:underline">
//               Configure →
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold">{selectedCard?.title}</h3>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               {renderFormFields()}
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button 
//                   type="button" 
//                   onClick={() => setIsModalOpen(false)} 
//                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   disabled={isSubmitting}
//                   className={`px-4 py-2 text-white rounded-lg transition shadow-md ${
//                     isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//                   }`}
//                 >
//                   {isSubmitting ? 'Saving...' : 'Submit'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProposalSection;

import React, { useState } from "react";
import { db } from "../../lib/database/firebase";
import { doc, setDoc } from "firebase/firestore";

const CARD_CONFIG = [
  {
    id: "add",
    title: "Add Algorithm",
    description: "Register a new algorithm into the DAO system.",
    iconPath: "M12 4v16m8-8H4",
    iconBg: "rgba(110,231,183,0.12)",
    iconColor: "#6ee7b7",
    accentColor: "rgba(110,231,183,0.3)",
  },
  {
    id: "default",
    title: "Set Default",
    description: "Configure the primary algorithm for the network.",
    iconPath: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    iconBg: "rgba(147,197,253,0.12)",
    iconColor: "#93c5fd",
    accentColor: "rgba(147,197,253,0.3)",
  },
  {
    id: "delete",
    title: "Delete Algorithm",
    description: "Remove an obsolete algorithm from the registry.",
    iconPath: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    iconBg: "rgba(239,68,68,0.1)",
    iconColor: "#f87171",
    accentColor: "rgba(239,68,68,0.25)",
  },
  {
    id: "deprecate",
    title: "Deprecate",
    description: "Mark an algorithm as deprecated for users.",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    iconBg: "rgba(253,230,138,0.1)",
    iconColor: "#fde68a",
    accentColor: "rgba(253,230,138,0.25)",
  },
  {
    id: "risk",
    title: "Assign Risk Score",
    description: "Evaluate and assign risk metrics to an algorithm.",
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    iconBg: "rgba(249,168,212,0.1)",
    iconColor: "#f9a8d4",
    accentColor: "rgba(249,168,212,0.25)",
  },
];

const FIELD_STYLE = `
  width: 100%;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9px;
  padding: 11px 14px;
  font-size: 13px;
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-weight: 500;
`;

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        color: "#94a3b8", textTransform: "uppercase",
        letterSpacing: "0.1em", marginBottom: 7,
      }}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...Object.fromEntries(FIELD_STYLE.split(";").filter(Boolean).map(s => {
          const [k, v] = s.split(":");
          return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v?.trim()];
        })),
        borderColor: focused ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)",
        boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
        ...(props.style || {}),
      }}
    />
  );
}

function StyledTextarea({ ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.45)",
        border: `1px solid ${focused ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 9,
        padding: "11px 14px",
        fontSize: 13,
        color: "#f1f5f9",
        fontFamily: "'Inter', sans-serif",
        outline: "none",
        resize: "none",
        lineHeight: 1.65,
        fontWeight: 500,
        boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.12)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        ...(props.style || {}),
      }}
    />
  );
}

function renderFormFields(id, handleInputChange) {
  const commonTimes = (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="Start time">
        <StyledInput type="datetime-local" name="startTime" onChange={handleInputChange} />
      </Field>
      <Field label="End time">
        <StyledInput type="datetime-local" name="endTime" onChange={handleInputChange} />
      </Field>
    </div>
  );

  switch (id) {
    case "add":
      return (<>
        <Field label="Algorithm name"><StyledInput name="name" placeholder="e.g. SLH-DSA (SPHINCS+)" onChange={handleInputChange} /></Field>
        <Field label="Description"><StyledTextarea name="description" placeholder="Describe the algorithm and its purpose" rows={3} onChange={handleInputChange} /></Field>
        {commonTimes}
      </>);
    case "default":
      return (<>
        <Field label="Algorithm name"><StyledInput name="name" placeholder="Algorithm name" onChange={handleInputChange} /></Field>
        <Field label="Reason to set as default"><StyledTextarea name="reason" placeholder="Explain why this should be the default" rows={3} onChange={handleInputChange} /></Field>
        {commonTimes}
      </>);
    case "delete":
      return (<>
        <Field label="Algorithm name"><StyledInput name="name" placeholder="Algorithm to remove" onChange={handleInputChange} /></Field>
        <Field label="Reason for deletion"><StyledTextarea name="reason" placeholder="Why should this algorithm be removed?" rows={3} onChange={handleInputChange} /></Field>
        {commonTimes}
      </>);
    case "deprecate":
      return (<>
        <Field label="Algorithm name"><StyledInput name="name" placeholder="Algorithm to deprecate" onChange={handleInputChange} /></Field>
        <Field label="Reason for deprecation"><StyledTextarea name="reason" placeholder="Why is this algorithm being deprecated?" rows={3} onChange={handleInputChange} /></Field>
        {commonTimes}
      </>);
    case "risk":
      return (<>
        <Field label="Algorithm name"><StyledInput name="name" placeholder="Algorithm name" onChange={handleInputChange} /></Field>
        <Field label="Score value (0–100)"><StyledInput type="number" name="score" placeholder="0" min="0" max="100" onChange={handleInputChange} /></Field>
        <Field label="Reason for this score"><StyledTextarea name="reason" placeholder="Explain the risk assessment" rows={3} onChange={handleInputChange} /></Field>
        {commonTimes}
      </>);
    default:
      return null;
  }
}

export default function ProposalSection() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData]         = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setDoc(
        doc(db, "adminProposals", selectedCard.id, "entries", Date.now().toString()),
        { ...formData, timestamp: new Date().toISOString(), proposalType: selectedCard.title }
      );
      setIsModalOpen(false);
      setFormData({});
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to save proposal to Firebase");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
        }
        .ps-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 20px 18px 18px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .ps-card:hover { border-color: rgba(124,58,237,0.4); background: rgba(124,58,237,0.06); transform: translateY(-1px); }
        .ps-card-icon  { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .ps-card-title { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 6px; letter-spacing: -0.2px; }
        .ps-card-desc  { font-size: 12px; color: #64748b; line-height: 1.65; font-weight: 400; }
        .ps-card-arrow { position: absolute; bottom: 14px; right: 15px; font-size: 11px; color: #7c3aed; font-weight: 700; letter-spacing: 0.02em; opacity: 0; transition: opacity 0.15s; }
        .ps-card:hover .ps-card-arrow { opacity: 1; }

        .ps-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          font-family: 'Inter', sans-serif;
        }
        .ps-modal {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 26px 24px;
          width: 440px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 64px);
          overflow-y: auto;
          position: relative;
        }
        .ps-modal::-webkit-scrollbar { width: 3px; }
        .ps-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .ps-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .ps-modal-title { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
        .ps-modal-close { background: none; border: none; color: #64748b; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
        .ps-modal-close:hover { color: #cbd5e1; }
        .ps-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
        .ps-btn-cancel {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px; padding: 9px 18px;
          color: #94a3b8; font-size: 13px; font-weight: 600;
          font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .ps-btn-cancel:hover { background: rgba(255,255,255,0.09); color: #cbd5e1; }
        .ps-btn-submit {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none; border-radius: 9px; padding: 9px 22px;
          color: #fff; font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          transition: opacity 0.15s; display: flex; align-items: center; gap: 7px;
          box-shadow: 0 4px 14px rgba(124,58,237,0.35);
        }
        .ps-btn-submit:hover:not(:disabled) { opacity: 0.88; }
        .ps-btn-submit:disabled { opacity: 0.3; cursor: not-allowed; }
        .ps-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: ps-spin 0.65s linear infinite; }
        @keyframes ps-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ps-grid">
        {CARD_CONFIG.map((card) => (
          <div key={card.id} className="ps-card" onClick={() => handleCardClick(card)}>
            <div className="ps-card-icon" style={{ background: card.iconBg, border: `1px solid ${card.accentColor}` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={card.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={card.iconPath}/>
              </svg>
            </div>
            <div className="ps-card-title">{card.title}</div>
            <div className="ps-card-desc">{card.description}</div>
            <div className="ps-card-arrow">Configure →</div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="ps-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="ps-modal">
            <div className="ps-modal-head">
              <span className="ps-modal-title">{selectedCard?.title}</span>
              <button className="ps-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {renderFormFields(selectedCard?.id, handleInputChange)}
              <div className="ps-modal-actions">
                <button type="button" className="ps-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="ps-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? <div className="ps-spinner"/> : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  {isSubmitting ? "Saving…" : "Submit proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}