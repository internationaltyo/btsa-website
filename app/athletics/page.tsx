'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Barcelona palette
const C = {
  red:    '#A50044',
  blue:   '#004D98',
  gold:   '#F5A623',
  dark:   '#0D1128',
  white:  '#FFFFFF',
  light:  '#F4F5F7',
  border: '#E2E6EF',
  muted:  '#6B7280',
  text:   '#111827',
}

const AGE_GROUPS = [
  { key:'g1',  labelTa:'வயது 04',        labelEn:'Age 4',       birthYears:[2022],      genders:['male','female'] as const,
    sports:[{ta:'20மீ. ஓட்டம்',en:'20m Run'},{ta:'இனிப்புடன் ஓடுதல்',en:'Run with Candy'},{ta:'பழம் பொறுக்குதல்',en:'Fruit Picking'},{ta:'நீர் நிரப்புதல்',en:'Water Filling'}]},
  { key:'g2',  labelTa:'வயது 04-05',     labelEn:'Age 4-5',     birthYears:[2021,2020], genders:['male','female'] as const,
    sports:[{ta:'25மீ. ஓட்டம்',en:'25m Run'},{ta:'நிறம் இனம் காணுதல்',en:'Color ID'},{ta:'பழம் பொறுக்குதல்',en:'Fruit Picking'},{ta:'நீர் நிரப்புதல்',en:'Water Filling'}]},
  { key:'g3',  labelTa:'வயது 06-07',     labelEn:'Age 6-7',     birthYears:[2019,2018], genders:['male','female'] as const,
    sports:[{ta:'50மீ. ஓட்டம்',en:'50m Run'},{ta:'வாளிக்குள் பந்து',en:'Ball into Bucket'},{ta:'படம்-சொல் பொருத்தம்',en:'Picture Word Match'},{ta:'நீர் நிரப்புதல்',en:'Water Filling'}]},
  { key:'g4',  labelTa:'வயது 08-09',     labelEn:'Age 8-9',     birthYears:[2017,2016], genders:['male','female'] as const,
    sports:[{ta:'75மீ. ஓட்டம்',en:'75m Run'},{ta:'வாளிக்குள் பந்து',en:'Ball into Bucket'},{ta:'படம்-சொல் பொருத்தம்',en:'Picture Word Match'},{ta:'தலையில் பொதியுடன் ஓடுதல்',en:'Run with Load'}]},
  { key:'g5',  labelTa:'வயது 10-11',     labelEn:'Age 10-11',   birthYears:[2015,2014], genders:['male','female'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'சாக்கோட்டம்',en:'Sack Race'},{ta:'உருவம் பொருத்துதல்',en:'Shape Matching'},{ta:'பலூன் உடைத்தல்',en:'Balloon Burst'}]},
  { key:'g6',  labelTa:'வயது 12-13',     labelEn:'Age 12-13',   birthYears:[2013,2012], genders:['male','female'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'சாக்கோட்டம்',en:'Sack Race'},{ta:'உருவம் பொருத்துதல்',en:'Shape Matching'},{ta:'யானைக்கு கண் வைத்தல்',en:'Elephant Drawing'}]},
  { key:'g7',  labelTa:'வயது 14-15',     labelEn:'Age 14-15',   birthYears:[2011,2010], genders:['male','female'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'குண்டு போடுதல்',en:'Shot Put'},{ta:'சாக்கோட்டம்',en:'Sack Race'},{ta:'யானைக்கு கண் வைத்தல்',en:'Elephant Drawing'}]},
  { key:'g8',  labelTa:'வயது 16-17',     labelEn:'Age 16-17',   birthYears:[2009,2008], genders:['male','female'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'சாக்கோட்டம்',en:'Sack Race'},{ta:'குண்டு போடுதல்',en:'Shot Put'},{ta:'நின்று நீளம் பாய்தல்',en:'Standing Long Jump'}]},
  { key:'g9f', labelTa:'வயது 18+ பெண்',  labelEn:'Age 18+ Women', birthYears:[],        genders:['female'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'கூடையில் பழம்',en:'Fruit Basket'},{ta:'குண்டு போடுதல்',en:'Shot Put'},{ta:'தேசிக்காய்க் கரண்டி',en:'Spoon & Lime'},{ta:'சங்கீதக் கதிரை',en:'Musical Chairs'}]},
  { key:'g9m', labelTa:'வயது 18+ ஆண்',   labelEn:'Age 18+ Men',   birthYears:[],        genders:['male'] as const,
    sports:[{ta:'100மீ. ஓட்டம்',en:'100m Run'},{ta:'குண்டு போடுதல்',en:'Shot Put'},{ta:'தட்டு எறிதல்',en:'Discus Throw'},{ta:'சாக்கோட்டம்',en:'Sack Race'},{ta:'பாரம் தூக்குதல்',en:'Weight Lifting'}]},
]

function getGroup(birthYear: number, gender: 'male' | 'female') {
  if (birthYear === 2022) return AGE_GROUPS[0]
  if (birthYear === 2021 || birthYear === 2020) return AGE_GROUPS[1]
  if (birthYear === 2019 || birthYear === 2018) return AGE_GROUPS[2]
  if (birthYear === 2017 || birthYear === 2016) return AGE_GROUPS[3]
  if (birthYear === 2015 || birthYear === 2014) return AGE_GROUPS[4]
  if (birthYear === 2013 || birthYear === 2012) return AGE_GROUPS[5]
  if (birthYear === 2011 || birthYear === 2010) return AGE_GROUPS[6]
  if (birthYear === 2009 || birthYear === 2008) return AGE_GROUPS[7]
  if (birthYear <= 2007) return gender === 'female' ? AGE_GROUPS[8] : AGE_GROUPS[9]
  return null
}

type Registration = { id: string; first_name: string; date_of_birth: string; gender: string; events: string[] }

export default function AthleticsPage() {
  const [step, setStep] = useState<'form' | 'sports' | 'done'>('form')
  const [firstName, setFirstName] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear2, setBirthYear2] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const birthDate = birthDay && birthMonth && birthYear2 ? `${birthYear2}-${birthMonth.padStart(2,'0')}-${birthDay.padStart(2,'0')}` : ''
  const birthYear = birthYear2 ? parseInt(birthYear2) : null
  const group = birthYear && gender ? getGroup(birthYear, gender as 'male' | 'female') : null

  useEffect(() => {
    supabase.from('athlete_registrations').select('id,first_name,date_of_birth,gender,events').then(({ data }) => {
      setRegistrations(data ?? [])
    })
  }, [step])

  function toggleSport(sport: string) {
    setSelected(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : prev.length < 3 ? [...prev, sport] : prev)
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !birthDay || !birthMonth || !birthYear2 || !gender) { setError('Vul alle velden in.'); return }
    if (!group) { setError(`Geboortejaar ${birthYear} valt buiten de beschikbare leeftijdsgroepen.`); return }
    setError('')
    setStep('sports')
  }

  async function handleSubmit() {
    if (selected.length === 0) { setError('Kies minstens 1 sport.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('athlete_registrations').insert({
      first_name: firstName, last_name: '', date_of_birth: birthDate, gender, events: selected, notes: group?.labelEn,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setStep('done'); setLoading(false)
  }

  function getNamesForSport(groupKey: string, sportEn: string, g: string) {
    return registrations.filter(r => {
      if (r.gender !== g) return false
      const by = new Date(r.date_of_birth).getFullYear()
      const rg = getGroup(by, r.gender as 'male' | 'female')
      return rg?.key === groupKey && r.events?.includes(sportEn)
    }).map(r => r.first_name)
  }

  const totalRegistrations = registrations.length

  return (
    <div style={{ minHeight: '100vh', background: C.dark }}>

      {/* ── HERO HEADER (dark, Barcelona style) ── */}
      <div style={{ background: C.dark, padding: '56px 48px 48px', borderBottom: `4px solid ${C.red}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 4, height: 40, background: C.red }} />
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: C.gold, marginBottom: 2 }}>தமிழர் விளையாட்டு விழா 2025</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: C.muted }}>TAMIL SPORTS FESTIVAL</div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 72, lineHeight: 0.9, color: C.white, margin: 0 }}>
            ATHLETICS<br /><span style={{ color: C.gold }}>REGISTRATIE</span>
          </h1>
          <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: C.gold, lineHeight: 1 }}>{totalRegistrations}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, color: C.muted, letterSpacing: 1 }}>INGESCHREVEN</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: C.gold, lineHeight: 1 }}>10</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, color: C.muted, letterSpacing: 1 }}>CATEGORIEËN</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── REGISTRATION FORM (white background) ── */}
      <div style={{ background: C.white, padding: '64px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Steps indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48 }}>
            {['Gegevens', 'Sport kiezen', 'Bevestigd'].map((s, i) => {
              const stepIdx = step === 'form' ? 0 : step === 'sports' ? 1 : 2
              const active = i === stepIdx
              const done = i < stepIdx
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? C.red : active ? C.dark : C.light,
                      border: `2px solid ${done || active ? 'transparent' : C.border}`,
                      fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, color: done || active ? C.white : C.muted,
                    }}>{done ? '✓' : i + 1}</div>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: active ? C.text : done ? C.red : C.muted, letterSpacing: 0.5 }}>{s}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? C.red : C.border, margin: '0 16px' }} />}
                </div>
              )
            })}
          </div>

          {/* STEP 1: Persoonsgegevens */}
          {step === 'form' && (
            <form onSubmit={handleNext}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: C.text, marginBottom: 32, letterSpacing: 1 }}>
                பதிவு விவரங்கள் / PERSOONSGEGEVENS
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: C.muted }}>
                    பெயர் / VOORNAAM *
                  </label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jouw voornaam" required
                    style={{ width: '100%', padding: '14px 16px', border: `2px solid ${C.border}`, borderRadius: 4, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 15, color: C.text, background: C.white, outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: C.muted }}>
                    பிறந்த தேதி / GEBOORTEDATUM *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 8 }}>
                    <select value={birthDay} onChange={e => setBirthDay(e.target.value)}
                      style={{ padding: '14px 10px', border: `2px solid ${C.border}`, borderRadius: 4, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 15, color: birthDay ? C.text : C.muted, background: C.white, outline: 'none' }}>
                      <option value="">Dag</option>
                      {Array.from({length:31},(_,i)=>i+1).map(d=><option key={d} value={String(d)}>{String(d).padStart(2,'0')}</option>)}
                    </select>
                    <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)}
                      style={{ padding: '14px 10px', border: `2px solid ${C.border}`, borderRadius: 4, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 15, color: birthMonth ? C.text : C.muted, background: C.white, outline: 'none' }}>
                      <option value="">Maand</option>
                      {['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'].map((m,i)=>(
                        <option key={i+1} value={String(i+1)}>{m}</option>
                      ))}
                    </select>
                    <select value={birthYear2} onChange={e => setBirthYear2(e.target.value)}
                      style={{ padding: '14px 10px', border: `2px solid ${C.border}`, borderRadius: 4, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 15, color: birthYear2 ? C.text : C.muted, background: C.white, outline: 'none' }}>
                      <option value="">Jaar</option>
                      {Array.from({length:2024-1950+1},(_,i)=>2024-i).map(y=><option key={y} value={String(y)}>{y}</option>)}
                    </select>
                  </div>
                  {birthYear && group && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#FFF8EC', border: `1px solid ${C.gold}`, borderRadius: 4 }}>
                      <span style={{ color: C.gold, fontSize: 16 }}>✓</span>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#92400E' }}>
                        {group.labelEn} · {group.labelTa}
                      </span>
                    </div>
                  )}
                  {birthYear && !group && (
                    <div style={{ marginTop: 10, padding: '10px 14px', background: '#FEF2F2', border: `1px solid #FCA5A5`, borderRadius: 4 }}>
                      <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#991B1B' }}>
                        Geboortejaar {birthYear} valt buiten de beschikbare leeftijdsgroepen.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: C.muted }}>
                    பாலினம் / GESLACHT *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[{ val:'male', ta:'ஆண்', nl:'Man', icon:'♂' }, { val:'female', ta:'பெண்', nl:'Vrouw', icon:'♀' }].map(g => (
                      <button key={g.val} type="button" onClick={() => setGender(g.val as 'male' | 'female')} style={{
                        padding: '18px 16px', border: `2px solid ${gender === g.val ? C.red : C.border}`,
                        background: gender === g.val ? C.red : C.light,
                        color: gender === g.val ? C.white : C.text,
                        borderRadius: 4, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
                        transition: 'all 0.15s',
                      }}>
                        <span style={{ fontSize: 20, marginRight: 8 }}>{g.icon}</span>
                        {g.ta} / {g.nl}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, color: '#991B1B', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <button type="submit" style={{
                  background: C.dark, color: C.white, padding: '16px', borderRadius: 4,
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 3, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                }}>
                  VERDER — SPORT KIEZEN <span style={{ color: C.gold }}>→</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Sport kiezen */}
          {step === 'sports' && group && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: C.text, marginBottom: 4, letterSpacing: 1 }}>
                    விளையாட்டு தேர்வு / SPORT KIEZEN
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: C.red, color: C.white, padding: '3px 10px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, borderRadius: 2 }}>{group.labelEn}</span>
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: C.muted }}>{firstName} · {gender === 'male' ? 'Man' : 'Vrouw'}</span>
                  </div>
                </div>
                <button onClick={() => { setStep('form'); setSelected([]) }} type="button" style={{
                  background: C.light, border: `1px solid ${C.border}`, color: C.muted, padding: '8px 16px',
                  cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 12, borderRadius: 4,
                }}>← Terug</button>
              </div>

              <div style={{ background: '#FFF8EC', border: `1px solid ${C.gold}`, borderRadius: 4, padding: '12px 16px', marginBottom: 24 }}>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: '#92400E' }}>
                  Kies maximaal <strong>3</strong> sporten · அதிகபட்சம் <strong>3</strong> விளையாட்டுகள்
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {group.sports.map((sport, i) => {
                  const isSelected = selected.includes(sport.en)
                  const isDisabled = !isSelected && selected.length >= 3
                  return (
                    <button key={sport.en} onClick={() => !isDisabled && toggleSport(sport.en)} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                      border: `2px solid ${isSelected ? C.red : C.border}`,
                      background: isSelected ? '#FFF5F7' : isDisabled ? C.light : C.white,
                      borderRadius: 4, cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1, textAlign: 'left', transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 4,
                        border: `2px solid ${isSelected ? C.red : C.border}`,
                        background: isSelected ? C.red : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isSelected && <span style={{ color: C.white, fontSize: 13, fontWeight: 900 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: isSelected ? C.red : C.text }}>{sport.en}</div>
                        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: C.muted }}>{sport.ta}</div>
                      </div>
                      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: isSelected ? C.red : C.border }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1,2,3].map(n => (
                    <div key={n} style={{ width: 10, height: 10, borderRadius: '50%', background: selected.length >= n ? C.red : C.border }} />
                  ))}
                </div>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: selected.length === 3 ? C.red : C.muted }}>
                  {selected.length}/3 gekozen
                </span>
              </div>

              {error && <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 4, color: '#991B1B', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13, marginBottom: 16 }}>{error}</div>}

              <button onClick={handleSubmit} disabled={loading || selected.length === 0} style={{
                width: '100%', background: selected.length > 0 ? C.red : C.light,
                color: selected.length > 0 ? C.white : C.muted, padding: '16px',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: 3, border: 'none', borderRadius: 4,
                cursor: selected.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}>
                {loading ? 'BEZIG MET OPSLAAN…' : 'BEVESTIGEN & INSCHRIJVEN →'}
              </button>
            </div>
          )}

          {/* STEP 3: Bevestiging */}
          {step === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F0FDF4', border: '3px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>✅</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#15803D', marginBottom: 4, letterSpacing: 1 }}>INSCHRIJVING BEVESTIGD!</h2>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 14, color: '#22C55E', marginBottom: 32 }}>பதிவு உறுதிப்படுத்தப்பட்டது!</p>
              <div style={{ background: C.light, border: `1px solid ${C.border}`, borderRadius: 4, padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 12 }}>{firstName}</div>
                {selected.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: `1px solid ${C.border}`, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 14, color: C.text }}>
                    <span style={{ color: C.red, fontSize: 16 }}>✓</span> {s}
                  </div>
                ))}
              </div>
              <button onClick={() => { setStep('form'); setFirstName(''); setBirthDay(''); setBirthMonth(''); setBirthYear2(''); setGender(''); setSelected([]) }}
                style={{ background: C.dark, color: C.white, padding: '14px 32px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: 2, border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                + NIEUWE INSCHRIJVING
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PARTICIPANTS LIST ── */}
      <div style={{ padding: '72px 48px', background: C.dark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56 }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>பதிவு பட்டியல் · DEELNEMERSLIJST</div>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, color: C.white, margin: 0, lineHeight: 0.9 }}>
                DEELNEMERS<br /><span style={{ color: C.gold }}>OVERZICHT</span>
              </h2>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>{totalRegistrations}</div>
          </div>

          {AGE_GROUPS.map((ag, idx) => (
            <div key={ag.key} style={{ marginBottom: 56 }}>
              {/* Age group header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
                <div style={{ background: C.red, padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: C.white, letterSpacing: 1 }}>{ag.labelEn}</span>
                  <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{ag.labelTa}</span>
                </div>
                <div style={{ flex: 1, height: 2, background: C.border }} />
              </div>

              {/* Gender columns */}
              <div style={{ display: 'grid', gridTemplateColumns: ag.genders.length === 2 ? '1fr 1fr' : '1fr', gap: 2 }}>
                {ag.genders.map(g => (
                  <div key={g}>
                    {/* Gender label */}
                    {(() => {
                      const isAdult = ag.key === 'g9m' || ag.key === 'g9f'
                      const taNl = g === 'male'
                        ? (isAdult ? 'ஆண் · MAN' : 'ஆண் · JONGEN')
                        : (isAdult ? 'பெண் · VROUW' : 'பெண் · MEISJE')
                      return (
                        <div style={{ padding: '10px 16px', marginBottom: 2, background: g === 'male' ? C.blue : '#BE185D', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 16, color: C.white }}>{g === 'male' ? '♂' : '♀'}</span>
                          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: C.white, letterSpacing: 2 }}>{taNl}</span>
                        </div>
                      )
                    })()}

                    {/* Sports list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {ag.sports.map((sport, si) => {
                        const names = getNamesForSport(ag.key, sport.en, g)
                        return (
                          <div key={sport.en} style={{
                            background: C.white,
                            padding: '14px 16px',
                            borderLeft: `4px solid ${names.length > 0 ? C.gold : C.border}`,
                            borderBottom: `1px solid ${C.border}`,
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: names.length > 0 ? 10 : 0 }}>
                              <div>
                                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 15, color: C.text }}>
                                  {sport.en}
                                </span>
                                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, color: C.muted, marginLeft: 8 }}>
                                  {sport.ta}
                                </span>
                              </div>
                              {names.length > 0 && (
                                <span style={{ background: C.gold, color: C.dark, padding: '2px 10px', borderRadius: 2, fontFamily: 'Bebas Neue, sans-serif', fontSize: 14, fontWeight: 700 }}>
                                  {names.length}
                                </span>
                              )}
                            </div>
                            {names.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {names.map((name, ni) => (
                                  <span key={ni} style={{
                                    background: C.dark, color: C.white, padding: '4px 12px',
                                    fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, borderRadius: 2,
                                  }}>{name}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {registrations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.3)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 16 }}>
              Nog geen inschrijvingen · இன்னும் பதிவுகள் இல்லை
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
