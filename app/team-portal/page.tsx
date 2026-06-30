'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Club, TeamAccount } from '@/lib/types'
import OverviewTab from './_tabs/OverviewTab'
import MembersTab from './_tabs/MembersTab'
import TeamsTab from './_tabs/TeamsTab'
import TournamentsTab from './_tabs/TournamentsTab'
import BorrowsTab from './_tabs/BorrowsTab'
import TransfersTab from './_tabs/TransfersTab'
import ScoresTab from './_tabs/ScoresTab'
import RankingsTab from './_tabs/RankingsTab'

const TABS = [
  { key: 'overview',     label: 'Overzicht',   icon: '🏠' },
  { key: 'members',      label: 'Spelers',      icon: '👤' },
  { key: 'teams',        label: 'Teams',        icon: '🏷' },
  { key: 'tournaments',  label: 'Toernooien',   icon: '🏆' },
  { key: 'borrows',      label: 'Borrows',      icon: '🔄' },
  { key: 'transfers',    label: 'Transfers',    icon: '↔️' },
  { key: 'scores',       label: 'Scores',       icon: '📊' },
  { key: 'rankings',     label: 'Rankings',     icon: '📈' },
]

function TeamPortalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [account, setAccount] = useState<TeamAccount | null>(null)
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<number>(0)
  const activeTab = searchParams.get('tab') ?? 'overview'

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/team-login'); return }

      const { data: acc } = await supabase
        .from('team_accounts')
        .select('*, clubs(*)')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!acc) { router.push('/team-login'); return }
      setAccount(acc)
      setClub((acc as any).clubs)
      setLoading(false)

      // unread notifications count
      const { count } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('club_id', acc.club_id)
        .eq('is_read', false)
      setNotifications(count ?? 0)
    }
    init()
  }, [router])

  function setTab(key: string) {
    router.push(`/team-portal?tab=${key}`)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/team-login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Laden…</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Club info */}
        <div style={{ padding: '24px 16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: 'var(--accent)', letterSpacing: 2, marginBottom: 4 }}>BTSA PORTAL</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{club?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontFamily: 'Rajdhani', fontWeight: 600 }}>
            {club?.sport}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6, marginBottom: 2,
              background: activeTab === t.key ? 'rgba(0,194,255,0.1)' : 'transparent',
              color: activeTab === t.key ? 'var(--accent)' : 'var(--muted)',
              fontSize: 13, fontFamily: 'Rajdhani', fontWeight: 600, textAlign: 'left',
              border: activeTab === t.key ? '1px solid rgba(0,194,255,0.2)' : '1px solid transparent',
            }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.key === 'overview' && notifications > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--red)', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>
                  {notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{account?.email}</div>
          <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%', fontSize: 12 }}>
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        {account && club && (
          <>
            {activeTab === 'overview'    && <OverviewTab    account={account} club={club} />}
            {activeTab === 'members'     && <MembersTab     account={account} club={club} />}
            {activeTab === 'teams'       && <TeamsTab       account={account} club={club} />}
            {activeTab === 'tournaments' && <TournamentsTab account={account} club={club} />}
            {activeTab === 'borrows'     && <BorrowsTab     account={account} club={club} />}
            {activeTab === 'transfers'   && <TransfersTab   account={account} club={club} />}
            {activeTab === 'scores'      && <ScoresTab      account={account} club={club} />}
            {activeTab === 'rankings'    && <RankingsTab    account={account} club={club} />}
          </>
        )}
      </main>
    </div>
  )
}

// Wrap in Suspense for useSearchParams
export default function TeamPortalPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--muted)' }}>Laden…</p></div>}>
      <TeamPortalPage />
    </Suspense>
  )
}
