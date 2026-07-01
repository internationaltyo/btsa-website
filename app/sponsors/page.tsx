'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'

const TIERS = [
  {
    name: 'Goud',
    color: '#F5A623',
    price: '€ 500 / jaar',
    perks: [
      'Logo op alle toernooi-banners',
      'Logo op de website (groot, bovenaan)',
      'Vermelding in alle sociale media posts',
      'Reclamebord op het veld tijdens toernooien',
      'Logo op BTSA-shirts',
    ],
  },
  {
    name: 'Zilver',
    color: '#C0C0C0',
    price: '€ 250 / jaar',
    perks: [
      'Logo op de website',
      'Vermelding bij toernooi-aankondigingen',
      'Reclamebord op het veld tijdens toernooien',
    ],
  },
  {
    name: 'Brons',
    color: '#CD7F32',
    price: '€ 100 / jaar',
    perks: [
      'Logo op de website',
      'Vermelding bij één toernooi naar keuze',
    ],
  },
]

export default function SponsorsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0D1128', color: '#fff' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #080c1a 0%, #0D1128 100%)', borderBottom: '4px solid #F5A623', padding: '56px 40px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: '#F5A623', marginBottom: 10 }}>
            BELGIUM TAMIL SPORTS ASSOCIATION
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, lineHeight: 0.9, color: '#fff', margin: 0, letterSpacing: 1 }}>
            ONZE<br /><span style={{ color: '#F5A623' }}>SPONSORS</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 15, marginTop: 16, maxWidth: 560 }}>
            BTSA organiseert Tamil sporttoernooien in België. Steun onze gemeenschap en vergroot uw zichtbaarheid bij duizenden fans.
          </p>
        </div>
      </div>

      {/* Huidige sponsors */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: '#F5A623', marginBottom: 8 }}>PARTNERS</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: '#fff', letterSpacing: 1, margin: 0 }}>HUIDIGE SPONSORS</h2>
        </div>

        {/* Placeholder sponsor logos */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginBottom: 80 }}>
          {['Goud sponsor', 'Goud sponsor', 'Zilver sponsor', 'Zilver sponsor', 'Zilver sponsor', 'Brons sponsor', 'Brons sponsor'].map((t, i) => (
            <div key={i} style={{
              width: i < 2 ? 220 : i < 5 ? 180 : 150,
              height: i < 2 ? 100 : i < 5 ? 80 : 64,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${i < 2 ? 'rgba(245,166,35,0.3)' : i < 5 ? 'rgba(192,192,192,0.2)' : 'rgba(205,127,50,0.2)'}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11,
              color: 'rgba(255,255,255,0.2)', letterSpacing: 1,
            }}>
              {t.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Sponsor pakketten */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: '#F5A623', marginBottom: 8 }}>WORD PARTNER</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 40, color: '#fff', letterSpacing: 1, margin: 0 }}>SPONSOR PAKKETTEN</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 80 }}>
          {TIERS.map((tier, i) => (
            <div key={tier.name} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${tier.color}40`,
              borderTop: `3px solid ${tier.color}`,
              borderRadius: 12, padding: '32px 28px',
              position: 'relative',
            }}>
              {i === 0 && (
                <div style={{ position: 'absolute', top: -12, right: 20, background: '#F5A623', color: '#000', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 1, padding: '3px 10px', borderRadius: 4 }}>
                  MEEST GEKOZEN
                </div>
              )}
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: tier.color, letterSpacing: 2, marginBottom: 4 }}>{tier.name}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#fff', marginBottom: 24 }}>{tier.price}</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tier.perks.map(p => (
                  <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: tier.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 16, padding: '48px 40px', textAlign: 'center', marginBottom: 80 }}>
          <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#fff', letterSpacing: 1, margin: '0 0 12px' }}>
            INTERESSE OM SPONSOR TE WORDEN?
          </h3>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto 28px' }}>
            Neem contact op met het BTSA bestuur. We bespreken graag de mogelijkheden en maken een voorstel op maat.
          </p>
          <a href="mailto:belgium@tamilyouthorganisation.com" style={{ textDecoration: 'none' }}>
            <button style={{
              background: '#F5A623', color: '#000', padding: '14px 36px',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 2,
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}>
              CONTACTEER ONS →
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
