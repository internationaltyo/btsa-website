'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount } from '@/lib/types'

type SubTab = 'sent' | 'received' | 'request'

export default function BorrowsTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [sub, setSub] = useState<SubTab>('sent')
  const [sent, setSent] = useState<any[]>([])
  const [received, setReceived] = useState<any[]>([])
  // Request form
  const [searchName, setSearchName] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [myTeams, setMyTeams] = useState<any[]>([])
  const [myTournaments, setMyTournaments] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedTournament, setSelectedTournament] = useState('')
  const [reqLoading, setReqLoading] = useState(false)

  async function load() {
    const [s, r, teams, tournaments] = await Promise.all([
      supabase.from('player_borrows').select('*, club_members(first_name, last_name), tournaments(name), club_teams!to_club_team_id(name)').eq('from_club_id', club.id).order('created_at', { ascending: false }),
      supabase.from('player_borrows').select('*, club_members(first_name, last_name), tournaments(name), clubs!from_club_id(name)').in('to_club_team_id', (await supabase.from('club_teams').select('id').eq('club_id', club.id)).data?.map((t: any) => t.id) ?? []).order('created_at', { ascending: false }),
      supabase.from('club_teams').select('*').eq('club_id', club.id).eq('is_active', true),
      supabase.from('tournaments').select('id, name').eq('sport', club.sport).in('status', ['open', 'ongoing']).order('start_date'),
    ])
    setSent(s.data ?? [])
    setReceived(r.data ?? [])
    setMyTeams(teams.data ?? [])
    setMyTournaments(tournaments.data ?? [])
  }
  useEffect(() => { load() }, [club.id])

  async function searchPlayers() {
    if (!searchName.trim()) return
    const { data } = await supabase
      .from('club_members')
      .select('*, clubs(name, sport)')
      .neq('clubs.id', club.id)
      .eq('is_active', true)
      .or(`first_name.ilike.%${searchName}%,last_name.ilike.%${searchName}%`)
      .limit(10)
    setSearchResults((data ?? []).filter((m: any) => m.clubs?.sport === club.sport && m.clubs?.id !== club.id))
  }

  async function sendBorrowRequest() {
    if (!selectedMember || !selectedTeam || !selectedTournament) return
    setReqLoading(true)
    const { error } = await supabase.from('player_borrows').insert({
      tournament_id: selectedTournament,
      club_member_id: selectedMember.id,
      from_club_id: selectedMember.club_id,
      to_club_team_id: selectedTeam,
      status: 'pending',
    })
    if (!error) {
      await supabase.from('notifications').insert({ club_id: selectedMember.club_id, title: `Borrow verzoek voor ${selectedMember.first_name} ${selectedMember.last_name}`, type: 'info' })
      setSelectedMember(null); setSelectedTeam(''); setSelectedTournament(''); setSearchName(''); setSearchResults([])
      load()
    }
    setReqLoading(false)
  }

  const statusBadge = (s: string) => <span className={`badge badge-${s === 'accepted' ? 'green' : s === 'rejected' ? 'red' : 'yellow'}`}>{s}</span>

  const TabBtn = ({ k, label }: { k: SubTab; label: string }) => (
    <button onClick={() => setSub(k)} style={{ padding: '8px 20px', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, background: sub === k ? 'var(--accent)' : 'var(--bg3)', color: sub === k ? '#000' : 'var(--muted)', border: 'none' }}>{label}</button>
  )

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 24 }}>BORROWS</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <TabBtn k="sent" label="Verstuurd" />
        <TabBtn k="received" label="Ontvangen" />
        <TabBtn k="request" label="Nieuw verzoek" />
      </div>

      {sub === 'sent' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Speler</th><th>Toernooi</th><th>Naar team</th><th>Status</th></tr></thead>
            <tbody>
              {sent.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Geen verzoeken</td></tr> : sent.map(b => (
                <tr key={b.id}>
                  <td>{b.club_members?.first_name} {b.club_members?.last_name}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{b.tournaments?.name}</td>
                  <td style={{ fontSize: 12 }}>{b.club_teams?.name}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'received' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Speler</th><th>Toernooi</th><th>Van club</th><th>Status</th></tr></thead>
            <tbody>
              {received.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Geen verzoeken</td></tr> : received.map(b => (
                <tr key={b.id}>
                  <td>{b.club_members?.first_name} {b.club_members?.last_name}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{b.tournaments?.name}</td>
                  <td style={{ fontSize: 12 }}>{b.clubs?.name}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'request' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Speler lenen</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label>Zoek speler (van andere club)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={searchName} onChange={e => setSearchName(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchPlayers()} placeholder="Naam…" />
                <button className="btn-ghost" onClick={searchPlayers} style={{ flexShrink: 0 }}>Zoeken</button>
              </div>
              {searchResults.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {searchResults.map(m => (
                    <div key={m.id} onClick={() => { setSelectedMember(m); setSearchResults([]) }}
                      style={{ padding: '8px 12px', background: selectedMember?.id === m.id ? 'rgba(0,194,255,0.1)' : 'var(--bg3)', borderRadius: 6, cursor: 'pointer', border: `1px solid ${selectedMember?.id === m.id ? 'var(--accent)' : 'var(--border)'}`, fontSize: 13 }}>
                      {m.first_name} {m.last_name} <span style={{ color: 'var(--muted)' }}>— {m.clubs?.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedMember && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(0,255,135,0.08)', borderRadius: 6, fontSize: 13, border: '1px solid rgba(0,255,135,0.2)' }}>
                  ✓ {selectedMember.first_name} {selectedMember.last_name} ({selectedMember.clubs?.name})
                </div>
              )}
            </div>
            <div>
              <label>Jouw team</label>
              <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                <option value="">— kies team —</option>
                {myTeams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label>Toernooi</label>
              <select value={selectedTournament} onChange={e => setSelectedTournament(e.target.value)}>
                <option value="">— kies toernooi —</option>
                {myTournaments.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={sendBorrowRequest} disabled={reqLoading || !selectedMember || !selectedTeam || !selectedTournament}>
              {reqLoading ? 'Versturen…' : 'Verzoek sturen'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
