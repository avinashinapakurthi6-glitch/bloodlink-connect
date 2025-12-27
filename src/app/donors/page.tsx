"use client"

import { useEffect, useState, useCallback } from 'react'
import DonorMap from '@/components/DonorMap'
import { PlaceAutocomplete } from '@/components/PlaceAutocomplete'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  latitude: number
  longitude: number
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
  latitude?: number
  longitude?: number
}

export default function DonorsPage() {
  const [mode, setMode] = useState<'list' | 'match' | 'register'>('list')
  const [donors, setDonors] = useState<Donor[]>([])
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchBloodType, setSearchBloodType] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>()
  const [registering, setRegistering] = useState(false)
  const [locationCapturing, setLocationCapturing] = useState(false)
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

  // Contact Modal State
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [sending, setSending] = useState(false)

  const captureLocation = () => {
    setLocationCapturing(true)
    if (!navigator.geolocation) {
      setRegisterError('Geolocation is not supported by your browser')
      setLocationCapturing(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }))
        setLocationCapturing(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setRegisterError('Failed to get your location. Please enter it manually or try again.')
        setLocationCapturing(false)
      }
    )
  }

  const fetchDonors = useCallback(async () => {
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
  }, [searchBloodType, searchCity])

  useEffect(() => {
    if (mode === 'list') {
      fetchDonors()
    }
  }, [mode, fetchDonors])

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

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      setMapCenter({ lat, lng })
      
      // Optionally extract city from address components
      const cityComponent = place.address_components?.find(c => 
        c.types.includes('locality') || c.types.includes('administrative_area_level_2')
      )
      if (cityComponent) {
        setSearchCity(cityComponent.long_name)
      }
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

  const handleContactDonor = (donor: Donor) => {
    setSelectedDonor(donor)
    setContactMessage(`Hi ${donor.full_name}, I am in urgent need of ${donor.blood_type} blood. Are you available to donate?`)
    setIsContactModalOpen(true)
  }

  const sendContactRequest = async () => {
    if (!selectedDonor) return
    if (!requesterName) {
      toast.error("Please enter your name")
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/donors/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_id: selectedDonor.id,
          message: contactMessage,
          requester_name: requesterName
        })
      })

      if (!res.ok) throw new Error('Failed to notify donor')

      toast.success(`Request sent to ${selectedDonor.full_name}!`)
      setIsContactModalOpen(false)
      setContactMessage('')
      setRequesterName('')
    } catch (error) {
      console.error('Contact error:', error)
      toast.error("Failed to send request. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8 overflow-y-auto">
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
                className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-red-500 outline-none w-48"
              >
                <option value="">All Blood Types</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {mode === 'list' && (
                <>
                  <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                  <input
                    type="text"
                    placeholder="Filter by city..."
                    value={searchCity}
                    onChange={e => setSearchCity(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-red-500 outline-none w-48"
                  />
                </>
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

          {mode !== 'register' && (
            <DonorMap 
              donors={mode === 'match' ? (matchResult?.matches || []) : donors} 
              center={mapCenter}
            />
          )}

          {mode === 'register' ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 max-w-2xl text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-500 mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Secure Donor Registration</h2>
              <p className="text-slate-600 mb-8 text-lg">
                To ensure a safe and reliable network, donor registration now requires a verified Google account. This helps us verify identities and protect your private information.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.href = '/profile'}
                  className="w-full py-6 text-lg bg-red-500 hover:bg-red-600 rounded-2xl"
                >
                  Go to Profile to Register
                </Button>
                <p className="text-sm text-slate-500">
                  You'll be able to set your blood type, location, and availability there.
                </p>
              </div>
            </div>
          ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-500">Loading donors...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mode === 'match' ? matchResult?.matches : donors)?.map(donor => (
              <DonorCard key={donor.id} donor={donor} onContact={() => handleContactDonor(donor)} />
            ))}
            {((mode === 'match' ? matchResult?.matches : donors)?.length || 0) === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                No donors found. Try adjusting your search criteria.
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedDonor?.full_name}</DialogTitle>
            <DialogDescription>
              Send a donation request to this donor. They will receive a notification immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <input 
                type="text" 
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea 
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-red-500 resize-none"
              />
            </div>
            {selectedDonor?.phone && (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex justify-between items-center">
                <span>Phone: {selectedDonor.phone}</span>
                <a href={`tel:${selectedDonor.phone}`} className="font-bold underline">Call Now</a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600" onClick={sendContactRequest} disabled={sending}>
              {sending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DonorCard({ donor, onContact }: { donor: Donor, onContact: () => void }) {
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
        <button 
          onClick={onContact}
          className="mt-4 w-full py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
        >
          Contact Donor
        </button>
      )}
    </div>
  )
}
