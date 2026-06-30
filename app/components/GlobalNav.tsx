'use client'

import Link from 'next/link'

export default function GlobalNav() {
  return (
    <>
      {/* ── TOP BAR ── */}
      <div style={{ background: '#080c1a', padding: '0 32px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 200 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13 }}>
          <span style={{ color: '#ccc' }}>BELGIUM TAMIL SPORTS ASSOCIATION</span>
          <span style={{ color: '#333', margin: '0 4px' }}>·</span>
          <span style={{ color: '#F5A623' }}>VOETBAL · CRICKET · VOLLEYBALL · ATLETIEK</span>
        </div>
        <div style={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <Link href="/team-login" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#ccc', textDecoration: 'none', padding: '6px 14px' }}>
            <span>👤</span> Inloggen
          </Link>
          <Link href="/team-login" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#E2231A', color: '#fff', padding: '7px 18px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', borderRadius: 4 }}>
              Team Portaal
            </button>
          </Link>
        </div>
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav style={{ background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', height: 72, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
          <img src="/btsa-logo.png" alt="BTSA" width={52} height={52} style={{ borderRadius: '50%' }} />
        </Link>
        <div style={{ display: 'flex', flex: 1, gap: 0 }}>
          {[
            { label: 'VOETBAL',    href: '/football' },
            { label: 'CRICKET',    href: '/cricket' },
            { label: 'VOLLEYBALL', href: '/volleyball' },
            { label: 'ATLETIEK',   href: '/athletics' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 1,
              color: '#111', padding: '0 18px', height: 72, display: 'flex', alignItems: 'center',
              textDecoration: 'none', borderBottom: '3px solid transparent', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { const a = e.currentTarget; a.style.color = '#A50044'; a.style.borderBottomColor = '#A50044' }}
              onMouseLeave={e => { const a = e.currentTarget; a.style.color = '#111'; a.style.borderBottomColor = 'transparent' }}
            >{l.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[
            { label: 'RANGLIJST', href: '/rankings' },
            { label: 'CLUBS',     href: '/football/teams' },
            { label: 'ADMIN',     href: '/admin' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 1,
              color: '#111', padding: '0 18px', height: 72, display: 'flex', alignItems: 'center',
              textDecoration: 'none', borderBottom: '3px solid transparent', transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { const a = e.currentTarget; a.style.color = '#A50044'; a.style.borderBottomColor = '#A50044' }}
              onMouseLeave={e => { const a = e.currentTarget; a.style.color = '#111'; a.style.borderBottomColor = 'transparent' }}
            >{l.label}</a>
          ))}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 16px', height: 72, display: 'flex', alignItems: 'center', color: '#111', fontSize: 20 }}>🔍</button>
        </div>
      </nav>
    </>
  )
}
