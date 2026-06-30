'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Club } from '@/lib/types'

interface Batter {
  name: string; runs: number; balls: number; fours: number; sixes: number; isOut: boolean; dismissal: string
}
interface Bowler {
  name: string; balls: number; runs: number; wickets: number; nb: number; wd: number
}
interface InningsState {
  battingTeam: string; bowlingTeam: string
  batters: Batter[]; striker: number; nonStriker: number
  bowlers: Bowler[]; currentBowlerName: string
  currentOverBalls: string[]; overHistory: { bowlerName: string; balls: string[] }[]
  extras: { wd: number; nb: number }
  totalRuns: number; totalWickets: number; totalBalls: number; done: boolean
}
type WicketType = 'Catch' | 'Stump' | 'Hit Wicket' | 'Bold' | 'Run Out'

function emptyBatter(name = ''): Batter {
  return { name, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissal: '' }
}
function emptyInnings(batting: string, bowling: string): InningsState {
  return {
    battingTeam: batting, bowlingTeam: bowling,
    batters: [emptyBatter(), emptyBatter()],
    striker: 0, nonStriker: 1,
    bowlers: [], currentBowlerName: '',
    currentOverBalls: [], overHistory: [],
    extras: { wd: 0, nb: 0 },
    totalRuns: 0, totalWickets: 0, totalBalls: 0, done: false,
  }
}
function oversStr(balls: number) { return `${Math.floor(balls / 6)}.${balls % 6}` }
function crr(runs: number, balls: number) { return balls === 0 ? '0.00' : ((runs / balls) * 6).toFixed(2) }

function rebuildInnings(balls: any[], batting: string, bowling: string): InningsState {
  const state = emptyInnings(batting, bowling)
  for (const b of balls) {
    const isWide = b.is_wide, isNb = b.is_noball, isLegal = !isWide && !isNb
    const runs = b.runs as number
    const extraRun = (isWide || isNb) ? 1 : 0
    if (b.batsman_name && !state.batters[state.striker]?.name) state.batters[state.striker].name = b.batsman_name
    if (b.non_striker_name && !state.batters[state.nonStriker]?.name) state.batters[state.nonStriker].name = b.non_striker_name
    state.totalRuns += runs + extraRun
    state.extras.wd += isWide ? 1 : 0
    state.extras.nb += isNb ? 1 : 0
    if (b.bowler_name) {
      let bw = state.bowlers.find(x => x.name === b.bowler_name)
      if (!bw) { bw = { name: b.bowler_name, balls: 0, runs: 0, wickets: 0, nb: 0, wd: 0 }; state.bowlers.push(bw) }
      bw.runs += runs + extraRun
      if (isLegal && !b.is_wicket) bw.balls++
      if (isWide) bw.wd++
      if (isNb) bw.nb++
      state.currentBowlerName = b.bowler_name
    }
    const ballStr = b.is_wicket ? 'W' : b.is_wide ? 'wd' : b.is_noball ? 'nb' : String(runs)
    state.currentOverBalls.push(ballStr)
    if (b.is_wicket) {
      const ab = state.batters[state.striker]
      if (ab) { ab.isOut = true; ab.dismissal = b.wicket_type || 'Out'; ab.balls += 1 }
      if (state.currentBowlerName) {
        const bi = state.bowlers.findIndex(x => x.name === state.currentBowlerName)
        if (bi >= 0 && b.wicket_type !== 'Run Out') state.bowlers[bi].wickets++
        if (bi >= 0) state.bowlers[bi].balls++
      }
      state.totalWickets += 1; state.totalBalls += 1
      state.batters.push(emptyBatter())
      state.striker = state.batters.length - 1
      if (runs % 2 === 1) { const tmp = state.striker; state.striker = state.nonStriker; state.nonStriker = tmp }
    } else {
      if (!isWide) {
        const ab = state.batters[state.striker]
        if (ab) { ab.runs += runs; ab.balls += 1; if (runs === 4) ab.fours++; if (runs === 6) ab.sixes++ }
      }
      if (isLegal) state.totalBalls += 1
      if (runs % 2 === 1) { const tmp = state.striker; state.striker = state.nonStriker; state.nonStriker = tmp }
    }
    const legalInOver = state.currentOverBalls.filter(x => x !== 'wd' && x !== 'nb').length
    if (legalInOver >= 6) {
      state.overHistory.push({ bowlerName: state.currentBowlerName, balls: [...state.currentOverBalls] })
      state.currentOverBalls = []
      state.currentBowlerName = ''
      const tmp = state.striker; state.striker = state.nonStriker; state.nonStriker = tmp
    }
  }
  return state
}

async function saveStatsToDb(matchId: string, innings: number, state: InningsState) {
  const batRows = state.batters.filter(b => b.name).map(b => ({
    match_id: matchId, innings, batting_team: state.battingTeam,
    batsman_name: b.name, runs: b.runs, balls: b.balls, fours: b.fours, sixes: b.sixes,
    is_out: b.isOut, dismissal: b.dismissal,
  }))
  if (batRows.length > 0) await supabase.from('cricket_batting_innings').upsert(batRows, { onConflict: 'match_id,innings,batsman_name' })
  const bowlRows = state.bowlers.map(b => ({
    match_id: matchId, innings, bowling_team: state.bowlingTeam,
    bowler_name: b.name, balls: b.balls, runs: b.runs, wickets: b.wickets, no_balls: b.nb, wides: b.wd,
  }))
  if (bowlRows.length > 0) await supabase.from('cricket_bowling_innings').upsert(bowlRows, { onConflict: 'match_id,innings,bowler_name' })
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props { match: any; club: Club; onBack: () => void }

export default function CricketScoring({ match, club, onBack }: Props) {
  const [step, setStep] = useState<'loading' | 'setup' | 'play' | 'done'>('loading')
  const [totalOvers, setTotalOvers] = useState('6')
  const [battingFirst, setBattingFirst] = useState<'home' | 'away'>('home')
  const [phase, setPhase] = useState<'inn1' | 'inn2'>('inn1')
  const [inn1, setInn1] = useState<InningsState | null>(null)
  const [inn2, setInn2] = useState<InningsState | null>(null)
  const [homePlayers, setHomePlayers] = useState<string[]>([])
  const [awayPlayers, setAwayPlayers] = useState<string[]>([])
  const [picker, setPicker] = useState<string | null>(null)
  const [wicketPopup, setWicketPopup] = useState(false)
  const [wicketType, setWicketType] = useState<WicketType>('Catch')
  const [ballNr, setBallNr] = useState(0)
  const [ballNr2, setBallNr2] = useState(0)

  const matchId = match.id

  // Load players from tournament_players
  useEffect(() => {
    async function loadPlayers() {
      const load = async (teamId: string) => {
        const { data } = await supabase.from('tournament_players').select('member_id, club_members(first_name, last_name)').eq('tournament_id', match.tournament_id).eq('club_team_id', teamId)
        return (data ?? []).map((r: any) => r.club_members ? `${r.club_members.first_name} ${r.club_members.last_name}` : '').filter(Boolean)
      }
      const [hp, ap] = await Promise.all([
        match.home_team_id ? load(match.home_team_id) : Promise.resolve([]),
        match.away_team_id ? load(match.away_team_id) : Promise.resolve([]),
      ])
      setHomePlayers(hp)
      setAwayPlayers(ap)
    }
    loadPlayers()
  }, [match.id, match.tournament_id, match.home_team_id, match.away_team_id])

  // Restore from DB
  useEffect(() => {
    async function restore() {
      const { data: ballsData } = await supabase.from('cricket_match_balls').select('*').eq('match_id', matchId).order('innings').order('ball_nr')
      if (!ballsData || ballsData.length === 0) { setStep('setup'); return }
      const meta = ballsData.find((b: any) => b.ball_nr === -1)
      const bf: 'home' | 'away' = meta?.batsman_name === 'away' ? 'away' : 'home'
      const storedOvers = meta ? parseInt(meta.bowler_name || '6') : 6
      setBattingFirst(bf); setTotalOvers(String(storedOvers))
      const t1bat = bf === 'home' ? match.home_team_name : match.away_team_name
      const t1bowl = bf === 'home' ? match.away_team_name : match.home_team_name
      const t2bat = bf === 'home' ? match.away_team_name : match.home_team_name
      const t2bowl = bf === 'home' ? match.home_team_name : match.away_team_name
      const inn1Balls = ballsData.filter((b: any) => b.innings === 1 && b.ball_nr >= 0)
      const inn2Balls = ballsData.filter((b: any) => b.innings === 2 && b.ball_nr >= 0)
      if (inn1Balls.length > 0) {
        const s1 = rebuildInnings(inn1Balls, t1bat, t1bowl)
        setInn1(s1)
        setBallNr(inn1Balls.length)
        if (inn2Balls.length > 0) {
          const s2 = rebuildInnings(inn2Balls, t2bat, t2bowl)
          setInn2(s2)
          setBallNr2(inn2Balls.length)
          setPhase('inn2')
          if (s2.done) { setStep('done'); return }
        } else if (s1.done) {
          setPhase('inn2')
          setInn2(emptyInnings(t2bat, t2bowl))
        }
      }
      setStep('play')
    }
    restore()
  }, [matchId, match.home_team_name, match.away_team_name])

  async function startMatch() {
    const t1bat = battingFirst === 'home' ? match.home_team_name : match.away_team_name
    const t1bowl = battingFirst === 'home' ? match.away_team_name : match.home_team_name
    // Save meta ball
    await supabase.from('cricket_match_balls').upsert({ match_id: matchId, innings: 0, ball_nr: -1, batsman_name: battingFirst, bowler_name: totalOvers })
    setInn1(emptyInnings(t1bat, t1bowl))
    setBallNr(0)
    setPhase('inn1')
    setStep('play')
  }

  async function recordBall(opts: { runs?: number; isWide?: boolean; isNb?: boolean; isLb?: boolean; isWicket?: boolean; wType?: WicketType }) {
    const curr = phase === 'inn1' ? inn1 : inn2
    if (!curr) return
    const { runs = 0, isWide = false, isNb = false, isLb = false, isWicket = false, wType } = opts
    const nb = phase === 'inn1' ? ballNr : ballNr2
    const inningsNum = phase === 'inn1' ? 1 : 2
    const striker = curr.batters[curr.striker]
    const nonStriker = curr.batters[curr.nonStriker]

    const row = {
      match_id: matchId, innings: inningsNum, ball_nr: nb,
      batsman_name: striker?.name ?? '',
      non_striker_name: nonStriker?.name ?? '',
      bowler_name: curr.currentBowlerName,
      runs, is_wide: isWide, is_noball: isNb, is_wicket: isWicket,
      wicket_type: isWicket ? (wType ?? wicketType) : null,
    }
    await supabase.from('cricket_match_balls').insert(row)
    if (phase === 'inn1') setBallNr(n => n + 1)
    else setBallNr2(n => n + 1)

    // Rebuild from DB for accuracy
    const { data: allBalls } = await supabase.from('cricket_match_balls').select('*').eq('match_id', matchId).order('innings').order('ball_nr')
    const t1bat = battingFirst === 'home' ? match.home_team_name : match.away_team_name
    const t1bowl = battingFirst === 'home' ? match.away_team_name : match.home_team_name
    const t2bat = battingFirst === 'home' ? match.away_team_name : match.home_team_name
    const t2bowl = battingFirst === 'home' ? match.home_team_name : match.away_team_name

    if (phase === 'inn1') {
      const balls1 = (allBalls ?? []).filter((b: any) => b.innings === 1 && b.ball_nr >= 0)
      const newState = rebuildInnings(balls1, t1bat, t1bowl)
      const overs = parseInt(totalOvers)
      const allOut = newState.totalWickets >= 10
      const oversUp = Math.floor(newState.totalBalls / 6) >= overs
      if (allOut || oversUp) {
        newState.done = true
        await saveStatsToDb(matchId, 1, newState)
        setInn1(newState)
        setInn2(emptyInnings(t2bat, t2bowl))
        setBallNr2(0)
        setPhase('inn2')
      } else {
        setInn1(newState)
      }
    } else {
      const balls2 = (allBalls ?? []).filter((b: any) => b.innings === 2 && b.ball_nr >= 0)
      const newState = rebuildInnings(balls2, t2bat, t2bowl)
      const overs = parseInt(totalOvers)
      const target = (inn1?.totalRuns ?? 0) + 1
      const allOut = newState.totalWickets >= 10
      const oversUp = Math.floor(newState.totalBalls / 6) >= overs
      const chased = newState.totalRuns >= target
      if (allOut || oversUp || chased) {
        newState.done = true
        await saveStatsToDb(matchId, 2, newState)
        setInn2(newState)
        // Finish match
        const homeRuns = battingFirst === 'home' ? (inn1?.totalRuns ?? 0) : newState.totalRuns
        const awayRuns = battingFirst === 'away' ? (inn1?.totalRuns ?? 0) : newState.totalRuns
        const homeBalls = battingFirst === 'home' ? (inn1?.totalBalls ?? 0) : newState.totalBalls
        const awayBalls = battingFirst === 'away' ? (inn1?.totalBalls ?? 0) : newState.totalBalls
        await supabase.from('tournament_matches').update({
          home_score: homeRuns, away_score: awayRuns,
          balls_home: homeBalls, balls_away: awayBalls,
          is_played: true, is_live: false,
          winner_id: homeRuns > awayRuns ? match.home_team_id : awayRuns > homeRuns ? match.away_team_id : null,
        }).eq('id', matchId)
        setStep('done')
      } else {
        setInn2(newState)
      }
    }
  }

  async function undoLast() {
    const inningsNum = phase === 'inn1' ? 1 : 2
    const nb = phase === 'inn1' ? ballNr - 1 : ballNr2 - 1
    if (nb < 0) return
    await supabase.from('cricket_match_balls').delete().eq('match_id', matchId).eq('innings', inningsNum).eq('ball_nr', nb)
    if (phase === 'inn1') setBallNr(n => n - 1)
    else setBallNr2(n => n - 1)
    // Rebuild
    const { data: allBalls } = await supabase.from('cricket_match_balls').select('*').eq('match_id', matchId).order('innings').order('ball_nr')
    const t1bat = battingFirst === 'home' ? match.home_team_name : match.away_team_name
    const t1bowl = battingFirst === 'home' ? match.away_team_name : match.home_team_name
    const t2bat = battingFirst === 'home' ? match.away_team_name : match.home_team_name
    const t2bowl = battingFirst === 'home' ? match.home_team_name : match.away_team_name
    if (phase === 'inn1') {
      const b1 = (allBalls ?? []).filter((b: any) => b.innings === 1 && b.ball_nr >= 0)
      setInn1(rebuildInnings(b1, t1bat, t1bowl))
    } else {
      const b2 = (allBalls ?? []).filter((b: any) => b.innings === 2 && b.ball_nr >= 0)
      setInn2(rebuildInnings(b2, t2bat, t2bowl))
    }
  }

  const curr = phase === 'inn1' ? inn1 : inn2
  const striker = curr?.batters[curr.striker ?? 0]
  const nonStr = curr?.batters[curr.nonStriker ?? 1]
  const battingPlayers = phase === 'inn1'
    ? (battingFirst === 'home' ? homePlayers : awayPlayers)
    : (battingFirst === 'home' ? awayPlayers : homePlayers)
  const bowlingPlayers = phase === 'inn1'
    ? (battingFirst === 'home' ? awayPlayers : homePlayers)
    : (battingFirst === 'home' ? homePlayers : awayPlayers)

  // ── Setup screen ──
  if (step === 'setup') return (
    <div style={{ padding: 32 }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Terug</button>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>CRICKET SETUP</h2>
      <div className="card" style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Aantal overs</label>
          <select value={totalOvers} onChange={e => setTotalOvers(e.target.value)}>
            {['4','5','6','8','10','12','15','20'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label>Wie slaat eerst?</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {(['home', 'away'] as const).map(side => (
              <button key={side} onClick={() => setBattingFirst(side)}
                style={{ flex: 1, padding: '10px', background: battingFirst === side ? 'var(--accent)' : 'var(--bg3)', color: battingFirst === side ? '#000' : 'var(--muted)', border: 'none', borderRadius: 6, fontFamily: 'Rajdhani', fontWeight: 700 }}>
                {side === 'home' ? match.home_team_name : match.away_team_name}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary" onClick={startMatch} style={{ width: '100%' }}>Start Match</button>
      </div>
    </div>
  )

  // ── Loading ──
  if (step === 'loading') return (
    <div style={{ padding: 32 }}><p style={{ color: 'var(--muted)' }}>Laden…</p></div>
  )

  // ── Done ──
  if (step === 'done') {
    const homeRuns = battingFirst === 'home' ? (inn1?.totalRuns ?? 0) : (inn2?.totalRuns ?? 0)
    const awayRuns = battingFirst === 'away' ? (inn1?.totalRuns ?? 0) : (inn2?.totalRuns ?? 0)
    return (
      <div style={{ padding: 32 }}>
        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Terug</button>
        <h2 style={{ fontSize: 32, marginBottom: 24 }}>WEDSTRIJD VOLTOOID</h2>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, marginBottom: 8 }}>{match.home_team_name} vs {match.away_team_name}</div>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: 64, color: 'var(--accent)' }}>{homeRuns} - {awayRuns}</div>
          <p style={{ color: homeRuns > awayRuns ? 'var(--green)' : homeRuns < awayRuns ? 'var(--red)' : 'var(--muted)', marginTop: 12 }}>
            {homeRuns > awayRuns ? `${match.home_team_name} wint` : homeRuns < awayRuns ? `${match.away_team_name} wint` : 'Gelijkspel'}
          </p>
        </div>
      </div>
    )
  }

  // ── Play screen ──
  const overs = parseInt(totalOvers)
  const inn1Target = (inn1?.totalRuns ?? 0) + 1
  const runsNeeded = phase === 'inn2' ? inn1Target - (curr?.totalRuns ?? 0) : 0
  const ballsLeft = phase === 'inn2' ? overs * 6 - (curr?.totalBalls ?? 0) : 0

  return (
    <div style={{ padding: 32 }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 16 }}>← Terug</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 28 }}>CRICKET — {phase === 'inn1' ? '1e Innings' : '2e Innings'}</h2>
        <button className="btn-ghost" onClick={undoLast} style={{ fontSize: 12 }}>↩ Ongedaan</button>
      </div>

      {/* Scoreboard */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: 'var(--muted)' }}>{curr?.battingTeam}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 56, lineHeight: 1, color: 'var(--text)' }}>
              {curr?.totalRuns ?? 0}/{curr?.totalWickets ?? 0}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              Overs: {oversStr(curr?.totalBalls ?? 0)}/{totalOvers} · CRR: {crr(curr?.totalRuns ?? 0, curr?.totalBalls ?? 0)}
            </div>
            {phase === 'inn2' && <div style={{ color: 'var(--yellow)', fontSize: 13, marginTop: 4 }}>
              Doel: {inn1Target} · Nodig: {runsNeeded} in {ballsLeft} ballen
            </div>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Rajdhani' }}>STRIKER</div>
              <div style={{ fontWeight: 700 }}>{striker?.name || <button onClick={() => setPicker('striker')} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, padding: '4px 10px', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Kies slagman</button>}</div>
              {striker?.name && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{striker.runs}({striker.balls})</div>}
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Rajdhani' }}>NON-STRIKER</div>
              <div style={{ fontWeight: 700 }}>{nonStr?.name || <button onClick={() => setPicker('nonStriker')} style={{ background: 'var(--bg3)', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Kies</button>}</div>
              {nonStr?.name && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{nonStr.runs}({nonStr.balls})</div>}
            </div>
          </div>
        </div>

        {/* Current over */}
        {curr && curr.currentOverBalls.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {curr.currentOverBalls.map((b, i) => (
              <span key={i} style={{
                padding: '3px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'Bebas Neue',
                background: b === 'W' ? 'rgba(255,61,113,0.2)' : b === 'wd' || b === 'nb' ? 'rgba(255,214,10,0.1)' : 'var(--bg3)',
                color: b === 'W' ? 'var(--red)' : b === 'wd' || b === 'nb' ? 'var(--yellow)' : 'var(--text)',
                border: `1px solid ${b === 'W' ? 'var(--red)' : 'var(--border)'}`,
              }}>{b}</span>
            ))}
          </div>
        )}

        {/* Bowler */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 600 }}>BOWLER:</span>
          {curr?.currentBowlerName ? (
            <span style={{ fontWeight: 600, fontSize: 13 }}>{curr.currentBowlerName}</span>
          ) : (
            <button onClick={() => setPicker('bowler')} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 6, padding: '4px 10px', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Kies bowler</button>
          )}
        </div>
      </div>

      {/* Scoring buttons */}
      {curr?.currentBowlerName && striker?.name && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {[0, 1, 2, 3, 4, 6].map(r => (
              <button key={r} onClick={() => recordBall({ runs: r })}
                style={{ flex: 1, padding: '16px 0', background: r === 4 ? 'rgba(0,255,135,0.1)' : r === 6 ? 'rgba(0,194,255,0.1)' : 'var(--bg3)', border: `1px solid ${r === 4 ? 'rgba(0,255,135,0.3)' : r === 6 ? 'rgba(0,194,255,0.3)' : 'var(--border)'}`, borderRadius: 8, color: r === 4 ? 'var(--green)' : r === 6 ? 'var(--accent)' : 'var(--text)', fontFamily: 'Bebas Neue', fontSize: 24, cursor: 'pointer' }}>
                {r}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => recordBall({ isWide: true })} style={{ flex: 1, padding: '10px', background: 'rgba(255,214,10,0.08)', border: '1px solid rgba(255,214,10,0.2)', borderRadius: 8, color: 'var(--yellow)', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>WIDE</button>
            <button onClick={() => recordBall({ isNb: true })} style={{ flex: 1, padding: '10px', background: 'rgba(255,214,10,0.08)', border: '1px solid rgba(255,214,10,0.2)', borderRadius: 8, color: 'var(--yellow)', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>NO BALL</button>
            <button onClick={() => recordBall({ isLb: true })} style={{ flex: 1, padding: '10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>LEG BYE</button>
            <button onClick={() => setWicketPopup(true)} style={{ flex: 1, padding: '10px', background: 'rgba(255,61,113,0.15)', border: '1px solid rgba(255,61,113,0.3)', borderRadius: 8, color: 'var(--red)', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>WICKET</button>
          </div>
        </div>
      )}

      {/* Batting scorecard */}
      {curr && curr.batters.some(b => b.name) && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <table>
            <thead><tr><th>Slagman</th><th style={{ textAlign: 'center' }}>Runs</th><th style={{ textAlign: 'center' }}>Ballen</th><th style={{ textAlign: 'center' }}>4s</th><th style={{ textAlign: 'center' }}>6s</th><th>Status</th></tr></thead>
            <tbody>
              {curr.batters.filter(b => b.name).map((b, i) => (
                <tr key={i} style={{ background: i === curr.striker ? 'rgba(0,194,255,0.05)' : undefined }}>
                  <td style={{ fontWeight: i === curr.striker ? 700 : 400 }}>{b.name} {i === curr.striker ? '*' : ''}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'Bebas Neue', fontSize: 18 }}>{b.runs}</td>
                  <td style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>{b.balls}</td>
                  <td style={{ textAlign: 'center', color: 'var(--green)', fontSize: 12 }}>{b.fours}</td>
                  <td style={{ textAlign: 'center', color: 'var(--accent)', fontSize: 12 }}>{b.sixes}</td>
                  <td style={{ fontSize: 12, color: b.isOut ? 'var(--red)' : 'var(--green)' }}>{b.isOut ? b.dismissal : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bowlers */}
      {curr && curr.bowlers.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead><tr><th>Bowler</th><th style={{ textAlign: 'center' }}>O</th><th style={{ textAlign: 'center' }}>R</th><th style={{ textAlign: 'center' }}>W</th><th style={{ textAlign: 'center' }}>Wd</th><th style={{ textAlign: 'center' }}>Nb</th></tr></thead>
            <tbody>
              {curr.bowlers.map((b, i) => (
                <tr key={i}><td>{b.name}</td><td style={{ textAlign: 'center', fontSize: 12 }}>{oversStr(b.balls)}</td><td style={{ textAlign: 'center' }}>{b.runs}</td><td style={{ textAlign: 'center', color: 'var(--red)', fontWeight: 700 }}>{b.wickets}</td><td style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>{b.wd}</td><td style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>{b.nb}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Picker modal */}
      {picker && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px 12px 0 0', padding: 20, width: '100%', maxHeight: '60vh', overflow: 'auto' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: 'var(--accent)', marginBottom: 16 }}>
              {picker === 'bowler' ? 'Kies bowler' : picker === 'striker' ? 'Kies slagman (striker)' : 'Kies non-striker'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {(picker === 'bowler' ? bowlingPlayers : battingPlayers).map(p => (
                <button key={p} onClick={() => {
                  if (!curr) return
                  if (picker === 'striker') {
                    setInn1(prev => prev ? { ...prev, batters: prev.batters.map((b, i) => i === prev.striker ? { ...b, name: p } : b) } : prev)
                    setInn2(prev => prev ? { ...prev, batters: prev.batters.map((b, i) => i === prev.striker ? { ...b, name: p } : b) } : prev)
                  } else if (picker === 'nonStriker') {
                    setInn1(prev => prev ? { ...prev, batters: prev.batters.map((b, i) => i === prev.nonStriker ? { ...b, name: p } : b) } : prev)
                    setInn2(prev => prev ? { ...prev, batters: prev.batters.map((b, i) => i === prev.nonStriker ? { ...b, name: p } : b) } : prev)
                  } else {
                    setInn1(prev => prev ? { ...prev, currentBowlerName: p } : prev)
                    setInn2(prev => prev ? { ...prev, currentBowlerName: p } : prev)
                  }
                  setPicker(null)
                }} style={{ padding: '8px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text)', cursor: 'pointer', fontFamily: 'Rajdhani', fontWeight: 600 }}>{p}</button>
              ))}
            </div>
            <button className="btn-ghost" onClick={() => setPicker(null)} style={{ width: '100%' }}>Annuleer</button>
          </div>
        </div>
      )}

      {/* Wicket popup */}
      {wicketPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ maxWidth: 360, width: '100%' }}>
            <h3 style={{ fontSize: 20, color: 'var(--red)', marginBottom: 16 }}>WICKET!</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {(['Catch', 'Stump', 'Hit Wicket', 'Bold', 'Run Out'] as WicketType[]).map(t => (
                <button key={t} onClick={() => setWicketType(t)}
                  style={{ padding: '10px', background: wicketType === t ? 'rgba(255,61,113,0.2)' : 'var(--bg3)', border: `1px solid ${wicketType === t ? 'var(--red)' : 'var(--border)'}`, borderRadius: 6, color: wicketType === t ? 'var(--red)' : 'var(--muted)', fontFamily: 'Rajdhani', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-danger" style={{ flex: 1 }} onClick={() => { recordBall({ isWicket: true, wType: wicketType }); setWicketPopup(false) }}>Bevestig</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setWicketPopup(false)}>Annuleer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
