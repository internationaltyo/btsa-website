'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TournamentPublicPage() {
  const { sport, id } = useParams<{ sport: string; id: string }>()
  const [tournament, setTournament] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: t }, { data: m }, { data: g }] = await Promise.all([
        supabase.from('tournaments').select('*, clubs!organizer_club_id(name)').eq('id', id).single(),
        supabase.from('tournament_matches').select('*').eq('tournament_id', id).order('sort_order'),
        supabase.from('tournament_groups').select('*').eq('tournament_id', id),
      ])
      setTournament(t)
      setMatches(m ?? [])
      setGroups(g ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)

  if (loading) return <div style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Laden…</p></div>
  if (!tournament) return <div style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Toernooi niet gevonden.</p></div>

  const groupMatches = matches.filter(m => m.round === 'group')
  const koMatches = matches.filter(m => m.round !== 'group')
  const liveMatches = matches.filter(m => m.is_live)

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 40px', borderBottom: '3px solid var(--accent)', background: 'var(--bg2)' }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={28} height={28} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18 }}>{tournament.name}</span>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 52 }}>{tournament.name}</h1>
          <div style={{ color: 'var(--muted)', marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
            <span>📅 {tournament.start_date}{tournament.end_date ? ` → ${tournament.end_date}` : ''}</span>
            {tournament.location && <span>📍 {tournament.location}</span>}
            <span>🏟 Organizer: {tournament.clubs?.name ?? 'BTSA'}</span>
          </div>
          <span className={`badge badge-${tournament.status === 'ongoing' ? 'green' : tournament.status === 'finished' ? 'gray' : 'blue'}`} style={{ marginTop: 8 }}>{tournament.status}</span>
        </div>

        {/* Live matches */}
        {liveMatches.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="live-dot" />
              <h3 style={{ fontSize: 20, color: 'var(--red)' }}>LIVE</h3>
            </div>
            {liveMatches.map(m => (
              <div key={m.id} style={{ padding: '16px 20px', background: 'rgba(255,61,113,0.05)', border: '1px solid rgba(255,61,113,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>{m.home_team_name}</span>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: 36, color: 'var(--red)', minWidth: 80, textAlign: 'center' }}>{m.home_score ?? 0} - {m.away_score ?? 0}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{m.away_team_name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Group stage */}
        {groups.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 26, marginBottom: 16 }}>GROEPSFASE</h3>
            {groups.map(g => {
              const gm = groupMatches.filter(m => m.group_name === g.name)
              return (
                <div key={g.id} style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--accent)', marginBottom: 8 }}>GROEP {g.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {gm.map(m => (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                        {m.is_live && <span className="live-dot" />}
                        <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 40 }}>{m.match_time ?? ''}</span>
                        <span style={{ flex: 1, textAlign: 'right', fontSize: 13 }}>{m.home_team_name}</span>
                        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, minWidth: 60, textAlign: 'center', color: m.is_played ? 'var(--text)' : 'var(--muted)' }}>
                          {m.is_played ? `${m.home_score} - ${m.away_score}` : 'vs'}
                        </span>
                        <span style={{ flex: 1, fontSize: 13 }}>{m.away_team_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Knockout */}
        {koMatches.length > 0 && (
          <div>
            <h3 style={{ fontSize: 26, marginBottom: 16 }}>KNOCKOUT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {koMatches.map(m => (
                <div key={m.id} style={{ padding: '12px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 6 }}>{m.round_label ?? m.round}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {m.is_live && <span className="live-dot" />}
                    <span style={{ flex: 1, textAlign: 'right' }}>{m.home_team_name ?? '?'}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 24, minWidth: 80, textAlign: 'center', color: m.is_played ? 'var(--text)' : 'var(--muted)' }}>
                      {m.is_played ? `${m.home_score} - ${m.away_score}` : 'vs'}
                    </span>
                    <span style={{ flex: 1 }}>{m.away_team_name ?? '?'}</span>
                    {m.is_played && m.home_score_pen != null && (
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>(pen {m.home_score_pen}-{m.away_score_pen})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
