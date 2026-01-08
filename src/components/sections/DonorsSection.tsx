"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Filter, Droplet, MessageSquare, Phone } from "lucide-react";
import ContactDialog from "../ui/ContactDialog";

interface Donor {
  id: string;
  name: string;
  blood_type: string;
  location: string;
  status: string;
  phone?: string;
}

export default function DonorsSection() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  useEffect(() => {
    async function fetchDonors() {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .limit(6);

      if (!error && data) {
        setDonors(data);
      }
      setLoading(false);
    }

    fetchDonors();
  }, []);

  if (loading) return <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
  </div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Available Donors</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
            <Search className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donors.map((donor) => (
          <div
            key={donor.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-red-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">
                  {donor.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">{donor.location}</p>
                  {donor.phone && (
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Phone className="h-2.5 w-2.5" /> {donor.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => donor.phone && setSelectedDonor(donor)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Notify Donor"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
                <Droplet className="h-3 w-3 text-red-600 fill-red-600" />
                <span className="text-xs font-bold text-red-600">{donor.blood_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
