"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { AlertTriangle, Phone, MapPin, User, Hospital, Droplet } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SOSPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    blood_type: "O-",
    hospital: "",
    location: "",
    contact: "",
    units_needed: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("emergencies").insert([
      { ...formData, status: "active" },
    ]);

    if (!error) {
      toast.success("SOS Alert Sent! Nearby donors are being notified.");
      setFormData({
        patient_name: "",
        blood_type: "O-",
        hospital: "",
        location: "",
        contact: "",
        units_needed: 1,
      });
    } else {
      toast.error("Failed to send SOS. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Emergency SOS</h1>
            <p className="text-sm text-gray-500">Send urgent blood request to all nearby donors</p>
          </div>
        </header>

        <div className="p-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Emergency Blood Request</h2>
                <p className="text-red-100">This will alert all compatible donors in your area</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  placeholder="Full name of the patient"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type Required</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none appearance-none"
                    value={formData.blood_type}
                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Units Needed</label>
                <input
                  required
                  type="number"
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={formData.units_needed}
                  onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
              <div className="relative">
                <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="Hospital name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="text"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City or area"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  required
                  type="tel"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="h-5 w-5" />
              {loading ? "Sending SOS..." : "Send Emergency SOS"}
            </button>
          </form>
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
