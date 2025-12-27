import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { donor_id, message, request_id, requester_name } = await request.json()

    if (!donor_id) {
      return NextResponse.json({ error: 'Donor ID is required' }, { status: 400 })
    }

    // 1. Create a notification for the donor
    const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: donor_id,
        title: 'New Blood Donation Request',
        message: message || `You have a new blood donation request from ${requester_name || 'a patient in need'}.`,
        type: 'donation_request',
        data: { request_id, requester_name }
      })

    if (notificationError) throw notificationError

    // 2. If it's linked to a specific request, update donor_matches
    if (request_id) {
      const { error: matchError } = await supabaseAdmin
        .from('donor_matches')
        .upsert({
          request_id,
          donor_id,
          status: 'notified',
          notified_at: new Date().toISOString()
        })
      
      if (matchError) {
        console.error('Failed to update donor_matches:', matchError)
        // We don't fail the whole request if this optional step fails
      }
    }

    return NextResponse.json({ success: true, message: 'Donor notified successfully' })
  } catch (error) {
    console.error('Contact donor error:', error)
    return NextResponse.json({ error: 'Failed to notify donor' }, { status: 500 })
  }
}
