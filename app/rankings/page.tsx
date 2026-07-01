'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useMobile } from '../hooks/useMobile'

const SPORTS = [
  { key: 'football',   label: 'Voetbal',    emoji: '⚽', color: '#E2231A' },
  { key: 'cricket',    label: 'Cricket',    emoji: '🏏', color: '#F5A623' },
  { key: 'volleyball', label: 'Volleyball', emoji: '🏐', color: '#4CD964' },
  { key: 'athletics',  label: 'Atletiek',   emoji: '🏃', color: '#00BFFF' },
]

export default function RankingsPage() {
  const [activeSport, setActiveSport] = useState('football')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    supabase
      .from('global_team_rankings')
      .select('*')
      .eq('sport', activeSport)
      .order('global_rank', { ascending: true })
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [activeSport])

  const isMobile = useMobile()
  const sport = SPORTS.find(s => s.key === activeSport)!

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <div className="rankings-header" style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 40px 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 8 }}>BTSA</div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 56, lineHeight: 0.95, marginBottom: 32 }}>RANGLIJST</h1>

          {/* Sport tabs */}
          <div className="rankings-tabs" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {SPORTS.map(s => (
              <button key={s.key} onClick={() => setActiveSport(s.key)} style={{
                padding: '14px 28px',
                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 1,
                border: 'none', cursor: 'pointer', background: 'transparent',
                color: activeSport === s.key ? s.color : 'var(--muted)',
                borderBottom: `3px solid ${activeSport === s.key ? s.color : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                {s.emoji} {s.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rankings-content" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 4, height: 32, background: sport.color }} />
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, margin: 0 }}>
            {sport.emoji} {sport.label.toUpperCase()} — RANGLIJST
          </h2>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Laden…</p>
        ) : rows.length === 0 ? (
          <div style={{ padding: '48px', background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{sport.emoji}</div>
            <p style={{ color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 15 }}>
              Nog geen ranglijst beschikbaar voor {sport.label}.
            </p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 500 : 'auto' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '2px solid var(--border)' }}>
                  {['#','Team','Club','G','W','D','V','GV','GT','+/-','Pts'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)', textAlign: h === '#' || h === 'Team' || h === 'Club' ? 'left' : 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'Bebas Neue', fontSize: 20, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted)' }}>{r.global_rank ?? i + 1}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{r.team_name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: 12 }}>{r.club_name}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13 }}>{r.played}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>{r.won}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>{r.drawn}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: 'var(--red)' }}>{r.lost}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13 }}>{r.goals_for}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13 }}>{r.goals_against}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: r.goal_diff > 0 ? 'var(--green)' : r.goal_diff < 0 ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>
                      {r.goal_diff > 0 ? '+' : ''}{r.goal_diff}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 22, color: sport.color }}>{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
