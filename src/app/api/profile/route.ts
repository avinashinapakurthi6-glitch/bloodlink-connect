import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', authenticated: false }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      },
      profile: profile || null
    })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single()

    let result
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...body,
          email: user.email,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', user.id)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          ...body,
          auth_id: user.id,
          email: user.email,
          is_donor: true,
          is_available: true,
          total_donations: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }

    return NextResponse.json({ profile: result })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
