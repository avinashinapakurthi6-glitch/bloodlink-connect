import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const eventType = searchParams.get('event_type')

    let query = supabase.from('events').select('*, hospitals(name)').eq('is_active', true)
    
    if (city) query = query.ilike('city', `%${city}%`)
    if (eventType) query = query.eq('event_type', eventType)

    const { data, error } = await query.order('start_date')

    if (error) throw error
    return NextResponse.json({ events: data })
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase.from('events').insert(body).select().single()
    
    if (error) throw error
    return NextResponse.json({ event: data })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
