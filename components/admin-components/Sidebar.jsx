// import React from 'react';

// const Sidebar = ({ activeSection, setActiveSection }) => {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//     { id: 'view-proposals', label: 'View Proposals', icon: '👁️' },
//     { id: 'proposals', label: 'Add New Proposal', icon: '➕' },
//     { id: 'algorithms', label: 'Algorithms', icon: '👥' },
//     { id: 'treasury', label: 'Treasury', icon: '💰' },
//     { id: 'settings', label: 'Settings', icon: '⚙️' },
//   ];

//   return (
//     <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
//       <div className="p-6 text-2xl font-bold border-b border-gray-800">
//         Admin DAO
//       </div>
//       <nav className="flex-1 p-4 space-y-2">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveSection(item.id)}
//             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
//               activeSection === item.id 
//                 ? 'bg-blue-600 text-white' 
//                 : 'text-gray-400 hover:bg-gray-800 hover:text-white'
//             }`}
//           >
//             <span>{item.icon}</span>
//             <span className="font-medium">{item.label}</span>
//           </button>
//         ))}
//       </nav>
//       <div className="p-4 border-t border-gray-800 text-sm text-gray-500">
//         v1.0.0 Stable
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




"use client";

import React from "react";

const NAV_ITEMS = [
  { id: "dashboard",       label: "Dashboard",        icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { id: "view-proposals",  label: "View Proposals",   icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { id: "proposals",       label: "Add Proposal",     icon: "M12 4v16m8-8H4" },
  { id: "algorithms",      label: "Algorithms",       icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
  // { id: "treasury",        label: "Treasury",         icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  // { id: "settings",        label: "Settings",         icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .qdao-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #0d0d1a;
          border-right: 1px solid rgba(255,255,255,0.09);
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }
        .qdao-sb-brand {
          padding: 22px 20px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.09);
        }
        .qdao-sb-icon {
          width: 40px; height: 40px;
          border-radius: 11px;
          background: linear-gradient(135deg, #7c3aed, #4338ca);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .qdao-sb-icon svg { color: #fff; }
        .qdao-sb-name { font-size: 17px; font-weight: 800; color: #fff; letter-spacing: -0.4px; }
        .qdao-sb-sub  { font-size: 10px; font-weight: 700; color: #8b7fd4; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 2px; }
        .qdao-sb-nav  { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }
        .qdao-sb-btn  {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 13px; border-radius: 9px;
          background: none; border: none; cursor: pointer;
          color: #6b7280; font-size: 13px; font-weight: 600;
          font-family: 'Inter', sans-serif; text-align: left;
          width: 100%; transition: all 0.14s;
        }
        .qdao-sb-btn:hover { background: rgba(255,255,255,0.05); color: #cbd5e1; }
        .qdao-sb-btn.active {
          background: rgba(124,58,237,0.16);
          color: #c4b5fd;
          border: 1px solid rgba(124,58,237,0.3);
        }
        .qdao-sb-btn svg { flex-shrink: 0; opacity: 0.8; }
        .qdao-sb-btn.active svg { opacity: 1; }
        .qdao-sb-foot {
          padding: 14px 18px;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-size: 11px; font-weight: 700; color: #374151;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
      `}</style>

      <aside className="qdao-sidebar">
        <div className="qdao-sb-brand">
          <div className="qdao-sb-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
            </svg>
          </div>
          <div>
            <div className="qdao-sb-name">Quorion</div>
            <div className="qdao-sb-sub">Admin DAO</div>
          </div>
        </div>

        <nav className="qdao-sb-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`qdao-sb-btn${activeSection === item.id ? " active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="qdao-sb-foot">v1.0.0 Stable</div>
      </aside>
    </>
  );
}