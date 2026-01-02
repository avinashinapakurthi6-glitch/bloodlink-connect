"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { WifiOff, CheckCircle, Database, RefreshCw, Cloud, CloudOff } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedData, setCachedData] = useState({
    donors: 4,
    requests: 3,
    inventory: 4,
    lastSync: new Date().toISOString(),
  });

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncData = () => {
    setCachedData({
      ...cachedData,
      lastSync: new Date().toISOString(),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Offline Mode</h1>
            <p className="text-sm text-gray-500">Access critical data without internet</p>
          </div>
        </header>

        <div className="p-8 max-w-3xl mx-auto">
          <div className={`rounded-2xl p-6 text-white mb-8 ${
            isOnline 
              ? "bg-gradient-to-br from-green-500 to-emerald-600" 
              : "bg-gradient-to-br from-gray-600 to-gray-700"
          }`}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                {isOnline ? <Cloud className="h-8 w-8" /> : <CloudOff className="h-8 w-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isOnline ? "You're Online" : "You're Offline"}
                </h2>
                <p className={isOnline ? "text-green-100" : "text-gray-300"}>
                  {isOnline 
                    ? "All features are available. Data syncs automatically." 
                    : "Using cached data. Some features may be limited."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Cached Data Status
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{cachedData.donors}</div>
                <p className="text-sm text-gray-500">Donors</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{cachedData.requests}</div>
                <p className="text-sm text-gray-500">Requests</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{cachedData.inventory}</div>
                <p className="text-sm text-gray-500">Inventory</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Last synced: {new Date(cachedData.lastSync).toLocaleString()}
              </div>
              <button
                onClick={syncData}
                disabled={!isOnline}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Offline Features</h3>
            <div className="space-y-4">
              {[
                { name: "View Cached Donors", available: true },
                { name: "View Blood Inventory", available: true },
                { name: "View Pending Requests", available: true },
                { name: "Check Eligibility (Questionnaire)", available: true },
                { name: "Submit New Requests", available: false },
                { name: "Real-time Notifications", available: false },
                { name: "Map Tracking", available: false },
              ].map((feature, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-gray-700">{feature.name}</span>
                  <span className={`flex items-center gap-2 text-sm font-medium ${
                    feature.available ? "text-green-600" : "text-gray-400"
                  }`}>
                    {feature.available ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Available
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4" />
                        Requires Internet
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
