'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LEFT = [
  { label: 'VOETBAL',    href: '/football' },
  { label: 'CRICKET',    href: '/cricket' },
  { label: 'VOLLEYBALL', href: '/volleyball' },
  { label: 'ATLETIEK',   href: '/athletics' },
]
const NAV_RIGHT = [
  { label: 'KALENDER',    href: '/calendar' },
  { label: 'RANGLIJST',   href: '/rankings' },
  { label: 'ORGANISATIE', href: '/organisatie' },
  { label: 'CLUBS',       href: '/football/teams' },
  { label: 'ADMIN',       href: '/admin' },
]
const ALL_LINKS = [...NAV_LEFT, ...NAV_RIGHT]

export default function GlobalNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* ── DESKTOP NAV (hidden on mobile via CSS) ── */}
      <div className="nav-desktop" style={{ flexDirection: 'column' }}>
        {/* Top bar */}
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

        {/* Main nav */}
        <nav style={{ background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', height: 72, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
            <img src="/btsa-logo.png" alt="BTSA" width={52} height={52} style={{ borderRadius: '50%' }} />
          </Link>
          <div style={{ display: 'flex', flex: 1, gap: 0 }}>
            {NAV_LEFT.map(l => (
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
            {NAV_RIGHT.map(l => (
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
        </nav>
      </div>

      {/* ── MOBILE NAV (hidden on desktop via CSS) ── */}
      <div className="nav-mobile" style={{ flexDirection: 'column', position: 'sticky', top: 0, zIndex: 200 }}>
        {/* Mobile bar */}
        <div style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <img src="/btsa-logo.png" alt="BTSA" width={40} height={40} style={{ borderRadius: '50%' }} />
          </Link>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: 2, color: '#A50044' }}>BTSA</span>
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: 24, height: 2, background: '#111', transition: 'transform 0.2s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#111', transition: 'opacity 0.2s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#111', transition: 'transform 0.2s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Dropdown */}
        {open && (
          <div style={{ position: 'fixed', top: 60, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 199, overflowY: 'auto' }}>
            {ALL_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '16px 24px',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: 1,
                color: '#111', textDecoration: 'none', borderBottom: '1px solid #f0f0f0',
              }}>
                {l.label}
              </Link>
            ))}
            <div style={{ padding: '20px 24px' }}>
              <Link href="/team-login" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
                <button style={{ width: '100%', background: '#A50044', color: '#fff', padding: '14px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: 1, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                  TEAM PORTAAL
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
