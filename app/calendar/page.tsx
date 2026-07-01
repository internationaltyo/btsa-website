'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const SPORT_COLOR: Record<string, string> = {
  football: '#E2231A', cricket: '#F5A623', volleyball: '#22C55E', athletics: '#00BFFF', tcc: '#7C3AED',
}
const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', cricket: '🏏', volleyball: '🏐', athletics: '🏃', tcc: '🎪',
}
const SPORT_LABEL: Record<string, string> = {
  football: 'Football', cricket: 'Cricket', volleyball: 'Volleyball', athletics: 'Athletics', tcc: 'TCC Events',
}
const MAANDEN = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
const DAGEN = ['Ma','Di','Wo','Do','Vr','Za','Zo']

type Tournament = {
  id: string
  name: string
  sport: string
  start_date: string
  end_date: string | null
  location: string | null
  organizer_club_id: string
  clubs?: { name: string }
}

export default function CalendarPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [today] = useState(new Date())
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<Tournament[] | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('tournaments')
      .select('*, clubs!organizer_club_id(name)')
      .eq('is_published', true)
      .order('start_date', { ascending: true })
      .then(({ data }) => setTournaments((data ?? []) as Tournament[]))
  }, [])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Build calendar days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday-first: 0=Mon...6=Sun
  const startDow = (firstDay.getDay() + 6) % 7
  const totalDays = lastDay.getDate()
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function getTournaments(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tournaments.filter(t => {
      if (!t.start_date) return false
      const start = t.start_date.slice(0, 10)
      const end = t.end_date ? t.end_date.slice(0, 10) : start
      return dateStr >= start && dateStr <= end
    })
  }

  function isToday(day: number) {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  function handleDayClick(day: number) {
    const ts = getTournaments(day)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setSelected(ts)
  }

  // Upcoming tournaments list
  const todayStr = today.toISOString().slice(0, 10)
  const upcoming = tournaments.filter(t => t.start_date >= todayStr).slice(0, 8)

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>

      {/* Header */}
      <div style={{ background: '#0D1128', borderBottom: '4px solid #A50044', padding: '40px 40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: '#F5A623', marginBottom: 8 }}>
            BELGIUM TAMIL SPORTS ASSOCIATION
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, lineHeight: 0.9, color: '#fff', margin: 0 }}>
            TOERNOOI<br /><span style={{ color: '#F5A623' }}>KALENDER</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 14, marginTop: 16 }}>
            Overzicht van alle geplande BTSA toernooien. Clubs kunnen via het Team Portaal een toernooi aanmaken.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>

        {/* ── CALENDAR ── */}
        <div>
          {/* Month navigation */}
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: '#0D1128', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: 6, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#fff', letterSpacing: 2 }}>
                {MAANDEN[month]} {year}
              </div>
              <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: 6, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F8F9FB' }}>
              {DAGEN.map(d => (
                <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: 1, color: '#9CA3AF' }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid #F0F0F0' }}>
              {cells.map((day, idx) => {
                const ts = day ? getTournaments(day) : []
                const isSelected = day !== null && selectedDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                return (
                  <div
                    key={idx}
                    onClick={() => day && handleDayClick(day)}
                    style={{
                      minHeight: 80,
                      padding: '8px 6px',
                      borderRight: (idx + 1) % 7 !== 0 ? '1px solid #F0F0F0' : 'none',
                      borderBottom: '1px solid #F0F0F0',
                      cursor: day ? 'pointer' : 'default',
                      background: isSelected ? '#EFF6FF' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (day) (e.currentTarget as HTMLDivElement).style.background = isSelected ? '#EFF6FF' : '#FAFAFA' }}
                    onMouseLeave={e => { if (day) (e.currentTarget as HTMLDivElement).style.background = isSelected ? '#EFF6FF' : 'transparent' }}
                  >
                    {day && (
                      <>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isToday(day) ? '#A50044' : 'transparent',
                          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14,
                          color: isToday(day) ? '#fff' : '#374151', marginBottom: 4,
                        }}>{day}</div>
                        {ts.slice(0, 2).map(t => (
                          <div key={t.id} style={{
                            background: SPORT_COLOR[t.sport] ?? '#A50044',
                            borderRadius: 3, padding: '2px 5px', marginBottom: 2,
                            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10, color: '#fff',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {SPORT_EMOJI[t.sport]} {t.name}
                          </div>
                        ))}
                        {ts.length > 2 && (
                          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>+{ts.length - 2} meer</div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected day detail */}
          {selected !== null && (
            <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#111827', marginBottom: 12, letterSpacing: 1 }}>
                {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
              </div>
              {selected.length === 0 ? (
                <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 14, color: '#9CA3AF' }}>Geen toernooien op deze dag.</p>
              ) : (
                selected.map(t => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid #F0F0F0' }}>
                    <div style={{ width: 4, height: 40, background: SPORT_COLOR[t.sport] ?? '#A50044', borderRadius: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#111827', letterSpacing: 0.5 }}>{t.name}</div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12, color: '#6B7280' }}>
                        {SPORT_EMOJI[t.sport]} {t.sport.toUpperCase()} · {(t as any).clubs?.name ?? '—'} {t.location ? `· 📍 ${t.location}` : ''}
                      </div>
                    </div>
                    <Link href={`/${t.sport}/tournament/${t.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ background: '#0D1128', color: '#fff', padding: '8px 16px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        BEKIJK →
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── SIDEBAR: Upcoming ── */}
        <div>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ background: '#A50044', padding: '16px 20px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#fff', letterSpacing: 1 }}>AANKOMENDE TOERNOOIEN</div>
            </div>
            {upcoming.length === 0 ? (
              <div style={{ padding: '24px 20px', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: '#9CA3AF' }}>Geen geplande toernooien.</div>
            ) : (
              upcoming.map((t, i) => (
                <Link key={t.id} href={`/${t.sport}/tournament/${t.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '14px 20px', borderBottom: i < upcoming.length - 1 ? '1px solid #F0F0F0' : 'none',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#FAFAFA'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    {/* Date block */}
                    <div style={{ background: SPORT_COLOR[t.sport] ?? '#A50044', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0, minWidth: 44 }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', lineHeight: 1 }}>
                        {new Date(t.start_date + 'T12:00:00').getDate()}
                      </div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>
                        {MAANDEN[new Date(t.start_date + 'T12:00:00').getMonth()].slice(0, 3).toUpperCase()}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, color: '#111827', letterSpacing: 0.5, lineHeight: 1.2, marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, color: '#9CA3AF' }}>
                        {SPORT_EMOJI[t.sport]} {(t as any).clubs?.name ?? '—'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Legend */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px', marginTop: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: '#111827', marginBottom: 12, letterSpacing: 1 }}>LEGENDE</div>
            {Object.entries(SPORT_COLOR).map(([sport, color]) => (
              <div key={sport} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13, color: '#374151' }}>
                  {SPORT_EMOJI[sport]} {SPORT_LABEL[sport]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
