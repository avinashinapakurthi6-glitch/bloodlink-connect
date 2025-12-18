"use client"

import { useEffect, useState } from 'react'

const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#22c55e',
  'AB+': '#3b82f6', 'AB-': '#8b5cf6', 'O+': '#ec4899', 'O-': '#06b6d4'
}

interface Donation {
  id: string
  blood_type: string
  donation_date: string
  status: string
  units_donated: number
  hospitals: { name: string } | null
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  blood_type: string
  city: string
  state: string
  is_donor: boolean
  is_available: boolean
  total_donations: number
  last_donation_date: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [donorsRes, donationsRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/donations')
      ])
      
      const donorsData = await donorsRes.json()
      const donationsData = await donationsRes.json()
      
      if (donorsData.donors?.[0]) {
        setProfile(donorsData.donors[0])
      }
      setDonations(donationsData.donations || [])
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-red-400">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 mb-6">
            <span className="text-5xl">👤</span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Profile Found</h2>
          <p className="text-slate-400">Register as a donor to create your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-800 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{profile.full_name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profile.full_name}</h1>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${BLOOD_COLORS[profile.blood_type]}20`, color: BLOOD_COLORS[profile.blood_type] }}
                >
                  {profile.blood_type}
                </span>
              </div>
              <p className="text-slate-400">{profile.city}, {profile.state}</p>
              <p className="text-slate-500 text-sm">{profile.email}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${profile.is_available ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {profile.is_available ? 'Available to Donate' : 'Not Available'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="text-3xl font-bold text-red-400">{profile.total_donations}</div>
              <div className="text-slate-400 text-sm">Total Donations</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="text-3xl font-bold text-pink-400">{profile.total_donations * 3}</div>
              <div className="text-slate-400 text-sm">Lives Impacted</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="text-xl font-bold text-blue-400">
                {profile.last_donation_date ? new Date(profile.last_donation_date).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-slate-400 text-sm">Last Donation</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-6">Donation History</h2>
          
          {donations.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No donation history yet
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map(donation => (
                <div key={donation.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <span className="text-xl">🩸</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{donation.hospitals?.name || 'Unknown Hospital'}</div>
                      <div className="text-slate-500 text-sm">{new Date(donation.donation_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white">{donation.units_donated} unit(s)</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      donation.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
