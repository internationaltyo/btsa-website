export type Sport = 'football' | 'cricket' | 'volleyball' | 'athletics'

export interface Country { id: string; name: string; flag_emoji: string; code: string }
export interface Club { id: string; country_id: string; name: string; code: string; sport: Sport; is_active: boolean }
export interface ClubMember {
  id: string; club_id: string; first_name: string; last_name: string
  date_of_birth: string | null; position: string | null; jersey_number: number | null
  is_active: boolean
  career_played: number; career_won: number; career_drawn: number; career_lost: number
  career_goals: number; career_assists: number; career_yellow: number; career_red: number
}
export interface ClubTeam { id: string; club_id: string; name: string; category: string | null; is_active: boolean }
export interface TeamAccount {
  id: string; club_id: string; user_id: string; display_name: string | null
  email: string | null; country_id: string | null; is_active: boolean
}
export interface Tournament {
  id: string; organizer_club_id: string | null; country_id: string | null
  name: string; description: string | null; location: string | null
  start_date: string; end_date: string | null; sport: Sport
  category: string; max_teams: number
  status: 'open' | 'ongoing' | 'finished' | 'cancelled'
  is_published: boolean; created_at: string
}
export interface TournamentApplication {
  id: string; tournament_id: string; club_id: string; club_team_id: string
  team_name: string | null; status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  applied_category: string | null; players_locked: boolean; created_at: string
}
export interface TournamentMatch {
  id: string; tournament_id: string; sport: Sport; round: string
  round_label: string | null; group_name: string | null; category: string | null
  home_team_id: string | null; away_team_id: string | null
  home_team_name: string | null; away_team_name: string | null
  home_score: number | null; away_score: number | null
  home_score_pen: number | null; away_score_pen: number | null
  balls_home: number | null; balls_away: number | null
  winner_id: string | null; match_date: string | null; match_time: string | null
  match_field: number; is_live: boolean; is_played: boolean
  is_enabled: boolean; sort_order: number
}
export interface TournamentGroup {
  id: string; tournament_id: string; name: string; category: string | null
}
export interface TournamentGroupAssignment {
  id: string; tournament_id: string; group_id: string
  club_team_id: string; club_id: string; category: string | null
}
export interface TournamentPlayer {
  id: string; tournament_id: string; club_id: string; club_team_id: string
  member_id: string; is_borrowed: boolean; borrowed_from_club_id: string | null
}
export interface TournamentSettings {
  id: string; tournament_id: string; start_time: string
  num_fields: number; match_duration: number; break_between: number
  groups_published: boolean; schedule_published: boolean; schedule_locked: boolean
}
export interface PlayerBorrow {
  id: string; tournament_id: string; club_member_id: string
  from_club_id: string; to_club_team_id: string
  status: 'pending' | 'accepted' | 'rejected'
}
export interface PlayerTransfer {
  id: string; member_id: string; from_club_id: string; to_club_id: string
  status: 'pending' | 'accepted' | 'rejected'; transferred_at: string
}
export interface MatchEvent {
  id: string; match_id: string; tournament_id: string
  club_team_id: string | null; member_id: string | null; player_name: string | null
  event_type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'own_goal'
  minute: number | null
}
export interface Notification {
  id: string; club_id: string; tournament_id: string | null
  title: string; type: 'info' | 'success' | 'error'; is_read: boolean; created_at: string
}
export interface AthleteRegistration {
  id: string; first_name: string; last_name: string; date_of_birth: string
  gender: string | null; country: string | null; club_name: string | null
  email: string | null; phone: string | null; events: string[] | null
  notes: string | null; tournament_id: string | null
  status: 'pending' | 'confirmed' | 'cancelled'; created_at: string
}

export const SPORT_LABELS: Record<Sport, string> = {
  football: 'Football',
  cricket: 'Cricket',
  volleyball: 'Volleyball',
  athletics: 'Athletics',
}

export const SPORT_EMOJI: Record<Sport, string> = {
  football: '⚽',
  cricket: '🏏',
  volleyball: '🏐',
  athletics: '🏃',
}
