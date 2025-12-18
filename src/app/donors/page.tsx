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

interface RegisterForm {
  full_name: string
  email: string
  phone: string
  blood_type: string
  date_of_birth: string
  gender: string
  city: string
  address: string
}

export default function DonorsPage() {
  const [mode, setMode] = useState<'list' | 'match' | 'register'>('list')
  const [donors, setDonors] = useState<Donor[]>([])
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchBloodType, setSearchBloodType] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [formData, setFormData] = useState<RegisterForm>({
    full_name: '',
    email: '',
    phone: '',
    blood_type: '',
    date_of_birth: '',
    gender: '',
    city: '',
    address: ''
  })

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistering(true)
    setRegisterError('')
    setRegisterSuccess(false)

    if (!formData.full_name || !formData.email || !formData.blood_type || !formData.phone || !formData.city) {
      setRegisterError('Please fill in all required fields')
      setRegistering(false)
      return
    }

    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_donor: true,
          is_available: true,
          total_donations: 0
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register')
      }
      
      setRegisterSuccess(true)
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        blood_type: '',
        date_of_birth: '',
        gender: '',
        city: '',
        address: ''
      })
      setTimeout(() => {
        setMode('list')
        fetchDonors()
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      setRegisterError(error instanceof Error ? error.message : 'Failed to register. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-white pl-72 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Donor Network</h1>
          <p className="text-slate-600">Find and match blood donors in your area</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('list')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'list' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All Donors
          </button>
          <button
            onClick={() => setMode('match')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'match' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Find Match
          </button>
          <button
            onClick={() => setMode('register')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === 'register' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Register as Donor
          </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={searchBloodType}
              onChange={e => setSearchBloodType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-red-500 outline-none"
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
                className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-red-500 outline-none flex-1 min-w-[200px]"
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
            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-slate-700">
                Found <span className="text-red-500 font-bold">{matchResult.total}</span> compatible donors for {searchBloodType}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Compatible types: {matchResult.compatible_types.join(', ')}
              </p>
            </div>
          )}
        </div>

        {mode === 'register' ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Register as a Blood Donor</h2>
            
            {registerSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                Registration successful! Thank you for becoming a donor.
              </div>
            )}
            
            {registerError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                {registerError}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type *</label>
                  <select
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="">Select blood type</option>
                    {BLOOD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={registering}
                className="w-full py-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {registering ? 'Registering...' : 'Register as Donor'}
              </button>
            </form>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-500">Loading donors...</div>
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
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{donor.full_name}</h3>
          <p className="text-slate-500 text-sm">{donor.city}</p>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: `${BLOOD_COLORS[donor.blood_type]}10`, color: BLOOD_COLORS[donor.blood_type] }}
        >
          {donor.blood_type}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Total Donations</span>
          <span className="text-slate-900 font-medium">{donor.total_donations}</span>
        </div>
        {donor.distance_km !== undefined && (
          <div className="flex items-center justify-between text-slate-600">
            <span>Distance</span>
            <span className="text-slate-900 font-medium">{donor.distance_km.toFixed(1)} km</span>
          </div>
        )}
        <div className="flex items-center justify-between text-slate-600">
          <span>Status</span>
          <span className={`font-medium ${donor.is_available ? 'text-green-600' : 'text-yellow-600'}`}>
            {donor.is_available ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      {donor.is_available && (
        <button className="mt-4 w-full py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors">
          Contact Donor
        </button>
      )}
    </div>
  )
}
