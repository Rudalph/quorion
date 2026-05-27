// "use client";

// import React, { useState } from 'react';
// import Sidebar from '../../components/admin-components/Sidebar';
// import ProposalSection from '../../components/admin-components/ProposalSection';
// import ViewProposals from '../../components/admin-components/VeiwProposals';
// import FinalStateRegistryViewer from '../../components/admin-components/FinalStateRegistryViewer';

// export default function AdminDaoPage() {
//   const [activeSection, setActiveSection] = useState('dashboard');

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'view-proposals':
//         return <ViewProposals />;
//       case 'proposals':
//         return <ProposalSection />;
//       case 'algorithms':
//         return <FinalStateRegistryViewer />;
//       case 'dashboard':
//         return (
//           <div className="p-8">
//             <h1 className="text-3xl font-bold mb-4">Admin DAO Dashboard</h1>
//             <p className="text-gray-600">Welcome to the main administration panel.</p>
//           </div>
//         );
//       default:
//         return (
//           <div className="p-8">
//             <h1 className="text-3xl font-bold mb-4">{activeSection}</h1>
//             <p className="text-gray-600">This section is under construction.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
//       <main className="flex-1 overflow-y-auto">
//         {renderContent()}
//       </main>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Sidebar from "../../components/admin-components/Sidebar";
import ProposalSection from "../../components/admin-components/ProposalSection";
import ViewProposals from "../../components/admin-components/VeiwProposals";
import FinalStateRegistryViewer from "../../components/admin-components/FinalStateRegistryViewer";

const SECTION_META = {
  dashboard:        { title: "Admin DAO Dashboard",    sub: "Quantum-safe governance & administration" },
  "view-proposals": { title: "Active Proposals",       sub: "All proposals with a future end time" },
  proposals:        { title: "Add New Proposal",       sub: "Select an action to create a DAO governance proposal" },
  algorithms:       { title: "Final State Registry",   sub: "On-chain algorithm registry from Solana program" },
  treasury:         { title: "Treasury",               sub: "Manage DAO funds and allocations" },
  settings:         { title: "Settings",               sub: "DAO configuration and preferences" },
};

function DashboardHome() {
  const stats = [
    { label: "Active proposals", value: "3",   sub: "2 ending soon",    accent: "#a78bfa" },
    { label: "Algorithms",       value: "6",   sub: "1 deprecated",     accent: "#6ee7b7" },
    { label: "Total votes cast", value: "142", sub: "This cycle",       accent: "#93c5fd" },
  ];
  const activity = [
    { text: "ML-DSA risk score updated to 42",   time: "2h ago",  color: "#4ade80",  glow: "rgba(34,197,94,0.7)"    },
    { text: "New proposal: Add SLH-DSA variant", time: "5h ago",  color: "#a78bfa",  glow: "rgba(124,58,237,0.7)"   },
    { text: "RSA-2048 marked deprecated",        time: "1d ago",  color: "#fde68a",  glow: "rgba(253,230,138,0.5)"  },
    { text: "Ed25519 set as default algorithm",  time: "2d ago",  color: "#93c5fd",  glow: "rgba(147,197,253,0.5)"  },
  ];

  return (
    <>
      <style>{`
        .dash-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
        .dash-stat-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .dash-stat-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
        .dash-stat-num   { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -1px; line-height: 1; }
        .dash-stat-sub   { font-size: 12px; color: #64748b; margin-top: 6px; font-weight: 500; }
        .dash-section-label {
          font-size: 11px; font-weight: 700; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.12em;
          margin-bottom: 10px; display: flex; align-items: center; gap: 7px;
        }
        .dash-activity { display: flex; flex-direction: column; gap: 7px; }
        .dash-activity-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 15px;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
        }
        .dash-activity-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .dash-activity-text { font-size: 13px; color: #94a3b8; flex: 1; font-weight: 500; }
        .dash-activity-time { font-size: 11px; color: #4b5563; font-weight: 600; white-space: nowrap; }
      `}</style>

      <div className="dash-stats">
        {stats.map((s) => (
          <div className="dash-stat-card" key={s.label}>
            <div className="dash-stat-label">{s.label}</div>
            <div className="dash-stat-num" style={{ color: s.accent }}>{s.value}</div>
            <div className="dash-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-section-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Recent activity
      </div>
      <div className="dash-activity">
        {activity.map((a, i) => (
          <div className="dash-activity-row" key={i}>
            <div className="dash-activity-dot" style={{ background: a.color, boxShadow: `0 0 7px ${a.glow}` }}/>
            <span className="dash-activity-text">{a.text}</span>
            <span className="dash-activity-time">{a.time}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function ComingSoon({ section }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px", color: "#4b5563" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ margin: "0 auto 14px", display: "block", opacity: 0.4 }}>
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#4b5563" }}>{section} module coming soon</p>
    </div>
  );
}

export default function AdminDaoPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const meta = SECTION_META[activeSection] || { title: activeSection, sub: "" };

  const renderContent = () => {
    switch (activeSection) {
      case "view-proposals": return <ViewProposals />;
      case "proposals":      return <ProposalSection />;
      case "algorithms":     return <FinalStateRegistryViewer />;
      case "dashboard":      return <DashboardHome />;
      default:               return <ComingSoon section={activeSection} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        html, body, #__next { height: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #08080e; font-family: 'Inter', sans-serif; }

        .qdao-shell {
          display: flex;
          min-height: 100vh;
          background: #08080e;
          color: #f1f5f9;
        }
        .qdao-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
        .qdao-topbar {
          height: 60px; flex-shrink: 0;
          background: #0d0d1a;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
        }
        .qdao-topbar-title { font-size: 15px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
        .qdao-topbar-sub   { font-size: 12px; color: #64748b; margin-top: 3px; font-weight: 400; }
        .qdao-net-badge {
          display: flex; align-items: center; gap: 7px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 999px; padding: 6px 15px;
          font-size: 12px; font-weight: 700; color: #4ade80;
        }
        .qdao-net-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.8); flex-shrink: 0; }
        .qdao-scroll {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 28px;
        }
        .qdao-scroll::-webkit-scrollbar { width: 4px; }
        .qdao-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .qdao-page-head { margin-bottom: 22px; }
        .qdao-page-title { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .qdao-page-sub   { font-size: 13px; color: #64748b; margin-top: 5px; font-weight: 400; }
      `}</style>

      <div className="qdao-shell">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className="qdao-main">
          <header className="qdao-topbar">
            <div>
              <div className="qdao-topbar-title">{meta.title}</div>
              <div className="qdao-topbar-sub">{meta.sub}</div>
            </div>
            <div className="qdao-net-badge">
              <div className="qdao-net-dot"/>
              Solana Devnet
            </div>
          </header>

          <div className="qdao-scroll">
            <div className="qdao-page-head">
              <div className="qdao-page-title">{meta.title}</div>
              <div className="qdao-page-sub">{meta.sub}</div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}