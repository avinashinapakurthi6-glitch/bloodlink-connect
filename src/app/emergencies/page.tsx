"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { AlertTriangle, Phone, MapPin, Clock, Heart, RefreshCw, Navigation } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Emergency {
  id: string;
  blood_type: string;
  patient_name: string;
  hospital: string;
  location: string;
  address?: string;
  contact: string;
  units_needed: number;
  status: string;
  created_at: string;
}

export default function EmergenciesPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmergencies = async () => {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEmergencies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleRespond = async (id: string) => {
    toast.success("Thank you for responding! The patient will be notified.");
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Emergency Responses</h1>
            <p className="text-sm text-gray-500">Respond to urgent blood requests</p>
          </div>
          <button onClick={fetchEmergencies} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </button>
        </header>

        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Active Emergencies: {emergencies.length}</h3>
              <p className="text-sm text-red-700">These patients need blood urgently. Your response can save lives.</p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {emergencies.map((emergency) => (
                <div key={emergency.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                        <span className="text-red-600 font-bold text-lg">{emergency.blood_type}</span>
                      </div>
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{emergency.patient_name}</h3>
                        <p className="text-red-100 text-sm">{emergency.units_needed} units needed</p>
                      </div>
                    </div>
                    <div className="text-right text-white">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase">Urgent</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{emergency.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{emergency.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{emergency.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{new Date(emergency.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleRespond(emergency.id)}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                      >
                        I Can Donate
                      </button>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(emergency.address || `${emergency.hospital} ${emergency.location}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <Navigation className="h-4 w-4" /> Directions
                          </a>
                        <a
                          href={`tel:${emergency.contact}`}
                          className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" /> Call Now
                        </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
