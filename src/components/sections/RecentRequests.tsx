"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Clock, MapPin, Hospital } from "lucide-react";

interface BloodRequest {
  id: string;
  patient_name: string;
  blood_type: string;
  hospital: string;
  location: string;
  urgency: string;
  status: string;
  created_at: string;
}

export default function RecentRequests() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setRequests(data);
      }
      setLoading(false);
    }

    fetchRequests();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
  </div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Blood Requests</h2>
        <button className="text-sm text-red-600 font-medium hover:underline">View All</button>
      </div>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-100 text-red-700 font-bold">
                  {request.blood_type}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{request.patient_name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Hospital className="h-3 w-3" /> {request.hospital}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {request.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  request.urgency === 'emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {request.urgency}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
