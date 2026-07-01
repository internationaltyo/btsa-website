'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', cricket: '🏏', volleyball: '🏐', athletics: '🏃',
}

const SPORT_NUM: Record<string, string> = {
  football: '01', cricket: '02', volleyball: '03', athletics: '04',
}

export default function SportPage() {
  const { sport } = useParams<{ sport: string }>()
  const emoji = SPORT_EMOJI[sport] ?? '🏆'
  const num = SPORT_NUM[sport] ?? '—'

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

      {/* Sub-nav */}
      <nav className="sport-subnav" style={{ background: '#000', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', paddingRight: 16, borderRight: '1px solid var(--border)' }}>
            <Image src="/btsa-logo.png" alt="BTSA" width={26} height={26} style={{ borderRadius: '50%' }} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, color: 'var(--muted)' }}>BTSA</span>
          </Link>
          <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--accent)', letterSpacing: 1 }}>{emoji} {label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {['teams', 'matches', 'rankings'].map((p, i) => (
            <Link key={p} href={`/${sport}/${p}`} className="sport-subnav-link" style={{
              color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12,
              letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 16px',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none', textDecoration: 'none',
              display: 'flex', alignItems: 'center', height: 56,
            }}>{p}</Link>
          ))}
        </div>
      </nav>

      {/* Page header */}
      <div className="sport-header" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--muted)', marginBottom: 8 }}>{num} — BTSA</div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 72, lineHeight: 0.9, letterSpacing: 1 }}>
              <span style={{ fontSize: 48 }}>{emoji}</span> {label}
            </h1>
          </div>
          <div className="sport-header-stats" style={{ display: 'flex', gap: 32, paddingBottom: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: 'var(--accent)', lineHeight: 1 }}>{clubs.length}</div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)' }}>CLUBS</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: 'var(--accent)', lineHeight: 1 }}>{tournaments.length}</div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)' }}>TOERNOOIEN</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="sport-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px' }}>

        {/* Two-column: clubs + matches */}
        <div className="sport-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 1, background: 'var(--border)', marginBottom: 1 }}>
          {/* Clubs */}
          <div className="sport-cols-inner" style={{ background: 'var(--bg)', padding: '32px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>CLUBS</h3>
              <Link href={`/${sport}/teams`} style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1, color: 'var(--muted)', textDecoration: 'none' }}>ALLE →</Link>
            </div>
            {clubs.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nog geen clubs geregistreerd.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {clubs.slice(0, 8).map((c, i) => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0',
                    borderBottom: i < clubs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: 'var(--muted)', minWidth: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent matches */}
          <div className="sport-cols-inner" style={{ background: 'var(--bg)', padding: 0 }}>
            <div style={{ padding: '28px 28px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>RECENTE WEDSTRIJDEN</h3>
              <Link href={`/${sport}/matches`} style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1, color: 'var(--muted)', textDecoration: 'none' }}>ALLE →</Link>
            </div>
            {matches.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13, padding: '0 28px 28px' }}>Geen wedstrijden gevonden.</p>
            ) : (
              <div>
                {matches.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center', gap: 12,
                    padding: '14px 28px',
                    borderTop: '1px solid var(--border)',
                    background: m.is_live ? 'rgba(226,35,26,0.04)' : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {m.is_live && <span className="live-dot" />}
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.home_team_name}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, lineHeight: 1, color: m.is_played ? 'var(--text)' : 'var(--muted)' }}>
                        {m.is_played ? `${m.home_score} — ${m.away_score}` : 'vs'}
                      </div>
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 9, letterSpacing: 1, color: m.is_live ? 'var(--red)' : 'var(--muted)', marginTop: 2 }}>
                        {m.is_live ? 'LIVE' : m.is_played ? 'FT' : m.match_date ?? 'TBD'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{m.away_team_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tournaments */}
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderTop: 'none' }}>
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>TOERNOOIEN</h3>
          </div>
          {tournaments.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, padding: '20px 24px' }}>Geen gepubliceerde toernooien.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 0 }}>
              {tournaments.map((t) => (
                <Link key={t.id} href={`/${sport}/tournament/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '18px 20px', borderRight: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg3)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    <span className={`badge badge-${t.status === 'ongoing' ? 'green' : t.status === 'finished' ? 'gray' : 'blue'}`} style={{ marginBottom: 8, display: 'inline-block' }}>{t.status}</span>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 0.5, marginBottom: 4, lineHeight: 1.1 }}>{t.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: 1 }}>{t.start_date}</div>
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
