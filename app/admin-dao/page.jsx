"use client";

import React, { useState } from 'react';
import Sidebar from '../../components/admin-components/Sidebar';
import ProposalSection from '../../components/admin-components/ProposalSection';
import ViewProposals from '../../components/admin-components/VeiwProposals';
import FinalStateRegistryViewer from '../../components/admin-components/FinalStateRegistryViewer';

export default function AdminDaoPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'view-proposals':
        return <ViewProposals />;
      case 'proposals':
        return <ProposalSection />;
      case 'algorithms':
        return <FinalStateRegistryViewer />;
      case 'dashboard':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin DAO Dashboard</h1>
            <p className="text-gray-600">Welcome to the main administration panel.</p>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{activeSection}</h1>
            <p className="text-gray-600">This section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
