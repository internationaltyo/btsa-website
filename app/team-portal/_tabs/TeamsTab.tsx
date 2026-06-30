'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount, ClubTeam } from '@/lib/types'

const CATEGORIES: Record<string, string[]> = {
  football:   ['5vs5', '7vs7', '11vs11'],
  cricket:    ['6vs6', '8vs8', '10vs10'],
  volleyball: ['4vs4', '6vs6'],
  athletics:  ['Open'],
}

export default function TeamsTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [teams, setTeams] = useState<ClubTeam[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function load() {
    const { data } = await supabase.from('club_teams').select('*').eq('club_id', club.id).eq('is_active', true).order('name')
    setTeams(data ?? [])
  }
  useEffect(() => { load() }, [club.id])

  async function add() {
    if (!name.trim()) return
    setErr(''); setLoading(true)
    const { error } = await supabase.from('club_teams').insert({ club_id: club.id, name: name.trim(), category: category || null })
    if (error) { setErr(error.message); setLoading(false); return }
    setName(''); setCategory(''); setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Team verwijderen?')) return
    await supabase.from('club_teams').update({ is_active: false }).eq('id', id)
    load()
  }

  const cats = CATEGORIES[club.sport] ?? []

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 24 }}>TEAMS</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 13 }}>Maximum 4 teams per club. ({teams.length}/4)</p>

      {/* Add form */}
      {teams.length < 4 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Nieuw team</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}><label>Teamnaam *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Maveerar A" /></div>
            <div><label>Categorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: 120 }}>
                <option value="">—</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={add} disabled={loading}>{loading ? '…' : '+ Toevoegen'}</button>
          </div>
          {err && <p style={{ color: 'var(--red)', marginTop: 8, fontSize: 12 }}>{err}</p>}
        </div>
      )}

      {/* Teams list */}
      {teams.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen teams aangemaakt.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {teams.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, flex: 1 }}>{t.name}</span>
              {t.category && <span className="badge badge-blue" style={{ marginRight: 12 }}>{t.category}</span>}
              <button className="btn-danger" onClick={() => remove(t.id)}>Verwijderen</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
