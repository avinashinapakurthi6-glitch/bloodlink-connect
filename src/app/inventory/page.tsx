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
    if (units < 10) return 'text-red-600 bg-red-50'
    if (units < 25) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getStatusLabel = (units: number) => {
    if (units < 10) return 'Critical'
    if (units < 25) return 'Low'
    return 'Adequate'
  }

  return (
    <div className="h-screen bg-white pl-72 p-8 text-slate-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blood Bank Inventory</h1>
          <p className="text-slate-600">Real-time blood stock levels across all partner hospitals</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {Object.entries(summary).map(([type, data]) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? '' : type)}
              className={`p-4 rounded-xl border transition-all ${selectedType === type ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'}`}
            >
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BLOOD_COLORS[type] }}
              >
                {type}
              </div>
              <div className="font-semibold">{data.total} units</div>
              <div className="text-slate-500 text-xs">{data.hospitals} hospitals</div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-500 font-medium">Loading inventory...</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Hospital</th>
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Blood Type</th>
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Available</th>
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Reserved</th>
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-slate-500 font-medium">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium">{item.hospitals?.name || 'Unknown'}</div>
                      <div className="text-slate-500 text-sm">{item.hospitals?.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{ backgroundColor: `${BLOOD_COLORS[item.blood_type]}10`, color: BLOOD_COLORS[item.blood_type] }}
                      >
                        {item.blood_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold">{item.units_available}</td>
                    <td className="py-4 px-6 text-slate-500">{item.units_reserved}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.units_available)}`}>
                        {getStatusLabel(item.units_available)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {new Date(item.last_updated).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400">
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
