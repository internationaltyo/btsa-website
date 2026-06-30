'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TeamLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    router.push('/team-portal')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ fontFamily: 'Bebas Neue', fontSize: 28, color: 'var(--accent)', letterSpacing: 3, textDecoration: 'none' }}>BTSA</Link>
          <h2 style={{ fontSize: 28, marginTop: 8 }}>TEAM PORTAL</h2>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 13 }}>Log in met je club account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--muted)' }}>E-MAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="club@btsa.be" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--muted)' }}>WACHTWOORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Inloggen…' : 'INLOGGEN'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: 12 }}>
          Geen account? Contacteer de BTSA admin.
        </p>
      </div>
    </div>
  )
}
