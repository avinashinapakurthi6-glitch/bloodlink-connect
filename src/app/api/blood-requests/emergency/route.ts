import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const emergencyRequest = {
      ...body,
      is_emergency: true,
      urgency: 'critical',
      status: 'pending'
    }

    const { data: requestData, error: requestError } = await supabase
      .from('blood_requests')
      .insert(emergencyRequest)
      .select()
      .single()

    if (requestError) throw requestError

    const COMPATIBLE_BLOOD_TYPES: Record<string, string[]> = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-']
    }

    const compatibleTypes = COMPATIBLE_BLOOD_TYPES[body.blood_type] || [body.blood_type]

    const { data: donors } = await supabase
      .from('users')
      .select('*')
      .eq('is_donor', true)
      .eq('is_available', true)
      .in('blood_type', compatibleTypes)
      .limit(20)

    if (donors && donors.length > 0) {
      const notifications = donors.map(donor => ({
        user_id: donor.id,
        title: 'Emergency Blood Request',
        message: `Urgent need for ${body.blood_type} blood in ${body.city || 'your area'}. ${body.units_needed} unit(s) required.`,
        type: 'emergency',
        data: { request_id: requestData.id }
      }))

      await supabase.from('notifications').insert(notifications)
    }

    return NextResponse.json({ 
      request: requestData,
      notified_donors: donors?.length || 0
    })
  } catch (error) {
    console.error('Emergency request error:', error)
    return NextResponse.json({ error: 'Failed to create emergency request' }, { status: 500 })
  }
}
