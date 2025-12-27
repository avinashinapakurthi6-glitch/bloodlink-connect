import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/profile'
  const origin = requestUrl.origin

    if (code) {
      console.log('Exchanging code for session on origin:', origin)
      const supabase = await createSupabaseServerClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        console.log('Session exchanged successfully')
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
        return NextResponse.redirect(new URL(next, siteUrl))
      }
      console.error('Auth error in callback:', error)
    }


  return NextResponse.redirect(new URL('/auth/error', request.url))
}
