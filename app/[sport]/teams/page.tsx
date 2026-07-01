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
const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', cricket: '🏏', volleyball: '🏐', athletics: '🏃',
}

export default function TeamsPage() {
  const { sport } = useParams<{ sport: string }>()
  const [clubs, setClubs] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: c }, { data: m }] = await Promise.all([
        supabase.from('clubs').select('id, name').eq('sport', sport).eq('is_active', true).order('name'),
        supabase.from('club_members').select('id, first_name, last_name, position, jersey_number, club_id').eq('is_active', true),
      ])
      setClubs(c ?? [])
      setMembers(m ?? [])
      setLoading(false)
    }
    load()
  }, [sport])

  const label = sport.charAt(0).toUpperCase() + sport.slice(1)
  const color = SPORT_COLOR[sport] ?? '#A50044'
  const emoji = SPORT_EMOJI[sport] ?? '🏆'

  return (
    <div style={{ minHeight: '100vh', background: '#0D1128', color: '#fff' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#080c1a', borderBottom: `3px solid ${color}`, padding: '0 40px', height: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href={`/${sport}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontFamily: 'Rajdhani', fontWeight: 600 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={22} height={22} style={{ borderRadius: '50%' }} />
          ← {label}
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>CLUBS</span>
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #080c1a 0%, #0D1128 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color, marginBottom: 10 }}>
            {label.toUpperCase()} · BTSA
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 56, lineHeight: 0.9, color: '#fff', margin: 0, letterSpacing: 1 }}>
            {emoji} CLUBS
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani', fontWeight: 500, fontSize: 14, marginTop: 12 }}>
            {clubs.length} clubs actief · klik op een club om de spelerslijst te zien
          </p>
        </div>
      </div>

      {/* Clubs grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani', fontWeight: 600 }}>Laden…</p>
        ) : clubs.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Rajdhani', fontWeight: 600 }}>Nog geen clubs ingeschreven.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {clubs.map((club, idx) => {
              const clubMembers = members.filter(m => m.club_id === club.id)
              const isOpen = expanded === club.id
              return (
                <div key={club.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isOpen ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  {/* Club header row */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : club.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    {/* Number */}
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: isOpen ? color : 'rgba(255,255,255,0.15)', minWidth: 40, transition: 'color 0.2s' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    {/* Club name */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1, color: '#fff' }}>{club.name}</div>
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        {clubMembers.length} spelers
                      </div>
                    </div>
                    {/* Arrow */}
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: isOpen ? color : 'rgba(255,255,255,0.3)', transition: 'all 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</div>
                  </div>

                  {/* Players grid */}
                  {isOpen && (
                    <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, padding: '20px 24px' }}>
                      {clubMembers.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13 }}>Nog geen spelers ingeschreven.</p>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                          {clubMembers.map(m => (
                            <div key={m.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                              {/* Jersey number */}
                              <div style={{ background: color, borderRadius: 4, minWidth: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', fontSize: 15, color: '#fff', flexShrink: 0 }}>
                                {m.jersey_number ?? '—'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', lineHeight: 1.2 }}>
                                  {m.first_name} {m.last_name}
                                </div>
                                {m.position && (
                                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, marginTop: 2 }}>
                                    {m.position}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
