import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const donorId = searchParams.get('donor_id')
    const status = searchParams.get('status')

    let query = supabase.from('donations').select('*, users!donations_donor_id_fkey(full_name, blood_type), hospitals(name)')
    
    if (donorId) query = query.eq('donor_id', donorId)
    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('donation_date', { ascending: false })

    if (error) throw error
    return NextResponse.json({ donations: data })
  } catch (error) {
    console.error('Donations API error:', error)
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase.from('donations').insert(body).select().single()
    
    if (error) throw error

    if (body.donor_id) {
      await supabase.rpc('increment_donations', { user_id: body.donor_id })
    }

    return NextResponse.json({ donation: data })
  } catch (error) {
    console.error('Create donation error:', error)
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 })
  }
}
