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
      <div className="min-h-screen bg-white pl-72 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-red-500 text-xl">Loading dashboard...</div>
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
    <div className="min-h-screen bg-white pl-72 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Impact Dashboard</h1>
          <p className="text-slate-500">Real-time blood donation statistics and analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="👥" label="Total Donors" value={data?.stats.totalDonors || 0} color="from-red-500 to-red-600" />
          <StatCard icon="💉" label="Total Donations" value={data?.stats.totalDonations || 0} color="from-orange-500 to-orange-600" />
          <StatCard icon="🩸" label="Units Collected" value={data?.stats.totalUnits || 0} color="from-pink-500 to-pink-600" />
          <StatCard icon="❤️" label="Lives Saved" value={data?.stats.livesSaved || 0} color="from-rose-500 to-rose-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="🏥" label="Partner Hospitals" value={data?.stats.totalHospitals || 0} color="from-blue-500 to-blue-600" />
          <StatCard icon="📅" label="Active Events" value={data?.stats.activeEvents || 0} color="from-green-500 to-green-600" />
          <StatCard icon="📋" label="Pending Requests" value={data?.stats.pendingRequests || 0} color="from-yellow-500 to-yellow-600" />
          <StatCard icon="🚨" label="Emergency Requests" value={data?.stats.emergencyRequests || 0} color="from-red-600 to-red-700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Blood Inventory by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b' }}
                />
                <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Blood Type Distribution</h2>
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
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Donor</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Blood Type</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentDonations.map((donation) => (
                  <tr key={donation.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-900">{donation.users?.full_name || 'Anonymous'}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: `${BLOOD_COLORS[donation.blood_type]}15`, color: BLOOD_COLORS[donation.blood_type] }}>
                        {donation.blood_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{new Date(donation.donation_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {(!data?.recentDonations || data.recentDonations.length === 0) && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">No recent donations</td>
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
