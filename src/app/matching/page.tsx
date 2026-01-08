"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import ContactDialog from "@/components/ui/ContactDialog";
import { supabase } from "@/lib/supabase/client";
import { Search, Filter, MapPin, Droplet, MessageSquare, Navigation, Phone } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Donor {
  id: string;
  name: string;
  blood_type: string;
  location: string;
  address?: string;
  status: string;
  last_donation_date: string;
  phone?: string;
}

export default function MatchingPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const fetchDonors = async () => {
    let query = supabase.from("donors").select("*");
    
    if (bloodTypeFilter) {
      query = query.eq("blood_type", bloodTypeFilter);
    }
    if (locationFilter) {
      query = query.ilike("location", `%${locationFilter}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setDonors(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, [bloodTypeFilter, locationFilter]);

  const filteredDonors = donors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    const handleContact = (donor: Donor) => {
      if (donor.phone) {
        setSelectedDonor(donor);
      } else {
        toast.error("Contact number not available for this donor.");
      }
    };

    const handleDirections = (donor: Donor) => {
      const query = encodeURIComponent(donor.address || donor.location);
      const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
    };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Donor Matching</h1>
            <p className="text-sm text-gray-500">Find compatible blood donors</p>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donors by name..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none min-w-[150px]"
                value={bloodTypeFilter}
                onChange={(e) => setBloodTypeFilter(e.target.value)}
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Filter by location"
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none min-w-[180px]"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-500">
            Found {filteredDonors.length} matching donors
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                        <span className="text-sm font-bold text-red-600">
                          {donor.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{donor.name}</h3>
                          <div className="flex flex-col gap-0.5 mt-0.5">
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{donor.location}</span>
                            </div>
                            {donor.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Phone className="h-3 w-3 shrink-0" />
                                <span>{donor.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg shrink-0">
                      <Droplet className="h-4 w-4 text-red-600 fill-red-600" />
                      <span className="text-sm font-bold text-red-600">{donor.blood_type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        donor.status === "available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {donor.status === "available" ? "Available" : "Busy"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Last seen {new Date(donor.last_donation_date).toLocaleDateString()}
                      </span>
                    </div>
                      <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleDirections(donor)}
                              className="w-full px-3 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                            >
                              <Navigation className="h-4 w-4 shrink-0" /> Directions
                            </button>
                              <button 
                                onClick={() => handleContact(donor)}
                                className="w-full px-3 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-200"
                              >
                                <MessageSquare className="h-4 w-4 shrink-0" /> Notify
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
            key={selectedDonor?.id || 'none'}
            isOpen={!!selectedDonor} 
            onClose={() => setSelectedDonor(null)} 
            name={selectedDonor?.name || ""} 
            phone={selectedDonor?.phone || ""} 
          />
      </div>
    );
  }

