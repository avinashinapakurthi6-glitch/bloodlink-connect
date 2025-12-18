import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const hasBloodBank = searchParams.get('has_blood_bank')

    let query = supabase.from('hospitals').select('*').eq('is_verified', true)
    
    if (city) query = query.ilike('city', `%${city}%`)
    if (hasBloodBank === 'true') query = query.eq('has_blood_bank', true)

    const { data, error } = await query.order('name')

    if (error) throw error
    return NextResponse.json({ hospitals: data })
  } catch (error) {
    console.error('Hospitals API error:', error)
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 })
  }
}
