import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospital_id')
    const bloodType = searchParams.get('blood_type')

    let query = supabase.from('blood_inventory').select('*, hospitals(name, city)')
    
    if (hospitalId) query = query.eq('hospital_id', hospitalId)
    if (bloodType) query = query.eq('blood_type', bloodType)

    const { data, error } = await query.order('blood_type')

    if (error) throw error

    const summary = data?.reduce((acc: Record<string, { total: number, hospitals: number }>, item) => {
      if (!acc[item.blood_type]) {
        acc[item.blood_type] = { total: 0, hospitals: 0 }
      }
      acc[item.blood_type].total += item.units_available
      acc[item.blood_type].hospitals += 1
      return acc
    }, {})

    return NextResponse.json({ inventory: data, summary })
  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, units_available, units_reserved } = await request.json()
    
    const { data, error } = await supabase
      .from('blood_inventory')
      .update({ units_available, units_reserved, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ inventory: data })
  } catch (error) {
    console.error('Update inventory error:', error)
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 })
  }
}
