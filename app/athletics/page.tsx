'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// All age groups with sports (Tamil + English), based on birth year in 2025
const AGE_GROUPS: Record<string, {
  labelTa: string
  labelEn: string
  birthYears: number[]
  genders: ('male' | 'female' | 'both')[]
  sports: { ta: string; en: string }[]
}> = {
  g1: {
    labelTa: 'வயது 04 — மழலையர்',
    labelEn: 'Age 4 — Toddlers',
    birthYears: [2022],
    genders: ['both'],
    sports: [
      { ta: '20மீ. ஓட்டம்', en: '20m Run' },
      { ta: 'இனிப்பு எடுத்துக்கொண்டு ஓடுதல்', en: 'Run with Candy' },
      { ta: 'பழம் பொறுக்குதல்', en: 'Fruit Picking' },
      { ta: 'நீர் நிரப்புதல்', en: 'Water Filling' },
    ],
  },
  g2: {
    labelTa: 'வயதுப்பிரிவு 04-05',
    labelEn: 'Age 4-5',
    birthYears: [2021, 2020],
    genders: ['both'],
    sports: [
      { ta: '25மீ. ஓட்டம்', en: '25m Run' },
      { ta: 'நிறம் இனம் காணுதல்', en: 'Color Identification' },
      { ta: 'பழம் பொறுக்குதல்', en: 'Fruit Picking' },
      { ta: 'நீர் நிரப்புதல்', en: 'Water Filling' },
    ],
  },
  g3: {
    labelTa: 'வயதுப்பிரிவு 06-07',
    labelEn: 'Age 6-7',
    birthYears: [2019, 2018],
    genders: ['both'],
    sports: [
      { ta: '50மீ. ஓட்டம்', en: '50m Run' },
      { ta: 'வாளிக்குள் பந்து போடுதல்', en: 'Ball Throw into Bucket' },
      { ta: 'படத்திற்குரிய சொல்லைத் தெரிவு செய்தல்', en: 'Picture Word Match' },
      { ta: 'நீர் நிரப்புதல்', en: 'Water Filling' },
    ],
  },
  g4: {
    labelTa: 'வயதுப்பிரிவு 08-09',
    labelEn: 'Age 8-9',
    birthYears: [2017, 2016],
    genders: ['both'],
    sports: [
      { ta: '75மீ. ஓட்டம்', en: '75m Run' },
      { ta: 'வாளிக்குள் பந்து போடுதல்', en: 'Ball Throw into Bucket' },
      { ta: 'படத்திற்குரிய சொல்லைத் தெரிவு செய்தல்', en: 'Picture Word Match' },
      { ta: 'தலையில் பொதியுடன் ஓடுதல்', en: 'Run with Load on Head' },
    ],
  },
  g5: {
    labelTa: 'வயதுப்பிரிவு 10-11',
    labelEn: 'Age 10-11',
    birthYears: [2015, 2014],
    genders: ['both'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'சாக்கோட்டம்', en: 'Sack Race' },
      { ta: 'உருவம் பொருத்துதல்', en: 'Shape Matching' },
      { ta: 'பலூன் ஊதி உடைத்தல்', en: 'Balloon Blow & Burst' },
    ],
  },
  g6: {
    labelTa: 'வயதுப்பிரிவு 12-13',
    labelEn: 'Age 12-13',
    birthYears: [2013, 2012],
    genders: ['both'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'சாக்கோட்டம்', en: 'Sack Race' },
      { ta: 'உருவம் பொருத்துதல்', en: 'Shape Matching' },
      { ta: 'யானைக்கு கண் வைத்தல்', en: 'Blindfold Elephant Drawing' },
    ],
  },
  g7: {
    labelTa: 'வயதுப்பிரிவு 14-15',
    labelEn: 'Age 14-15',
    birthYears: [2011, 2010],
    genders: ['both'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'குண்டு போடுதல்', en: 'Shot Put' },
      { ta: 'சாக்கோட்டம்', en: 'Sack Race' },
      { ta: 'யானைக்கு கண் வைத்தல்', en: 'Blindfold Elephant Drawing' },
    ],
  },
  g8: {
    labelTa: 'வயதுப்பிரிவு 16-17',
    labelEn: 'Age 16-17',
    birthYears: [2009, 2008],
    genders: ['both'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'சாக்கோட்டம்', en: 'Sack Race' },
      { ta: 'குண்டு போடுதல்', en: 'Shot Put' },
      { ta: 'நின்று நீளம் பாய்தல்', en: 'Standing Long Jump' },
    ],
  },
  g9f: {
    labelTa: 'வயதுப்பிரிவு 18+ பெண்',
    labelEn: 'Age 18+ Women',
    birthYears: [], // 2007 or earlier
    genders: ['female'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'கூடையில் பழம் சேகரித்தல்', en: 'Fruit Picking from Basket' },
      { ta: 'குண்டு போடுதல்', en: 'Shot Put' },
      { ta: 'தேசிக்காய்க் கரண்டி', en: 'Spoon & Lime Race' },
      { ta: 'சங்கீதக் கதிரை', en: 'Musical Chairs' },
    ],
  },
  g9m: {
    labelTa: 'வயதுப்பிரிவு 18+ ஆண்',
    labelEn: 'Age 18+ Men',
    birthYears: [], // 2007 or earlier
    genders: ['male'],
    sports: [
      { ta: '100மீ. ஓட்டம்', en: '100m Run' },
      { ta: 'குண்டு போடுதல்', en: 'Shot Put' },
      { ta: 'தட்டு எறிதல்', en: 'Discus Throw' },
      { ta: 'சாக்கோட்டம்', en: 'Sack Race' },
      { ta: 'பாரம் தூக்குதல்', en: 'Weight Lifting' },
    ],
  },
}

function getGroup(birthYear: number, gender: 'male' | 'female') {
  if (birthYear === 2022) return AGE_GROUPS.g1
  if (birthYear === 2021 || birthYear === 2020) return AGE_GROUPS.g2
  if (birthYear === 2019 || birthYear === 2018) return AGE_GROUPS.g3
  if (birthYear === 2017 || birthYear === 2016) return AGE_GROUPS.g4
  if (birthYear === 2015 || birthYear === 2014) return AGE_GROUPS.g5
  if (birthYear === 2013 || birthYear === 2012) return AGE_GROUPS.g6
  if (birthYear === 2011 || birthYear === 2010) return AGE_GROUPS.g7
  if (birthYear === 2009 || birthYear === 2008) return AGE_GROUPS.g8
  if (birthYear <= 2007) return gender === 'female' ? AGE_GROUPS.g9f : AGE_GROUPS.g9m
  return null
}

export default function AthleticsPage() {
  const [step, setStep] = useState<'form' | 'sports' | 'done'>('form')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const birthYear = birthDate ? new Date(birthDate).getFullYear() : null
  const group = birthYear && gender ? getGroup(birthYear, gender as 'male' | 'female') : null

  function toggleSport(sport: string) {
    setSelected(prev =>
      prev.includes(sport)
        ? prev.filter(s => s !== sport)
        : prev.length < 3 ? [...prev, sport] : prev
    )
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName || !birthDate || !gender) { setError('Vul alle velden in.'); return }
    if (!group) { setError('Geboortejaar valt buiten de beschikbare leeftijdsgroepen (2008-2022 of 18+).'); return }
    setError('')
    setStep('sports')
  }

  async function handleSubmit() {
    if (selected.length === 0) { setError('Kies minstens 1 sport.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('athlete_registrations').insert({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: birthDate,
      gender,
      events: selected,
      notes: group?.labelEn,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setStep('done')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 40px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 8 }}>
            தமிழர் விளையாட்டு விழா 2025
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, lineHeight: 0.95, marginBottom: 8 }}>
            ATHLETICS<br />REGISTRATIE
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Schrijf je in voor de Tamil Sports Games · அணிவகுப்பு பதிவு
          </p>
          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
            {['Gegevens', 'Sporten kiezen', 'Bevestigd'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue', fontSize: 14,
                  background: (step === 'form' && i === 0) || (step === 'sports' && i === 1) || (step === 'done' && i === 2)
                    ? 'var(--accent)' : i < (['form','sports','done'].indexOf(step)) ? 'var(--green)' : 'var(--bg3)',
                  color: '#000',
                }}>{i + 1}</div>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: 'var(--muted)' }}>{s}</span>
                {i < 2 && <div style={{ width: 24, height: 1, background: 'var(--border)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: Persoonsgegevens */}
        {step === 'form' && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 32 }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 24, marginBottom: 24 }}>
              பதிவு விவரங்கள் / Persoonsgegevens
            </h2>
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                    பெயர் / VOORNAAM *
                  </label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Voornaam" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                    குடும்பப்பெயர் / ACHTERNAAM *
                  </label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Achternaam" required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                  பிறந்த தேதி / GEBOORTEDATUM *
                </label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required max="2023-12-31" min="1950-01-01" />
                {birthYear && group && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 4 }}>
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
                      ✓ {group.labelTa} · {group.labelEn}
                    </span>
                  </div>
                )}
                {birthYear && !group && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(226,35,26,0.1)', border: '1px solid rgba(226,35,26,0.3)', borderRadius: 4 }}>
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, color: 'var(--red)' }}>
                      Dit geboortejaar ({birthYear}) valt buiten de leeftijdsgroepen.
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 10, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                  பாலினம் / GESLACHT *
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[{ val: 'male', ta: 'ஆண்', nl: 'Man' }, { val: 'female', ta: 'பெண்', nl: 'Vrouw' }].map(g => (
                    <button key={g.val} type="button" onClick={() => setGender(g.val as 'male' | 'female')} style={{
                      flex: 1, padding: '14px', border: `2px solid ${gender === g.val ? 'var(--accent)' : 'var(--border)'}`,
                      background: gender === g.val ? 'rgba(245,166,35,0.1)' : 'var(--bg3)',
                      color: gender === g.val ? 'var(--accent)' : 'var(--text)',
                      borderRadius: 4, cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 15,
                    }}>
                      {g.ta} / {g.nl}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}
              <button type="submit" style={{
                background: 'var(--accent)', color: '#000', padding: '14px',
                fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 2, border: 'none', cursor: 'pointer', marginTop: 8,
              }}>
                VERDER → SPORT KIEZEN
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Sport kiezen */}
        {step === 'sports' && group && (
          <div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 32, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 24, marginBottom: 4 }}>
                    விளையாட்டு தேர்வு / SPORT KIEZEN
                  </h2>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
                    {group.labelTa} · {group.labelEn}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {firstName} · {gender === 'male' ? 'ஆண் / Man' : 'பெண் / Vrouw'} · {birthDate}
                  </div>
                </div>
                <button onClick={() => { setStep('form'); setSelected([]) }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, borderRadius: 4 }}>
                  ← Terug
                </button>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
                Kies <strong style={{ color: 'var(--accent)' }}>maximaal 3</strong> sporten · அதிகபட்சம் <strong style={{ color: 'var(--accent)' }}>3</strong> விளையாட்டுகளை தேர்ந்தெடுக்கவும்
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.sports.map((sport, i) => {
                  const key = `${sport.en}`
                  const isSelected = selected.includes(key)
                  const isDisabled = !isSelected && selected.length >= 3
                  return (
                    <button key={key} onClick={() => !isDisabled && toggleSport(key)} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 20px', border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isSelected ? 'rgba(245,166,35,0.08)' : 'var(--bg3)',
                      color: isDisabled ? 'var(--muted)' : 'var(--text)',
                      borderRadius: 4, cursor: isDisabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left', opacity: isDisabled ? 0.5 : 1, transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 4, border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isSelected && <span style={{ color: '#000', fontSize: 14, fontWeight: 900 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{sport.en}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sport.ta}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', fontFamily: 'Bebas Neue', fontSize: 20, color: isSelected ? 'var(--accent)' : 'var(--border)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: selected.length === 3 ? 'var(--accent)' : 'var(--muted)' }}>
                  {selected.length}/3 gekozen
                </div>
              </div>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading || selected.length === 0} style={{
              width: '100%', background: selected.length > 0 ? 'var(--accent)' : 'var(--bg3)',
              color: selected.length > 0 ? '#000' : 'var(--muted)', padding: '16px',
              fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 2, border: 'none',
              cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
            }}>
              {loading ? 'BEZIG MET OPSLAAN…' : 'BEVESTIGEN & INSCHRIJVEN →'}
            </button>
          </div>
        )}

        {/* STEP 3: Bevestiging */}
        {step === 'done' && (
          <div style={{ background: 'var(--bg2)', border: '2px solid var(--green)', padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, color: 'var(--green)', marginBottom: 8 }}>
              INSCHRIJVING BEVESTIGD!
            </h2>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 16, color: 'var(--green)', marginBottom: 24 }}>
              பதிவு உறுதிப்படுத்தப்பட்டது!
            </div>
            <div style={{ background: 'var(--bg3)', padding: '20px 24px', borderRadius: 4, marginBottom: 24, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{firstName} {lastName}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                {group?.labelEn} · {gender === 'male' ? 'Man' : 'Vrouw'} · {birthDate}
              </div>
              {selected.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--accent)' }}>✓</span> {s}
                </div>
              ))}
            </div>
            <button onClick={() => { setStep('form'); setFirstName(''); setLastName(''); setBirthDate(''); setGender(''); setSelected([]) }}
              style={{ background: 'var(--accent)', color: '#000', padding: '12px 32px', fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, border: 'none', cursor: 'pointer' }}>
              + NIEUWE INSCHRIJVING
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
