import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    let query = supabase.from('users').select(publicColumns).eq('is_donor', true)
    
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

  import { createSupabaseServerClient } from '@/lib/supabase-server'
  
  export async function GET(request: NextRequest) {
    // ...
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
  
      // ... geocoding logic ...
  
      const { data, error } = await supabase.from('users').insert({ 
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
