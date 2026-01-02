"use client";

import React, { useEffect, useState } from "react";
import { Heart, Users, Droplets, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Stats {
  total_donations: number;
  lives_saved: number;
  active_donors: number;
  blood_units_available: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("site_stats")
        .select("*")
        .single();

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl" />)}
  </div>;

  const statItems = [
    {
      label: "Total Donations",
      value: stats?.total_donations || 0,
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Lives Saved",
      value: stats?.lives_saved || 0,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Donors",
      value: stats?.active_donors || 0,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Blood Units",
      value: stats?.blood_units_available || 0,
      icon: Droplets,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {item.value.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
