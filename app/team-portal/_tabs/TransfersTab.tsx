'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount } from '@/lib/types'

type SubTab = 'outgoing' | 'incoming' | 'request'

export default function TransfersTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [sub, setSub] = useState<SubTab>('outgoing')
  const [outgoing, setOutgoing] = useState<any[]>([])
  const [incoming, setIncoming] = useState<any[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [sending, setSending] = useState(false)

  async function load() {
    const [out, inc] = await Promise.all([
      supabase.from('player_transfers').select('*, club_members(first_name, last_name), clubs!to_club_id(name)').eq('from_club_id', club.id).order('transferred_at', { ascending: false }),
      supabase.from('player_transfers').select('*, club_members(first_name, last_name), clubs!from_club_id(name)').eq('to_club_id', club.id).order('transferred_at', { ascending: false }),
    ])
    setOutgoing(out.data ?? [])
    setIncoming(inc.data ?? [])
  }
  useEffect(() => { load() }, [club.id])

  async function searchPlayers() {
    if (!searchName.trim()) return
    const { data } = await supabase
      .from('club_members')
      .select('*, clubs(id, name, sport)')
      .eq('is_active', true)
      .or(`first_name.ilike.%${searchName}%,last_name.ilike.%${searchName}%`)
      .limit(10)
    setSearchResults((data ?? []).filter((m: any) => m.clubs?.sport === club.sport && m.clubs?.id !== club.id))
  }

  async function sendTransfer() {
    if (!selectedMember) return
    setSending(true)
    const { error } = await supabase.from('player_transfers').insert({
      member_id: selectedMember.id,
      from_club_id: selectedMember.club_id,
      to_club_id: club.id,
      status: 'pending',
    })
    if (!error) {
      await supabase.from('notifications').insert({ club_id: selectedMember.club_id, title: `Transfer aanvraag voor ${selectedMember.first_name} ${selectedMember.last_name}`, type: 'info' })
      setSelectedMember(null); setSearchName(''); setSearchResults([])
      load()
    }
    setSending(false)
  }

  async function respondTransfer(id: string, status: 'accepted' | 'rejected', memberId: string, fromClubId: string) {
    await supabase.from('player_transfers').update({ status }).eq('id', id)
    if (status === 'accepted') {
      // Compute career stats snapshot and move player to new club
      const { data: matches } = await supabase.from('tournament_matches').select('id, sport').eq('sport', club.sport)
      const matchIds = matches?.map((m: any) => m.id) ?? []

      let won = 0, drawn = 0, lost = 0

      if (matchIds.length > 0) {
        const { data: evts } = await supabase.from('match_events').select('event_type').eq('member_id', memberId).in('match_id', matchIds)
        const goals = evts?.filter((e: any) => e.event_type === 'goal').length ?? 0
        const assists = evts?.filter((e: any) => e.event_type === 'assist').length ?? 0
        const yellow = evts?.filter((e: any) => e.event_type === 'yellow_card').length ?? 0
        const red = evts?.filter((e: any) => e.event_type === 'red_card').length ?? 0

        await supabase.from('club_members').update({
          club_id: club.id,
          career_goals: supabase.rpc('add_to_career_goals' as any, { inc: goals }),
          career_assists: supabase.rpc('add_to_career_assists' as any, { inc: assists }),
          career_yellow: supabase.rpc('add_to_career_yellow' as any, { inc: yellow }),
          career_red: supabase.rpc('add_to_career_red' as any, { inc: red }),
        } as any).eq('id', memberId)

        // Simpler: just move player
        await supabase.from('club_members').update({ club_id: club.id }).eq('id', memberId)
      } else {
        await supabase.from('club_members').update({ club_id: club.id }).eq('id', memberId)
      }

      // Remove from tournament rosters of old club
      await supabase.from('tournament_players').delete().eq('member_id', memberId).eq('club_id', fromClubId)

      await supabase.from('notifications').insert({ club_id: fromClubId, title: `Transfer geaccepteerd`, type: 'success' })
    }
    load()
  }

  const statusBadge = (s: string) => <span className={`badge badge-${s === 'accepted' ? 'green' : s === 'rejected' ? 'red' : 'yellow'}`}>{s}</span>
  const TabBtn = ({ k, label }: { k: SubTab; label: string }) => (
    <button onClick={() => setSub(k)} style={{ padding: '8px 20px', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, background: sub === k ? 'var(--accent)' : 'var(--bg3)', color: sub === k ? '#000' : 'var(--muted)', border: 'none' }}>{label}</button>
  )

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 24 }}>TRANSFERS</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <TabBtn k="outgoing" label="Uitgaand" />
        <TabBtn k="incoming" label="Inkomend" />
        <TabBtn k="request" label="Transfer aanvragen" />
      </div>

      {sub === 'outgoing' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Speler</th><th>Naar club</th><th>Status</th><th>Datum</th></tr></thead>
            <tbody>
              {outgoing.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Geen uitgaande transfers</td></tr> : outgoing.map(t => (
                <tr key={t.id}>
                  <td>{t.club_members?.first_name} {t.club_members?.last_name}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{t.clubs?.name}</td>
                  <td>{statusBadge(t.status)}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(t.transferred_at).toLocaleDateString('nl-BE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'incoming' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Speler</th><th>Van club</th><th>Status</th><th>Actie</th></tr></thead>
            <tbody>
              {incoming.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>Geen inkomende transfers</td></tr> : incoming.map(t => (
                <tr key={t.id}>
                  <td>{t.club_members?.first_name} {t.club_members?.last_name}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{t.clubs?.name}</td>
                  <td>{statusBadge(t.status)}</td>
                  <td>
                    {t.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-success" onClick={() => respondTransfer(t.id, 'accepted', t.member_id, t.from_club_id)}>Accepteren</button>
                        <button className="btn-danger" onClick={() => respondTransfer(t.id, 'rejected', t.member_id, t.from_club_id)}>Weigeren</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'request' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Speler aantrekken</h3>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>Zoek een speler van een andere club om een transfer verzoek te sturen.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input value={searchName} onChange={e => setSearchName(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchPlayers()} placeholder="Naam van speler…" />
            <button className="btn-ghost" onClick={searchPlayers} style={{ flexShrink: 0 }}>Zoeken</button>
          </div>
          {searchResults.map(m => (
            <div key={m.id} onClick={() => { setSelectedMember(m); setSearchResults([]) }}
              style={{ padding: '8px 12px', background: selectedMember?.id === m.id ? 'rgba(0,194,255,0.1)' : 'var(--bg3)', borderRadius: 6, cursor: 'pointer', marginBottom: 6, border: `1px solid ${selectedMember?.id === m.id ? 'var(--accent)' : 'var(--border)'}`, fontSize: 13 }}>
              {m.first_name} {m.last_name} <span style={{ color: 'var(--muted)' }}>— {m.clubs?.name}</span>
            </div>
          ))}
          {selectedMember && (
            <div style={{ padding: '10px 12px', background: 'rgba(0,255,135,0.08)', borderRadius: 6, marginBottom: 16, border: '1px solid rgba(0,255,135,0.2)', fontSize: 13 }}>
              ✓ {selectedMember.first_name} {selectedMember.last_name} ({selectedMember.clubs?.name})
            </div>
          )}
          <button className="btn-primary" onClick={sendTransfer} disabled={sending || !selectedMember}>
            {sending ? 'Versturen…' : 'Transfer aanvragen'}
          </button>
        </div>
      )}
    </div>
  )
}
