'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function MatchesPage() {
  const { sport } = useParams<{ sport: string }>()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tournament_matches')
      .select('*, tournaments(name)')
      .eq('sport', sport)
      .order('match_date', { ascending: false })
      .limit(50)
      .then(({ data }) => { setMatches(data ?? []); setLoading(false) })
  }, [sport])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)

  const scoreDisplay = (m: any) => {
    if (!m.is_played) return 'vs'
    if (m.home_score_pen != null) return `${m.home_score} - ${m.away_score} (pen ${m.home_score_pen}-${m.away_score_pen})`
    return `${m.home_score} - ${m.away_score}`
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 40px', borderBottom: '3px solid var(--accent)', background: 'var(--bg2)' }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={28} height={28} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18 }}>Wedstrijden</span>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: 44, marginBottom: 32 }}>WEDSTRIJDEN</h1>
        {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : matches.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Geen wedstrijden gevonden.</p>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Toernooi</th>
                  <th>Ronde</th>
                  <th style={{ textAlign: 'center' }}>Thuis</th>
                  <th style={{ textAlign: 'center' }}>Score</th>
                  <th style={{ textAlign: 'center' }}>Uit</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m.id}>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{m.match_date ?? '—'}</td>
                    <td style={{ fontSize: 12 }}>{(m.tournaments as any)?.name ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{m.round_label ?? m.round}</td>
                    <td style={{ textAlign: 'center' }}>{m.home_team_name}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20 }}>{scoreDisplay(m)}</td>
                    <td style={{ textAlign: 'center' }}>{m.away_team_name}</td>
                    <td>
                      {m.is_live ? <span className="badge badge-red">LIVE</span>
                        : m.is_played ? <span className="badge badge-gray">Gespeeld</span>
                        : <span className="badge badge-blue">Gepland</span>}
                    </td>
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
