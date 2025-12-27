"use client"

import { useEffect, useState, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'

const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#22c55e',
  'AB+': '#3b82f6', 'AB-': '#8b5cf6', 'O+': '#ec4899', 'O-': '#06b6d4'
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

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
  address: string
  date_of_birth: string
  gender: string
  is_donor: boolean
  is_available: boolean
  total_donations: number
  last_donation_date: string | null
  profile_image_url: string | null
}

interface AuthUser {
  id: string
  email: string
  name: string
  avatar: string
}

export default function ProfilePage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    blood_type: '',
    city: '',
    state: '',
    address: '',
    date_of_birth: '',
    gender: '',
    is_available: true
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/profile')
      const data = await res.json()

      if (!data.authenticated) {
        setAuthUser(null)
        setProfile(null)
        setShowSetup(false)
        return
      }

      setAuthUser(data.user)
      if (data.profile) {
        setProfile(data.profile)
        setFormData({
          full_name: data.profile.full_name || data.user.name || '',
          phone: data.profile.phone || '',
          blood_type: data.profile.blood_type || '',
          city: data.profile.city || '',
          state: data.profile.state || '',
          address: data.profile.address || '',
          date_of_birth: data.profile.date_of_birth || '',
          gender: data.profile.gender || '',
          is_available: data.profile.is_available ?? true
        })
        setShowSetup(false)

        fetch('/api/donations?donor_id=' + data.profile.id)
          .then(res => res.json())
          .then(data => setDonations(data.donations || []))
          .catch(err => console.error('Donations fetch error:', err))
      } else {
        setShowSetup(true)
        setFormData(prev => ({
          ...prev,
          full_name: data.user.name || ''
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const signInWithGoogle = async () => {
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback'
      }
    })
    if (error) {
      console.error('Sign in error:', error.message)
      alert('Sign in error: ' + error.message)
    }
  }

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    setAuthUser(null)
    setProfile(null)
    setShowSetup(false)
    window.location.reload()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
        setEditing(false)
        setShowSetup(false)
        fetchData()
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8 flex items-center justify-center">
        <div className="animate-pulse text-red-500">Loading profile...</div>
      </div>
    )
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 mb-6 shadow-lg shadow-red-500/20">
            <span className="text-5xl">🩸</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Donor Profile</h1>
          <p className="text-slate-600 mb-8">
            Sign in with Google to access your personal donor profile. Your details are private and only visible to you.
          </p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  if (showSetup || editing) {
    return (
      <div className="min-h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {showSetup ? 'Complete Your Profile' : 'Edit Profile'}
              </h1>
              <p className="text-slate-600">
                {showSetup ? 'Set up your donor profile to get started' : 'Update your personal details'}
              </p>
            </div>
            {authUser.avatar && (
              <img src={authUser.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-slate-200" />
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Type</label>
                <select
                  value={formData.blood_type}
                  onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                  placeholder="Your city"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500"
                  placeholder="Your phone"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 text-red-600"
                  />
                  <span className="text-slate-700 font-medium">Available to donate blood</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100">
              {!showSetup && (
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !formData.full_name || !formData.blood_type}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : showSetup ? 'Create Profile' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative mx-auto sm:mx-0">
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt={profile?.full_name || 'Profile'}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <span className="text-4xl font-bold text-white">{profile?.full_name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{profile?.full_name}</h1>
                {profile?.blood_type && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: BLOOD_COLORS[profile.blood_type] + '15', color: BLOOD_COLORS[profile.blood_type] }}
                  >
                    {profile.blood_type}
                  </span>
                )}
              </div>
              <p className="text-slate-600 font-medium">{profile?.city}{profile?.state ? ', ' + profile.state : ''}</p>
              <p className="text-slate-500 text-sm">{authUser.email}</p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <div className={`px-4 py-2 rounded-xl text-sm font-semibold border text-center ${profile?.is_available ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {profile?.is_available ? 'Available to Donate' : 'Not Available'}
              </div>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Donation History</h2>
          {donations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No donation history yet
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map(donation => (
                <div key={donation.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600">🩸</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{donation.hospitals?.name || 'Hospital'}</div>
                      <div className="text-sm text-slate-500">{new Date(donation.donation_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{donation.units_donated} units</div>
                    <div className="text-xs uppercase font-bold text-green-600">{donation.status}</div>
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
