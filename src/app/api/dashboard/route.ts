import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const [
      donorsResult,
      donationsResult,
      requestsResult,
      inventoryResult,
      hospitalsResult,
      eventsResult,
      recentDonationsResult
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact' }).eq('is_donor', true),
      supabase.from('donations').select('units_donated'),
      supabase.from('blood_requests').select('*', { count: 'exact' }),
      supabase.from('blood_inventory').select('blood_type, units_available'),
      supabase.from('hospitals').select('*', { count: 'exact' }).eq('is_verified', true),
      supabase.from('events').select('*', { count: 'exact' }).eq('is_active', true),
      supabase.from('donations').select('*, users!donations_donor_id_fkey(full_name, blood_type)').order('donation_date', { ascending: false }).limit(5)
    ])

    const totalUnits = donationsResult.data?.reduce((sum, d) => sum + (d.units_donated || 0), 0) || 0
    const livesSaved = Math.floor(totalUnits * 3)

    const inventoryByType = inventoryResult.data?.reduce((acc: Record<string, number>, item) => {
      acc[item.blood_type] = (acc[item.blood_type] || 0) + item.units_available
      return acc
    }, {}) || {}

    const pendingRequests = requestsResult.data?.filter(r => r.status === 'pending').length || 0
    const emergencyRequests = requestsResult.data?.filter(r => r.is_emergency).length || 0

    return NextResponse.json({
      stats: {
        totalDonors: donorsResult.count || 0,
        totalDonations: donationsResult.data?.length || 0,
        totalUnits,
        livesSaved,
        totalHospitals: hospitalsResult.count || 0,
        activeEvents: eventsResult.count || 0,
        pendingRequests,
        emergencyRequests
      },
      inventory: inventoryByType,
      recentDonations: recentDonationsResult.data || []
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
