'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const SPORT_COLOR: Record<string, string> = {
  football: '#E2231A', cricket: '#F5A623', volleyball: '#22C55E', athletics: '#00BFFF',
}

function calcStandings(matches: any[]) {
  const table: Record<string, any> = {}
  matches.filter(m => m.round === 'group' && m.is_played).forEach(m => {
    const h = m.home_team_name, a = m.away_team_name
    if (!table[h]) table[h] = { name: h, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    if (!table[a]) table[a] = { name: a, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    const hs = m.home_score ?? 0, as_ = m.away_score ?? 0
    table[h].p++; table[a].p++
    table[h].gf += hs; table[h].ga += as_
    table[a].gf += as_; table[a].ga += hs
    if (hs > as_) { table[h].w++; table[h].pts += 3; table[a].l++ }
    else if (hs < as_) { table[a].w++; table[a].pts += 3; table[h].l++ }
    else { table[h].d++; table[a].d++; table[h].pts++; table[a].pts++ }
  })
  return Object.values(table).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))
}

export default function TournamentPublicPage() {
  const { sport, id } = useParams<{ sport: string; id: string }>()
  const [tournament, setTournament] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: t }, { data: m }] = await Promise.all([
        supabase.from('tournaments').select('*, clubs!organizer_club_id(name)').eq('id', id).single(),
        supabase.from('tournament_matches').select('*').eq('tournament_id', id).order('sort_order'),
      ])
      setTournament(t)
      setMatches(m ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div style={{ minHeight: '100vh', background: '#0D1128', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani', fontWeight: 600 }}>Laden…</p></div>
  if (!tournament) return <div style={{ minHeight: '100vh', background: '#0D1128', padding: 40 }}><p style={{ color: 'rgba(255,255,255,0.4)' }}>Toernooi niet gevonden.</p></div>

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)
  const color = SPORT_COLOR[sport] ?? '#A50044'
  const groupMatches = matches.filter(m => m.round === 'group')
  const koMatches = matches.filter(m => m.round !== 'group')
  const groups = [...new Set(groupMatches.map(m => m.group_name).filter(Boolean))].sort()
  const standings = calcStandings(matches)
  const liveMatches = matches.filter(m => m.is_live)
  const finale = koMatches.find(m => m.round === 'FINAL' && m.is_played)
  const winner = finale ? (finale.home_score > finale.away_score ? finale.home_team_name : finale.away_team_name) : null
  const KO_ORDER = ['QF1', 'QF2', 'QF3', 'QF4', 'SF1', 'SF2', '3RD', 'FINAL']
  const sortedKO = [...koMatches].sort((a, b) => KO_ORDER.indexOf(a.round) - KO_ORDER.indexOf(b.round))

  return (
    <div style={{ minHeight: '100vh', background: '#0D1128', color: '#fff' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#080c1a', borderBottom: `3px solid ${color}`, padding: '0 40px', height: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontFamily: 'Rajdhani', fontWeight: 600 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={22} height={22} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>{tournament.name}</span>
      </div>

      {/* Header */}
      <div className="tourn-header" style={{ background: 'linear-gradient(135deg, #080c1a 0%, #0D1128 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: color, marginBottom: 10 }}>
              {label.toUpperCase()} · BTSA
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 56, lineHeight: 0.9, color: '#fff', margin: 0, letterSpacing: 1 }}>
              {tournament.name}
            </h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📅 {tournament.start_date}</span>
              {tournament.location && <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>📍 {tournament.location}</span>}
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>🏟 {tournament.clubs?.name ?? 'BTSA'}</span>
            </div>
          </div>
          {winner && (
            <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: '20px 28px', textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, letterSpacing: 3, color: '#F5A623', marginBottom: 6 }}>🏆 WINNAAR</div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 30, color: '#F5A623', letterSpacing: 1 }}>{winner}</div>
            </div>
          )}
        </div>
      </div>

      <div className="tourn-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        {/* LEFT */}
        <div>
          {/* Live */}
          {liveMatches.length > 0 && (
            <div style={{ background: 'rgba(226,35,26,0.1)', border: '1px solid rgba(226,35,26,0.3)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ background: '#E2231A', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" /><span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#fff', letterSpacing: 1 }}>LIVE</span>
              </div>
              {liveMatches.map(m => (
                <div key={m.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flex: 1, textAlign: 'right', fontWeight: 700 }}>{m.home_team_name}</span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#E2231A', minWidth: 80, textAlign: 'center' }}>{m.home_score ?? 0}–{m.away_score ?? 0}</span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{m.away_team_name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Group stage */}
          {groupMatches.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 2 }}>GROEPSFASE</span>
              </div>
              {groups.map(grp => (
                <div key={grp}>
                  <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 13, color: color, letterSpacing: 2 }}>GROEP {grp}</span>
                  </div>
                  {groupMatches.filter(m => m.group_name === grp).map((m, i, arr) => {
                    const homeWon = m.is_played && m.home_score > m.away_score
                    const awayWon = m.is_played && m.away_score > m.home_score
                    return (
                      <div key={m.id} className="tourn-match-grid" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 80px 1fr', alignItems: 'center', gap: 8, padding: '13px 20px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{m.match_time ?? ''}</span>
                        <span style={{ fontWeight: homeWon ? 700 : 400, fontSize: 14, textAlign: 'right', color: homeWon ? '#fff' : 'rgba(255,255,255,0.6)' }}>{m.home_team_name}</span>
                        <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: m.is_played ? '#fff' : 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                          {m.is_played ? `${m.home_score}–${m.away_score}` : 'vs'}
                        </span>
                        <span style={{ fontWeight: awayWon ? 700 : 400, fontSize: 14, color: awayWon ? '#fff' : 'rgba(255,255,255,0.6)' }}>{m.away_team_name}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Knockout */}
          {koMatches.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 2 }}>KNOCKOUT FASE</span>
              </div>
              {sortedKO.map((m, i) => {
                const isFinal = m.round === 'FINAL'
                const homeWon = m.is_played && m.home_score > m.away_score
                const awayWon = m.is_played && m.away_score > m.home_score
                return (
                  <div key={m.id} style={{ padding: '18px 20px', borderBottom: i < sortedKO.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: isFinal ? 'rgba(245,166,35,0.05)' : 'transparent' }}>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: isFinal ? '#F5A623' : color, marginBottom: 10 }}>
                      {isFinal ? '🏆 ' : ''}{m.round_label ?? m.round} {m.match_time ? `· ${m.match_time}` : ''}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 1fr', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: homeWon ? 700 : 400, fontSize: 15, textAlign: 'right', color: homeWon ? '#fff' : 'rgba(255,255,255,0.6)' }}>{m.home_team_name ?? '?'}</span>
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: isFinal ? 32 : 26, color: m.is_played ? (isFinal ? '#F5A623' : '#fff') : 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                        {m.is_played ? `${m.home_score}–${m.away_score}` : 'vs'}
                      </span>
                      <span style={{ fontWeight: awayWon ? 700 : 400, fontSize: 15, color: awayWon ? '#fff' : 'rgba(255,255,255,0.6)' }}>{m.away_team_name ?? '?'}</span>
                    </div>
                    {m.home_score_pen != null && (
                      <div style={{ textAlign: 'center', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                        Penalties: {m.home_score_pen}–{m.away_score_pen}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Standings + Info */}
        <div>
          {standings.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: color, padding: '14px 20px' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 2 }}>STAND</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['#', 'Club', 'G', 'W', 'V', 'Pts'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)', textAlign: h === 'Club' ? 'left' : 'center' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: winner === row.name ? 'rgba(245,166,35,0.08)' : 'transparent' }}>
                      <td style={{ padding: '11px 10px', fontFamily: 'Bebas Neue', fontSize: 18, color: i === 0 ? '#F5A623' : 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '11px 10px', fontWeight: 600, fontSize: 13, color: winner === row.name ? '#F5A623' : '#fff' }}>
                        {winner === row.name && '🏆 '}{row.name}
                      </td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{row.p}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', fontSize: 12, color: '#22C55E', fontWeight: 600 }}>{row.w}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', fontSize: 12, color: '#E2231A' }}>{row.l}</td>
                      <td style={{ padding: '11px 10px', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 22, color: color }}>{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '20px' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#fff', letterSpacing: 2, marginBottom: 16 }}>INFO</div>
            {[
              ['Sport', label],
              ['Datum', tournament.start_date],
              ['Wedstrijden', matches.length.toString()],
              ['Status', tournament.status.toUpperCase()],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{k}</span>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: k === 'Status' && tournament.status === 'finished' ? '#F5A623' : '#fff' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
