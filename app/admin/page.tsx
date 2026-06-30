'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Tab = 'clubs' | 'accounts' | 'borrows' | 'transfers'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('clubs')
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clubs, setClubs] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [borrows, setBorrows] = useState<any[]>([])
  const [transfers, setTransfers] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [clubForm, setClubForm] = useState({ name: '', sport: 'football', country_id: '' })
  const [accountForm, setAccountForm] = useState({ email: '', password: '', club_id: '', display_name: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/team-login'); return }
      const { data: admin } = await supabase.from('country_admins').select('*').eq('user_id', user.id).single()
      if (!admin) { router.push('/'); return }
      setIsAdmin(true)
      setLoading(false)
      loadAll()
    }
    init()
  }, [router])

  async function loadAll() {
    const [cl, ac, bo, tr, co] = await Promise.all([
      supabase.from('clubs').select('*, countries(name)').order('name'),
      supabase.from('team_accounts').select('*, clubs(name, sport)').order('created_at', { ascending: false }),
      supabase.from('player_borrows').select('*, club_members(first_name, last_name), clubs!from_club_id(name), club_teams!to_club_team_id(name), tournaments(name)').eq('status', 'pending'),
      supabase.from('player_transfers').select('*, club_members(first_name, last_name), clubs!from_club_id(name), clubs!to_club_id(name)').eq('status', 'pending'),
      supabase.from('countries').select('*').order('name'),
    ])
    setClubs(cl.data ?? [])
    setAccounts(ac.data ?? [])
    setBorrows(bo.data ?? [])
    setTransfers(tr.data ?? [])
    setCountries(co.data ?? [])
    if (clubForm.country_id === '' && co.data?.[0]) setClubForm(f => ({ ...f, country_id: co.data![0].id }))
  }

  async function createClub() {
    if (!clubForm.name || !clubForm.country_id) return
    const { error } = await supabase.from('clubs').insert({ name: clubForm.name, sport: clubForm.sport, country_id: clubForm.country_id, code: clubForm.name.slice(0, 4).toUpperCase() })
    if (error) { setMsg(error.message); return }
    setMsg('Club aangemaakt ✅')
    setClubForm(f => ({ ...f, name: '' }))
    loadAll()
  }

  async function createAccount() {
    if (!accountForm.email || !accountForm.password || !accountForm.club_id) return
    setMsg('Account aanmaken…')
    const res = await fetch('/api/admin/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountForm),
    })
    const json = await res.json()
    if (!res.ok) { setMsg(json.error ?? 'Fout'); return }
    setMsg('Account aangemaakt ✅')
    setAccountForm(f => ({ ...f, email: '', password: '', display_name: '' }))
    loadAll()
  }

  async function approveBorrow(id: string) {
    const borrow = borrows.find(b => b.id === id)
    await supabase.from('player_borrows').update({ status: 'accepted' }).eq('id', id)
    if (borrow) {
      await supabase.from('tournament_players').upsert({
        tournament_id: borrow.tournament_id,
        club_id: borrow.from_club_id,
        club_team_id: borrow.to_club_team_id,
        member_id: borrow.club_member_id,
        is_borrowed: true,
        borrowed_from_club_id: borrow.from_club_id,
      }, { onConflict: 'tournament_id,club_team_id,member_id' })
    }
    loadAll()
  }

  async function rejectBorrow(id: string) {
    await supabase.from('player_borrows').update({ status: 'rejected' }).eq('id', id)
    loadAll()
  }

  async function toggleAccount(id: string, active: boolean) {
    await supabase.from('team_accounts').update({ is_active: active }).eq('id', id)
    loadAll()
  }

  const TabBtn = ({ k, label, badge }: { k: Tab; label: string; badge?: number }) => (
    <button onClick={() => setTab(k)} style={{ padding: '8px 20px', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, background: tab === k ? 'var(--accent)' : 'var(--bg3)', color: tab === k ? '#000' : 'var(--muted)', border: 'none' }}>
      {label}{badge ? ` (${badge})` : ''}
    </button>
  )

  if (loading) return <div style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Laden…</p></div>

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 44 }}>ADMIN PANEL</h1>
        <button className="btn-ghost" onClick={() => supabase.auth.signOut().then(() => router.push('/team-login'))}>Uitloggen</button>
      </div>

      {msg && <div style={{ padding: '10px 16px', background: 'rgba(0,194,255,0.08)', borderRadius: 6, marginBottom: 20, fontSize: 13, color: 'var(--accent)' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <TabBtn k="clubs" label="Clubs" />
        <TabBtn k="accounts" label="Accounts" />
        <TabBtn k="borrows" label="Borrows" badge={borrows.length} />
        <TabBtn k="transfers" label="Transfers" badge={transfers.length} />
      </div>

      {/* ── CLUBS ── */}
      {tab === 'clubs' && (
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Nieuwe club aanmaken</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label>Naam *</label><input value={clubForm.name} onChange={e => setClubForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label>Sport *</label>
                <select value={clubForm.sport} onChange={e => setClubForm(f => ({ ...f, sport: e.target.value }))}>
                  {['football', 'cricket', 'volleyball', 'athletics'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label>Land *</label>
                <select value={clubForm.country_id} onChange={e => setClubForm(f => ({ ...f, country_id: e.target.value }))}>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.flag_emoji} {c.name}</option>)}
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={createClub}>+ Aanmaken</button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead><tr><th>Club</th><th>Sport</th><th>Land</th><th>Status</th></tr></thead>
              <tbody>
                {clubs.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td><span className="badge badge-blue">{c.sport}</span></td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{(c.countries as any)?.name}</td>
                    <td><span className={`badge badge-${c.is_active ? 'green' : 'red'}`}>{c.is_active ? 'Actief' : 'Inactief'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ACCOUNTS ── */}
      {tab === 'accounts' && (
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Nieuw club account aanmaken</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label>E-mail *</label><input type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label>Wachtwoord *</label><input type="password" value={accountForm.password} onChange={e => setAccountForm(f => ({ ...f, password: e.target.value }))} /></div>
              <div><label>Display naam</label><input value={accountForm.display_name} onChange={e => setAccountForm(f => ({ ...f, display_name: e.target.value }))} /></div>
              <div><label>Club *</label>
                <select value={accountForm.club_id} onChange={e => setAccountForm(f => ({ ...f, club_id: e.target.value }))}>
                  <option value="">— kies club —</option>
                  {clubs.map(c => <option key={c.id} value={c.id}>{c.name} ({c.sport})</option>)}
                </select>
              </div>
            </div>
            <button className="btn-primary" onClick={createAccount}>+ Aanmaken</button>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead><tr><th>Email</th><th>Club</th><th>Status</th><th>Actie</th></tr></thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontSize: 13 }}>{a.email}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>{(a.clubs as any)?.name}</td>
                    <td><span className={`badge badge-${a.is_active ? 'green' : 'red'}`}>{a.is_active ? 'Actief' : 'Inactief'}</span></td>
                    <td>
                      <button onClick={() => toggleAccount(a.id, !a.is_active)} className={a.is_active ? 'btn-danger' : 'btn-success'} style={{ padding: '4px 10px', fontSize: 11 }}>
                        {a.is_active ? 'Deactiveren' : 'Activeren'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BORROWS ── */}
      {tab === 'borrows' && (
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>OPENSTAANDE BORROWS</h3>
          {borrows.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen openstaande borrows.</p> : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table>
                <thead><tr><th>Speler</th><th>Van club</th><th>Naar team</th><th>Toernooi</th><th>Actie</th></tr></thead>
                <tbody>
                  {borrows.map(b => (
                    <tr key={b.id}>
                      <td>{b.club_members?.first_name} {b.club_members?.last_name}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)' }}>{b.clubs?.name}</td>
                      <td style={{ fontSize: 12 }}>{b.club_teams?.name}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)' }}>{b.tournaments?.name}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-success" onClick={() => approveBorrow(b.id)}>Accepteren</button>
                        <button className="btn-danger" onClick={() => rejectBorrow(b.id)}>Weigeren</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TRANSFERS ── */}
      {tab === 'transfers' && (
        <div>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>OPENSTAANDE TRANSFERS</h3>
          {transfers.length === 0 ? <p style={{ color: 'var(--muted)' }}>Geen openstaande transfers.</p> : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table>
                <thead><tr><th>Speler</th><th>Van</th><th>Naar</th><th>Status</th></tr></thead>
                <tbody>
                  {transfers.map(t => (
                    <tr key={t.id}>
                      <td>{t.club_members?.first_name} {t.club_members?.last_name}</td>
                      <td style={{ fontSize: 12, color: 'var(--muted)' }}>{t.clubs?.name}</td>
                      <td style={{ fontSize: 12 }}>{(t as any).clubs2?.name ?? '—'}</td>
                      <td><span className="badge badge-yellow">{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
