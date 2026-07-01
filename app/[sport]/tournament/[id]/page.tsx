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
  const gm = matches.filter(m => m.round === 'group' && m.is_played)
  gm.forEach(m => {
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

  if (loading) return <div style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Laden…</p></div>
  if (!tournament) return <div style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Toernooi niet gevonden.</p></div>

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
    <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>

      {/* Breadcrumb nav */}
      <nav style={{ background: '#0D1128', padding: '0 40px', height: 48, display: 'flex', alignItems: 'center', gap: 12, borderBottom: `3px solid ${color}` }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', fontFamily: 'Rajdhani', fontWeight: 600 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={24} height={24} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#fff', letterSpacing: 1 }}>{tournament.name}</span>
      </nav>

      {/* Header */}
      <div style={{ background: '#0D1128', padding: '40px 40px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: color, marginBottom: 8 }}>
                {label.toUpperCase()} · BTSA
              </div>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, lineHeight: 0.9, color: '#fff', margin: 0, letterSpacing: 1 }}>
                {tournament.name}
              </h1>
              <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  📅 {tournament.start_date}
                </span>
                {tournament.location && (
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    📍 {tournament.location}
                  </span>
                )}
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  🏟 {tournament.clubs?.name ?? 'BTSA'}
                </span>
              </div>
            </div>

            {/* Winner banner */}
            {winner && (
              <div style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, letterSpacing: 3, color: '#F5A623', marginBottom: 4 }}>🏆 WINNAAR</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#F5A623', letterSpacing: 1 }}>{winner}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* LEFT: Wedstrijden */}
        <div>
          {/* Live */}
          {liveMatches.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
              <div style={{ background: '#E2231A', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" />
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 1 }}>LIVE</span>
              </div>
              {liveMatches.map(m => (
                <div key={m.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 15 }}>{m.home_team_name}</span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#E2231A', minWidth: 80, textAlign: 'center' }}>{m.home_score ?? 0}–{m.away_score ?? 0}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{m.away_team_name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Group stage */}
          {groupMatches.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
              <div style={{ background: '#0D1128', padding: '14px 20px' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 1 }}>GROEPSFASE</span>
              </div>
              {groups.map(grp => (
                <div key={grp}>
                  <div style={{ padding: '10px 20px', background: '#F8F9FB', borderBottom: '1px solid #F0F0F0' }}>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: color, letterSpacing: 2 }}>GROEP {grp}</span>
                  </div>
                  {groupMatches.filter(m => m.group_name === grp).map((m, i, arr) => (
                    <div key={m.id} style={{
                      display: 'grid', gridTemplateColumns: '56px 1fr auto 1fr',
                      alignItems: 'center', gap: 8, padding: '12px 20px',
                      borderBottom: i < arr.length - 1 ? '1px solid #F0F0F0' : 'none',
                    }}>
                      <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 11, color: '#9CA3AF' }}>{m.match_time ?? ''}</span>
                      <span style={{ fontWeight: m.is_played && (m.home_score > m.away_score) ? 700 : 400, fontSize: 13, textAlign: 'right' }}>{m.home_team_name}</span>
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: m.is_played ? '#111827' : '#9CA3AF', minWidth: 64, textAlign: 'center' }}>
                        {m.is_played ? `${m.home_score}–${m.away_score}` : 'vs'}
                      </span>
                      <span style={{ fontWeight: m.is_played && (m.away_score > m.home_score) ? 700 : 400, fontSize: 13 }}>{m.away_team_name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Knockout */}
          {koMatches.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ background: '#0D1128', padding: '14px 20px' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 1 }}>KNOCKOUT FASE</span>
              </div>
              {sortedKO.map((m, i) => (
                <div key={m.id} style={{
                  padding: '16px 20px',
                  borderBottom: i < sortedKO.length - 1 ? '1px solid #F0F0F0' : 'none',
                  background: m.round === 'FINAL' ? 'rgba(245,166,35,0.04)' : 'transparent',
                }}>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: m.round === 'FINAL' ? '#F5A623' : color, marginBottom: 8 }}>
                    {m.round === 'FINAL' ? '🏆 ' : ''}{m.round_label ?? m.round} · {m.match_time ?? ''}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: m.is_played && m.home_score > m.away_score ? 700 : 400, fontSize: 15, textAlign: 'right' }}>{m.home_team_name ?? '?'}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: m.is_played ? '#111827' : '#9CA3AF', minWidth: 80, textAlign: 'center' }}>
                      {m.is_played ? `${m.home_score}–${m.away_score}` : 'vs'}
                    </span>
                    <span style={{ fontWeight: m.is_played && m.away_score > m.home_score ? 700 : 400, fontSize: 15 }}>{m.away_team_name ?? '?'}</span>
                  </div>
                  {m.home_score_pen != null && (
                    <div style={{ textAlign: 'center', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                      Penalties: {m.home_score_pen}–{m.away_score_pen}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Standings */}
        <div>
          {standings.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: 24 }}>
              <div style={{ background: color, padding: '14px 20px' }}>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#fff', letterSpacing: 1 }}>STAND</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F9FB' }}>
                    {['#', 'Club', 'G', 'W', 'D', 'V', 'Pts'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1, color: '#9CA3AF', textAlign: h === 'Club' ? 'left' : 'center' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.name} style={{ borderTop: '1px solid #F0F0F0', background: winner === row.name ? 'rgba(245,166,35,0.06)' : 'transparent' }}>
                      <td style={{ padding: '10px', fontFamily: 'Bebas Neue', fontSize: 16, color: i === 0 ? '#F5A623' : '#9CA3AF', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '10px', fontWeight: 600, fontSize: 13 }}>
                        {winner === row.name && <span style={{ marginRight: 4 }}>🏆</span>}
                        {row.name}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: '#6B7280' }}>{row.p}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: '#22C55E', fontWeight: 600 }}>{row.w}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: '#6B7280' }}>{row.d}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: '#E2231A' }}>{row.l}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20, color: color }}>{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Info card */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#111827', letterSpacing: 1, marginBottom: 12 }}>INFO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#9CA3AF', fontFamily: 'Rajdhani', fontWeight: 600 }}>Sport</span>
                <span style={{ fontWeight: 600 }}>{label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#9CA3AF', fontFamily: 'Rajdhani', fontWeight: 600 }}>Datum</span>
                <span style={{ fontWeight: 600 }}>{tournament.start_date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#9CA3AF', fontFamily: 'Rajdhani', fontWeight: 600 }}>Wedstrijden</span>
                <span style={{ fontWeight: 600 }}>{matches.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#9CA3AF', fontFamily: 'Rajdhani', fontWeight: 600 }}>Status</span>
                <span className={`badge badge-${tournament.status === 'ongoing' ? 'green' : tournament.status === 'finished' ? 'gray' : 'blue'}`}>{tournament.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
