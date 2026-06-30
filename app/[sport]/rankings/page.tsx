'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RankingsPage() {
  const { sport } = useParams<{ sport: string }>()
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('global_team_rankings')
      .select('*')
      .eq('sport', sport)
      .order('global_rank', { ascending: true })
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [sport])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 40px', borderBottom: '3px solid var(--accent)', background: 'var(--bg2)' }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={28} height={28} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18 }}>Rankings</span>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: 44, marginBottom: 32 }}>RANKINGS — {label.toUpperCase()}</h1>
        {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : rows.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Nog geen rankings beschikbaar.</p>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Club</th>
                  <th style={{ textAlign: 'center' }}>G</th>
                  <th style={{ textAlign: 'center' }}>W</th>
                  <th style={{ textAlign: 'center' }}>D</th>
                  <th style={{ textAlign: 'center' }}>V</th>
                  <th style={{ textAlign: 'center' }}>GV</th>
                  <th style={{ textAlign: 'center' }}>GT</th>
                  <th style={{ textAlign: 'center' }}>+/-</th>
                  <th style={{ textAlign: 'center' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: i < 3 ? 'var(--yellow)' : 'var(--muted)' }}>{r.global_rank ?? i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.team_name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{r.club_name}</td>
                    <td style={{ textAlign: 'center' }}>{r.played}</td>
                    <td style={{ textAlign: 'center', color: 'var(--green)' }}>{r.won}</td>
                    <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{r.drawn}</td>
                    <td style={{ textAlign: 'center', color: 'var(--red)' }}>{r.lost}</td>
                    <td style={{ textAlign: 'center' }}>{r.goals_for}</td>
                    <td style={{ textAlign: 'center' }}>{r.goals_against}</td>
                    <td style={{ textAlign: 'center', color: r.goal_diff > 0 ? 'var(--green)' : r.goal_diff < 0 ? 'var(--red)' : 'var(--muted)' }}>{r.goal_diff > 0 ? '+' : ''}{r.goal_diff}</td>
                    <td style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--accent)' }}>{r.points}</td>
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
