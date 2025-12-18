"use client"

import { useEffect, useState } from 'react'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#22c55e',
  'AB+': '#3b82f6', 'AB-': '#8b5cf6', 'O+': '#ec4899', 'O-': '#06b6d4'
}

interface Donor {
  id: string
  full_name: string
  blood_type: string
  city: string
  phone: string
  is_available: boolean
  total_donations: number
  last_donation_date: string | null
  distance_km?: number
}

interface MatchResult {
  matches: Donor[]
  total: number
  compatible_types: string[]
}

export default function DonorsPage() {
  const [mode, setMode] = useState<'list' | 'match'>('list')
  const [donors, setDonors] = useState<Donor[]>([])
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchBloodType, setSearchBloodType] = useState('')
  const [searchCity, setSearchCity] = useState('')

  useEffect(() => {
    if (mode === 'list') {
      fetchDonors()
    }
  }, [mode, searchBloodType, searchCity])

  const fetchDonors = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchBloodType) params.append('blood_type', searchBloodType)
    if (searchCity) params.append('city', searchCity)
    params.append('available', 'true')

    try {
      const res = await fetch(`/api/donors?${params}`)
      const data = await res.json()
      setDonors(data.donors || [])
    } catch (error) {
      console.error('Failed to fetch donors:', error)
    } finally {
      setLoading(false)
    }
  }

  const findMatches = async () => {
    if (!searchBloodType) return
    setLoading(true)

    try {
      const res = await fetch('/api/donors/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blood_type: searchBloodType })
      })
      const data = await res.json()
      setMatchResult(data)
    } catch (error) {
      console.error('Failed to find matches:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Donor Network</h1>
          <p className="text-slate-400">Find and match blood donors in your area</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('list')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'list' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            All Donors
          </button>
          <button
            onClick={() => setMode('match')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'match' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Find Match
          </button>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={searchBloodType}
              onChange={e => setSearchBloodType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
            >
              <option value="">All Blood Types</option>
              {BLOOD_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {mode === 'list' && (
              <input
                type="text"
                placeholder="Filter by city..."
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none flex-1 min-w-[200px]"
              />
            )}

            {mode === 'match' && (
              <button
                onClick={findMatches}
                disabled={!searchBloodType || loading}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Find Compatible Donors
              </button>
            )}
          </div>

          {mode === 'match' && matchResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <p className="text-slate-300">
                Found <span className="text-red-400 font-bold">{matchResult.total}</span> compatible donors for {searchBloodType}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Compatible types: {matchResult.compatible_types.join(', ')}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-400">Loading donors...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mode === 'match' ? matchResult?.matches : donors)?.map(donor => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
            {((mode === 'match' ? matchResult?.matches : donors)?.length || 0) === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                No donors found. Try adjusting your search criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function DonorCard({ donor }: { donor: Donor }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{donor.full_name}</h3>
          <p className="text-slate-400 text-sm">{donor.city}</p>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: `${BLOOD_COLORS[donor.blood_type]}20`, color: BLOOD_COLORS[donor.blood_type] }}
        >
          {donor.blood_type}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span>Total Donations</span>
          <span className="text-white font-medium">{donor.total_donations}</span>
        </div>
        {donor.distance_km !== undefined && (
          <div className="flex items-center justify-between text-slate-400">
            <span>Distance</span>
            <span className="text-white font-medium">{donor.distance_km.toFixed(1)} km</span>
          </div>
        )}
        <div className="flex items-center justify-between text-slate-400">
          <span>Status</span>
          <span className={`font-medium ${donor.is_available ? 'text-green-400' : 'text-yellow-400'}`}>
            {donor.is_available ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      {donor.is_available && (
        <button className="mt-4 w-full py-2 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors">
          Contact Donor
        </button>
      )}
    </div>
  )
}
