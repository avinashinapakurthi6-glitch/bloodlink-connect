import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    let query = supabase.from('certificates').select('*, donations(donation_date, hospital_id)')
    
    if (userId) query = query.eq('user_id', userId)

    const { data, error } = await query.order('issued_date', { ascending: false })

    if (error) throw error
    return NextResponse.json({ certificates: data })
  } catch (error) {
    console.error('Certificates API error:', error)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const certificateNumber = `BL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        ...body,
        certificate_number: certificateNumber,
        issued_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json({ certificate: data })
  } catch (error) {
    console.error('Create certificate error:', error)
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}
