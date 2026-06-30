'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const AGE_GROUPS = [
  { key: 'g1',  labelTa: 'வயது 04',       labelEn: 'Age 4',      birthYears: [2022],       genders: ['male','female'] as const,
    sports: [{ ta:'20மீ. ஓட்டம்', en:'20m Run' },{ ta:'இனிப்புடன் ஓடுதல்', en:'Run with Candy' },{ ta:'பழம் பொறுக்குதல்', en:'Fruit Picking' },{ ta:'நீர் நிரப்புதல்', en:'Water Filling' }] },
  { key: 'g2',  labelTa: 'வயது 04-05',    labelEn: 'Age 4-5',    birthYears: [2021,2020],  genders: ['male','female'] as const,
    sports: [{ ta:'25மீ. ஓட்டம்', en:'25m Run' },{ ta:'நிறம் இனம் காணுதல்', en:'Color ID' },{ ta:'பழம் பொறுக்குதல்', en:'Fruit Picking' },{ ta:'நீர் நிரப்புதல்', en:'Water Filling' }] },
  { key: 'g3',  labelTa: 'வயது 06-07',    labelEn: 'Age 6-7',    birthYears: [2019,2018],  genders: ['male','female'] as const,
    sports: [{ ta:'50மீ. ஓட்டம்', en:'50m Run' },{ ta:'வாளிக்குள் பந்து', en:'Ball into Bucket' },{ ta:'படம்-சொல் பொருத்தம்', en:'Picture Word Match' },{ ta:'நீர் நிரப்புதல்', en:'Water Filling' }] },
  { key: 'g4',  labelTa: 'வயது 08-09',    labelEn: 'Age 8-9',    birthYears: [2017,2016],  genders: ['male','female'] as const,
    sports: [{ ta:'75மீ. ஓட்டம்', en:'75m Run' },{ ta:'வாளிக்குள் பந்து', en:'Ball into Bucket' },{ ta:'படம்-சொல் பொருத்தம்', en:'Picture Word Match' },{ ta:'தலையில் பொதியுடன் ஓடுதல்', en:'Run with Load' }] },
  { key: 'g5',  labelTa: 'வயது 10-11',    labelEn: 'Age 10-11',  birthYears: [2015,2014],  genders: ['male','female'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'சாக்கோட்டம்', en:'Sack Race' },{ ta:'உருவம் பொருத்துதல்', en:'Shape Matching' },{ ta:'பலூன் உடைத்தல்', en:'Balloon Burst' }] },
  { key: 'g6',  labelTa: 'வயது 12-13',    labelEn: 'Age 12-13',  birthYears: [2013,2012],  genders: ['male','female'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'சாக்கோட்டம்', en:'Sack Race' },{ ta:'உருவம் பொருத்துதல்', en:'Shape Matching' },{ ta:'யானைக்கு கண் வைத்தல்', en:'Elephant Drawing' }] },
  { key: 'g7',  labelTa: 'வயது 14-15',    labelEn: 'Age 14-15',  birthYears: [2011,2010],  genders: ['male','female'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'குண்டு போடுதல்', en:'Shot Put' },{ ta:'சாக்கோட்டம்', en:'Sack Race' },{ ta:'யானைக்கு கண் வைத்தல்', en:'Elephant Drawing' }] },
  { key: 'g8',  labelTa: 'வயது 16-17',    labelEn: 'Age 16-17',  birthYears: [2009,2008],  genders: ['male','female'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'சாக்கோட்டம்', en:'Sack Race' },{ ta:'குண்டு போடுதல்', en:'Shot Put' },{ ta:'நின்று நீளம் பாய்தல்', en:'Standing Long Jump' }] },
  { key: 'g9f', labelTa: 'வயது 18+ பெண்', labelEn: 'Age 18+ Women', birthYears: [],       genders: ['female'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'கூடையில் பழம்', en:'Fruit Basket' },{ ta:'குண்டு போடுதல்', en:'Shot Put' },{ ta:'தேசிக்காய்க் கரண்டி', en:'Spoon & Lime' },{ ta:'சங்கீதக் கதிரை', en:'Musical Chairs' }] },
  { key: 'g9m', labelTa: 'வயது 18+ ஆண்',  labelEn: 'Age 18+ Men',   birthYears: [],       genders: ['male'] as const,
    sports: [{ ta:'100மீ. ஓட்டம்', en:'100m Run' },{ ta:'குண்டு போடுதல்', en:'Shot Put' },{ ta:'தட்டு எறிதல்', en:'Discus Throw' },{ ta:'சாக்கோட்டம்', en:'Sack Race' },{ ta:'பாரம் தூக்குதல்', en:'Weight Lifting' }] },
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
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const birthYear = birthDate ? new Date(birthDate).getFullYear() : null
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
    if (!firstName || !birthDate || !gender) { setError('Vul alle velden in.'); return }
    if (!group) { setError(`Geboortejaar ${birthYear} valt buiten de beschikbare leeftijdsgroepen.`); return }
    setError('')
    setStep('sports')
  }

  async function handleSubmit() {
    if (selected.length === 0) { setError('Kies minstens 1 sport.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('athlete_registrations').insert({
      first_name: firstName,
      last_name: '',
      date_of_birth: birthDate,
      gender,
      events: selected,
      notes: group?.labelEn,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setStep('done')
    setLoading(false)
  }

  // Build lookup: groupKey → gender → sportEn → names[]
  function getNamesForSport(groupKey: string, sportEn: string, g: string) {
    return registrations.filter(r => {
      if (r.gender !== g) return false
      const by = new Date(r.date_of_birth).getFullYear()
      const rg = getGroup(by, r.gender as 'male' | 'female')
      return rg?.key === groupKey && r.events?.includes(sportEn)
    }).map(r => r.first_name)
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── REGISTRATION FORM ── */}
      <div style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 8 }}>
            தமிழர் விளையாட்டு விழா 2025
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, lineHeight: 0.95, marginBottom: 8 }}>
            ATHLETICS<br />REGISTRATIE
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32 }}>
            Schrijf je in voor de Tamil Sports Games · அணிவகுப்பு பதிவு
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {['Gegevens', 'Sporten kiezen', 'Bevestigd'].map((s, i) => {
              const stepIdx = step === 'form' ? 0 : step === 'sports' ? 1 : 2
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Bebas Neue', fontSize: 14,
                    background: i === stepIdx ? 'var(--accent)' : i < stepIdx ? 'var(--green)' : 'var(--bg3)', color: '#000',
                  }}>{i < stepIdx ? '✓' : i + 1}</div>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, color: i === stepIdx ? 'var(--text)' : 'var(--muted)' }}>{s}</span>
                  {i < 2 && <div style={{ width: 24, height: 1, background: 'var(--border)' }} />}
                </div>
              )
            })}
          </div>

          {/* STEP 1 */}
          {step === 'form' && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 32 }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 24 }}>பதிவு விவரங்கள் / Persoonsgegevens</h2>
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                    பெயர் / VOORNAAM *
                  </label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Voornaam" required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 1.5, color: 'var(--muted)' }}>
                    பிறந்த தேதி / GEBOORTEDATUM *
                  </label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required max="2023-12-31" min="1950-01-01" style={{ width: '100%' }} />
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
                        Geboortejaar {birthYear} valt buiten de leeftijdsgroepen.
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
                      }}>{g.ta} / {g.nl}</button>
                    ))}
                  </div>
                </div>
                {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}
                <button type="submit" style={{ background: 'var(--accent)', color: '#000', padding: '14px', fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 2, border: 'none', cursor: 'pointer', marginTop: 8 }}>
                  VERDER → SPORT KIEZEN
                </button>
              </form>
            </div>
          )}

          {/* STEP 2 */}
          {step === 'sports' && group && (
            <div>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: 32, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 4 }}>விளையாட்டு தேர்வு / SPORT KIEZEN</h2>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{group.labelTa} · {group.labelEn}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{firstName} · {gender === 'male' ? 'ஆண் / Man' : 'பெண் / Vrouw'}</div>
                  </div>
                  <button onClick={() => { setStep('form'); setSelected([]) }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 12, borderRadius: 4 }}>
                    ← Terug
                  </button>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
                  Kies <strong style={{ color: 'var(--accent)' }}>maximaal 3</strong> sporten · அதிகபட்சம் <strong style={{ color: 'var(--accent)' }}>3</strong> விளையாட்டுகள்
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {group.sports.map((sport, i) => {
                    const isSelected = selected.includes(sport.en)
                    const isDisabled = !isSelected && selected.length >= 3
                    return (
                      <button key={sport.en} onClick={() => !isDisabled && toggleSport(sport.en)} style={{
                        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        background: isSelected ? 'rgba(245,166,35,0.08)' : 'var(--bg3)',
                        color: isDisabled ? 'var(--muted)' : 'var(--text)',
                        borderRadius: 4, cursor: isDisabled ? 'not-allowed' : 'pointer',
                        textAlign: 'left', opacity: isDisabled ? 0.5 : 1, transition: 'all 0.15s',
                      }}>
                        <div style={{ width: 24, height: 24, borderRadius: 4, border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, background: isSelected ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isSelected && <span style={{ color: '#000', fontSize: 14, fontWeight: 900 }}>✓</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{sport.en}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sport.ta}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontFamily: 'Bebas Neue', fontSize: 20, color: isSelected ? 'var(--accent)' : 'var(--border)' }}>{String(i + 1).padStart(2, '0')}</div>
                      </button>
                    )
                  })}
                </div>
                <div style={{ marginTop: 16, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 13, color: selected.length === 3 ? 'var(--accent)' : 'var(--muted)' }}>
                  {selected.length}/3 gekozen
                </div>
              </div>
              {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button onClick={handleSubmit} disabled={loading || selected.length === 0} style={{
                width: '100%', background: selected.length > 0 ? 'var(--accent)' : 'var(--bg3)',
                color: selected.length > 0 ? '#000' : 'var(--muted)', padding: '16px',
                fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 2, border: 'none', cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
              }}>
                {loading ? 'BEZIG MET OPSLAAN…' : 'BEVESTIGEN & INSCHRIJVEN →'}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 'done' && (
            <div style={{ background: 'var(--bg2)', border: '2px solid var(--green)', padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, color: 'var(--green)', marginBottom: 8 }}>INSCHRIJVING BEVESTIGD!</h2>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14, color: 'var(--green)', marginBottom: 24 }}>பதிவு உறுதிப்படுத்தப்பட்டது!</div>
              <div style={{ background: 'var(--bg3)', padding: '16px 20px', borderRadius: 4, marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{firstName}</div>
                {selected.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13, color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> {s}
                  </div>
                ))}
              </div>
              <button onClick={() => { setStep('form'); setFirstName(''); setBirthDate(''); setGender(''); setSelected([]) }}
                style={{ background: 'var(--accent)', color: '#000', padding: '12px 32px', fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 2, border: 'none', cursor: 'pointer' }}>
                + NIEUWE INSCHRIJVING
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PUBLIC PARTICIPANT LIST ── */}
      <div style={{ padding: '56px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 3, color: 'var(--accent)', marginBottom: 8 }}>
            பதிவு பட்டியல்
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 48, marginBottom: 40 }}>DEELNEMERS OVERZICHT</h2>

          {AGE_GROUPS.map(ag => {
            const hasAnyInGroup = ag.genders.some(g =>
              ag.sports.some(s => getNamesForSport(ag.key, s.en, g).length > 0)
            )

            return (
              <div key={ag.key} style={{ marginBottom: 48 }}>
                {/* Age group header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 28, margin: 0 }}>{ag.labelEn}</h3>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: 13, color: 'var(--muted)' }}>{ag.labelTa}</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {/* Gender columns */}
                <div style={{ display: 'grid', gridTemplateColumns: ag.genders.length === 2 ? '1fr 1fr' : '1fr', gap: 24 }}>
                  {ag.genders.map(g => (
                    <div key={g}>
                      {/* Gender label */}
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 11, letterSpacing: 2, color: g === 'male' ? '#00BFFF' : '#FF69B4', marginBottom: 12 }}>
                        {g === 'male' ? '♂ ஆண் / MAN' : '♀ பெண் / VROUW'}
                      </div>

                      {/* Sports */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ag.sports.map((sport, si) => {
                          const names = getNamesForSport(ag.key, sport.en, g)
                          return (
                            <div key={sport.en} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '12px 16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: names.length > 0 ? 8 : 0 }}>
                                <div>
                                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 15, letterSpacing: 0.5 }}>{sport.en}</span>
                                  <span style={{ fontFamily: 'Rajdhani', fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>{sport.ta}</span>
                                </div>
                                <span style={{ fontFamily: 'Bebas Neue', fontSize: 13, color: names.length > 0 ? 'var(--accent)' : 'var(--border)' }}>
                                  {names.length > 0 ? `${names.length}` : '—'}
                                </span>
                              </div>
                              {names.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                  {names.map((name, ni) => (
                                    <span key={ni} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '3px 10px', fontSize: 12, fontFamily: 'Rajdhani', fontWeight: 600, borderRadius: 2 }}>
                                      {name}
                                    </span>
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
            )
          })}

          {registrations.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>
              Nog geen inschrijvingen. Wees de eerste! · இன்னும் பதிவுகள் இல்லை.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
