'use client'
export const dynamic = 'force-dynamic'

// ── Pas deze data aan met echte namen en periodes ──
const BESTUUR = [
  { naam: 'Voorzitter',     rol: 'Voorzitter',        periode: '2026 – 2028', kleur: '#A50044' },
  { naam: 'Secretaris',     rol: 'Secretaris',         periode: '2026 – 2028', kleur: '#004D98' },
  { naam: 'Penningmeester', rol: 'Penningmeester',     periode: '2026 – 2028', kleur: '#004D98' },
]

const SPORTEN = [
  {
    sport: 'Voetbal', emoji: '⚽', kleur: '#A50044',
    verantwoordelijke: { naam: 'Naam',  rol: 'Verantwoordelijke Voetbal', periode: '2026 – 2028' },
    uitvoerenden: [
      { naam: 'Naam', rol: 'Uitvoerend Voetbal', periode: '2026 – 2028' },
      { naam: 'Naam', rol: 'Uitvoerend Voetbal', periode: '2026 – 2028' },
    ],
  },
  {
    sport: 'Cricket', emoji: '🏏', kleur: '#F5A623',
    verantwoordelijke: { naam: 'Naam', rol: 'Verantwoordelijke Cricket', periode: '2026 – 2028' },
    uitvoerenden: [
      { naam: 'Naam', rol: 'Uitvoerend Cricket', periode: '2026 – 2028' },
      { naam: 'Naam', rol: 'Uitvoerend Cricket', periode: '2026 – 2028' },
    ],
  },
  {
    sport: 'Volleyball', emoji: '🏐', kleur: '#22C55E',
    verantwoordelijke: { naam: 'Naam', rol: 'Verantwoordelijke Volleyball', periode: '2026 – 2028' },
    uitvoerenden: [
      { naam: 'Naam', rol: 'Uitvoerend Volleyball', periode: '2026 – 2028' },
      { naam: 'Naam', rol: 'Uitvoerend Volleyball', periode: '2026 – 2028' },
    ],
  },
  {
    sport: 'Atletiek', emoji: '🏃', kleur: '#00BFFF',
    verantwoordelijke: { naam: 'Naam', rol: 'Verantwoordelijke Atletiek', periode: '2026 – 2028' },
    uitvoerenden: [
      { naam: 'Naam', rol: 'Uitvoerend Atletiek', periode: '2026 – 2028' },
      { naam: 'Naam', rol: 'Uitvoerend Atletiek', periode: '2026 – 2028' },
    ],
  },
]

function PersonIcon({ kleur, size = 56 }: { kleur: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill={kleur} opacity="0.12" />
      <circle cx="28" cy="22" r="10" fill={kleur} />
      <path d="M8 46c0-9.941 8.059-18 20-18s20 8.059 20 18" fill={kleur} opacity="0.7" />
    </svg>
  )
}

function PersonCard({ naam, rol, periode, kleur, size = 'md' }: {
  naam: string; rol: string; periode: string; kleur: string; size?: 'lg' | 'md' | 'sm'
}) {
  const s = size === 'lg' ? { icon: 72, naam: 18, rol: 12, pad: '28px 24px' }
           : size === 'md' ? { icon: 56, naam: 15, rol: 11, pad: '20px 20px' }
           : { icon: 44, naam: 13, rol: 10, pad: '16px 16px' }
  return (
    <div style={{
      background: '#fff', border: `2px solid ${kleur}20`,
      borderTop: `4px solid ${kleur}`,
      borderRadius: 8, padding: s.pad,
      textAlign: 'center', minWidth: 130,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <PersonIcon kleur={kleur} size={s.icon} />
      </div>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: s.naam, letterSpacing: 0.5, color: '#111827', marginBottom: 4 }}>{naam}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: s.rol, color: kleur, marginBottom: 6, letterSpacing: 0.3 }}>{rol}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: `${kleur}10`, border: `1px solid ${kleur}30`, borderRadius: 20, padding: '3px 10px' }}>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 10, color: '#6B7280', letterSpacing: 0.5 }}>📅 {periode}</span>
      </div>
    </div>
  )
}

// Verbindingslijn component (SVG connector)
function Connector({ color = '#E2E6EF', vertical = false }: { color?: string; vertical?: boolean }) {
  if (vertical) {
    return <div style={{ width: 2, height: 32, background: color, margin: '0 auto' }} />
  }
  return <div style={{ height: 2, background: color, flex: 1 }} />
}

export default function OrganisatiePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>

      {/* ── HEADER ── */}
      <div style={{ background: '#0D1128', borderBottom: '4px solid #A50044', padding: '56px 48px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: '#F5A623', marginBottom: 8 }}>
            BELGIUM TAMIL SPORTS ASSOCIATION
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 72, lineHeight: 0.9, color: '#fff', margin: 0 }}>
            ONZE<br /><span style={{ color: '#F5A623' }}>ORGANISATIE</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 15, marginTop: 20, maxWidth: 560 }}>
            BTSA wordt geleid door een democratisch gekozen bestuur. Voor elke sport is er één verantwoordelijke en twee uitvoerenden die samen de dagelijkse werking coördineren.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px' }}>

        {/* ── BESTUUR ── */}
        <div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{ background: '#A50044', color: '#fff', padding: '6px 16px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: 2 }}>
              BESTUUR
            </div>
            <div style={{ flex: 1, height: 2, background: '#E2E6EF' }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12, color: '#9CA3AF' }}>Algemeen Bestuur BTSA</span>
          </div>

          {/* Bestuur kaarten */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
            {BESTUUR.map((p, i) => (
              <PersonCard key={i} naam={p.naam} rol={p.rol} periode={p.periode} kleur={p.kleur} size="lg" />
            ))}
          </div>

          {/* Connector naar sporten */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Connector color="#CBD5E1" vertical />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#CBD5E1' }} />
            </div>
          </div>
        </div>

        {/* ── SPORTCATEGORIEËN ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
            <div style={{ background: '#004D98', color: '#fff', padding: '6px 16px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, letterSpacing: 2 }}>
              SPORTCATEGORIEËN
            </div>
            <div style={{ flex: 1, height: 2, background: '#E2E6EF' }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 12, color: '#9CA3AF' }}>1 Verantwoordelijke + 2 Uitvoerenden per sport</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 48 }}>
            {SPORTEN.map((s) => (
              <div key={s.sport} style={{
                background: '#fff', borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                border: `1px solid ${s.kleur}20`,
              }}>
                {/* Sport header */}
                <div style={{
                  background: s.kleur, padding: '16px 24px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: 1 }}>{s.sport}</div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>SPORTCOMITÉ</div>
                  </div>
                </div>

                <div style={{ padding: '32px 24px' }}>
                  {/* Verantwoordelijke */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 2, color: '#9CA3AF', marginBottom: 12 }}>
                      VERANTWOORDELIJKE
                    </div>
                    <PersonCard naam={s.verantwoordelijke.naam} rol={s.verantwoordelijke.rol} periode={s.verantwoordelijke.periode} kleur={s.kleur} size="md" />
                  </div>

                  {/* Connector */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ flex: 1, height: 1, background: '#E2E6EF' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.kleur, opacity: 0.4, margin: '0 8px' }} />
                    <div style={{ flex: 1, height: 1, background: '#E2E6EF' }} />
                  </div>

                  {/* Uitvoerenden */}
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 2, color: '#9CA3AF', textAlign: 'center', marginBottom: 16 }}>
                    UITVOERENDEN
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {s.uitvoerenden.map((u, i) => (
                      <PersonCard key={i} naam={u.naam} rol={u.rol} periode={u.periode} kleur={s.kleur} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── UITLEG ── */}
        <div style={{ marginTop: 72, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { titel: 'Democratisch Gekozen', tekst: 'Alle bestuursleden en sportverantwoordelijken worden democratisch verkozen door de leden van BTSA.', icon: '🗳️' },
            { titel: 'Vaste Mandaatperiode', tekst: 'Elk mandaat loopt over een vaste periode van 2 jaar. Na de periode zijn herverkiezingen mogelijk.', icon: '📅' },
            { titel: 'Transparante Werking', tekst: 'BTSA streeft naar volledige transparantie. Alle beslissingen worden gecommuniceerd aan de leden.', icon: '📋' },
          ].map((item) => (
            <div key={item.titel} style={{ background: '#fff', borderRadius: 8, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #A50044' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#111827', marginBottom: 8, letterSpacing: 0.5 }}>{item.titel}</div>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{item.tekst}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
