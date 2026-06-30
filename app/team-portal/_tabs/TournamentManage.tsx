'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount, Tournament } from '@/lib/types'

type Tab = 'applications' | 'players' | 'groups' | 'group_stage' | 'knockout' | 'awards'

// Greedy multi-field scheduler — from Tamil Volleyball ScoreHelpers.tsx
function calcSched(matches: any[], startTime: string, numFields: number, duration: number, breakBetween: number) {
  const [h, m] = startTime.split(':').map(Number)
  const startMin = h * 60 + m
  const slotLen = duration + breakBetween
  const scheduled = matches.map((match, i) => {
    const slot = Math.floor(i / numFields)
    const field = (i % numFields) + 1
    const totalMin = startMin + slot * slotLen
    const hh = Math.floor(totalMin / 60) % 24
    const mm = totalMin % 60
    return { ...match, match_time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, match_field: field }
  })
  return scheduled
}

interface Props {
  tournament: Tournament; club: Club; account: TeamAccount; onBack: () => void
}

export default function TournamentManage({ tournament, club, account, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('applications')
  const [applications, setApplications] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [groupMatches, setGroupMatches] = useState<any[]>([])
  const [koMatches, setKoMatches] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({ start_time: '09:00', num_fields: 1, match_duration: 20, break_between: 5, groups_published: false, schedule_published: false })
  const [awards, setAwards] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const tid = tournament.id

  async function load() {
    const [apps, grps, assgn, matches, sets, awds, plrs] = await Promise.all([
      supabase.from('tournament_applications').select('*, club_teams(name, category), clubs(name)').eq('tournament_id', tid).order('created_at'),
      supabase.from('tournament_groups').select('*').eq('tournament_id', tid).order('name'),
      supabase.from('tournament_group_assignments').select('*, club_teams(name)').eq('tournament_id', tid),
      supabase.from('tournament_matches').select('*').eq('tournament_id', tid).order('sort_order'),
      supabase.from('tournament_settings').select('*').eq('tournament_id', tid).single(),
      supabase.from('tournament_awards').select('*').eq('tournament_id', tid),
      supabase.from('tournament_players').select('*, club_members(first_name, last_name), club_teams(name)').eq('tournament_id', tid),
    ])
    setApplications(apps.data ?? [])
    setGroups(grps.data ?? [])
    setAssignments(assgn.data ?? [])
    setGroupMatches((matches.data ?? []).filter((m: any) => m.round === 'group'))
    setKoMatches((matches.data ?? []).filter((m: any) => m.round !== 'group'))
    if (sets.data) setSettings(sets.data)
    setAwards(awds.data ?? [])
    setPlayers(plrs.data ?? [])
  }
  useEffect(() => { load() }, [tid])

  async function ensureSettings() {
    const { data } = await supabase.from('tournament_settings').select('id').eq('tournament_id', tid).single()
    if (!data) await supabase.from('tournament_settings').insert({ tournament_id: tid, ...settings })
  }

  // ── APPLICATIONS ──────────────────────────────────────────────────────────
  async function respondApp(id: string, status: 'accepted' | 'rejected') {
    await supabase.from('tournament_applications').update({ status }).eq('id', id)
    const app = applications.find(a => a.id === id)
    if (app) await supabase.from('notifications').insert({ club_id: app.club_id, tournament_id: tid, title: `Aanvraag voor ${tournament.name} ${status === 'accepted' ? 'geaccepteerd ✅' : 'geweigerd ❌'}`, type: status === 'accepted' ? 'success' : 'error' })
    load()
  }

  // ── GROUPS ────────────────────────────────────────────────────────────────
  async function createGroup(name: string) {
    await supabase.from('tournament_groups').insert({ tournament_id: tid, name })
    load()
  }

  async function assignTeamToGroup(groupId: string, app: any) {
    const already = assignments.find(a => a.club_team_id === app.club_team_id)
    if (already) {
      await supabase.from('tournament_group_assignments').update({ group_id: groupId }).eq('id', already.id)
    } else {
      await supabase.from('tournament_group_assignments').insert({ tournament_id: tid, group_id: groupId, club_team_id: app.club_team_id, club_id: app.club_id, category: app.applied_category })
    }
    load()
  }

  async function generateGroupMatches() {
    // Delete existing group matches
    await supabase.from('tournament_matches').delete().eq('tournament_id', tid).eq('round', 'group')
    const newMatches: any[] = []
    for (const group of groups) {
      const groupTeams = assignments.filter(a => a.group_id === group.id)
      // Round-robin
      for (let i = 0; i < groupTeams.length; i++) {
        for (let j = i + 1; j < groupTeams.length; j++) {
          newMatches.push({
            tournament_id: tid, sport: tournament.sport, round: 'group',
            group_name: group.name,
            home_team_id: groupTeams[i].club_team_id,
            away_team_id: groupTeams[j].club_team_id,
            home_team_name: groupTeams[i].club_teams?.name ?? '',
            away_team_name: groupTeams[j].club_teams?.name ?? '',
          })
        }
      }
    }
    // Apply schedule
    const scheduled = calcSched(newMatches, settings.start_time, settings.num_fields, settings.match_duration, settings.break_between)
    await ensureSettings()
    let order = 0
    for (const m of scheduled) {
      await supabase.from('tournament_matches').insert({ ...m, sort_order: order++ })
    }
    load()
  }

  // ── MATCH SCORING (group stage) ───────────────────────────────────────────
  async function saveMatchScore(matchId: string, home: number | null, away: number | null, finish: boolean) {
    const m = groupMatches.find(x => x.id === matchId)
    const winnerId = home != null && away != null ? (home > away ? m?.home_team_id : away > home ? m?.away_team_id : null) : null
    await supabase.from('tournament_matches').update({
      home_score: home, away_score: away,
      is_played: finish, is_live: finish ? false : m?.is_live,
      winner_id: finish ? winnerId : null,
    }).eq('id', matchId)
    load()
  }

  async function toggleLive(matchId: string, val: boolean) {
    await supabase.from('tournament_matches').update({ is_live: val }).eq('id', matchId)
    load()
  }

  // ── KNOCKOUT ──────────────────────────────────────────────────────────────
  async function generateKnockout(numTeams: 4 | 8) {
    await supabase.from('tournament_matches').delete().eq('tournament_id', tid).neq('round', 'group')
    const rounds = numTeams === 4
      ? [{ round: 'SF1', label: 'Halve finale 1' }, { round: 'SF2', label: 'Halve finale 2' }, { round: 'FINAL', label: 'Finale' }]
      : [
        { round: 'QF1', label: 'Kwartfinale 1' }, { round: 'QF2', label: 'Kwartfinale 2' },
        { round: 'QF3', label: 'Kwartfinale 3' }, { round: 'QF4', label: 'Kwartfinale 4' },
        { round: 'SF1', label: 'Halve finale 1' }, { round: 'SF2', label: 'Halve finale 2' },
        { round: '3RD', label: '3e plaats' }, { round: 'FINAL', label: 'Finale' },
      ]
    let order = 1000
    for (const r of rounds) {
      await supabase.from('tournament_matches').insert({ tournament_id: tid, sport: tournament.sport, round: r.round, round_label: r.label, sort_order: order++ })
    }
    load()
  }

  async function setKoTeams(matchId: string, homeId: string | null, awayId: string | null) {
    const homeApp = applications.find(a => a.club_team_id === homeId)
    const awayApp = applications.find(a => a.club_team_id === awayId)
    await supabase.from('tournament_matches').update({
      home_team_id: homeId, away_team_id: awayId,
      home_team_name: homeApp?.club_teams?.name ?? '',
      away_team_name: awayApp?.club_teams?.name ?? '',
    }).eq('id', matchId)
    load()
  }

  async function saveKoScore(matchId: string, home: number, away: number, homePen: number | null, awayPen: number | null) {
    const m = koMatches.find(x => x.id === matchId)
    let winnerId: string | null = null
    if (homePen != null && awayPen != null) winnerId = homePen > awayPen ? m?.home_team_id : m?.away_team_id
    else if (home !== away) winnerId = home > away ? m?.home_team_id : m?.away_team_id
    await supabase.from('tournament_matches').update({ home_score: home, away_score: away, home_score_pen: homePen, away_score_pen: awayPen, is_played: true, is_live: false, winner_id: winnerId }).eq('id', matchId)
    load()
  }

  // Standings calculation (football/cricket: won=3/2pts, draw=1/0pts)
  function calcStandings(gName: string) {
    const groupTeams = assignments.filter(a => a.group_name === gName || groups.find(g => g.id === a.group_id && g.name === gName))
    const teamIds = groupTeams.map(a => a.club_team_id)
    const relevantMatches = groupMatches.filter(m => m.group_name === gName && m.is_played)
    const stats: Record<string, { id: string; name: string; p: number; w: number; d: number; l: number; gf: number; ga: number; pts: number }> = {}
    for (const teamId of teamIds) {
      const team = assignments.find(a => a.club_team_id === teamId)
      stats[teamId] = { id: teamId, name: team?.club_teams?.name ?? '', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    }
    for (const m of relevantMatches) {
      const h = m.home_score ?? 0, a = m.away_score ?? 0
      if (!stats[m.home_team_id] || !stats[m.away_team_id]) continue
      stats[m.home_team_id].p++; stats[m.away_team_id].p++
      stats[m.home_team_id].gf += h; stats[m.home_team_id].ga += a
      stats[m.away_team_id].gf += a; stats[m.away_team_id].ga += h
      if (h > a) { stats[m.home_team_id].w++; stats[m.home_team_id].pts += 3; stats[m.away_team_id].l++ }
      else if (a > h) { stats[m.away_team_id].w++; stats[m.away_team_id].pts += 3; stats[m.home_team_id].l++ }
      else { stats[m.home_team_id].d++; stats[m.away_team_id].d++; stats[m.home_team_id].pts++; stats[m.away_team_id].pts++ }
    }
    return Object.values(stats).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
  }

  const acceptedApps = applications.filter(a => a.status === 'accepted')

  const TABS: { key: Tab; label: string }[] = [
    { key: 'applications', label: 'Aanvragen' },
    { key: 'players', label: 'Spelers' },
    { key: 'groups', label: 'Groepen' },
    { key: 'group_stage', label: 'Groepsfase' },
    { key: 'knockout', label: 'Knockout' },
    { key: 'awards', label: 'Awards' },
  ]

  return (
    <div style={{ padding: 32 }}>
      {/* Back + title */}
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 16 }}>← Terug</button>
      <h2 style={{ fontSize: 32, marginBottom: 4 }}>TOERNOOI BEHEER</h2>
      <p style={{ color: 'var(--accent)', fontFamily: 'Bebas Neue', fontSize: 20, marginBottom: 20 }}>{tournament.name}</p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 16px', borderRadius: '6px 6px 0 0',
            background: tab === t.key ? 'var(--bg2)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--muted)',
            border: tab === t.key ? '1px solid var(--border)' : '1px solid transparent',
            borderBottom: tab === t.key ? '1px solid var(--bg2)' : undefined,
            fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12,
          }}>{t.label}{t.key === 'applications' && applications.filter(a => a.status === 'pending').length > 0 ? ` (${applications.filter(a => a.status === 'pending').length})` : ''}</button>
        ))}
      </div>

      {/* ── APPLICATIONS ─────────────────────────────────────────────────────── */}
      {tab === 'applications' && (
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>AANVRAGEN ({applications.length})</h3>
          {applications.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen aanvragen.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {applications.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{a.club_teams?.name ?? 'Onbekend'}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.clubs?.name} {a.applied_category ? `· ${a.applied_category}` : ''}</div>
                  </div>
                  <span className={`badge badge-${a.status === 'accepted' ? 'green' : a.status === 'rejected' ? 'red' : 'yellow'}`}>{a.status}</span>
                  {a.status === 'pending' && (
                    <>
                      <button className="btn-success" onClick={() => respondApp(a.id, 'accepted')}>Accepteren</button>
                      <button className="btn-danger" onClick={() => respondApp(a.id, 'rejected')}>Weigeren</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PLAYERS ──────────────────────────────────────────────────────────── */}
      {tab === 'players' && (
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>SPELERSLIJSTEN</h3>
          {acceptedApps.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen geaccepteerde teams.</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {acceptedApps.map(app => {
                const teamPlayers = players.filter(p => p.club_team_id === app.club_team_id)
                return (
                  <div key={app.id} className="card">
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, marginBottom: 8 }}>{app.club_teams?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>{app.clubs?.name} · {teamPlayers.length} spelers</div>
                    {teamPlayers.length === 0 ? <p style={{ color: 'var(--muted)', fontSize: 12 }}>Nog geen spelers geselecteerd</p> : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {teamPlayers.map(p => (
                          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0' }}>
                            <span>{p.club_members?.first_name} {p.club_members?.last_name}</span>
                            {p.is_borrowed && <span className="badge badge-yellow" style={{ fontSize: 9 }}>BORROW</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── GROUPS ───────────────────────────────────────────────────────────── */}
      {tab === 'groups' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 22 }}>GROEPEN INSTELLEN</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['A', 'B', 'C', 'D'].map(n => (
                !groups.find(g => g.name === n) && (
                  <button key={n} className="btn-ghost" onClick={() => createGroup(n)}>+ Groep {n}</button>
                )
              ))}
              {groups.length > 0 && assignments.length > 0 && (
                <button className="btn-primary" onClick={generateGroupMatches}>🗓 Genereer wedstrijden</button>
              )}
            </div>
          </div>

          {/* Schedule settings */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontFamily: 'Bebas Neue', marginBottom: 12 }}>SCHEMA INSTELLINGEN</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div><label>Starttijd</label><input type="time" value={settings.start_time} onChange={e => setSettings((s: any) => ({ ...s, start_time: e.target.value }))} /></div>
              <div><label>Velden</label><input type="number" value={settings.num_fields} min={1} onChange={e => setSettings((s: any) => ({ ...s, num_fields: Number(e.target.value) }))} /></div>
              <div><label>Duur (min)</label><input type="number" value={settings.match_duration} onChange={e => setSettings((s: any) => ({ ...s, match_duration: Number(e.target.value) }))} /></div>
              <div><label>Pauze (min)</label><input type="number" value={settings.break_between} onChange={e => setSettings((s: any) => ({ ...s, break_between: Number(e.target.value) }))} /></div>
            </div>
          </div>

          {groups.length === 0 ? <p style={{ color: 'var(--muted)' }}>Maak groepen aan via de knoppen hierboven.</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {groups.map(g => {
                const groupTeams = assignments.filter(a => a.group_id === g.id)
                const unassigned = acceptedApps.filter(a => !assignments.find(x => x.club_team_id === a.club_team_id))
                return (
                  <div key={g.id} className="card">
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'var(--accent)', marginBottom: 12 }}>GROEP {g.name}</div>
                    {groupTeams.map(a => (
                      <div key={a.id} style={{ padding: '6px 10px', background: 'var(--bg3)', borderRadius: 6, marginBottom: 4, fontSize: 13 }}>{a.club_teams?.name}</div>
                    ))}
                    {unassigned.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <label style={{ fontSize: 10, color: 'var(--muted)' }}>Team toevoegen:</label>
                        <select onChange={e => { if (e.target.value) { const app = acceptedApps.find(a => a.club_team_id === e.target.value); if (app) assignTeamToGroup(g.id, app); e.target.value = '' } }} style={{ marginTop: 4 }}>
                          <option value="">— kies team —</option>
                          {unassigned.map(a => <option key={a.club_team_id} value={a.club_team_id}>{a.club_teams?.name}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── GROUP STAGE ──────────────────────────────────────────────────────── */}
      {tab === 'group_stage' && (
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>GROEPSFASE</h3>
          {groupMatches.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Geen groepswedstrijden. Genereer ze eerst in de Groepen tab.</p>
          ) : (
            <>
              {groups.map(g => {
                const gMatches = groupMatches.filter(m => m.group_name === g.name)
                const standings = calcStandings(g.name)
                return (
                  <div key={g.id} style={{ marginBottom: 32 }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: 'var(--accent)', marginBottom: 12 }}>GROEP {g.name}</div>
                    {/* Wedstrijden */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                      {gMatches.map(m => <MatchRow key={m.id} match={m} onSave={saveMatchScore} onToggleLive={toggleLive} />)}
                    </div>
                    {/* Standings */}
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      <table>
                        <thead><tr><th>#</th><th>Team</th><th style={{ textAlign: 'center' }}>G</th><th style={{ textAlign: 'center' }}>W</th><th style={{ textAlign: 'center' }}>D</th><th style={{ textAlign: 'center' }}>V</th><th style={{ textAlign: 'center' }}>+/-</th><th style={{ textAlign: 'center' }}>Pts</th></tr></thead>
                        <tbody>
                          {standings.map((s, i) => (
                            <tr key={s.id}>
                              <td style={{ color: i < 2 ? 'var(--green)' : 'var(--muted)', fontFamily: 'Bebas Neue', fontSize: 16 }}>{i + 1}</td>
                              <td style={{ fontWeight: 600 }}>{s.name}</td>
                              <td style={{ textAlign: 'center' }}>{s.p}</td>
                              <td style={{ textAlign: 'center', color: 'var(--green)' }}>{s.w}</td>
                              <td style={{ textAlign: 'center', color: 'var(--muted)' }}>{s.d}</td>
                              <td style={{ textAlign: 'center', color: 'var(--red)' }}>{s.l}</td>
                              <td style={{ textAlign: 'center', color: s.gf - s.ga > 0 ? 'var(--green)' : 'var(--red)' }}>{s.gf - s.ga > 0 ? '+' : ''}{s.gf - s.ga}</td>
                              <td style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--accent)' }}>{s.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* ── KNOCKOUT ─────────────────────────────────────────────────────────── */}
      {tab === 'knockout' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 22 }}>KNOCKOUT</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" onClick={() => generateKnockout(4)}>4 teams (SF)</button>
              <button className="btn-ghost" onClick={() => generateKnockout(8)}>8 teams (QF)</button>
            </div>
          </div>
          {koMatches.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen knockout wedstrijden. Genereer ze via de knoppen hierboven.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {koMatches.map(m => (
                <KoMatchRow key={m.id} match={m} acceptedApps={acceptedApps} onSetTeams={setKoTeams} onSave={saveKoScore} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── AWARDS ───────────────────────────────────────────────────────────── */}
      {tab === 'awards' && (
        <AwardsSection tid={tid} tournament={tournament} awards={awards} acceptedApps={acceptedApps} players={players} onReload={load} />
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MatchRow({ match: m, onSave, onToggleLive }: { match: any; onSave: (id: string, h: number | null, a: number | null, finish: boolean) => void; onToggleLive: (id: string, val: boolean) => void }) {
  const [hs, setHs] = useState(String(m.home_score ?? ''))
  const [as_, setAs] = useState(String(m.away_score ?? ''))

  useEffect(() => { setHs(String(m.home_score ?? '')); setAs(String(m.away_score ?? '')) }, [m.home_score, m.away_score])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
      {m.is_live && <span className="live-dot" />}
      <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 48 }}>{m.match_time ?? ''} V{m.match_field}</span>
      <span style={{ flex: 1, fontSize: 13, textAlign: 'right' }}>{m.home_team_name}</span>
      <input value={hs} onChange={e => setHs(e.target.value)} style={{ width: 50, textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 18 }} />
      <span style={{ color: 'var(--muted)' }}>—</span>
      <input value={as_} onChange={e => setAs(e.target.value)} style={{ width: 50, textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 18 }} />
      <span style={{ flex: 1, fontSize: 13 }}>{m.away_team_name}</span>
      {m.is_played ? <span className="badge badge-gray">✓</span> : (
        <>
          <button onClick={() => onToggleLive(m.id, !m.is_live)} style={{ padding: '4px 8px', background: m.is_live ? 'var(--red)' : 'var(--bg3)', border: 'none', borderRadius: 4, color: m.is_live ? '#fff' : 'var(--muted)', fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>
            {m.is_live ? 'LIVE' : 'live'}
          </button>
          <button className="btn-ghost" onClick={() => onSave(m.id, hs !== '' ? Number(hs) : null, as_ !== '' ? Number(as_) : null, false)}>Sla op</button>
          <button className="btn-primary" onClick={() => onSave(m.id, hs !== '' ? Number(hs) : 0, as_ !== '' ? Number(as_) : 0, true)}>✓</button>
        </>
      )}
    </div>
  )
}

function KoMatchRow({ match: m, acceptedApps, onSetTeams, onSave }: { match: any; acceptedApps: any[]; onSetTeams: (id: string, h: string | null, a: string | null) => void; onSave: (id: string, h: number, a: number, hp: number | null, ap: number | null) => void }) {
  const [hs, setHs] = useState(String(m.home_score ?? ''))
  const [as_, setAs] = useState(String(m.away_score ?? ''))
  const [hp, setHp] = useState(String(m.home_score_pen ?? ''))
  const [ap, setAp] = useState(String(m.away_score_pen ?? ''))

  return (
    <div className="card">
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: 'var(--accent)', marginBottom: 12 }}>{m.round_label ?? m.round}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={m.home_team_id ?? ''} onChange={e => onSetTeams(m.id, e.target.value || null, m.away_team_id)} style={{ flex: 1 }}>
          <option value="">— thuis team —</option>
          {acceptedApps.map(a => <option key={a.club_team_id} value={a.club_team_id}>{a.club_teams?.name}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input value={hs} onChange={e => setHs(e.target.value)} style={{ width: 50, textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20 }} />
          <span style={{ color: 'var(--muted)' }}>—</span>
          <input value={as_} onChange={e => setAs(e.target.value)} style={{ width: 50, textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 20 }} />
        </div>
        <select value={m.away_team_id ?? ''} onChange={e => onSetTeams(m.id, m.home_team_id, e.target.value || null)} style={{ flex: 1 }}>
          <option value="">— uit team —</option>
          {acceptedApps.map(a => <option key={a.club_team_id} value={a.club_team_id}>{a.club_teams?.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 11, color: 'var(--muted)' }}>Penalties:</label>
        <input value={hp} onChange={e => setHp(e.target.value)} placeholder="T" style={{ width: 50, textAlign: 'center' }} />
        <span style={{ color: 'var(--muted)' }}>—</span>
        <input value={ap} onChange={e => setAp(e.target.value)} placeholder="U" style={{ width: 50, textAlign: 'center' }} />
        {!m.is_played && (
          <button className="btn-primary" onClick={() => onSave(m.id, Number(hs) || 0, Number(as_) || 0, hp ? Number(hp) : null, ap ? Number(ap) : null)}>
            ✓ Beëindigen
          </button>
        )}
        {m.is_played && <span className="badge badge-gray">Gespeeld</span>}
      </div>
    </div>
  )
}

const AWARD_TYPES = [
  { key: 'man_of_tournament', label: 'Man of the Tournament' },
  { key: 'man_of_match', label: 'Man of the Match (finale)' },
  { key: 'top_scorer', label: 'Top Scorer' },
  { key: 'best_keeper', label: 'Best Keeper' },
  { key: 'best_young', label: 'Best Young Player' },
]

function AwardsSection({ tid, tournament, awards, acceptedApps, players, onReload }: any) {
  const [form, setForm] = useState<Record<string, string>>({})

  async function save(awardType: string) {
    const name = form[awardType]?.trim()
    if (!name) return
    await supabase.from('tournament_awards').upsert({ tournament_id: tid, award_type: awardType, player_name: name }, { onConflict: 'tournament_id,award_type,category' })
    onReload()
  }

  const allPlayers = players.map((p: any) => `${p.club_members?.first_name} ${p.club_members?.last_name}`)

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>AWARDS</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {AWARD_TYPES.map(at => {
          const existing = awards.find((a: any) => a.award_type === at.key)
          return (
            <div key={at.key} className="card">
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--accent)', marginBottom: 8 }}>{at.label}</div>
              {existing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>{existing.player_name}</span>
                  <button className="btn-ghost" onClick={() => { setForm(f => ({ ...f, [at.key]: existing.player_name })); supabase.from('tournament_awards').delete().eq('tournament_id', tid).eq('award_type', at.key).then(() => onReload()) }}>Wijzigen</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input list={`players-${at.key}`} value={form[at.key] ?? ''} onChange={e => setForm(f => ({ ...f, [at.key]: e.target.value }))} placeholder="Spelernaam…" />
                  <datalist id={`players-${at.key}`}>{allPlayers.map((p: string) => <option key={p} value={p} />)}</datalist>
                  <button className="btn-primary" onClick={() => save(at.key)}>Opslaan</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
