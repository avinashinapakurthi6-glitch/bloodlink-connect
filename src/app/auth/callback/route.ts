import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/profile'

  if (code) {
    console.log('Exchanging code for session:', code)
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log('Session exchanged successfully')
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('Auth error in callback:', error)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
