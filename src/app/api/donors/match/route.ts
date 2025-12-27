import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const COMPATIBLE_BLOOD_TYPES: Record<string, string[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export async function POST(request: NextRequest) {
  try {
    const { blood_type, latitude, longitude, radius_km = 50 } = await request.json()

    if (!blood_type) {
      return NextResponse.json({ error: 'Blood type is required' }, { status: 400 })
    }

    const compatibleTypes = COMPATIBLE_BLOOD_TYPES[blood_type] || [blood_type]

    const publicColumns = [
      'id', 'full_name', 'blood_type', 'city', 'state', 
      'is_donor', 'is_available', 'total_donations', 
      'last_donation_date', 'latitude', 'longitude'
    ].join(',')

    const { data: donors, error } = await supabaseAdmin
      .from('users')
      .select(publicColumns)
      .eq('is_donor', true)
      .eq('is_available', true)
      .in('blood_type', compatibleTypes)

    if (error) throw error

    let matchedDonors = donors || []

    if (latitude && longitude) {
      matchedDonors = matchedDonors
        .map(donor => ({
          ...donor,
          distance_km: donor.latitude && donor.longitude 
            ? calculateDistance(latitude, longitude, parseFloat(donor.latitude), parseFloat(donor.longitude))
            : null
        }))
        .filter(donor => donor.distance_km === null || donor.distance_km <= radius_km)
        .sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999))
    }

    return NextResponse.json({ 
      matches: matchedDonors,
      total: matchedDonors.length,
      compatible_types: compatibleTypes
    })
  } catch (error) {
    console.error('Donor match error:', error)
    return NextResponse.json({ error: 'Failed to find matching donors' }, { status: 500 })
  }
}
