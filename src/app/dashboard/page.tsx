"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { 
  Heart, 
  Users, 
  Building2, 
  AlertTriangle,
  TrendingUp,
  Droplets,
  Calendar,
  Award,
  MapPin
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const donationTrends = [
  { month: "Jan", donations: 120, requests: 95 },
  { month: "Feb", donations: 145, requests: 110 },
  { month: "Mar", donations: 168, requests: 125 },
  { month: "Apr", donations: 190, requests: 140 },
  { month: "May", donations: 210, requests: 155 },
  { month: "Jun", donations: 245, requests: 180 },
];

const pieData = [
  { name: "Whole Blood", value: 45, color: "#DC2626" },
  { name: "Platelets", value: 25, color: "#2563EB" },
  { name: "Plasma", value: 20, color: "#9333EA" },
  { name: "Red Cells", value: 10, color: "#F59E0B" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    livesSaved: 0,
    emergencies: 0,
  });
  const [inventory, setInventory] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();

    const statsSubscription = supabase
      .channel('site_stats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_stats' }, fetchDashboardData)
      .subscribe();

    const donorsSubscription = supabase
      .channel('donors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(statsSubscription);
      supabase.removeChannel(donorsSubscription);
    };
  }, []);

  async function fetchDashboardData() {
    try {
      const { data: statsData } = await supabase.from('site_stats').select('*').single();
      if (statsData) {
        setStats({
          totalDonations: statsData.total_donations,
          activeDonors: statsData.active_donors,
          livesSaved: statsData.lives_saved,
          emergencies: statsData.blood_units_available,
        });
      }

      const { data: inventoryData } = await supabase.from('inventory').select('*');
      if (inventoryData) {
        const formatted = inventoryData.map(item => ({
          type: item.blood_type,
          units: item.units,
          color: getBloodTypeColor(item.blood_type)
        }));
        setInventory(formatted);
      }

      const { data: donors } = await supabase.from('donors').select('*').order('created_at', { ascending: false }).limit(3);
      const { data: requests } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(2);
      
      const activity = [
        ...(donors || []).map(d => ({ 
          id: d.id, 
          type: 'donation', 
          user: d.name, 
          bloodType: d.blood_type, 
          location: d.location,
          time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        })),
        ...(requests || []).map(r => ({ 
          id: r.id, 
          type: 'request', 
          hospital: r.hospital, 
          bloodType: r.blood_type, 
          location: r.location,
          time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }))
      ].sort((a, b) => b.id.localeCompare(a.id));

      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  function getBloodTypeColor(type: string) {
    const colors: any = {
      "A+": "#DC2626", "A-": "#EF4444",
      "B+": "#F87171", "B-": "#FCA5A5",
      "AB+": "#2563EB", "AB-": "#3B82F6",
      "O+": "#10B981", "O-": "#34D399"
    };
    return colors[type] || "#DC2626";
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-14 border-b border-[#E5E7EB] bg-white flex items-center px-6 sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-[#111827]">Impact Dashboard</h1>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Donations"
              value={stats.totalDonations.toLocaleString()}
              icon={Heart}
              trend="+12.5%"
              color="red"
            />
            <StatCard
              title="Active Donors"
              value={stats.activeDonors.toLocaleString()}
              icon={Users}
              trend="+8.2%"
              color="blue"
            />
            <StatCard
              title="Lives Saved"
              value={stats.livesSaved.toLocaleString()}
              icon={Building2}
              trend="+3.1%"
              color="green"
            />
            <StatCard
              title="Emergencies"
              value={stats.emergencies.toLocaleString()}
              icon={AlertTriangle}
              trend="-5.4%"
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-4">Donation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="donations" 
                    stroke="#DC2626" 
                    fill="#FEE2E2" 
                    strokeWidth={2}
                    name="Donations"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#2563EB" 
                    fill="#DBEAFE" 
                    strokeWidth={2}
                    name="Requests"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-4">Blood Type Inventory</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="type" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px"
                    }} 
                  />
                  <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                    {inventory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-4">Donation Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-[#6B7280]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-base font-semibold text-[#111827] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "donation" ? "bg-green-100" :
                        activity.type === "request" ? "bg-blue-100" : "bg-red-100"
                      }`}>
                        {activity.type === "donation" ? (
                          <Droplets className="w-5 h-5 text-green-600" />
                        ) : activity.type === "request" ? (
                          <Building2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          {activity.type === "donation" 
                            ? `${activity.user} donated blood`
                            : activity.type === "request"
                            ? `${activity.hospital} requested blood`
                            : `Emergency at ${activity.hospital}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#6B7280]">Blood Type: {activity.bloodType}</span>
                          <span className="text-[10px] text-gray-400">•</span>
                          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#6B7280]">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              icon={Calendar}
              title="Schedule Donation"
              description="Book your next appointment"
              href="/events"
            />
            <QuickAction
              icon={Award}
              title="View Certificates"
              description="Download your achievements"
              href="/certificates"
            />
            <QuickAction
              icon={TrendingUp}
              title="Track Impact"
              description="See lives you've saved"
              href="/profile"
            />
          </div>
        </main>
      </div>
      <ChatBotTrigger />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  trend: string;
  color: "red" | "blue" | "green" | "amber";
}) {
  const colors = {
    red: { bg: "bg-red-50", icon: "text-red-600", trend: "text-green-600" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", trend: "text-green-600" },
    green: { bg: "bg-green-50", icon: "text-green-600", trend: "text-green-600" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", trend: trend.startsWith("-") ? "text-green-600" : "text-red-600" },
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${colors[color].bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors[color].icon}`} />
        </div>
        <span className={`text-sm font-medium ${colors[color].trend}`}>{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-[#111827]">{value}</p>
        <p className="text-sm text-[#6B7280] mt-1">{title}</p>
      </div>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <a 
      href={href}
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FEE2E2] rounded-lg flex items-center justify-center group-hover:bg-[#DC2626] transition-colors">
          <Icon className="w-6 h-6 text-[#DC2626] group-hover:text-white transition-colors" />
        </div>
        <div>
          <p className="font-medium text-[#111827]">{title}</p>
          <p className="text-sm text-[#6B7280]">{description}</p>
        </div>
      </div>
    </a>
  );
}
