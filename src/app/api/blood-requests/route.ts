import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const bloodType = searchParams.get('blood_type')
    const emergency = searchParams.get('emergency')

    let query = supabase.from('blood_requests').select('*, users!blood_requests_requester_id_fkey(full_name, phone), hospitals(name)')
    
    if (status) query = query.eq('status', status)
    if (bloodType) query = query.eq('blood_type', bloodType)
    if (emergency === 'true') query = query.eq('is_emergency', true)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ requests: data })
  } catch (error) {
    console.error('Blood requests API error:', error)
    return NextResponse.json({ error: 'Failed to fetch blood requests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase.from('blood_requests').insert(body).select().single()
    
    if (error) throw error
    return NextResponse.json({ request: data })
  } catch (error) {
    console.error('Create blood request error:', error)
    return NextResponse.json({ error: 'Failed to create blood request' }, { status: 500 })
  }
}
