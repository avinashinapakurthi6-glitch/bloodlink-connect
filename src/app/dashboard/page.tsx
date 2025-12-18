"use client"

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardStats {
  totalDonors: number
  totalDonations: number
  totalUnits: number
  livesSaved: number
  totalHospitals: number
  activeEvents: number
  pendingRequests: number
  emergencyRequests: number
}

interface DashboardData {
  stats: DashboardStats
  inventory: Record<string, number>
  recentDonations: Array<{
    id: string
    blood_type: string
    donation_date: string
    users: { full_name: string; blood_type: string } | null
  }>
}

const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444',
  'A-': '#f97316',
  'B+': '#eab308',
  'B-': '#22c55e',
  'AB+': '#3b82f6',
  'AB-': '#8b5cf6',
  'O+': '#ec4899',
  'O-': '#06b6d4'
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-red-400 text-xl">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const inventoryData = Object.entries(data?.inventory || {}).map(([type, units]) => ({
    type,
    units,
    fill: BLOOD_COLORS[type] || '#6b7280'
  }))

  const pieData = inventoryData.map(d => ({ name: d.type, value: d.units }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Impact Dashboard</h1>
          <p className="text-slate-400">Real-time blood donation statistics and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="👥" label="Total Donors" value={data?.stats.totalDonors || 0} color="from-red-500 to-red-700" />
          <StatCard icon="💉" label="Total Donations" value={data?.stats.totalDonations || 0} color="from-orange-500 to-orange-700" />
          <StatCard icon="🩸" label="Units Collected" value={data?.stats.totalUnits || 0} color="from-pink-500 to-pink-700" />
          <StatCard icon="❤️" label="Lives Saved" value={data?.stats.livesSaved || 0} color="from-rose-500 to-rose-700" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="🏥" label="Partner Hospitals" value={data?.stats.totalHospitals || 0} color="from-blue-500 to-blue-700" />
          <StatCard icon="📅" label="Active Events" value={data?.stats.activeEvents || 0} color="from-green-500 to-green-700" />
          <StatCard icon="📋" label="Pending Requests" value={data?.stats.pendingRequests || 0} color="from-yellow-500 to-yellow-700" />
          <StatCard icon="🚨" label="Emergency Requests" value={data?.stats.emergencyRequests || 0} color="from-red-600 to-red-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Blood Inventory by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Blood Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLOOD_COLORS[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Donor</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Blood Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentDonations.map((donation) => (
                  <tr key={donation.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-white">{donation.users?.full_name || 'Anonymous'}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: `${BLOOD_COLORS[donation.blood_type]}20`, color: BLOOD_COLORS[donation.blood_type] }}>
                        {donation.blood_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{new Date(donation.donation_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!data?.recentDonations || data.recentDonations.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">No recent donations</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value.toLocaleString()}</span>
      </div>
      <p className="text-white/90 font-medium">{label}</p>
    </div>
  )
}
