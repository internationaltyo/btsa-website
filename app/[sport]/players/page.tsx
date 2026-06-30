'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PlayersPage() {
  const { sport } = useParams<{ sport: string }>()
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('club_members')
      .select('id, first_name, last_name, position, jersey_number, career_played, career_goals, clubs(name, sport)')
      .eq('is_active', true)
      .then(({ data }) => {
        const filtered = (data ?? []).filter((p: any) => p.clubs?.sport === sport)
        setPlayers(filtered)
        setLoading(false)
      })
  }, [sport])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)
  const visible = players.filter(p =>
    search === '' ||
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 40px', borderBottom: '3px solid var(--accent)', background: 'var(--bg2)' }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: 13 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={28} height={28} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18 }}>Spelers</span>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 44 }}>SPELERS</h1>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Zoek speler…"
            style={{ width: 220 }}
          />
        </div>
        {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : visible.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Geen spelers gevonden.</p>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Naam</th>
                  <th>Club</th>
                  <th>Positie</th>
                  <th style={{ textAlign: 'center' }}>Gespeeld</th>
                  <th style={{ textAlign: 'center' }}>Goals</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--muted)', fontFamily: 'Bebas Neue', fontSize: 16 }}>{p.jersey_number ?? '—'}</td>
                    <td style={{ fontWeight: 600 }}>{p.first_name} {p.last_name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{(p.clubs as any)?.name ?? '—'}</td>
                    <td style={{ fontSize: 12 }}>{p.position ?? '—'}</td>
                    <td style={{ textAlign: 'center' }}>{p.career_played}</td>
                    <td style={{ textAlign: 'center' }}>{p.career_goals}</td>
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
