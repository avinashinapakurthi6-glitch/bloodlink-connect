"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import ContactDialog from "@/components/ui/ContactDialog";
import { supabase } from "@/lib/supabase/client";
import { AlertTriangle, MessageSquare, MapPin, Clock, Heart, RefreshCw, Navigation, Hospital, Phone } from "lucide-react";
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
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);

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

  const handleRespond = async (emergency: Emergency) => {
    toast.success(`Thank you for responding! A notification has been sent to ${emergency.patient_name}'s family with your contact details. They will reach out to you shortly.`, {
      duration: 6000,
    });
    // Simulate notification log
    console.log(`EMERGENCY_RESPONSE: User responded to ${emergency.patient_name}'s request at ${emergency.hospital}. Notification sent to ${emergency.contact}.`);
  };

  const handleCallFamily = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" richColors />
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-4 shadow-sm">
            <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
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
                <div key={emergency.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-red-200 transition-colors">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-red-600 font-bold text-xl">{emergency.blood_type}</span>
                      </div>
                      <div className="text-white">
                        <h3 className="font-bold text-xl tracking-tight">{emergency.patient_name}</h3>
                        <p className="text-red-100 text-sm font-medium">{emergency.units_needed} units needed urgently</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/30">
                        Critical Level
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <Hospital className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">{emergency.hospital}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">{emergency.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <Phone className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">{emergency.contact}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <Clock className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">{new Date(emergency.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleRespond(emergency)}
                        className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-200"
                      >
                        I Can Donate Now
                      </button>

                        <button
                          onClick={() => {
                            const query = encodeURIComponent(`${emergency.hospital}, ${emergency.location}${emergency.address ? `, ${emergency.address}` : ''}`);
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
                            window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                            toast.info(`Getting directions to ${emergency.hospital}...`);
                          }}
                          className="px-6 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                        <Navigation className="h-5 w-5 text-gray-400" /> Directions
                      </button>

                          <button
                            onClick={() => handleCallFamily(emergency)}
                            className="px-6 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="h-5 w-5 text-gray-400" /> Notify Family
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <ChatBotTrigger />
        <ContactDialog
          isOpen={!!selectedEmergency}
          onClose={() => setSelectedEmergency(null)}
          name={`${selectedEmergency?.patient_name}'s Family`}
          phone={selectedEmergency?.contact || ""}
        />
      </div>
    );
  }

