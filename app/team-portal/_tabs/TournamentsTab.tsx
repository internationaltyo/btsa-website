'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount, Tournament, ClubTeam, ClubMember } from '@/lib/types'
import TournamentManage from './TournamentManage'

const CATEGORIES: Record<string, string[]> = {
  football:   ['5vs5', '7vs7', '11vs11'],
  cricket:    ['6vs6', '8vs8', '10vs10'],
  volleyball: ['4vs4', '6vs6'],
  athletics:  ['Open'],
}

type View = 'list' | 'manage'

export default function TournamentsTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [view, setView] = useState<View>('list')
  const [manageTournament, setManageTournament] = useState<Tournament | null>(null)
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([])
  const [allTournaments, setAllTournaments] = useState<(Tournament & { organizer?: string })[]>([])
  const [myTeams, setMyTeams] = useState<ClubTeam[]>([])
  const [myMembers, setMyMembers] = useState<ClubMember[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', location: '', start_date: '', end_date: '', category: '', max_teams: 8, description: '' })
  const [applyModal, setApplyModal] = useState<{ tournament: Tournament; team: ClubTeam | null } | null>(null)
  const [playerModal, setPlayerModal] = useState<{ tournament: Tournament; team: ClubTeam } | null>(null)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [appliedTeams, setAppliedTeams] = useState<Record<string, { status: string; team_id: string; app_id: string }[]>>({})
  const [borrowRequests, setBorrowRequests] = useState<any[]>([])
  const [dateConflict, setDateConflict] = useState<{ type: 'blocked' | 'warning'; message: string } | null>(null)
  const [dateWarningConfirmed, setDateWarningConfirmed] = useState(false)

  async function load() {
    const [mine, all, teams, members] = await Promise.all([
      supabase.from('tournaments').select('*').eq('organizer_club_id', club.id).order('start_date', { ascending: false }),
      supabase.from('tournaments').select('*, clubs!organizer_club_id(name)').eq('sport', club.sport).eq('is_published', true).order('start_date', { ascending: false }),
      supabase.from('club_teams').select('*').eq('club_id', club.id).eq('is_active', true),
      supabase.from('club_members').select('*').eq('club_id', club.id).eq('is_active', true),
    ])
    setMyTournaments(mine.data ?? [])
    setAllTournaments((all.data ?? []).map((t: any) => ({ ...t, organizer: t.clubs?.name })))
    setMyTeams(teams.data ?? [])
    setMyMembers(members.data ?? [])

    // Load applications
    if (teams.data?.length) {
      const teamIds = teams.data.map((t: ClubTeam) => t.id)
      const { data: apps } = await supabase.from('tournament_applications').select('*').in('club_team_id', teamIds)
      const map: typeof appliedTeams = {}
      for (const a of apps ?? []) {
        if (!map[a.tournament_id]) map[a.tournament_id] = []
        map[a.tournament_id].push({ status: a.status, team_id: a.club_team_id, app_id: a.id })
      }
      setAppliedTeams(map)
    }

    // Load incoming borrow requests
    const { data: borrows } = await supabase
      .from('player_borrows')
      .select('*, club_members(first_name, last_name), tournaments(name), club_teams!to_club_team_id(name)')
      .eq('from_club_id', club.id)
      .eq('status', 'pending')
    setBorrowRequests(borrows ?? [])
  }

  useEffect(() => { load() }, [club.id])

  async function checkDateConflicts(skipWarning = false): Promise<boolean> {
    if (!createForm.start_date) return true
    const newDate = new Date(createForm.start_date)
    const { data: existing } = await supabase
      .from('tournaments')
      .select('id, name, start_date, organizer_club_id')
      .eq('is_published', true)
    const others = (existing ?? []).filter((t: any) => t.organizer_club_id !== club.id)

    for (const t of others) {
      const tDate = new Date(t.start_date)
      const diffDays = Math.abs((newDate.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 0) {
        setDateConflict({
          type: 'blocked',
          message: `❌ Op ${createForm.start_date} organiseert "${t.name}" al een toernooi. Je kan geen toernooi op dezelfde dag organiseren.`,
        })
        return false
      }
      if (!skipWarning && diffDays <= 7) {
        const direction = newDate > tDate ? 'na' : 'voor'
        setDateConflict({
          type: 'warning',
          message: `⚠️ Een week ${direction} jouw datum organiseert "${t.name}" een toernooi (${t.start_date}). Je kan doorgaan, maar bespreek dit eerst met het BTSA bestuur.`,
        })
        return false
      }
    }
    return true
  }

  async function createTournament(force = false) {
    if (!createForm.name || !createForm.start_date) return
    const ok = await checkDateConflicts(force)
    if (!ok) return
    setDateConflict(null)
    const { error } = await supabase.from('tournaments').insert({
      organizer_club_id: club.id,
      country_id: account.country_id,
      sport: club.sport,
      name: createForm.name,
      location: createForm.location,
      start_date: createForm.start_date,
      end_date: createForm.end_date || null,
      category: createForm.category,
      max_teams: createForm.max_teams,
      description: createForm.description,
      is_published: true,
    })
    if (!error) { setShowCreate(false); setCreateForm({ name: '', location: '', start_date: '', end_date: '', category: '', max_teams: 8, description: '' }); load() }
  }

  async function applyToTournament(tournament: Tournament, team: ClubTeam) {
    const already = appliedTeams[tournament.id]?.find(a => a.team_id === team.id)
    if (already) return
    const { error } = await supabase.from('tournament_applications').insert({
      tournament_id: tournament.id,
      club_id: club.id,
      club_team_id: team.id,
      team_name: team.name,
      applied_category: team.category,
    })
    if (!error) {
      await supabase.from('notifications').insert({ club_id: club.id, tournament_id: tournament.id, title: `Aanvraag verstuurd voor ${tournament.name}`, type: 'info' })
      setApplyModal(null)
      load()
    }
  }

  async function withdrawApplication(appId: string) {
    if (!confirm('Aanvraag intrekken?')) return
    await supabase.from('tournament_applications').update({ status: 'withdrawn' }).eq('id', appId)
    load()
  }

  async function openPlayerModal(tournament: Tournament, team: ClubTeam) {
    const { data } = await supabase.from('tournament_players').select('member_id').eq('tournament_id', tournament.id).eq('club_team_id', team.id)
    setSelectedPlayers((data ?? []).map((r: any) => r.member_id))
    setPlayerModal({ tournament, team })
  }

  async function savePlayerSelection() {
    if (!playerModal) return
    const { tournament, team } = playerModal
    await supabase.from('tournament_players').delete().eq('tournament_id', tournament.id).eq('club_team_id', team.id).eq('club_id', club.id)
    if (selectedPlayers.length > 0) {
      await supabase.from('tournament_players').insert(
        selectedPlayers.map(mid => ({ tournament_id: tournament.id, club_id: club.id, club_team_id: team.id, member_id: mid }))
      )
    }
    setPlayerModal(null)
  }

  async function respondBorrow(id: string, status: 'accepted' | 'rejected') {
    await supabase.from('player_borrows').update({ status }).eq('id', id)
    if (status === 'accepted') {
      const borrow = borrowRequests.find(b => b.id === id)
      if (borrow) {
        await supabase.from('tournament_players').insert({
          tournament_id: borrow.tournament_id,
          club_id: club.id,
          club_team_id: borrow.to_club_team_id,
          member_id: borrow.club_member_id,
          is_borrowed: true,
          borrowed_from_club_id: club.id,
        })
      }
    }
    load()
  }

  if (view === 'manage' && manageTournament) {
    return <TournamentManage tournament={manageTournament} club={club} account={account} onBack={() => { setView('list'); setManageTournament(null); load() }} />
  }

  const cats = CATEGORIES[club.sport] ?? []

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 36 }}>TOERNOOIEN</h2>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Nieuw toernooi</button>
      </div>

      {/* Incoming borrow requests */}
      {borrowRequests.length > 0 && (
        <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(255,214,10,0.3)' }}>
          <h3 style={{ fontSize: 18, marginBottom: 12, color: 'var(--yellow)' }}>⚠️ Openstaande borrow verzoeken</h3>
          {borrowRequests.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ flex: 1, fontSize: 13 }}>
                <strong>{b.club_members?.first_name} {b.club_members?.last_name}</strong> gevraagd door{' '}
                <em>{b.club_teams?.name}</em> voor <em>{b.tournaments?.name}</em>
              </span>
              <button className="btn-success" onClick={() => respondBorrow(b.id, 'accepted')}>Accepteren</button>
              <button className="btn-danger" onClick={() => respondBorrow(b.id, 'rejected')}>Weigeren</button>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Toernooi aanmaken</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>Naam *</label><input value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label>Locatie</label><input value={createForm.location} onChange={e => setCreateForm(p => ({ ...p, location: e.target.value }))} /></div>
            <div><label>Startdatum *</label><input type="date" value={createForm.start_date} onChange={e => setCreateForm(p => ({ ...p, start_date: e.target.value }))} /></div>
            <div><label>Einddatum</label><input type="date" value={createForm.end_date} onChange={e => setCreateForm(p => ({ ...p, end_date: e.target.value }))} /></div>
            <div><label>Categorie</label>
              <select value={createForm.category} onChange={e => setCreateForm(p => ({ ...p, category: e.target.value }))}>
                <option value="">Alle categorieën</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label>Max teams</label><input type="number" value={createForm.max_teams} onChange={e => setCreateForm(p => ({ ...p, max_teams: Number(e.target.value) }))} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label>Beschrijving</label><textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
          </div>
          {/* Date conflict feedback */}
          {dateConflict && (
            <div style={{
              marginTop: 12, padding: '14px 16px', borderRadius: 6,
              background: dateConflict.type === 'blocked' ? '#FEF2F2' : '#FFFBEB',
              border: `1px solid ${dateConflict.type === 'blocked' ? '#FCA5A5' : '#FCD34D'}`,
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 14,
              color: dateConflict.type === 'blocked' ? '#991B1B' : '#92400E',
            }}>
              {dateConflict.message}
              {dateConflict.type === 'warning' && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={() => createTournament(true)}
                    style={{ fontSize: 12, padding: '6px 14px' }}
                  >
                    Toch aanmaken
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => setDateConflict(null)}
                    style={{ fontSize: 12, padding: '6px 14px' }}
                  >
                    Andere datum kiezen
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={() => { setDateConflict(null); createTournament(false) }}>Aanmaken</button>
            <button className="btn-ghost" onClick={() => { setShowCreate(false); setDateConflict(null) }}>Annuleren</button>
          </div>
        </div>
      )}

      {/* My tournaments (organizer) */}
      {myTournaments.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 22, marginBottom: 12 }}>Mijn toernooien (organisator)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myTournaments.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Bebas Neue', fontSize: 20 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.start_date} {t.location ? `· ${t.location}` : ''}</div>
                </div>
                {t.category && <span className="badge badge-blue">{t.category}</span>}
                <span className={`badge badge-${t.status === 'ongoing' ? 'green' : t.status === 'finished' ? 'gray' : 'blue'}`}>{t.status}</span>
                <button className="btn-primary" onClick={() => { setManageTournament(t); setView('manage') }}>Beheren</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All tournaments (browse + apply) */}
      <h3 style={{ fontSize: 22, marginBottom: 12 }}>Alle toernooien</h3>
      {allTournaments.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen toernooien beschikbaar.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allTournaments.map(t => {
            const apps = appliedTeams[t.id] ?? []
            const isOrganizer = t.organizer_club_id === club.id
            return (
              <div key={t.id} style={{ padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: apps.length > 0 ? 10 : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 20 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {t.start_date} · {t.organizer ?? 'BTSA'} {t.location ? `· ${t.location}` : ''}
                    </div>
                  </div>
                  {t.category && <span className="badge badge-blue">{t.category}</span>}
                  <span className={`badge badge-${t.status === 'ongoing' ? 'green' : t.status === 'finished' ? 'gray' : 'blue'}`}>{t.status}</span>
                  {!isOrganizer && t.status === 'open' && (
                    <button className="btn-primary" onClick={() => setApplyModal({ tournament: t, team: null })}>Aanmelden</button>
                  )}
                </div>

                {/* Applied teams status */}
                {apps.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    {apps.map(a => {
                      const tm = myTeams.find(mt => mt.id === a.team_id)
                      return (
                        <div key={a.app_id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)', padding: '4px 10px', borderRadius: 6, fontSize: 12 }}>
                          <span>{tm?.name ?? 'Team'}</span>
                          <span className={`badge badge-${a.status === 'accepted' ? 'green' : a.status === 'rejected' ? 'red' : 'yellow'}`}>{a.status}</span>
                          {a.status === 'accepted' && (
                            <button onClick={() => {
                              const team = myTeams.find(mt => mt.id === a.team_id)
                              if (team) openPlayerModal(t, team)
                            }} style={{ fontSize: 10, background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: 4, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                              Spelers
                            </button>
                          )}
                          {a.status === 'pending' && (
                            <button onClick={() => withdrawApplication(a.app_id)} style={{ fontSize: 10, background: 'var(--red)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                              Terugtrekken
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Apply modal */}
      {applyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: 400 }}>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Aanmelden voor</h3>
            <p style={{ color: 'var(--accent)', fontFamily: 'Bebas Neue', fontSize: 18, marginBottom: 16 }}>{applyModal.tournament.name}</p>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>Selecteer welk team je aanmeldt:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {myTeams.map(t => {
                const already = appliedTeams[applyModal.tournament.id]?.find(a => a.team_id === t.id)
                return (
                  <button key={t.id} onClick={() => !already && applyToTournament(applyModal.tournament, t)}
                    style={{ padding: '12px 16px', background: already ? 'var(--bg3)' : 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, color: already ? 'var(--muted)' : 'var(--text)', textAlign: 'left', cursor: already ? 'not-allowed' : 'pointer' }}>
                    {t.name} {t.category ? `(${t.category})` : ''}
                    {already && <span className={`badge badge-${already.status === 'accepted' ? 'green' : already.status === 'rejected' ? 'red' : 'yellow'}`} style={{ marginLeft: 8 }}>{already.status}</span>}
                  </button>
                )
              })}
              {myTeams.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>Geen teams beschikbaar. Maak eerst een team aan.</p>}
            </div>
            <button className="btn-ghost" onClick={() => setApplyModal(null)}>Sluiten</button>
          </div>
        </div>
      )}

      {/* Player selection modal */}
      {playerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: 480, maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Spelersselectie</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
              {playerModal.team.name} — {playerModal.tournament.name}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {myMembers.map(m => {
                const selected = selectedPlayers.includes(m.id)
                return (
                  <div key={m.id} onClick={() => setSelectedPlayers(prev => selected ? prev.filter(id => id !== m.id) : [...prev, m.id])}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: selected ? 'rgba(0,194,255,0.1)' : 'var(--bg3)', border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}>
                    <span style={{ width: 20, height: 20, borderRadius: 4, background: selected ? 'var(--accent)' : 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                      {selected ? '✓' : ''}
                    </span>
                    <span style={{ flex: 1 }}>{m.first_name} {m.last_name}</span>
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{m.position ?? ''}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={savePlayerSelection}>Opslaan ({selectedPlayers.length})</button>
              <button className="btn-ghost" onClick={() => setPlayerModal(null)}>Annuleren</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
