"use client"

import { useEffect, useState } from 'react'

const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#22c55e',
  'AB+': '#3b82f6', 'AB-': '#8b5cf6', 'O+': '#ec4899', 'O-': '#06b6d4'
}

interface InventoryItem {
  id: string
  blood_type: string
  units_available: number
  units_reserved: number
  last_updated: string
  hospitals: { name: string; city: string } | null
}

interface Summary {
  [key: string]: { total: number; hospitals: number }
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [summary, setSummary] = useState<Summary>({})
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [selectedType])

  const fetchInventory = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedType) params.append('blood_type', selectedType)

    try {
      const res = await fetch(`/api/inventory?${params}`)
      const data = await res.json()
      setInventory(data.inventory || [])
      setSummary(data.summary || {})
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (units: number) => {
    if (units < 10) return 'text-red-400 bg-red-500/20'
    if (units < 25) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  const getStatusLabel = (units: number) => {
    if (units < 10) return 'Critical'
    if (units < 25) return 'Low'
    return 'Adequate'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Blood Bank Inventory</h1>
          <p className="text-slate-400">Real-time blood stock levels across all partner hospitals</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {Object.entries(summary).map(([type, data]) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? '' : type)}
              className={`p-4 rounded-xl border transition-all ${selectedType === type ? 'border-red-500 bg-red-500/20' : 'border-slate-700 bg-slate-900/80 hover:border-slate-600'}`}
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BLOOD_COLORS[type] }}
              >
                {type}
              </div>
              <div className="text-white font-semibold">{data.total} units</div>
              <div className="text-slate-500 text-xs">{data.hospitals} hospitals</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-400">Loading inventory...</div>
          </div>
        ) : (
          <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Hospital</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Blood Type</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Available</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Reserved</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="text-white font-medium">{item.hospitals?.name || 'Unknown'}</div>
                      <div className="text-slate-500 text-sm">{item.hospitals?.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{ backgroundColor: `${BLOOD_COLORS[item.blood_type]}20`, color: BLOOD_COLORS[item.blood_type] }}
                      >
                        {item.blood_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white font-semibold">{item.units_available}</td>
                    <td className="py-4 px-6 text-slate-400">{item.units_reserved}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.units_available)}`}>
                        {getStatusLabel(item.units_available)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-sm">
                      {new Date(item.last_updated).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-500">
                      No inventory data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
