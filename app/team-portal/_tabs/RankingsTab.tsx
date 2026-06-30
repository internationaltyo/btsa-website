'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount } from '@/lib/types'

export default function RankingsTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('country_team_rankings')
      .select('*')
      .eq('sport', club.sport)
      .eq('country_id', account.country_id ?? '')
      .order('country_rank', { ascending: true })
      .then(({ data }) => { setRows(data ?? []); setLoading(false) })
  }, [club.sport, account.country_id])

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 24 }}>RANKINGS — {club.sport.toUpperCase()}</h2>
      {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : rows.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Nog geen rankings beschikbaar.</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>#</th><th>Team</th><th>Club</th>
                <th style={{ textAlign: 'center' }}>G</th>
                <th style={{ textAlign: 'center' }}>W</th>
                <th style={{ textAlign: 'center' }}>D</th>
                <th style={{ textAlign: 'center' }}>V</th>
                <th style={{ textAlign: 'center' }}>+/-</th>
                <th style={{ textAlign: 'center' }}>Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ background: r.club_name === club.name ? 'rgba(0,194,255,0.05)' : undefined }}>
                  <td style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: i < 3 ? 'var(--yellow)' : 'var(--muted)' }}>{r.country_rank ?? i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{r.team_name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{r.club_name}</td>
                  <td style={{ textAlign: 'center' }}>{r.played}</td>
                  <td style={{ textAlign: 'center', color: 'var(--green)' }}>{r.won}</td>
                  <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{r.drawn}</td>
                  <td style={{ textAlign: 'center', color: 'var(--red)' }}>{r.lost}</td>
                  <td style={{ textAlign: 'center', color: r.goal_diff > 0 ? 'var(--green)' : r.goal_diff < 0 ? 'var(--red)' : 'var(--muted)' }}>{r.goal_diff > 0 ? '+' : ''}{r.goal_diff}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--accent)' }}>{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
