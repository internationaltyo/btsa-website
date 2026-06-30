'use client'
export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TeamsPage() {
  const { sport } = useParams<{ sport: string }>()
  const [clubs, setClubs] = useState<{ id: string; name: string; club_teams: { id: string; name: string; category: string | null }[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('clubs')
      .select('id, name, club_teams(id, name, category)')
      .eq('sport', sport)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => { setClubs(data as any ?? []); setLoading(false) })
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
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 18 }}>Teams</span>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px' }}>
        <h1 style={{ fontSize: 44, marginBottom: 32 }}>CLUBS & TEAMS</h1>
        {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : clubs.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Nog geen clubs ingeschreven.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {clubs.map(club => (
              <div key={club.id} className="card">
                <h3 style={{ fontSize: 22, marginBottom: 12 }}>{club.name}</h3>
                {club.club_teams?.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {club.club_teams.map(t => (
                      <span key={t.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 12px', fontSize: 13 }}>
                        {t.name} {t.category ? <span style={{ color: 'var(--muted)', fontSize: 11 }}>({t.category})</span> : null}
                      </span>
                    ))}
                  </div>
                ) : <p style={{ color: 'var(--muted)', fontSize: 13 }}>Geen teams</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
