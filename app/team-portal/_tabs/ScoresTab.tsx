'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount } from '@/lib/types'
import CricketScoring from './CricketScoring'

export default function ScoresTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [matches, setMatches] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  async function loadMatches() {
    const { data } = await supabase
      .from('tournament_matches')
      .select('*, tournaments(name, organizer_club_id)')
      .eq('sport', club.sport)
      .eq('is_played', false)
      .or(`home_team_id.in.(${[]}),tournaments.organizer_club_id.eq.${club.id}`)
      .order('match_date', { ascending: true })
      .limit(30)

    // Filter: only show matches where we're the organizer
    const myTournIds = (await supabase.from('tournaments').select('id').eq('organizer_club_id', club.id)).data?.map((t: any) => t.id) ?? []
    const { data: allMatches } = await supabase
      .from('tournament_matches')
      .select('*, tournaments!inner(name, organizer_club_id)')
      .eq('sport', club.sport)
      .in('tournament_id', myTournIds)
      .order('match_date', { ascending: true })

    setMatches(allMatches ?? [])
    setLoading(false)
  }

  useEffect(() => { loadMatches() }, [club.id, club.sport])

  if (selected) {
    if (club.sport === 'cricket') {
      return <CricketScoring match={selected} club={club} onBack={() => { setSelected(null); loadMatches() }} />
    }
    return <FootballScoring match={selected} club={club} onBack={() => { setSelected(null); loadMatches() }} />
  }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 8 }}>WEDSTRIJD SCORES</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 13 }}>Enkel wedstrijden van toernooien die jij organiseert.</p>

      {loading ? <p style={{ color: 'var(--muted)' }}>Laden…</p> : matches.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Geen wedstrijden beschikbaar om te scoren.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {matches.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, gap: 12 }}>
              {m.is_live && <span className="live-dot" />}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>{m.home_team_name}</span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--muted)', minWidth: 40, textAlign: 'center' }}>
                    {m.is_played ? `${m.home_score}-${m.away_score}` : 'vs'}
                  </span>
                  <span style={{ fontWeight: 600 }}>{m.away_team_name}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{m.tournaments?.name} · {m.round_label ?? m.round} · {m.match_date ?? 'datum onbekend'}</div>
              </div>
              {m.is_played ? <span className="badge badge-gray">Gespeeld</span> : null}
              <button className="btn-primary" onClick={() => setSelected(m)}>
                {m.is_played ? 'Bewerken' : 'Scoren'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── FOOTBALL SCORING ──────────────────────────────────────────────────────────

function FootballScoring({ match, club, onBack }: { match: any; club: Club; onBack: () => void }) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0)
  const [awayScore, setAwayScore] = useState(match.away_score ?? 0)
  const [homePen, setHomePen] = useState(match.home_score_pen ?? '')
  const [awayPen, setAwayPen] = useState(match.away_score_pen ?? '')
  const [events, setEvents] = useState<any[]>([])
  const [players, setPlayers] = useState<{ home: any[]; away: any[] }>({ home: [], away: [] })
  const [eventForm, setEventForm] = useState({ team: 'home' as 'home' | 'away', type: 'goal', member_id: '', player_name: '', minute: '' })
  const [saving, setSaving] = useState(false)
  const [isLive, setIsLive] = useState(match.is_live)

  useEffect(() => {
    supabase.from('match_events').select('*, club_members(first_name, last_name)').eq('match_id', match.id).order('minute').then(({ data }) => setEvents(data ?? []))
    if (match.home_team_id) {
      supabase.from('tournament_players').select('member_id, club_members(id, first_name, last_name)').eq('tournament_id', match.tournament_id).eq('club_team_id', match.home_team_id).then(({ data }) => setPlayers(p => ({ ...p, home: (data ?? []).map((r: any) => r.club_members).filter(Boolean) })))
    }
    if (match.away_team_id) {
      supabase.from('tournament_players').select('member_id, club_members(id, first_name, last_name)').eq('tournament_id', match.tournament_id).eq('club_team_id', match.away_team_id).then(({ data }) => setPlayers(p => ({ ...p, away: (data ?? []).map((r: any) => r.club_members).filter(Boolean) })))
    }
  }, [match.id, match.tournament_id, match.home_team_id, match.away_team_id])

  async function addEvent() {
    const teamId = eventForm.team === 'home' ? match.home_team_id : match.away_team_id
    const member = (eventForm.team === 'home' ? players.home : players.away).find((p: any) => p.id === eventForm.member_id)
    await supabase.from('match_events').insert({
      match_id: match.id,
      tournament_id: match.tournament_id,
      club_team_id: teamId,
      member_id: eventForm.member_id || null,
      player_name: member ? `${member.first_name} ${member.last_name}` : eventForm.player_name,
      event_type: eventForm.type,
      minute: eventForm.minute ? Number(eventForm.minute) : null,
    })
    // Recalculate score from goals
    const { data: evts } = await supabase.from('match_events').select('event_type, club_team_id').eq('match_id', match.id)
    const hs = (evts ?? []).filter((e: any) => (e.event_type === 'goal') && e.club_team_id === match.home_team_id).length
    const as = (evts ?? []).filter((e: any) => (e.event_type === 'goal') && e.club_team_id === match.away_team_id).length
    setHomeScore(hs); setAwayScore(as)
    supabase.from('match_events').select('*, club_members(first_name, last_name)').eq('match_id', match.id).order('minute').then(({ data }) => setEvents(data ?? []))
    setEventForm(f => ({ ...f, member_id: '', player_name: '', minute: '' }))
  }

  async function saveMatch(finish: boolean) {
    setSaving(true)
    const winnerId = homeScore > awayScore ? match.home_team_id : awayScore > homeScore ? match.away_team_id : null
    await supabase.from('tournament_matches').update({
      home_score: homeScore,
      away_score: awayScore,
      home_score_pen: homePen !== '' ? Number(homePen) : null,
      away_score_pen: awayPen !== '' ? Number(awayPen) : null,
      is_played: finish,
      is_live: finish ? false : isLive,
      winner_id: finish ? winnerId : null,
    }).eq('id', match.id)
    setSaving(false)
    if (finish) onBack()
  }

  const teamPlayers = eventForm.team === 'home' ? players.home : players.away
  const EVENT_TYPES = ['goal', 'assist', 'yellow_card', 'red_card', 'own_goal']
  const eventIcon: Record<string, string> = { goal: '⚽', assist: '🅰️', yellow_card: '🟨', red_card: '🟥', own_goal: '🔴' }

  return (
    <div style={{ padding: 32 }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Terug</button>
      <h2 style={{ fontSize: 32, marginBottom: 4 }}>VOETBAL SCORING</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{match.tournaments?.name} · {match.round_label ?? match.round}</p>

      {/* Scoreboard */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '32px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 24 }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 8 }}>{match.home_team_name}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => setHomeScore((n: number) => Math.max(0, n - 1))} style={{ width: 32, height: 32, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 18 }}>−</button>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 64, lineHeight: 1 }}>{homeScore}</span>
            <button onClick={() => setHomeScore((n: number) => n + 1)} style={{ width: 32, height: 32, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 18 }}>+</button>
          </div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: 'var(--muted)' }}>vs</div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 8 }}>{match.away_team_name}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => setAwayScore((n: number) => Math.max(0, n - 1))} style={{ width: 32, height: 32, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 18 }}>−</button>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 64, lineHeight: 1 }}>{awayScore}</span>
            <button onClick={() => setAwayScore((n: number) => n + 1)} style={{ width: 32, height: 32, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 18 }}>+</button>
          </div>
        </div>
      </div>

      {/* Penalties (for draws in knockout) */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <label style={{ color: 'var(--muted)', fontSize: 12 }}>Strafschoppen (optioneel):</label>
        <input type="number" value={homePen} onChange={e => setHomePen(e.target.value)} placeholder="Thuis" style={{ width: 80 }} />
        <span style={{ color: 'var(--muted)' }}>—</span>
        <input type="number" value={awayPen} onChange={e => setAwayPen(e.target.value)} placeholder="Uit" style={{ width: 80 }} />
      </div>

      {/* Live toggle */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <button onClick={() => { setIsLive(!isLive); supabase.from('tournament_matches').update({ is_live: !isLive }).eq('id', match.id) }}
          style={{ padding: '8px 16px', background: isLive ? 'var(--red)' : 'var(--bg3)', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700 }}>
          {isLive ? '🔴 LIVE' : '⚫ LIVE aanzetten'}
        </button>
        <button className="btn-ghost" onClick={() => saveMatch(false)} disabled={saving}>Opslaan</button>
        <button className="btn-primary" onClick={() => saveMatch(true)} disabled={saving}>✓ Wedstrijd beëindigen</button>
      </div>

      {/* Events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Add event */}
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Event toevoegen</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['home', 'away'] as const).map(side => (
                <button key={side} onClick={() => setEventForm(f => ({ ...f, team: side }))}
                  style={{ flex: 1, padding: '8px', background: eventForm.team === side ? 'var(--accent)' : 'var(--bg3)', color: eventForm.team === side ? '#000' : 'var(--muted)', border: 'none', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12 }}>
                  {side === 'home' ? match.home_team_name : match.away_team_name}
                </button>
              ))}
            </div>
            <select value={eventForm.type} onChange={e => setEventForm(f => ({ ...f, type: e.target.value }))}>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{eventIcon[t]} {t.replace('_', ' ')}</option>)}
            </select>
            <select value={eventForm.member_id} onChange={e => setEventForm(f => ({ ...f, member_id: e.target.value }))}>
              <option value="">— speler (optioneel) —</option>
              {teamPlayers.map((p: any) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
            {!eventForm.member_id && (
              <input value={eventForm.player_name} onChange={e => setEventForm(f => ({ ...f, player_name: e.target.value }))} placeholder="Naam handmatig…" />
            )}
            <input type="number" value={eventForm.minute} onChange={e => setEventForm(f => ({ ...f, minute: e.target.value }))} placeholder="Minuut (optioneel)" />
            <button className="btn-primary" onClick={addEvent}>+ Toevoegen</button>
          </div>
        </div>

        {/* Events list */}
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Events ({events.length})</h3>
          {events.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nog geen events</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {events.map(ev => {
                const isHome = ev.club_team_id === match.home_team_id
                return (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg3)', borderRadius: 6, fontSize: 12 }}>
                    <span>{eventIcon[ev.event_type] ?? '•'}</span>
                    <span style={{ color: 'var(--muted)', minWidth: 24 }}>{ev.minute ? `${ev.minute}'` : ''}</span>
                    <span style={{ flex: 1 }}>{ev.player_name ?? (ev.club_members ? `${ev.club_members.first_name} ${ev.club_members.last_name}` : '?')}</span>
                    <span style={{ color: isHome ? 'var(--accent)' : 'var(--green)', fontSize: 10, fontFamily: 'Rajdhani', fontWeight: 700 }}>{isHome ? 'THUIS' : 'UIT'}</span>
                    <button onClick={async () => { await supabase.from('match_events').delete().eq('id', ev.id); supabase.from('match_events').select('*, club_members(first_name, last_name)').eq('match_id', match.id).order('minute').then(({ data }) => setEvents(data ?? [])) }} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }}>✕</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
