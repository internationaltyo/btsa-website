'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const sports = [
  { slug: 'football',   emoji: '⚽', label: 'Football' },
  { slug: 'cricket',    emoji: '🏏', label: 'Cricket' },
  { slug: 'volleyball', emoji: '🏐', label: 'Volleyball' },
  { slug: 'athletics',  emoji: '🏃', label: 'Athletics' },
]

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<any[]>([])
  const [rankings, setRankings] = useState<any[]>([])

  useEffect(() => {
    supabase.from('tournament_matches').select('*').order('match_date', { ascending: false }).limit(6).then(({ data }) => setRecentMatches(data ?? []))
    supabase.from('global_team_rankings').select('*').order('global_rank', { ascending: true }).limit(5).then(({ data }) => setRankings(data ?? []))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ background: '#000', borderBottom: '1px solid var(--border)', padding: '6px 40px', display: 'flex', justifyContent: 'flex-end', gap: 20, fontSize: 12 }}>
        <Link href="/team-login" style={{ color: 'var(--muted)' }}>Team Login</Link>
        <Link href="/admin" style={{ color: 'var(--muted)' }}>Admin</Link>
      </div>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 40px', background: 'var(--bg2)', borderBottom: '3px solid var(--accent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={52} height={52} style={{ borderRadius: '50%' }} />
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 2, color: 'var(--accent)', lineHeight: 1 }}>BTSA</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>BELGIUM TAMIL SPORTS ASSOCIATION</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {sports.map(s => (
            <Link key={s.slug} href={`/${s.slug}`} style={{ color: 'var(--text)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
              {s.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1C1408 60%, #0A0A0A 100%)',
        padding: '80px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40,
      }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ color: 'var(--accent)', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>WE ARE</div>
          <h1 style={{ fontSize: 64, lineHeight: 1.05, marginBottom: 16 }}>
            BUILDING THE <span style={{ color: 'var(--accent)' }}>TAMIL SPORTS</span> COMMUNITY
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28, maxWidth: 480 }}>
            Officieel platform van de Belgium Tamil Sports Association — Football, Cricket, Volleyball &amp; Athletics onder één dak.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/football" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 28px', fontSize: 14 }}>BEKIJK SPORTEN →</button>
            </Link>
            <Link href="/team-login" style={{ textDecoration: 'none' }}>
              <button className="btn-ghost" style={{ padding: '14px 28px', fontSize: 14 }}>TEAM PORTAL</button>
            </Link>
          </div>
        </div>
        <Image src="/btsa-logo.png" alt="BTSA Logo" width={340} height={340} style={{ borderRadius: '50%', boxShadow: '0 0 80px rgba(245,166,35,0.25)', flexShrink: 0 }} />
      </div>

      {/* Match ticker */}
      {recentMatches.length > 0 && (
        <div style={{ background: '#000', borderBottom: '1px solid var(--border)', padding: '20px 40px', display: 'flex', gap: 16, overflowX: 'auto' }}>
          {recentMatches.map(m => (
            <div key={m.id} style={{ minWidth: 200, flexShrink: 0, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{m.match_date ?? 'TBD'}</div>
              <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                <span>{m.home_team_name}</span><span>{m.is_played ? m.home_score : ''}</span>
              </div>
              <div style={{ padding: '0 12px 8px', display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                <span>{m.away_team_name}</span><span>{m.is_played ? m.away_score : ''}</span>
              </div>
              <div style={{
                background: 'var(--accent)', color: '#000', textAlign: 'center', padding: '6px',
                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1,
                clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
              }}>
                {m.is_live ? 'LIVE' : m.is_played ? 'GESPEELD' : 'GEPLAND'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sport cards */}
      <div style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>ONZE SPORTEN</h2>
        <div style={{ width: 60, height: 3, background: 'var(--accent)', margin: '0 auto 40px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {sports.map(s => (
            <Link key={s.slug} href={`/${s.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)', padding: 32, textAlign: 'center',
                transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>{s.emoji}</div>
                <h3 style={{ color: 'var(--accent)', fontSize: 26 }}>{s.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured News + Rankings */}
      <div style={{ padding: '0 40px 60px', maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <div style={{
            background: 'var(--bg2)', padding: '14px 20px', fontFamily: 'Bebas Neue', fontSize: 20,
            letterSpacing: 1, clipPath: 'polygon(0 0, 96% 0, 100% 100%, 0 100%)',
          }}>FEATURED NEWS</div>
          <div className="card" style={{ borderTop: 'none', borderRadius: 0 }}>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nieuws en updates verschijnen hier zodra toernooien starten.</p>
          </div>
        </div>
        <div>
          <div style={{
            background: 'var(--bg2)', padding: '14px 20px', fontFamily: 'Bebas Neue', fontSize: 20,
            letterSpacing: 1, clipPath: 'polygon(0 0, 96% 0, 100% 100%, 0 100%)',
          }}>TEAM RANKINGS</div>
          <div className="card" style={{ borderTop: 'none', borderRadius: 0, padding: 0 }}>
            {rankings.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13, padding: 20 }}>Nog geen rankings beschikbaar.</p>
            ) : (
              <table>
                <tbody>
                  {rankings.map((r, i) => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: i < 3 ? 'var(--accent)' : 'var(--muted)', width: 30 }}>{r.global_rank ?? i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.team_name}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--accent)' }}>{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', background: '#000', borderTop: '3px solid var(--accent)', textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: 12 }}>
        © 2026 Belgium Tamil Sports Association
      </div>
    </div>
  )
}
