"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Filter, Droplet } from "lucide-react";

interface Donor {
  id: string;
  name: string;
  blood_type: string;
  location: string;
  status: string;
}

export default function DonorsSection() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

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
            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">
                  {donor.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
                <p className="text-xs text-gray-500">{donor.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
                <Droplet className="h-3 w-3 text-red-600 fill-red-600" />
                <span className="text-xs font-bold text-red-600">{donor.blood_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
