import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bloodType = searchParams.get('blood_type')
    const city = searchParams.get('city')
    const available = searchParams.get('available')

    const publicColumns = [
      'id', 'full_name', 'blood_type', 'city', 'state', 
      'is_donor', 'is_available', 'total_donations', 
      'last_donation_date', 'latitude', 'longitude'
    ].join(',')

    let query = supabaseAdmin.from('users').select(publicColumns).eq('is_donor', true)
    
    if (bloodType) query = query.eq('blood_type', bloodType)
    if (city) query = query.ilike('city', `%${city}%`)
    if (available === 'true') query = query.eq('is_available', true)

    const { data, error } = await query.order('total_donations', { ascending: false })

    if (error) throw error
    return NextResponse.json({ donors: data })
  } catch (error) {
    console.error('Donors API error:', error)
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseServer = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { city, address, latitude, longitude } = body
    
    let finalLat = latitude
    let finalLng = longitude

    // Geocode if lat/lng are missing but city/address is provided
    if ((!finalLat || !finalLng) && (city || address)) {
      try {
        const query = encodeURIComponent(`${address || ''} ${city || ''}`.trim())
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        
        if (apiKey) {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`)
          const geoData = await res.json()
          
          if (geoData.status === 'OK' && geoData.results[0]) {
            finalLat = geoData.results[0].geometry.location.lat
            finalLng = geoData.results[0].geometry.location.lng
          }
        }
      } catch (geoError) {
        console.error('Geocoding error:', geoError)
      }
    }

    const { data, error } = await supabaseAdmin.from('users').insert({ 
      ...body, 
      auth_id: user.id,
      email: user.email,
      latitude: finalLat,
      longitude: finalLng,
      is_donor: true 
    }).select().single()
    
    if (error) throw error
    return NextResponse.json({ donor: data })
  } catch (error) {
    console.error('Create donor error:', error)
    return NextResponse.json({ error: 'Failed to create donor' }, { status: 500 })
  }
}
