'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', cricket: '🏏', volleyball: '🏐', athletics: '🏃',
}

const SPORT_COLOR: Record<string, string> = {
  football: '#E2231A', cricket: '#F5A623', volleyball: '#4CD964', athletics: '#00BFFF',
}

const sports = ['football', 'cricket', 'volleyball', 'athletics']

export default function CompetitionsPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    supabase
      .from('tournament_matches')
      .select('*, tournaments(name, sport)')
      .order('match_date', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setMatches(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = filter === 'all' ? matches : matches.filter(m => m.sport === filter || m.tournaments?.sport === filter)

  const grouped: Record<string, any[]> = {}
  filtered.forEach(m => {
    const date = m.match_date ?? 'Datum onbekend'
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(m)
  })
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 8 }}>BTSA</div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 56, lineHeight: 0.95, marginBottom: 24 }}>ALLE COMPETITIES</h1>

          {/* Sport filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{
              padding: '8px 20px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, letterSpacing: 1,
              border: 'none', cursor: 'pointer', borderRadius: 4,
              background: filter === 'all' ? 'var(--accent)' : 'var(--bg3)',
              color: filter === 'all' ? '#000' : 'var(--muted)',
            }}>ALLE SPORTEN</button>
            {sports.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '8px 20px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, letterSpacing: 1,
                border: 'none', cursor: 'pointer', borderRadius: 4,
                background: filter === s ? SPORT_COLOR[s] : 'var(--bg3)',
                color: filter === s ? '#000' : 'var(--muted)',
              }}>{SPORT_EMOJI[s]} {s.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Laden…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Geen wedstrijden gevonden.</p>
        ) : (
          sortedDates.map(date => (
            <div key={date} style={{ marginBottom: 36 }}>
              {/* Datum header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, letterSpacing: 2, color: 'var(--accent)' }}>{date}</div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>

              {/* Wedstrijden op die datum */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {grouped[date].map((m, i) => {
                  const sport = m.sport ?? m.tournaments?.sport ?? 'football'
                  return (
                    <div key={m.id} style={{
                      display: 'grid', gridTemplateColumns: '120px 1fr auto 1fr 120px',
                      alignItems: 'center', gap: 16, padding: '14px 20px',
                      background: m.is_live ? 'rgba(226,35,26,0.05)' : 'var(--bg2)',
                      border: `1px solid ${m.is_live ? 'rgba(226,35,26,0.2)' : 'var(--border)'}`,
                    }}>
                      {/* Sport badge + toernooi */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          {m.is_live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E2231A', display: 'inline-block', animation: 'pulse 1s infinite' }} />}
                          <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, letterSpacing: 1, color: SPORT_COLOR[sport] ?? 'var(--accent)' }}>
                            {SPORT_EMOJI[sport]} {sport.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.tournaments?.name ?? '—'}
                        </div>
                      </div>

                      {/* Thuisploeg */}
                      <div style={{ fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{m.home_team_name}</div>

                      {/* Score */}
                      <div style={{ textAlign: 'center', minWidth: 90 }}>
                        {m.is_live ? (
                          <span style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#E2231A', lineHeight: 1 }}>{m.home_score ?? 0} — {m.away_score ?? 0}</span>
                        ) : m.is_played ? (
                          <span style={{ fontFamily: 'Bebas Neue', fontSize: 28, lineHeight: 1 }}>{m.home_score} — {m.away_score}</span>
                        ) : (
                          <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: 'var(--muted)', lineHeight: 1 }}>VS</span>
                        )}
                        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 9, letterSpacing: 1, color: m.is_live ? '#E2231A' : m.is_played ? 'var(--muted)' : 'var(--accent)', marginTop: 2 }}>
                          {m.is_live ? 'LIVE' : m.is_played ? 'FT' : m.match_time ?? 'TBD'}
                        </div>
                      </div>

                      {/* Uitploeg */}
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{m.away_team_name}</div>

                      {/* Ronde */}
                      <div style={{ textAlign: 'right', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, color: 'var(--muted)', letterSpacing: 0.5 }}>
                        {m.round_label ?? m.round ?? '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
