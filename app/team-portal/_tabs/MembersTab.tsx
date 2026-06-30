'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount, ClubMember } from '@/lib/types'

const POSITIONS: Record<string, string[]> = {
  football:   ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'],
  cricket:    ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'],
  volleyball: ['Setter', 'Outside Hitter', 'Opposite', 'Middle Blocker', 'Libero'],
  athletics:  ['Sprinter', 'Long Distance', 'Jumper', 'Thrower'],
}

const EMPTY: Partial<ClubMember> = { first_name: '', last_name: '', position: '', jersey_number: undefined, date_of_birth: '' }

export default function MembersTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [members, setMembers] = useState<ClubMember[]>([])
  const [form, setForm] = useState<Partial<ClubMember>>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    const { data } = await supabase.from('club_members').select('*').eq('club_id', club.id).eq('is_active', true).order('last_name')
    setMembers(data ?? [])
  }
  useEffect(() => { load() }, [club.id])

  async function save() {
    if (!form.first_name || !form.last_name) return
    setLoading(true)
    if (editing) {
      await supabase.from('club_members').update({ first_name: form.first_name, last_name: form.last_name, position: form.position, jersey_number: form.jersey_number, date_of_birth: form.date_of_birth || null }).eq('id', editing)
    } else {
      await supabase.from('club_members').insert({ club_id: club.id, first_name: form.first_name, last_name: form.last_name, position: form.position, jersey_number: form.jersey_number, date_of_birth: form.date_of_birth || null })
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Speler verwijderen?')) return
    await supabase.from('club_members').update({ is_active: false }).eq('id', id)
    load()
  }

  function startEdit(m: ClubMember) {
    setForm({ first_name: m.first_name, last_name: m.last_name, position: m.position ?? '', jersey_number: m.jersey_number ?? undefined, date_of_birth: m.date_of_birth ?? '' })
    setEditing(m.id); setShowForm(true)
  }

  const visible = members.filter(m =>
    search === '' || `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase())
  )
  const positions = POSITIONS[club.sport] ?? []

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 36 }}>SPELERS</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoeken…" style={{ width: 180 }} />
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true) }}>+ Toevoegen</button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>{editing ? 'Speler bewerken' : 'Nieuwe speler'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label>Voornaam *</label><input value={form.first_name ?? ''} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} /></div>
            <div><label>Achternaam *</label><input value={form.last_name ?? ''} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} /></div>
            <div><label>Geboortedatum</label><input type="date" value={form.date_of_birth ?? ''} onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))} /></div>
            <div><label>Rugnummer</label><input type="number" value={form.jersey_number ?? ''} onChange={e => setForm(p => ({ ...p, jersey_number: Number(e.target.value) || undefined }))} /></div>
            <div><label>Positie</label>
              <select value={form.position ?? ''} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}>
                <option value="">— kies —</option>
                {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn-primary" onClick={save} disabled={loading}>{loading ? 'Opslaan…' : 'Opslaan'}</button>
            <button className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null) }}>Annuleren</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Naam</th><th>Positie</th><th>Geb.</th>
              <th style={{ textAlign: 'center' }}>Gespeeld</th>
              <th style={{ textAlign: 'center' }}>Goals</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)' }}>Geen spelers gevonden</td></tr>
            ) : visible.map(m => (
              <tr key={m.id}>
                <td style={{ color: 'var(--muted)', fontFamily: 'Bebas Neue', fontSize: 16 }}>{m.jersey_number ?? '—'}</td>
                <td style={{ fontWeight: 600 }}>{m.first_name} {m.last_name}</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{m.position ?? '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{m.date_of_birth ?? '—'}</td>
                <td style={{ textAlign: 'center' }}>{m.career_played}</td>
                <td style={{ textAlign: 'center' }}>{m.career_goals}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-ghost" onClick={() => startEdit(m)} style={{ marginRight: 6 }}>✏️</button>
                  <button className="btn-danger" onClick={() => remove(m.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
