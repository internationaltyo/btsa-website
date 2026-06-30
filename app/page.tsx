'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const sports = [
  { slug: 'football',   label: 'Football',   emoji: '⚽' },
  { slug: 'cricket',    label: 'Cricket',     emoji: '🏏' },
  { slug: 'volleyball', label: 'Volleyball',  emoji: '🏐' },
  { slug: 'athletics',  label: 'Athletics',   emoji: '🏃' },
]

const navLinks = [
  { label: 'Football',   href: '/football' },
  { label: 'Cricket',    href: '/cricket' },
  { label: 'Volleyball', href: '/volleyball' },
  { label: 'Athletics',  href: '/athletics' },
  { label: 'Rankings',   href: '/football/rankings' },
]

export default function HomePage() {
  const [matches, setMatches] = useState<any[]>([])
  const [tournaments, setTournaments] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement>(null)

  const scrollPhotos = useCallback((dir: 'left' | 'right') => {
    if (photosRef.current) {
      photosRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    supabase.from('tournament_matches').select('*').order('match_date', { ascending: false }).limit(8).then(({ data }) => setMatches(data ?? []))
    supabase.from('tournaments').select('*, clubs!organizer_club_id(name)').eq('is_published', true).order('start_date', { ascending: false }).limit(8).then(({ data }) => setTournaments(data ?? []))
    supabase.from('clubs').select('id,name,sport').eq('is_active', true).order('name').limit(12).then(({ data }) => setClubs(data ?? []))
  }, [])

  const liveMatches = matches.filter(m => m.is_live)
  const recentMatches = matches.filter(m => m.is_played)
  const upcomingMatches = matches.filter(m => !m.is_played && !m.is_live)

  const sportColor: Record<string, string> = {
    football: '#E2231A', cricket: '#F5A623', volleyball: '#4CD964', athletics: '#00BFFF',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: '#F2F2F0', fontFamily: 'Exo 2, sans-serif' }}>

      {/* ── TOP BAR (Barcelona-stijl: gecentreerde tekst + rechts login/knop) ── */}
      <div style={{ background: '#080c1a', padding: '0 32px', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: leeg voor balans */}
        <div style={{ width: 200 }} />
        {/* Center: platform info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, letterSpacing: 0.5 }}>
          <span style={{ color: '#ccc' }}>BELGIUM TAMIL SPORTS ASSOCIATION</span>
          <span style={{ color: '#333', margin: '0 4px' }}>·</span>
          <span style={{ color: 'var(--accent)' }}>FOOTBALL · CRICKET · VOLLEYBALL · ATHLETICS</span>
        </div>
        {/* Right: login + knop */}
        <div style={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          <Link href="/team-login" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: '#ccc', textDecoration: 'none', padding: '6px 14px' }}>
            <span style={{ fontSize: 15 }}>👤</span> Login
          </Link>
          <Link href="/team-login" style={{ textDecoration: 'none' }}>
            <button style={{ background: 'var(--red)', color: '#fff', padding: '7px 18px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, letterSpacing: 0.5, border: 'none', cursor: 'pointer', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Image src="/btsa-logo.png" alt="" width={16} height={16} style={{ borderRadius: '50%' }} />
              Team Portal
            </button>
          </Link>
        </div>
      </div>

      {/* ── MAIN NAVBAR (Barcelona-stijl: wit/licht, logo links, links gesplitst) ── */}
      <nav style={{ background: '#fff', padding: '0 32px', display: 'flex', alignItems: 'center', height: 72, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginRight: 32, flexShrink: 0 }}>
          <Image src="/btsa-logo.png" alt="BTSA" width={52} height={52} style={{ borderRadius: '50%' }} />
        </Link>

        {/* Links: sport navigatie */}
        <div style={{ display: 'flex', flex: 1, gap: 0 }}>
          {[
            { label: 'FOOTBALL',   href: '/football' },
            { label: 'CRICKET',    href: '/cricket' },
            { label: 'VOLLEYBALL', href: '/volleyball' },
            { label: 'ATHLETICS',  href: '/athletics' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 1,
              color: '#111', padding: '0 18px', height: 72, display: 'flex', alignItems: 'center',
              textDecoration: 'none', borderBottom: '3px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#A50044'; a.style.borderBottomColor = '#A50044' }}
              onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#111'; a.style.borderBottomColor = 'transparent' }}
            >{l.label}</Link>
          ))}
        </div>

        {/* Rechts: extra links + zoek */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[
            { label: 'RANKINGS', href: '/football/rankings' },
            { label: 'CLUBS',    href: '/football/teams' },
            { label: 'ADMIN',    href: '/admin' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 1,
              color: '#111', padding: '0 18px', height: 72, display: 'flex', alignItems: 'center',
              textDecoration: 'none', borderBottom: '3px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#A50044'; a.style.borderBottomColor = '#A50044' }}
              onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#111'; a.style.borderBottomColor = 'transparent' }}
            >{l.label}</Link>
          ))}
          {/* Zoekicoon */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 16px', height: 72, display: 'flex', alignItems: 'center', color: '#111', fontSize: 20 }}>
            🔍
          </button>
          {/* Live badge */}
          {liveMatches.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#A50044', borderRadius: 4, padding: '6px 12px', marginLeft: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, color: '#fff', letterSpacing: 1 }}>{liveMatches.length} LIVE</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', borderBottom: '1px solid #1e3048', overflow: 'hidden' }}>
        {/* Gouden gloed rechts */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', background: 'radial-gradient(ellipse at right center, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 40px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 3, background: 'var(--accent)' }} />
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)' }}>BTSA · EST. 2024</span>
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(56px, 7vw, 96px)', lineHeight: 0.92, letterSpacing: 1, marginBottom: 24 }}>
              HET OFFICIËLE<br />
              PLATFORM VOOR<br />
              <span style={{ color: 'var(--accent)' }}>TAMIL SPORT</span><br />
              IN BELGIË
            </h1>
            <p style={{ color: '#777', fontSize: 14, lineHeight: 1.8, maxWidth: 460, marginBottom: 36, fontWeight: 300 }}>
              Volg competities, bekijk live scores, en ontdek spelers en clubs van alle Tamil sportverenigingen in België.
            </p>
            <div style={{ display: 'flex', gap: 0 }}>
              <Link href="/football" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'var(--accent)', color: '#000', padding: '14px 32px', fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, border: 'none', cursor: 'pointer' }}>
                  COMPETITIES
                </button>
              </Link>
              <Link href="/team-login" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'transparent', color: '#fff', padding: '14px 32px', fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, border: '1px solid #333', cursor: 'pointer', marginLeft: -1 }}>
                  TEAM LOGIN
                </button>
              </Link>
            </div>
          </div>
          {/* Right side: logo + quick stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <Image src="/btsa-logo.png" alt="BTSA" width={220} height={220} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 48px rgba(245,166,35,0.2))' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#1a1a1a', width: '100%' }}>
              {[['4', 'SPORTEN'], ['—', 'CLUBS'], ['—', 'SPELERS'], ['—', 'MATCHES']].map(([n, l]) => (
                <div key={l} style={{ background: '#111', padding: '16px 20px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 30, color: 'var(--accent)', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, letterSpacing: 1.5, color: '#555', marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SPORT TILES ── */}
      <div style={{ borderBottom: '1px solid #1e3048', background: 'rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {sports.map((s, i) => (
            <Link key={s.slug} href={`/${s.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px 24px', borderLeft: i > 0 ? '1px solid #1a1a1a' : 'none',
                borderTop: `3px solid transparent`, transition: 'border-color 0.2s, background 0.2s',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
              }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderTopColor = sportColor[s.slug]; d.style.background = '#141414' }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderTopColor = 'transparent'; d.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 28 }}>{s.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 1, lineHeight: 1 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 10, letterSpacing: 1, color: '#555', marginTop: 3 }}>BEKIJK MEER →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MEMBERSHIP BANNER (Barcelona-stijl: witte achtergrond, donkerblauwe banner erop) ── */}
      <div style={{ background: '#fff', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <div style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a0e20 0%, #111630 50%, #0d1128 100%)',
          border: '1px solid #1e2444',
          minHeight: 200,
        }}>
          {/* Achtergrond decoratie: grote BTSA logo als watermark */}
          <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', opacity: 0.08, pointerEvents: 'none' }}>
            <Image src="/btsa-logo.png" alt="" width={320} height={320} style={{ borderRadius: '50%' }} />
          </div>
          {/* Gouden gloed links */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '60%', height: '100%', background: 'radial-gradient(ellipse at left center, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          {/* Content */}
          <div style={{ position: 'relative', padding: '48px 56px', maxWidth: 600 }}>
            <h2 style={{
              fontFamily: 'Bebas Neue', fontSize: 42, letterSpacing: 1, lineHeight: 1,
              marginBottom: 14,
              background: 'linear-gradient(90deg, #F5A623, #FFC93C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Become a Member of BTSA
            </h2>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, marginBottom: 28, fontWeight: 300 }}>
              By becoming a member you join an official Tamil sports club in Belgium and can participate in tournaments across Football, Cricket and Volleyball. Individual athletes can also register and compete in Athletics events.
            </p>
            <Link href="/team-login" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(90deg, #F5A623, #FFC93C)',
                color: '#000', padding: '12px 28px',
                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, letterSpacing: 1,
                border: 'none', cursor: 'pointer', borderRadius: 24,
              }}>
                More Info
              </button>
            </Link>
          </div>
          {/* Logo rechts (zichtbaar) */}
          <div style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)' }}>
            <Image src="/btsa-logo.png" alt="BTSA" width={140} height={140} style={{ borderRadius: '50%', opacity: 0.7, filter: 'drop-shadow(0 0 24px rgba(245,166,35,0.3))' }} />
          </div>
        </div>
      </div>
      </div>

      {/* ── BTSA PHOTOS (Barcelona Stories stijl) ── */}
      <div style={{ background: '#fff', padding: '48px 0 56px' }}>
        {/* Titel gecentreerd */}
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 2, color: '#111', textAlign: 'center', marginBottom: 32 }}>
          BTSA PHOTOS
        </h2>
        {/* Carousel wrapper */}
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 56px' }}>
          {/* Scroll container */}
          <div ref={photosRef} style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {[
              { label: 'Football', sport: 'football', color: 'linear-gradient(135deg, #1a0a0a, #4a0a0a)', emoji: '⚽' },
              { label: 'Cricket', sport: 'cricket', color: 'linear-gradient(135deg, #1a120a, #4a2a0a)', emoji: '🏏' },
              { label: 'Volleyball', sport: 'volleyball', color: 'linear-gradient(135deg, #0a1a0a, #0a3a0a)', emoji: '🏐' },
              { label: 'Athletics', sport: 'athletics', color: 'linear-gradient(135deg, #0a0a1a, #0a0a4a)', emoji: '🏃' },
              { label: 'Football', sport: 'football', color: 'linear-gradient(135deg, #2a0a1a, #5a0a2a)', emoji: '⚽' },
              { label: 'Cricket', sport: 'cricket', color: 'linear-gradient(135deg, #1a1a0a, #3a3a0a)', emoji: '🏏' },
              { label: 'Volleyball', sport: 'volleyball', color: 'linear-gradient(135deg, #0a1a1a, #0a3a3a)', emoji: '🏐' },
              { label: 'BTSA', sport: 'football', color: 'linear-gradient(135deg, #0D1128, #1e2a4a)', emoji: '🏆' },
            ].map((item, i) => (
              <div key={i} style={{ flexShrink: 0, scrollSnapAlign: 'start', width: 200, height: 280, borderRadius: 12, overflow: 'hidden', position: 'relative', cursor: 'pointer', background: item.color }}>
                {/* NEW badge */}
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: 'var(--accent)', color: '#000', fontFamily: 'Rajdhani', fontWeight: 800, fontSize: 11, letterSpacing: 1, padding: '3px 10px', borderRadius: 20 }}>
                  NEW
                </div>
                {/* Emoji decoratie midden */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, opacity: 0.3 }}>
                  {item.emoji}
                </div>
                {/* Bottom overlay + label */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', padding: '32px 14px 14px' }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#fff', letterSpacing: 0.5 }}>{item.label}</div>
                </div>
              </div>
            ))}
            {/* Lege ruimte rechts voor de pijl */}
            <div style={{ flexShrink: 0, width: 20 }} />
          </div>

          {/* Pijl rechts — exact zoals Barcelona */}
          <button
            onClick={() => scrollPhotos('right')}
            style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: '#fff', border: '2px solid #ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 18, color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >›</button>

          {/* Pijl links */}
          <button
            onClick={() => scrollPhotos('left')}
            style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: '#fff', border: '2px solid #ddd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 18, color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >‹</button>
        </div>
      </div>

      {/* ── MAIN CONTENT: News feed + Sidebar ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>

        {/* LEFT: Matches feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 24, background: 'var(--accent)' }} />
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>WEDSTRIJDEN</h2>
            </div>
            <Link href="/football/matches" style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: '#555', textDecoration: 'none' }}>ALLE WEDSTRIJDEN →</Link>
          </div>

          {/* Live matches (top priority) */}
          {liveMatches.map(m => (
            <div key={m.id} style={{ background: 'rgba(226,35,26,0.06)', border: '1px solid rgba(226,35,26,0.2)', marginBottom: 2, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1s infinite', display: 'inline-block' }} />
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: 'var(--red)' }}>LIVE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{m.home_team_name}</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 40, color: 'var(--red)', textAlign: 'center', lineHeight: 1 }}>{m.home_score ?? 0} — {m.away_score ?? 0}</div>
                <div style={{ fontWeight: 700, fontSize: 16, textAlign: 'right' }}>{m.away_team_name}</div>
              </div>
            </div>
          ))}

          {/* Recent results */}
          {matches.length === 0 ? (
            <div style={{ padding: '40px 0', color: '#555', fontSize: 14 }}>Nog geen wedstrijden beschikbaar.</div>
          ) : (
            <div>
              {matches.map((m, i) => (
                <div key={m.id} style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr auto 1fr 100px',
                  alignItems: 'center', gap: 16, padding: '16px 0',
                  borderBottom: i < matches.length - 1 ? '1px solid #1a1a1a' : 'none',
                }}>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, letterSpacing: 1, color: '#444' }}>
                    {m.match_date ?? 'TBD'}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{m.home_team_name}</div>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    {m.is_live ? (
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'var(--red)' }}>{m.home_score ?? 0}—{m.away_score ?? 0}</span>
                    ) : m.is_played ? (
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: 22 }}>{m.home_score}—{m.away_score}</span>
                    ) : (
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#555' }}>VS</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.away_team_name}</div>
                  <div style={{ textAlign: 'right' }}>
                    {m.is_live
                      ? <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, color: 'var(--red)', letterSpacing: 1 }}>● LIVE</span>
                      : m.is_played
                        ? <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, color: '#444', letterSpacing: 1 }}>GESPEELD</span>
                        : <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, color: 'var(--accent)', letterSpacing: 1 }}>GEPLAND</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Clubs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 4, height: 20, background: 'var(--accent)' }} />
              <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 1 }}>CLUBS</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {clubs.slice(0, 8).map((c, i) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < 7 ? '1px solid #1a1a1a' : 'none' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#333', minWidth: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700, color: sportColor[c.sport] ?? '#555', letterSpacing: 1 }}>{c.sport.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team login CTA */}
          <div style={{ background: 'var(--accent)', padding: '28px 24px' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: '#000', lineHeight: 0.95, marginBottom: 10 }}>
              BEN JIJ EEN<br />CLUB ADMIN?
            </div>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', marginBottom: 18, lineHeight: 1.6 }}>
              Beheer je spelers, teams en toernooien via het BTSA team portal.
            </p>
            <Link href="/team-login" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#000', color: '#fff', padding: '11px 24px', fontFamily: 'Bebas Neue', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer', width: '100%' }}>
                INLOGGEN →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── TOURNAMENTS CAROUSEL ── */}
      {tournaments.length > 0 && (
        <div style={{ borderTop: '1px solid #1a1a1a', background: '#0D0D0D', padding: '48px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 24, background: 'var(--accent)' }} />
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 26, letterSpacing: 1 }}>TOERNOOIEN</h2>
            </div>
          </div>
          <div ref={carouselRef} style={{ display: 'flex', gap: 0, overflowX: 'auto', paddingLeft: 40, scrollbarWidth: 'none' }}>
            {tournaments.map((t, i) => (
              <Link key={t.id} href={`/${t.sport}/tournament/${t.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  width: 240, borderLeft: i > 0 ? '1px solid #1a1a1a' : 'none',
                  padding: '24px 28px', cursor: 'pointer', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#141414'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.status === 'ongoing' ? 'var(--green)' : t.status === 'finished' ? '#444' : 'var(--accent)', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 10, color: '#555', letterSpacing: 1.5 }}>{t.sport?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, lineHeight: 1.1, marginBottom: 8 }}>{t.name}</div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 11, color: '#555', letterSpacing: 0.5 }}>{t.start_date ?? '—'}</div>
                  {t.clubs?.name && <div style={{ marginTop: 8, fontSize: 11, color: '#444' }}>org. {t.clubs.name}</div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: '#000', borderTop: '1px solid #1a1a1a', padding: '40px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Image src="/btsa-logo.png" alt="BTSA" width={32} height={32} style={{ borderRadius: '50%' }} />
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--accent)', letterSpacing: 2 }}>BTSA</span>
            </div>
            <p style={{ fontSize: 12, color: '#444', lineHeight: 1.7 }}>Belgium Tamil Sports Association — officieel platform voor Tamil sport in België.</p>
          </div>
          {sports.map(s => (
            <div key={s.slug}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, color: '#555', letterSpacing: 2, marginBottom: 12 }}>{s.label.toUpperCase()}</div>
              {['Teams', 'Wedstrijden', 'Rankings', 'Toernooien'].map(p => (
                <div key={p} style={{ marginBottom: 8 }}>
                  <Link href={`/${s.slug}`} style={{ fontSize: 12, color: '#444', textDecoration: 'none' }}>{p}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid #1a1a1a', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 11, color: '#333', letterSpacing: 1 }}>
          © 2026 BELGIUM TAMIL SPORTS ASSOCIATION
        </div>
      </footer>
    </div>
  )
}
