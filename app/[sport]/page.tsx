'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Sport } from '@/lib/types'

const SPORT_COLOR: Record<string, string> = {
  football: '#00C2FF', cricket: '#00FF87', volleyball: '#7B2FFF', athletics: '#FFD60A',
}
const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', cricket: '🏏', volleyball: '🏐', athletics: '🏃',
}

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>()
  const color = SPORT_COLOR[sport] ?? 'var(--accent)'
  const emoji = SPORT_EMOJI[sport] ?? '🏆'

  const [clubs, setClubs] = useState<{ id: string; name: string }[]>([])
  const [matches, setMatches] = useState<{ id: string; home_team_name: string; away_team_name: string; home_score: number | null; away_score: number | null; is_live: boolean; is_played: boolean; match_date: string | null }[]>([])
  const [tournaments, setTournaments] = useState<{ id: string; name: string; start_date: string; status: string }[]>([])

  useEffect(() => {
    supabase.from('clubs').select('id,name').eq('sport', sport).eq('is_active', true).order('name').then(({ data }) => setClubs(data ?? []))
    supabase.from('tournament_matches').select('id,home_team_name,away_team_name,home_score,away_score,is_live,is_played,match_date').eq('sport', sport).order('match_date', { ascending: false }).limit(5).then(({ data }) => setMatches(data ?? []))
    supabase.from('tournaments').select('id,name,start_date,status').eq('sport', sport).eq('is_published', true).order('start_date', { ascending: false }).limit(6).then(({ data }) => setTournaments(data ?? []))
  }, [sport])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: 13 }}>← BTSA</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ color, fontFamily: 'Bebas Neue', fontSize: 18 }}>{emoji} {label}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20 }}>
          {['teams', 'matches', 'rankings'].map(p => (
            <Link key={p} href={`/${sport}/${p}`} style={{ color: 'var(--muted)', fontSize: 13, textTransform: 'capitalize' }}>{p}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>
        <h1 style={{ fontSize: 52, color, marginBottom: 32 }}>{emoji} {label}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Clubs */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20 }}>CLUBS</h3>
              <Link href={`/${sport}/teams`} style={{ color: 'var(--muted)', fontSize: 12 }}>Alle clubs →</Link>
            </div>
            {clubs.length === 0 ? <p style={{ color: 'var(--muted)' }}>Nog geen clubs</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {clubs.slice(0, 6).map(c => (
                  <div key={c.id} style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 6 }}>{c.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Recent matches */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20 }}>WEDSTRIJDEN</h3>
              <Link href={`/${sport}/matches`} style={{ color: 'var(--muted)', fontSize: 12 }}>Alle →</Link>
            </div>
            {matches.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen wedstrijden</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matches.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 6 }}>
                    {m.is_live && <span className="live-dot" />}
                    <span style={{ flex: 1, fontSize: 12 }}>{m.home_team_name}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: m.is_played ? 'var(--text)' : 'var(--muted)', minWidth: 50, textAlign: 'center' }}>
                      {m.is_played ? `${m.home_score} - ${m.away_score}` : 'vs'}
                    </span>
                    <span style={{ flex: 1, fontSize: 12, textAlign: 'right' }}>{m.away_team_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tournaments */}
        <div className="card" style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>TOERNOOIEN</h3>
          {tournaments.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen toernooien</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {tournaments.map(t => (
                <Link key={t.id} href={`/${sport}/tournament/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: 16, background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t.start_date}</div>
                    <span className={`badge badge-${t.status === 'ongoing' ? 'green' : t.status === 'finished' ? 'gray' : 'blue'}`} style={{ marginTop: 8 }}>{t.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
