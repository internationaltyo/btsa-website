'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'

const sports = [
  { slug: 'football',   emoji: '⚽', label: 'Football',   color: '#00C2FF' },
  { slug: 'cricket',    emoji: '🏏', label: 'Cricket',    color: '#00FF87' },
  { slug: 'volleyball', emoji: '🏐', label: 'Volleyball', color: '#7B2FFF' },
  { slug: 'athletics',  emoji: '🏃', label: 'Athletics',  color: '#FFD60A' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
      }}>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 24, letterSpacing: 2, color: 'var(--accent)' }}>
          BTSA
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/team-login" style={{ color: 'var(--muted)', fontSize: 13 }}>Team Portal</Link>
          <Link href="/admin" style={{ color: 'var(--muted)', fontSize: 13 }}>Admin</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '80px 40px 40px',
        background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)',
      }}>
        <h1 style={{ fontSize: 64, color: 'var(--text)', marginBottom: 12 }}>
          BELGIUM TAMIL SPORTS ASSOCIATION
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
          Officieel platform voor Football, Cricket, Volleyball & Athletics in België
        </p>
      </div>

      {/* Sport cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 24, padding: '40px', maxWidth: 1100, margin: '0 auto', width: '100%',
      }}>
        {sports.map(s => (
          <Link key={s.slug} href={`/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 32, textAlign: 'center',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = s.color
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>{s.emoji}</div>
              <h2 style={{ color: s.color, fontSize: 32, marginBottom: 8 }}>{s.label}</h2>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                {['Teams', 'Matches', 'Rankings'].map(l => (
                  <span key={l} style={{
                    fontSize: 11, color: 'var(--muted)',
                    fontFamily: 'Rajdhani', fontWeight: 600, textTransform: 'uppercase',
                    background: 'var(--bg3)', padding: '3px 8px', borderRadius: 4,
                  }}>{l}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: 12 }}>
        © 2025 Belgium Tamil Sports Association
      </div>
    </div>
  )
}
