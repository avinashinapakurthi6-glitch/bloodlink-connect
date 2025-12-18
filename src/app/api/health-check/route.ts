import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface HealthCheckData {
  user_id?: string
  weight_kg?: number
  hemoglobin?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  pulse_rate?: number
  temperature?: number
  has_recent_illness?: boolean
  has_recent_surgery?: boolean
  has_tattoo_recently?: boolean
  is_pregnant?: boolean
  is_breastfeeding?: boolean
  on_medication?: boolean
  medication_details?: string
  age?: number
}

function checkEligibility(data: HealthCheckData): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = []

  if (data.age && data.age < 18) reasons.push('Must be at least 18 years old')
  if (data.age && data.age > 65) reasons.push('Age above 65 requires medical clearance')
  if (data.weight_kg && data.weight_kg < 50) reasons.push('Weight must be at least 50 kg')
  if (data.hemoglobin && data.hemoglobin < 12.5) reasons.push('Hemoglobin level too low (minimum 12.5 g/dL)')
  if (data.blood_pressure_systolic && (data.blood_pressure_systolic < 90 || data.blood_pressure_systolic > 180)) {
    reasons.push('Blood pressure out of acceptable range')
  }
  if (data.blood_pressure_diastolic && (data.blood_pressure_diastolic < 60 || data.blood_pressure_diastolic > 100)) {
    reasons.push('Diastolic blood pressure out of range')
  }
  if (data.pulse_rate && (data.pulse_rate < 50 || data.pulse_rate > 100)) {
    reasons.push('Pulse rate out of acceptable range (50-100 bpm)')
  }
  if (data.temperature && data.temperature > 37.5) reasons.push('Body temperature too high')
  if (data.has_recent_illness) reasons.push('Recent illness - please wait until fully recovered')
  if (data.has_recent_surgery) reasons.push('Recent surgery - wait period required')
  if (data.has_tattoo_recently) reasons.push('Recent tattoo - 6 month wait period required')
  if (data.is_pregnant) reasons.push('Cannot donate during pregnancy')
  if (data.is_breastfeeding) reasons.push('Cannot donate while breastfeeding')
  if (data.on_medication) reasons.push('Some medications may affect eligibility - consult with staff')

  return { eligible: reasons.length === 0, reasons }
}

export async function POST(request: NextRequest) {
  try {
    const body: HealthCheckData = await request.json()
    const { eligible, reasons } = checkEligibility(body)

    const healthCheck = {
      ...body,
      is_eligible: eligible,
      eligibility_reason: reasons.join('; ') || 'All criteria met'
    }

    if (body.user_id) {
      const { data, error } = await supabase.from('health_checks').insert(healthCheck).select().single()
      if (error) throw error
      return NextResponse.json({ health_check: data, eligible, reasons })
    }

    return NextResponse.json({ eligible, reasons })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ error: 'Failed to process health check' }, { status: 500 })
  }
}
