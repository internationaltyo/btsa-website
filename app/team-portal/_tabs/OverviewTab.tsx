'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount, Notification } from '@/lib/types'

export default function OverviewTab({ account, club }: { account: TeamAccount; club: Club }) {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [stats, setStats] = useState({ members: 0, teams: 0, tournaments: 0 })

  useEffect(() => {
    supabase.from('notifications').select('*').eq('club_id', club.id).order('created_at', { ascending: false }).limit(10).then(({ data }) => setNotifs(data ?? []))

    Promise.all([
      supabase.from('club_members').select('id', { count: 'exact', head: true }).eq('club_id', club.id).eq('is_active', true),
      supabase.from('club_teams').select('id', { count: 'exact', head: true }).eq('club_id', club.id).eq('is_active', true),
      supabase.from('tournaments').select('id', { count: 'exact', head: true }).eq('organizer_club_id', club.id),
    ]).then(([m, t, to]) => setStats({ members: m.count ?? 0, teams: t.count ?? 0, tournaments: to.count ?? 0 }))
  }, [club.id])

  async function markRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const S: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, textAlign: 'center' }

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 36, marginBottom: 24 }}>OVERZICHT</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={S}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 48, color: 'var(--accent)' }}>{stats.members}</div>
          <div style={{ color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12 }}>SPELERS</div>
        </div>
        <div style={S}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 48, color: 'var(--green)' }}>{stats.teams}</div>
          <div style={{ color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12 }}>TEAMS</div>
        </div>
        <div style={S}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 48, color: 'var(--yellow)' }}>{stats.tournaments}</div>
          <div style={{ color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12 }}>TOERNOOIEN</div>
        </div>
      </div>

      {/* Notifications */}
      <h3 style={{ fontSize: 22, marginBottom: 16 }}>MELDINGEN</h3>
      {notifs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Geen meldingen.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id} onClick={() => !n.is_read && markRead(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 8,
              background: n.is_read ? 'var(--bg2)' : 'rgba(0,194,255,0.05)',
              border: `1px solid ${n.is_read ? 'var(--border)' : 'rgba(0,194,255,0.2)'}`,
              cursor: n.is_read ? 'default' : 'pointer',
            }}>
              <span style={{ fontSize: 16 }}>{n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{n.title}</span>
              {!n.is_read && <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />}
              <span style={{ color: 'var(--muted)', fontSize: 11 }}>{new Date(n.created_at).toLocaleDateString('nl-BE')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
