'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const sports = [
  { slug: 'football',   label: 'Football',   sub: 'Competitie & Bekers' },
  { slug: 'cricket',    label: 'Cricket',     sub: 'T20 & ODI Formaat' },
  { slug: 'volleyball', label: 'Volleyball',  sub: 'Indoor & Zaal' },
  { slug: 'athletics',  label: 'Athletics',   sub: 'Registratie Open' },
]

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<any[]>([])
  const [rankings, setRankings] = useState<any[]>([])

  useEffect(() => {
    supabase.from('tournament_matches').select('*').order('match_date', { ascending: false }).limit(6).then(({ data }) => setRecentMatches(data ?? []))
    supabase.from('global_team_rankings').select('*').order('global_rank', { ascending: true }).limit(5).then(({ data }) => setRankings(data ?? []))
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Top utility bar */}
      <div style={{ background: 'var(--accent)', padding: '5px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: '#000' }}>
          OFFICIEEL PLATFORM — BELGIUM TAMIL SPORTS ASSOCIATION
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/team-login" style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1, color: '#000' }}>TEAM PORTAL</Link>
          <Link href="/admin" style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1, color: '#000' }}>ADMIN</Link>
        </div>
      </div>

      {/* Main navbar */}
      <nav style={{ background: '#000', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={44} height={44} style={{ borderRadius: '50%' }} />
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 14 }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#fff', letterSpacing: 3, lineHeight: 1 }}>BTSA</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5, fontFamily: 'Rajdhani', fontWeight: 600 }}>BELGIUM TAMIL SPORTS</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 0 }}>
          {sports.map((s, i) => (
            <Link key={s.slug} href={`/${s.slug}`} style={{
              color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13,
              letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 20px',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              textDecoration: 'none',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)'}
            >{s.label}</Link>
          ))}
        </div>
      </nav>

      {/* Hero — editorial split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 500, borderBottom: '1px solid var(--border)' }}>
        {/* Left: big text */}
        <div style={{
          background: 'var(--bg)',
          padding: '64px 64px 64px 40px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          borderRight: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 20 }}>
              EST. 2024 — BELGIË
            </div>
            <h1 style={{
              fontSize: 'clamp(52px, 6vw, 88px)',
              lineHeight: 0.95,
              letterSpacing: -1,
              fontFamily: 'Bebas Neue',
              marginBottom: 28,
            }}>
              DE TEMPEL VAN<br />
              <span style={{ color: 'var(--accent)' }}>TAMIL</span><br />
              SPORT
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 440, fontFamily: 'Exo 2', fontWeight: 300 }}>
              Competities, uitslagen, transfers en live scores voor alle Tamil sportclubs in België. Football, Cricket, Volleyball en Athletics op één platform.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 0, marginTop: 40 }}>
            <Link href="/football" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'var(--accent)', color: '#000', padding: '13px 28px',
                fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, border: 'none', cursor: 'pointer',
              }}>BEKIJK COMPETITIES</button>
            </Link>
            <Link href="/team-login" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: 'var(--text)', padding: '13px 28px',
                fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2,
                border: '1px solid var(--border)', cursor: 'pointer', marginLeft: -1,
              }}>TEAM LOGIN</button>
            </Link>
          </div>
        </div>

        {/* Right: logo + stat strip */}
        <div style={{ background: '#0D0D0D', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <Image src="/btsa-logo.png" alt="BTSA" width={260} height={260} style={{
              borderRadius: '50%',
              filter: 'drop-shadow(0 0 40px rgba(245,166,35,0.3))',
            }} />
          </div>
          <div style={{ borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {[['4', 'SPORTEN'], ['—', 'CLUBS'], ['—', 'SPELERS'], ['—', 'WEDSTRIJDEN']].map(([num, label]) => (
              <div key={label} style={{ padding: '18px 20px', borderRight: label === 'SPORTEN' || label === 'CLUBS' ? '1px solid var(--border)' : 'none', borderBottom: label === 'SPORTEN' || label === 'CLUBS' ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--accent)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live scores strip */}
      {recentMatches.length > 0 && (
        <div style={{ background: '#111', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'stretch', overflowX: 'auto' }}>
          <div style={{ background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, fontFamily: 'Bebas Neue', fontSize: 13, letterSpacing: 2 }}>
            SCORES
          </div>
          {recentMatches.map((m, i) => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
              borderLeft: '1px solid var(--border)', flexShrink: 0, minWidth: 220,
              borderRight: i === recentMatches.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {m.is_live && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', flexShrink: 0, animation: 'pulse 1s infinite' }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{m.home_team_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{m.away_team_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, lineHeight: 1, color: m.is_live ? 'var(--accent)' : 'var(--text)' }}>
                  {m.is_played ? `${m.home_score}-${m.away_score}` : 'vs'}
                </div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 9, letterSpacing: 1, color: m.is_live ? 'var(--red)' : 'var(--muted)' }}>
                  {m.is_live ? 'LIVE' : m.is_played ? 'FT' : m.match_date ?? 'TBD'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sports section — numbered list style */}
      <div style={{ padding: '72px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 42, letterSpacing: 1 }}>ONZE SPORTEN</h2>
          <div style={{ flex: 1, height: 1, background: 'var(--border)', marginBottom: 6 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 1, background: 'var(--border)' }}>
          {/* Big featured card: football */}
          <Link href="/football" style={{ textDecoration: 'none', gridRow: '1 / 3' }}>
            <div style={{
              background: 'var(--bg2)', padding: '48px 40px', height: '100%',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#181818'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'}
            >
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--muted)', marginBottom: 16 }}>01</div>
                <div style={{ fontSize: 72, marginBottom: 16 }}>⚽</div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 56, letterSpacing: 1, lineHeight: 0.95, marginBottom: 12 }}>FOOT<br />BALL</h3>
                <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Exo 2', fontWeight: 300, lineHeight: 1.6 }}>
                  Competities, bekertoernooien en uitgebreide spelersstatistieken. Goals, assists en kaarten bijgehouden per wedstrijd.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 32, color: 'var(--accent)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>
                BEKIJK FOOTBALL <span style={{ fontSize: 16 }}>→</span>
              </div>
            </div>
          </Link>

          {/* Cricket */}
          <Link href="/cricket" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg2)', padding: '32px 28px',
              cursor: 'pointer', transition: 'background 0.2s', height: '100%',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#181818'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'}
            >
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--muted)', marginBottom: 10 }}>02</div>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏏</div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 1 }}>CRICKET</h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'Exo 2', marginTop: 8, lineHeight: 1.6 }}>T20 & ODI · Live ball-by-ball scoring</p>
            </div>
          </Link>

          {/* Volleyball */}
          <Link href="/volleyball" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg2)', padding: '32px 28px',
              cursor: 'pointer', transition: 'background 0.2s', height: '100%',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#181818'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)'}
            >
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--muted)', marginBottom: 10 }}>03</div>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🏐</div>
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 1 }}>VOLLEYBALL</h3>
              <p style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'Exo 2', marginTop: 8, lineHeight: 1.6 }}>Indoor competitie · Set-score systeem</p>
            </div>
          </Link>

          {/* Athletics — spans 2 cols */}
          <Link href="/athletics" style={{ textDecoration: 'none', gridColumn: '2 / 4' }}>
            <div style={{
              background: '#111', padding: '28px',
              cursor: 'pointer', transition: 'background 0.2s', height: '100%',
              display: 'flex', alignItems: 'center', gap: 24,
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#181818'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#111'}
            >
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--muted)', marginBottom: 6 }}>04</div>
                <div style={{ fontSize: 28 }}>🏃</div>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 1 }}>ATHLETICS</h3>
                <p style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'Exo 2', marginTop: 4 }}>Registratie open — schrijf je club in</p>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--accent)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>→</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Rankings section */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 220 }}>
          {/* Label column */}
          <div style={{ padding: '40px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 10 }}>GLOBAAL</div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 38, lineHeight: 0.95 }}>TEAM<br />RANKINGS</h2>
            </div>
            <Link href="/football/rankings" style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: 'var(--muted)', textDecoration: 'none' }}>
              ALLE RANKINGS →
            </Link>
          </div>
          {/* Rankings */}
          <div style={{ padding: '40px 48px' }}>
            {rankings.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13, paddingTop: 20 }}>Rankings worden gepubliceerd zodra toernooien zijn afgelopen.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {rankings.map((r, i) => (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 20,
                    padding: '14px 0', borderBottom: i < rankings.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{
                      fontFamily: 'Bebas Neue', fontSize: 32, lineHeight: 1, minWidth: 40,
                      color: i === 0 ? 'var(--accent)' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted)',
                    }}>{i + 1}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{r.team_name}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'var(--accent)' }}>{r.points} <span style={{ fontSize: 12, fontFamily: 'Rajdhani', color: 'var(--muted)' }}>PTS</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', background: '#000', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={28} height={28} style={{ borderRadius: '50%', opacity: 0.6 }} />
          <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'var(--muted)' }}>© 2026 Belgium Tamil Sports Association</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {sports.map(s => (
            <Link key={s.slug} href={`/${s.slug}`} style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
