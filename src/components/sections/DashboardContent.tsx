"use client";

import React, { useState } from 'react';
import { LayoutGrid, Bell, Settings, Search } from 'lucide-react';
import StatsSection from './StatsSection';
import RecentRequests from './RecentRequests';
import DonorsSection from './DonorsSection';
import BloodRequestModal from '../ui/BloodRequestModal';
import { toast, Toaster } from 'sonner';

const DashboardContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    toast.success('Blood request submitted successfully!');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for donors, hospitals, or requests..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center cursor-pointer">
            <span className="text-xs font-bold text-red-700">JD</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Impact Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
            >
              New Blood Request
            </button>
          </div>

          <StatsSection key={`stats-${refreshKey}`} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RecentRequests key={`requests-${refreshKey}`} />
            </div>
            <div className="space-y-8">
              <DonorsSection key={`donors-${refreshKey}`} />
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white shadow-lg shadow-red-500/20">
                <h3 className="font-bold text-lg">Emergency SOS</h3>
                <p className="text-red-50 text-sm mt-2 leading-relaxed">
                  Need blood immediately? Trigger an SOS to notify all compatible donors nearby.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-4 py-2.5 bg-white text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
                >
                  Trigger SOS Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BloodRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </main>
  );
};

export default DashboardContent;
