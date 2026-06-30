import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, club_id, display_name } = await req.json()

  if (!email || !password || !club_id) {
    return NextResponse.json({ error: 'email, password en club_id zijn verplicht' }, { status: 400 })
  }

  const admin = supabaseAdmin()

  // Create auth user
  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  })
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })

  const userId = authData.user.id

  // Get club country
  const { data: clubData } = await admin.from('clubs').select('country_id').eq('id', club_id).single()

  // Create team_account
  const { error: accErr } = await admin.from('team_accounts').insert({
    user_id: userId, club_id, email,
    display_name: display_name || null,
    country_id: clubData?.country_id ?? null,
    is_active: true,
  })

  if (accErr) {
    // Cleanup auth user if account creation fails
    await admin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: accErr.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, user_id: userId })
}
