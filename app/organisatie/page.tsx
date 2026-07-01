'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useMobile } from '../hooks/useMobile'

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
  const isMobile = useMobile()
  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7' }}>

      {/* ── HEADER ── */}
      <div style={{ background: '#0D1128', borderBottom: '4px solid #A50044', padding: isMobile ? '32px 20px 28px' : '56px 48px 48px' }}>
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

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '64px 48px' }}>

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
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? 16 : 32 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 24 : 48 }}>
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
        <div style={{ marginTop: isMobile ? 40 : 72, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
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

        {/* ── STATUTEN ── */}
        <StatutenSection />
      </div>
    </div>
  )
}

const STATUTEN_NL = `
STATUTEN VAN DE BELGIUM TAMIL SPORTS ASSOCIATION (BTSA)

HOOFDSTUK 1 — ALGEMENE BEPALINGEN

Artikel 1 — Naam
De vereniging draagt de naam "Belgium Tamil Sports Association", afgekort BTSA.

Artikel 2 — Zetel
De maatschappelijke zetel van de vereniging is gevestigd in België. Het precieze adres wordt bepaald door het bestuur.

Artikel 3 — Doel
BTSA heeft tot doel de Belgisch-Tamile gemeenschap samen te brengen via sport en recreatie. De vereniging organiseert en coördineert sportactiviteiten op het gebied van voetbal, cricket, volleyball en atletiek.

Artikel 4 — Duur
De vereniging is opgericht voor onbepaalde duur.

---

HOOFDSTUK 2 — LEDEN

Artikel 5 — Lidmaatschap
Elke persoon die de doelstellingen van BTSA onderschrijft, kan lid worden. Het lidmaatschap staat open voor individuele leden en voor teams/clubs die deelnemen aan de activiteiten van BTSA.

Artikel 6 — Rechten van leden
Leden hebben het recht om deel te nemen aan activiteiten, vergaderingen bij te wonen en te stemmen tijdens de algemene vergadering.

Artikel 7 — Verplichtingen van leden
Leden verbinden zich ertoe de statuten en het huishoudelijk reglement na te leven, de besluiten van het bestuur te respecteren, en zich sportief en respectvol te gedragen.

Artikel 8 — Beëindiging lidmaatschap
Het lidmaatschap eindigt door vrijwillige uittreding, uitsluiting door het bestuur wegens ernstige overtredingen, of overlijden.

---

HOOFDSTUK 3 — BESTUUR

Artikel 9 — Samenstelling
Het bestuur bestaat uit minimaal drie leden: een voorzitter, een secretaris en een penningmeester. Het bestuur kan worden uitgebreid met bijkomende leden indien nodig.

Artikel 10 — Bevoegdheden
Het bestuur beheert de dagelijkse werking van BTSA, vertegenwoordigt de vereniging naar buiten, neemt beslissingen over disciplinaire maatregelen en oefent alle bevoegdheden uit die niet uitdrukkelijk aan de algemene vergadering voorbehouden zijn.

Artikel 11 — Mandaatperiode
Bestuursleden worden verkozen voor een vaste periode van twee jaar. Herverkiezing is mogelijk.

Artikel 12 — Vergaderingen
Het bestuur vergadert minstens eenmaal per kwartaal. Beslissingen worden genomen bij gewone meerderheid van de aanwezige stemgerechtigde bestuursleden.

---

HOOFDSTUK 4 — SPORTCOMITÉS

Artikel 13 — Samenstelling
Per sport (voetbal, cricket, volleyball, atletiek) is er een sportcomité bestaande uit één verantwoordelijke en twee uitvoerende leden.

Artikel 14 — Bevoegdheden
Het sportcomité coördineert alle activiteiten binnen de eigen sport, ondersteunt de organisatie van toernooien, en rapporteert aan het bestuur.

Artikel 15 — Aanstelling
De sportverantwoordelijken en uitvoerende leden worden aangesteld door het bestuur en bekrachtigd door de algemene vergadering.

---

HOOFDSTUK 5 — VERKIEZINGEN

Artikel 16 — Verkiezingsprocedure
Verkiezingen voor bestuurs- en comitéfuncties vinden plaats tijdens de jaarlijkse algemene vergadering. Alle stemgerechtigde leden kunnen kandidaat stellen en stemmen.

Artikel 17 — Stemrecht
Elk lid heeft één stem. Stemming geschiedt bij geheime stemming indien meer dan één kandidaat zich aandient voor dezelfde functie.

---

HOOFDSTUK 6 — ALGEMENE VERGADERING

Artikel 18 — Bevoegdheden
De algemene vergadering heeft de hoogste bevoegdheid binnen BTSA. Ze beslist over wijzigingen aan de statuten, de jaarrekening, de begroting en de verkiezing van bestuursleden.

Artikel 19 — Bijeenroeping
De algemene vergadering wordt minstens eenmaal per jaar bijeengeroepen door het bestuur. Een buitengewone vergadering kan worden bijeengeroepen op verzoek van het bestuur of van minstens een vijfde van de leden.

Artikel 20 — Besluitvorming
Beslissingen worden genomen bij gewone meerderheid, tenzij de statuten anders bepalen. Voor statutenwijziging is een tweederde meerderheid vereist.

---

HOOFDSTUK 7 — FINANCIËN

Artikel 21 — Boekjaar
Het boekjaar loopt van 1 januari tot 31 december.

Artikel 22 — Financieel beheer
De penningmeester beheert de financiën van de vereniging en legt jaarlijks rekening en verantwoording af aan de algemene vergadering.

Artikel 23 — Lidgeld
Het bedrag van het lidgeld wordt jaarlijks vastgesteld door het bestuur en bekrachtigd door de algemene vergadering.

---

HOOFDSTUK 8 — SPORTREGLEMENTEN

Artikel 24 — Toepassingsgebied
De sportreglementen zijn van toepassing op alle officiële competities en toernooien georganiseerd door of via BTSA.

Artikel 25 — Fair play
Alle deelnemers verbinden zich ertoe de beginselen van fair play, sportiviteit en wederzijds respect na te leven.

Artikel 26 — Geschillen
Geschillen over sportieve aangelegenheden worden voorgelegd aan het bevoegde sportcomité. Bij beroep beslist het bestuur definitief.

---

HOOFDSTUK 9 — TOERNOOIORGANISATIE

Artikel 27 — Via het BTSA-platform
Alle toernooien en competities worden uitsluitend georganiseerd via het officiële BTSA-platform. Dit garandeert een uniforme werkwijze en transparantie voor alle betrokkenen.

Artikel 28 — Datumcoördinatie
Bij het plannen van een toernooi dienen teams rekening te houden met reeds vastgelegde data op het platform. Overlappende data zijn niet toegestaan zonder expliciete goedkeuring van het bestuur.

Artikel 29 — Geen platformbijdrage
Er wordt geen platformbijdrage gevraagd voor het organiseren van toernooien via BTSA. Deelname aan het platform is gratis voor alle leden.

Artikel 30 — Verantwoordelijkheid van organisatoren
De organiserende ploeg is verantwoordelijk voor het naleven van de geldende regels en het correct invoeren van alle gegevens op het platform (datum, locatie, deelnemende ploegen).

---

HOOFDSTUK 10 — TUCHTMAATREGELEN

Artikel 31 — Categorieën van overtredingen
Overtredingen worden onderverdeeld in drie categorieën:
• Categorie A (lichte overtredingen): verbaal conflict, oneerlijk spel, lichte wanorde. Sanctie: waarschuwing of berisping.
• Categorie B (ernstige overtredingen): agressief gedrag, opzettelijke belediging, grove overtreding. Sanctie: schorsing van 1 tot 3 toernooien.
• Categorie C (zeer ernstige overtredingen): fysiek geweld, ernstige bedreiging, herhaling van Categorie B. Sanctie: schorsing van 4 of meer toernooien, of definitieve uitsluiting.

Artikel 32 — Procedure
Bij een vermeende overtreding wordt de betrokken persoon uitgenodigd zijn standpunt toe te lichten. Het bestuur beoordeelt de feiten en legt de sanctie op. De beslissing wordt schriftelijk meegedeeld.

Artikel 33 — Beroep
Tegen een beslissing van het bestuur kan binnen de 14 dagen beroep worden aangetekend bij de algemene vergadering. De beslissing van de algemene vergadering is definitief.

---

HOOFDSTUK 11 — ONTBINDING

Artikel 34 — Procedure
De ontbinding van BTSA kan enkel worden beslist door de algemene vergadering met een tweederde meerderheid van alle stemgerechtigde leden.

Artikel 35 — Vereffening
Bij ontbinding wordt het vermogen van BTSA overgedragen aan een gelijkaardig sportief of sociaal-cultureel doel, te bepalen door de algemene vergadering.

---

HOOFDSTUK 12 — SLOTBEPALINGEN

Artikel 36 — Inwerkingtreding
Deze statuten treden in werking na goedkeuring door de algemene vergadering.

Artikel 37 — Niet voorziene gevallen
In alle gevallen die niet door deze statuten worden voorzien, beslist het bestuur. De beslissing wordt ter bekrachtiging voorgelegd aan de eerstvolgende algemene vergadering.

Artikel 38 — Publicatie
De statuten worden ter beschikking gesteld van alle leden via het BTSA-platform.

Opgesteld en goedgekeurd door de Stichtende Algemene Vergadering van BTSA.
`

const STATUTEN_TA = `
பெல்ஜியம் தமிழ் விளையாட்டு சங்கம் (BTSA) சட்டதிட்டங்கள்

அத்தியாயம் 1 — பொது விதிகள்

பிரிவு 1 — பெயர்
சங்கத்தின் பெயர் "Belgium Tamil Sports Association", சுருக்கமாக BTSA என்று அழைக்கப்படும்.

பிரிவு 2 — அலுவலகம்
சங்கத்தின் பதிவு செய்யப்பட்ட அலுவலகம் பெல்ஜியத்தில் அமைந்துள்ளது. துல்லியமான முகவரியை நிர்வாகக் குழு தீர்மானிக்கும்.

பிரிவு 3 — நோக்கம்
BTSA விளையாட்டு மற்றும் பொழுதுபோக்கு மூலம் பெல்ஜியத்தில் வாழும் தமிழ் சமுதாயத்தை ஒன்றிணைக்கும் நோக்கத்தைக் கொண்டுள்ளது. சங்கம் கால்பந்து, கிரிக்கெட், கைப்பந்து மற்றும் தடகளம் ஆகிய விளையாட்டுகளை ஏற்பாடு செய்து ஒருங்கிணைக்கும்.

பிரிவு 4 — காலம்
சங்கம் காலவரையற்ற முறையில் நிறுவப்பட்டுள்ளது.

---

அத்தியாயம் 2 — உறுப்பினர்கள்

பிரிவு 5 — உறுப்பினர் தகுதி
BTSA இன் நோக்கங்களை ஆதரிக்கும் எவரும் உறுப்பினராக சேரலாம். தனிநபர் உறுப்பினர்கள் மற்றும் BTSA நடவடிக்கைகளில் பங்கேற்கும் அணிகள்/கிளப்புகள் உறுப்பினர் தகுதி பெறலாம்.

பிரிவு 6 — உறுப்பினர் உரிமைகள்
உறுப்பினர்கள் நடவடிக்கைகளில் பங்கேற்கவும், கூட்டங்களில் கலந்துகொள்ளவும், பொதுக் கூட்டத்தில் வாக்களிக்கவும் உரிமை பெற்றுள்ளனர்.

பிரிவு 7 — உறுப்பினர் கடமைகள்
உறுப்பினர்கள் சட்டதிட்டங்களையும் உள் விதிகளையும் கடைப்பிடிக்க வேண்டும், நிர்வாக குழுவின் தீர்மானங்களை மதிக்க வேண்டும், மற்றும் விளையாட்டு உணர்வுடனும் மரியாதையுடனும் நடந்துகொள்ள வேண்டும்.

பிரிவு 8 — உறுப்பினர் பதவி முடிவு
தன்னார்வமாக விலகுவதன் மூலம், கடுமையான மீறல்களுக்காக நிர்வாக குழுவால் நீக்கப்படுவதன் மூலம் அல்லது இறப்பினால் உறுப்பினர் பதவி முடிவடையும்.

---

அத்தியாயம் 3 — நிர்வாக குழு

பிரிவு 9 — அமைப்பு
நிர்வாக குழுவில் குறைந்தது மூன்று உறுப்பினர்கள் இருக்க வேண்டும்: ஒரு தலைவர், ஒரு செயலாளர் மற்றும் ஒரு பொருளாளர். தேவைப்பட்டால் கூடுதல் உறுப்பினர்களை நிர்வாக குழுவில் சேர்க்கலாம்.

பிரிவு 10 — அதிகாரங்கள்
நிர்வாக குழு BTSA இன் அன்றாட செயல்பாட்டை நிர்வகிக்கும், சங்கத்தை வெளியில் பிரதிநிதித்துவப்படுத்தும், ஒழுக்க நடவடிக்கைகள் குறித்து தீர்மானிக்கும், மற்றும் பொதுக் கூட்டத்திற்கு வெளிப்படையாக ஒதுக்கப்படாத அனைத்து அதிகாரங்களையும் செயல்படுத்தும்.

பிரிவு 11 — பதவிக்காலம்
நிர்வாக குழு உறுப்பினர்கள் இரண்டு ஆண்டுகளுக்கு தேர்ந்தெடுக்கப்படுவார்கள். மீண்டும் தேர்தல் நிற்கலாம்.

பிரிவு 12 — கூட்டங்கள்
நிர்வாக குழு குறைந்தது காலாண்டுக்கு ஒரு முறை கூட்டம் நடத்தும். தீர்மானங்கள் வாக்களிக்கும் உறுப்பினர்களின் சாதாரண பெரும்பான்மையால் எடுக்கப்படும்.

---

அத்தியாயம் 4 — விளையாட்டுக் குழுக்கள்

பிரிவு 13 — அமைப்பு
ஒவ்வொரு விளையாட்டுக்கும் (கால்பந்து, கிரிக்கெட், கைப்பந்து, தடகளம்) ஒரு பொறுப்பாளர் மற்றும் இரண்டு நிர்வாக உறுப்பினர்களைக் கொண்ட விளையாட்டுக் குழு இருக்கும்.

பிரிவு 14 — அதிகாரங்கள்
விளையாட்டுக் குழு அந்தந்த விளையாட்டில் அனைத்து நடவடிக்கைகளையும் ஒருங்கிணைக்கும், போட்டிகள் ஏற்பாட்டிற்கு உதவும், மற்றும் நிர்வாக குழுவிற்கு அறிக்கையிடும்.

பிரிவு 15 — நியமனம்
விளையாட்டு பொறுப்பாளர்களும் நிர்வாக உறுப்பினர்களும் நிர்வாக குழுவால் நியமிக்கப்பட்டு பொதுக் கூட்டத்தால் உறுதிப்படுத்தப்படுவார்கள்.

---

அத்தியாயம் 5 — தேர்தல்கள்

பிரிவு 16 — தேர்தல் நடைமுறை
நிர்வாக குழு மற்றும் குழு பதவிகளுக்கான தேர்தல்கள் ஆண்டு பொதுக் கூட்டத்தில் நடைபெறும். வாக்களிக்கும் உரிமை பெற்ற அனைத்து உறுப்பினர்களும் வேட்பாளராக நிற்கலாம் மற்றும் வாக்களிக்கலாம்.

பிரிவு 17 — வாக்களிக்கும் உரிமை
ஒவ்வொரு உறுப்பினருக்கும் ஒரு வாக்கு உண்டு. ஒரே பதவிக்கு ஒன்றுக்கும் மேற்பட்ட வேட்பாளர் இருந்தால் இரகசிய வாக்களிப்பு நடத்தப்படும்.

---

அத்தியாயம் 6 — பொதுக் கூட்டம்

பிரிவு 18 — அதிகாரங்கள்
பொதுக் கூட்டம் BTSA இல் உச்ச அதிகாரம் கொண்டது. சட்டதிட்ட மாற்றங்கள், ஆண்டு கணக்குகள், பட்ஜெட் மற்றும் நிர்வாக குழு உறுப்பினர் தேர்தல் ஆகியவற்றை அது தீர்மானிக்கும்.

பிரிவு 19 — கூட்டம் அழைப்பு
பொதுக் கூட்டம் நிர்வாக குழுவால் ஆண்டுக்கு ஒரு முறையாவது கூட்டப்படும். நிர்வாக குழுவின் கோரிக்கையின் பேரிலோ அல்லது குறைந்தது ஐந்தில் ஒரு பங்கு உறுப்பினர்களின் கோரிக்கையின் பேரிலோ அசாதாரண கூட்டம் கூட்டப்படலாம்.

பிரிவு 20 — தீர்மான எடுக்கும் முறை
சட்டதிட்டங்கள் தனியாக வேறு முறையில் குறிப்பிடாத வரை சாதாரண பெரும்பான்மையில் தீர்மானங்கள் எடுக்கப்படும். சட்டதிட்ட மாற்றங்களுக்கு மூன்றில் இரண்டு பெரும்பான்மை தேவை.

---

அத்தியாயம் 7 — நிதி

பிரிவு 21 — நிதியாண்டு
நிதியாண்டு ஜனவரி 1 முதல் டிசம்பர் 31 வரை நடைபெறும்.

பிரிவு 22 — நிதி நிர்வாகம்
பொருளாளர் சங்கத்தின் நிதியை நிர்வகிப்பார் மற்றும் ஆண்டுதோறும் பொதுக் கூட்டத்தில் கணக்கு தெரிவிப்பார்.

பிரிவு 23 — உறுப்பினர் கட்டணம்
உறுப்பினர் கட்டண தொகையை நிர்வாக குழு ஆண்டுதோறும் நிர்ணயித்து பொதுக் கூட்டம் உறுதிப்படுத்தும்.

---

அத்தியாயம் 8 — விளையாட்டு விதிமுறைகள்

பிரிவு 24 — பொருந்துமிடம்
BTSA ஏற்பாடு செய்யும் அல்லது BTSA மூலம் நடத்தப்படும் அனைத்து அதிகாரப்பூர்வ போட்டிகளிலும் விளையாட்டு விதிமுறைகள் பொருந்தும்.

பிரிவு 25 — நேர்மையான விளையாட்டு
அனைத்து பங்கேற்பாளர்களும் நேர்மையான விளையாட்டு, விளையாட்டு மனப்பான்மை மற்றும் பரஸ்பர மரியாதையின் கொள்கைகளை கடைப்பிடிக்க வேண்டும்.

பிரிவு 26 — சர்ச்சைகள்
விளையாட்டு தொடர்பான சர்ச்சைகள் சம்பந்தப்பட்ட விளையாட்டுக் குழுவிடம் சமர்ப்பிக்கப்படும். மேல்முறையீட்டில் நிர்வாக குழு இறுதி தீர்மானம் எடுக்கும்.

---

அத்தியாயம் 9 — போட்டி ஏற்பாடு

பிரிவு 27 — BTSA தளம் மூலம்
அனைத்து போட்டிகளும் பிரத்யேக BTSA தளம் மூலம் மட்டுமே ஏற்பாடு செய்யப்படும். இது அனைத்து சம்பந்தப்பட்டவர்களுக்கும் ஒரே மாதிரியான செயல்முறையையும் வெளிப்படைத்தன்மையையும் உறுதிப்படுத்துகிறது.

பிரிவு 28 — தேதி ஒருங்கிணைப்பு
போட்டியை திட்டமிடும்போது, அணிகள் தளத்தில் ஏற்கனவே நிர்ணயிக்கப்பட்ட தேதிகளை கவனத்தில் கொள்ள வேண்டும். நிர்வாக குழுவின் வெளிப்படையான ஒப்புதல் இல்லாமல் தேதி மோதல் அனுமதிக்கப்படாது.

பிரிவு 29 — தள கட்டணம் இல்லை
BTSA மூலம் போட்டி ஏற்பாடு செய்வதற்கு தள கட்டணம் வசூலிக்கப்படாது. தளத்தில் பங்கேற்பது அனைத்து உறுப்பினர்களுக்கும் இலவசம்.

பிரிவு 30 — ஏற்பாட்டாளர்களின் பொறுப்பு
போட்டியை ஏற்பாடு செய்யும் அணி நடைமுறையில் உள்ள விதிகளை கடைப்பிடிப்பதற்கும், தளத்தில் அனைத்து தகவல்களையும் (தேதி, இடம், பங்கேற்கும் அணிகள்) சரியாக உள்ளிடுவதற்கும் பொறுப்பாகும்.

---

அத்தியாயம் 10 — ஒழுக்க நடவடிக்கைகள்

பிரிவு 31 — மீறல் வகைகள்
மீறல்கள் மூன்று வகைகளாக பிரிக்கப்படுகின்றன:
• வகை A (சாதாரண மீறல்கள்): வாய்மொழி சர்ச்சை, நேர்மையற்ற விளையாட்டு, சிறிய ஒழுக்கக்கேடு. தண்டனை: எச்சரிக்கை அல்லது கண்டனம்.
• வகை B (தீவிர மீறல்கள்): ஆக்ரோஷமான நடத்தை, வேண்டுமென்றே அவமதிப்பு, மோசமான மீறல். தண்டனை: 1 முதல் 3 போட்டிகளில் விலக்கல்.
• வகை C (மிகவும் தீவிர மீறல்கள்): உடல் வன்முறை, கடுமையான மிரட்டல், வகை B இன் மீண்டும் நிகழ்வு. தண்டனை: 4 அல்லது அதிக போட்டிகளில் விலக்கல் அல்லது நிரந்தர நீக்கம்.

பிரிவு 32 — நடைமுறை
சந்தேகிக்கப்படும் மீறல் இருக்கும்போது, சம்பந்தப்பட்ட நபர் தனது கருத்தை தெரிவிக்க அழைக்கப்படுவார். நிர்வாக குழு உண்மைகளை மதிப்பிட்டு தண்டனை விதிக்கும். தீர்மானம் எழுத்து வடிவில் தெரிவிக்கப்படும்.

பிரிவு 33 — மேல்முறையீடு
நிர்வாக குழுவின் தீர்மானத்திற்கு எதிராக 14 நாட்களுக்குள் பொதுக் கூட்டத்தில் மேல்முறையீடு செய்யலாம். பொதுக் கூட்டத்தின் தீர்மானம் இறுதியானது.

---

அத்தியாயம் 11 — கலைப்பு

பிரிவு 34 — நடைமுறை
BTSA ஐ கலைப்பது அனைத்து வாக்களிக்கும் உரிமை பெற்ற உறுப்பினர்களில் மூன்றில் இரண்டு பெரும்பான்மையுடன் பொதுக் கூட்டத்தால் மட்டுமே தீர்மானிக்கப்படலாம்.

பிரிவு 35 — கணக்கு தீர்வு
கலைப்பு நிகழும்போது BTSA இன் சொத்துக்கள் பொதுக் கூட்டத்தால் தீர்மானிக்கப்படும் இதேபோன்ற விளையாட்டு அல்லது சமூக-கலாச்சார நோக்கத்திற்கு மாற்றப்படும்.

---

அத்தியாயம் 12 — இறுதி விதிகள்

பிரிவு 36 — நடைமுறைக்கு வருதல்
இந்த சட்டதிட்டங்கள் பொதுக் கூட்டத்தின் ஒப்புதலுக்கு பிறகு நடைமுறைக்கு வரும்.

பிரிவு 37 — கணிக்கப்படாத நிகழ்வுகள்
இந்த சட்டதிட்டங்களில் கணிக்கப்படாத அனைத்து நிகழ்வுகளிலும் நிர்வாக குழு தீர்மானிக்கும். தீர்மானம் அடுத்த பொதுக் கூட்டத்தில் உறுதிப்படுத்தப்படும்.

பிரிவு 38 — வெளியீடு
சட்டதிட்டங்கள் BTSA தளம் மூலம் அனைத்து உறுப்பினர்களுக்கும் கிடைக்கும்படி செய்யப்படும்.

BTSA இன் நிறுவன பொதுக் கூட்டத்தால் தயாரிக்கப்பட்டு ஒப்புதல் அளிக்கப்பட்டது.
`

function StatutenSection() {
  const [lang, setLang] = useState<'nl' | 'ta'>('nl')
  const text = lang === 'nl' ? STATUTEN_NL : STATUTEN_TA

  return (
    <div style={{ marginTop: 96 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, #A50044, transparent)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#111827', letterSpacing: 2 }}>STATUTEN</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16, color: '#6B7280', letterSpacing: 1 }}>சட்டதிட்டங்கள்</div>
        </div>
        <div style={{ flex: 1, height: 2, background: 'linear-gradient(270deg, #004D98, transparent)' }} />
      </div>

      {/* Language toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
        <button onClick={() => setLang('nl')} style={{
          padding: '10px 32px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 1,
          border: 'none', cursor: 'pointer', borderRadius: '4px 0 0 4px',
          background: lang === 'nl' ? '#A50044' : '#E5E7EB', color: lang === 'nl' ? '#fff' : '#6B7280',
        }}>🇧🇪 NEDERLANDS</button>
        <button onClick={() => setLang('ta')} style={{
          padding: '10px 32px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: 1,
          border: 'none', cursor: 'pointer', borderRadius: '0 4px 4px 0',
          background: lang === 'ta' ? '#004D98' : '#E5E7EB', color: lang === 'ta' ? '#fff' : '#6B7280',
        }}>தமிழ்</button>
      </div>

      {/* Constitution text */}
      <div style={{ background: '#fff', borderRadius: 12, padding: typeof window !== 'undefined' && window.innerWidth < 768 ? '24px 20px' : '48px 56px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', borderTop: '4px solid #A50044' }}>
        <pre style={{
          fontFamily: lang === 'ta' ? 'Noto Sans Tamil, serif' : 'Rajdhani, sans-serif',
          fontSize: lang === 'ta' ? 15 : 14,
          fontWeight: lang === 'ta' ? 400 : 500,
          color: '#1F2937',
          lineHeight: 1.9,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
        }}>{text.trim()}</pre>
      </div>
    </div>
  )
}
