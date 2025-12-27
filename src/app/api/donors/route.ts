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

    const { data, error } = await query.order('total_donations', { ascending: false }).limit(50)

    if (error) throw error
    return NextResponse.json({ donors: data })
  } catch (error) {
    console.error('Donors API error:', error)
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 })
  }
}
