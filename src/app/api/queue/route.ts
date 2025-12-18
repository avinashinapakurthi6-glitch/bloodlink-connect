import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospital_id')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    let query = supabase.from('hospital_queue')
      .select('*, users!hospital_queue_donor_id_fkey(full_name, blood_type, phone), hospitals(name)')
      .eq('appointment_date', date)
    
    if (hospitalId) query = query.eq('hospital_id', hospitalId)

    const { data, error } = await query.order('queue_number')

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      waiting: data?.filter(q => q.status === 'waiting').length || 0,
      in_progress: data?.filter(q => q.status === 'in_progress').length || 0,
      completed: data?.filter(q => q.status === 'completed').length || 0
    }

    return NextResponse.json({ queue: data, stats })
  } catch (error) {
    console.error('Queue API error:', error)
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: existingQueue } = await supabase
      .from('hospital_queue')
      .select('queue_number')
      .eq('hospital_id', body.hospital_id)
      .eq('appointment_date', body.appointment_date)
      .order('queue_number', { ascending: false })
      .limit(1)

    const queueNumber = (existingQueue?.[0]?.queue_number || 0) + 1

    const { data, error } = await supabase
      .from('hospital_queue')
      .insert({ ...body, queue_number: queueNumber })
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json({ queue_entry: data, queue_number: queueNumber })
  } catch (error) {
    console.error('Create queue entry error:', error)
    return NextResponse.json({ error: 'Failed to create queue entry' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    
    const updates: Record<string, unknown> = { status }
    if (status === 'in_progress') updates.check_in_time = new Date().toISOString()
    if (status === 'completed') updates.completed_time = new Date().toISOString()

    const { data, error } = await supabase
      .from('hospital_queue')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ queue_entry: data })
  } catch (error) {
    console.error('Update queue error:', error)
    return NextResponse.json({ error: 'Failed to update queue' }, { status: 500 })
  }
}
