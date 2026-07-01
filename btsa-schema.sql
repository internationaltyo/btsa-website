-- ============================================================
-- BTSA — Belgium Tamil Sports Association
-- Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── STAP 1: DROP OUDE TABELLEN (veilig om opnieuw te runnen) ──
DROP TABLE IF EXISTS athlete_registrations       CASCADE;
DROP TABLE IF EXISTS cricket_bowling_innings     CASCADE;
DROP TABLE IF EXISTS cricket_batting_innings     CASCADE;
DROP TABLE IF EXISTS cricket_match_balls         CASCADE;
DROP TABLE IF EXISTS match_events                CASCADE;
DROP TABLE IF EXISTS notifications               CASCADE;
DROP TABLE IF EXISTS global_team_rankings        CASCADE;
DROP TABLE IF EXISTS country_team_rankings       CASCADE;
DROP TABLE IF EXISTS tournament_awards           CASCADE;
DROP TABLE IF EXISTS tournament_settings         CASCADE;
DROP TABLE IF EXISTS tournament_matches          CASCADE;
DROP TABLE IF EXISTS tournament_group_assignments CASCADE;
DROP TABLE IF EXISTS tournament_groups           CASCADE;
DROP TABLE IF EXISTS tournament_players          CASCADE;
DROP TABLE IF EXISTS tournament_applications     CASCADE;
DROP TABLE IF EXISTS tournaments                 CASCADE;
DROP TABLE IF EXISTS player_transfers            CASCADE;
DROP TABLE IF EXISTS player_borrows              CASCADE;
DROP TABLE IF EXISTS team_accounts               CASCADE;
DROP TABLE IF EXISTS club_teams                  CASCADE;
DROP TABLE IF EXISTS club_members                CASCADE;
DROP TABLE IF EXISTS clubs                       CASCADE;
DROP TABLE IF EXISTS country_admins              CASCADE;
DROP TABLE IF EXISTS countries                   CASCADE;

-- ── STAP 2: KERN TABELLEN ─────────────────────────────────────

-- LANDEN
CREATE TABLE countries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  flag_emoji  TEXT NOT NULL DEFAULT '🏳',
  code        TEXT NOT NULL UNIQUE,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- BEHEERDERS (country admin + super admin)
CREATE TABLE country_admins (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  country_id    UUID REFERENCES countries(id) ON DELETE SET NULL,
  is_super_admin BOOLEAN DEFAULT false,
  name          TEXT,
  email         TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- CLUBS (per sport — één club is actief in één sport)
-- sport: 'football' | 'cricket' | 'volleyball' | 'athletics'
CREATE TABLE clubs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id  UUID REFERENCES countries(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  code        TEXT,
  sport       TEXT NOT NULL CHECK (sport IN ('football','cricket','volleyball','athletics')),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- CLUBLEDEN (spelers — permanent bij club)
-- career_* worden snapshot bij transfer
CREATE TABLE club_members (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id         UUID REFERENCES clubs(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  date_of_birth   DATE,
  position        TEXT,
  jersey_number   INT,
  is_active       BOOLEAN DEFAULT true,
  -- Career statistieken (worden bijgewerkt bij transfer)
  career_played   INT DEFAULT 0,
  career_won      INT DEFAULT 0,
  career_drawn    INT DEFAULT 0,
  career_lost     INT DEFAULT 0,
  career_goals    INT DEFAULT 0,
  career_assists  INT DEFAULT 0,
  career_yellow   INT DEFAULT 0,
  career_red      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- CLUB TEAMS (max 4 per club, permanent)
CREATE TABLE club_teams (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id     UUID REFERENCES clubs(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  category    TEXT,  -- bv. '5vs5', '7vs7', '6vs6', '4vs4' — afhankelijk van sport
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Max 4 teams per club afdwingen
CREATE OR REPLACE FUNCTION check_max_teams_per_club()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM club_teams WHERE club_id = NEW.club_id) >= 4 THEN
    RAISE EXCEPTION 'Een club kan maximaal 4 teams hebben.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_max_teams ON club_teams;
CREATE TRIGGER enforce_max_teams
  BEFORE INSERT ON club_teams
  FOR EACH ROW EXECUTE FUNCTION check_max_teams_per_club();

-- TEAM ACCOUNTS (inlogaccount per club)
CREATE TABLE team_accounts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id       UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name  TEXT,
  email         TEXT,
  country_id    UUID REFERENCES countries(id) ON DELETE SET NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── STAP 3: SPELER BEWEGINGEN ──────────────────────────────────

-- SPELER BORROWS (tijdelijke lening voor één toernooi)
CREATE TABLE player_borrows (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id     UUID,  -- FK toegevoegd na tournaments tabel
  club_member_id    UUID REFERENCES club_members(id) ON DELETE CASCADE,
  from_club_id      UUID REFERENCES clubs(id) ON DELETE CASCADE,
  to_club_team_id   UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tournament_id, club_member_id)
);

-- SPELER TRANSFERS (permanente cluboverstap)
CREATE TABLE player_transfers (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id     UUID REFERENCES club_members(id) ON DELETE CASCADE,
  from_club_id  UUID REFERENCES clubs(id) ON DELETE SET NULL,
  to_club_id    UUID REFERENCES clubs(id) ON DELETE SET NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  transferred_at TIMESTAMPTZ DEFAULT now()
);

-- ── STAP 4: TOERNOOIEN ────────────────────────────────────────

-- TOERNOOIEN
CREATE TABLE tournaments (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  country_id        UUID REFERENCES countries(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  location          TEXT,
  start_date        DATE NOT NULL,
  end_date          DATE,
  sport             TEXT NOT NULL CHECK (sport IN ('football','cricket','volleyball','athletics')),
  category          TEXT DEFAULT '',  -- bv. '5vs5', '6vs6', 'both'
  max_teams         INT DEFAULT 8,
  status            TEXT DEFAULT 'open' CHECK (status IN ('open','ongoing','finished','cancelled')),
  is_published      BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- FK toevoegen op player_borrows nu tournaments bestaat
ALTER TABLE player_borrows
  ADD CONSTRAINT player_borrows_tournament_id_fkey
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;

-- TOERNOOI AANVRAGEN (per team)
CREATE TABLE tournament_applications (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  club_id         UUID REFERENCES clubs(id) ON DELETE CASCADE,
  club_team_id    UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  team_name       TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','withdrawn')),
  applied_category TEXT,
  players_locked  BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tournament_id, club_team_id)
);

-- TOERNOOI SPELERS (geselecteerde spelers per team per toernooi)
CREATE TABLE tournament_players (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id         UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  club_id               UUID REFERENCES clubs(id) ON DELETE CASCADE,
  club_team_id          UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  member_id             UUID REFERENCES club_members(id) ON DELETE CASCADE,
  is_borrowed           BOOLEAN DEFAULT false,
  borrowed_from_club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  UNIQUE(tournament_id, club_team_id, member_id)
);

-- TOERNOOI GROEPEN
CREATE TABLE tournament_groups (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,  -- 'A', 'B', 'C'...
  category      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- GROEP TOEWIJZINGEN
CREATE TABLE tournament_group_assignments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  group_id      UUID REFERENCES tournament_groups(id) ON DELETE CASCADE,
  club_team_id  UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  club_id       UUID REFERENCES clubs(id) ON DELETE CASCADE,
  category      TEXT,
  UNIQUE(tournament_id, club_team_id)
);

-- WEDSTRIJDEN (groepsfase + knockout)
CREATE TABLE tournament_matches (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id   UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  sport           TEXT NOT NULL CHECK (sport IN ('football','cricket','volleyball','athletics')),
  round           TEXT NOT NULL DEFAULT 'group',  -- 'group','QF1','QF2','QF3','QF4','SF1','SF2','3RD','FINAL'
  round_label     TEXT,
  group_name      TEXT,
  category        TEXT,
  home_team_id    UUID REFERENCES club_teams(id) ON DELETE SET NULL,
  away_team_id    UUID REFERENCES club_teams(id) ON DELETE SET NULL,
  home_team_name  TEXT,  -- gedenormaliseerd voor snelheid
  away_team_name  TEXT,
  home_score      INT,
  away_score      INT,
  home_score_pen  INT,   -- voetbal: strafschoppen
  away_score_pen  INT,
  -- Cricket: ballen gespeeld (voor NRR)
  balls_home      INT,
  balls_away      INT,
  winner_id       UUID REFERENCES club_teams(id) ON DELETE SET NULL,
  match_date      DATE,
  match_time      TEXT,
  match_field     INT DEFAULT 1,
  is_live         BOOLEAN DEFAULT false,
  is_played       BOOLEAN DEFAULT false,
  is_enabled      BOOLEAN DEFAULT true,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- TOERNOOI INSTELLINGEN
CREATE TABLE tournament_settings (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id       UUID REFERENCES tournaments(id) ON DELETE CASCADE UNIQUE,
  start_time          TEXT DEFAULT '09:00',
  num_fields          INT DEFAULT 1,
  match_duration      INT DEFAULT 20,
  break_between       INT DEFAULT 5,
  groups_published    BOOLEAN DEFAULT false,
  schedule_published  BOOLEAN DEFAULT false,
  schedule_locked     BOOLEAN DEFAULT false,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- TOERNOOI AWARDS
CREATE TABLE tournament_awards (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  award_type    TEXT NOT NULL,  -- 'man_of_match','man_of_tournament','best_young','top_scorer','best_keeper'
  player_name   TEXT NOT NULL,
  club_id       UUID REFERENCES clubs(id) ON DELETE SET NULL,
  category      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tournament_id, award_type, category)
);

-- ── STAP 5: SPORT-SPECIFIEKE SCORING ──────────────────────────

-- MATCH EVENTS — Football (goals, assists, gele/rode kaarten)
CREATE TABLE match_events (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id      UUID REFERENCES tournament_matches(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  club_team_id  UUID REFERENCES club_teams(id) ON DELETE SET NULL,
  member_id     UUID REFERENCES club_members(id) ON DELETE SET NULL,
  player_name   TEXT,  -- gedenormaliseerd (borrow/naam kan afwijken)
  event_type    TEXT NOT NULL CHECK (event_type IN ('goal','assist','yellow_card','red_card','own_goal')),
  minute        INT,   -- speelminuut (optioneel)
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- CRICKET — Bal-voor-bal
-- ball_nr = -1 is meta-rij (batting_first + total_overs)
CREATE TABLE cricket_match_balls (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id      UUID REFERENCES tournament_matches(id) ON DELETE CASCADE,
  innings       INT NOT NULL,   -- 0=meta, 1=eerste innings, 2=tweede innings
  ball_nr       INT NOT NULL,
  batsman_name  TEXT,
  non_striker_name TEXT,
  bowler_name   TEXT,
  runs          INT DEFAULT 0,
  is_wide       BOOLEAN DEFAULT false,
  is_noball     BOOLEAN DEFAULT false,
  is_wicket     BOOLEAN DEFAULT false,
  wicket_type   TEXT,  -- 'Catch','Stump','Hit Wicket','Bold','Run Out'
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, innings, ball_nr)
);

-- CRICKET — Batting statistieken per innings
CREATE TABLE cricket_batting_innings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id      UUID REFERENCES tournament_matches(id) ON DELETE CASCADE,
  innings       INT NOT NULL,
  batting_team  TEXT NOT NULL,
  batsman_name  TEXT NOT NULL,
  runs          INT DEFAULT 0,
  balls         INT DEFAULT 0,
  fours         INT DEFAULT 0,
  sixes         INT DEFAULT 0,
  is_out        BOOLEAN DEFAULT false,
  dismissal     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, innings, batsman_name)
);

-- CRICKET — Bowling statistieken per innings
CREATE TABLE cricket_bowling_innings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id      UUID REFERENCES tournament_matches(id) ON DELETE CASCADE,
  innings       INT NOT NULL,
  bowling_team  TEXT NOT NULL,
  bowler_name   TEXT NOT NULL,
  balls         INT DEFAULT 0,
  runs          INT DEFAULT 0,
  wickets       INT DEFAULT 0,
  no_balls      INT DEFAULT 0,
  wides         INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, innings, bowler_name)
);

-- ── STAP 6: RANKINGS ──────────────────────────────────────────

-- RANKINGS PER LAND (per sport)
CREATE TABLE country_team_rankings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id    UUID REFERENCES countries(id) ON DELETE CASCADE,
  club_team_id  UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  sport         TEXT NOT NULL,
  team_name     TEXT,
  club_name     TEXT,
  played        INT DEFAULT 0,
  won           INT DEFAULT 0,
  drawn         INT DEFAULT 0,
  lost          INT DEFAULT 0,
  goals_for     INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_diff     INT DEFAULT 0,
  points        INT DEFAULT 0,
  country_rank  INT,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_id, club_team_id, sport)
);

-- GLOBALE RANKINGS (per sport)
CREATE TABLE global_team_rankings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_team_id  UUID REFERENCES club_teams(id) ON DELETE CASCADE,
  sport         TEXT NOT NULL,
  team_name     TEXT,
  club_name     TEXT,
  country_id    UUID REFERENCES countries(id) ON DELETE SET NULL,
  country_flag  TEXT,
  played        INT DEFAULT 0,
  won           INT DEFAULT 0,
  drawn         INT DEFAULT 0,
  lost          INT DEFAULT 0,
  goals_for     INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  goal_diff     INT DEFAULT 0,
  points        INT DEFAULT 0,
  global_rank   INT,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(club_team_id, sport)
);

-- ── STAP 7: ATLETIEK INSCHRIJVINGEN ───────────────────────────

CREATE TABLE athlete_registrations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender        TEXT CHECK (gender IN ('male','female','other')),
  country       TEXT,
  club_name     TEXT,
  email         TEXT,
  phone         TEXT,
  events        TEXT[],  -- bv. ['100m','200m','long_jump']
  notes         TEXT,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── STAP 8: MELDINGEN ─────────────────────────────────────────

CREATE TABLE notifications (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id       UUID REFERENCES clubs(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  type          TEXT DEFAULT 'info' CHECK (type IN ('info','success','error')),
  is_read       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── STAP 9: ROW LEVEL SECURITY ────────────────────────────────

ALTER TABLE countries                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_admins               ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs                        ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_teams                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_accounts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_borrows               ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_transfers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_applications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_players           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_groups            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_group_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_matches           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_awards            ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE cricket_match_balls          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cricket_batting_innings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cricket_bowling_innings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_team_rankings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_team_rankings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_registrations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications                ENABLE ROW LEVEL SECURITY;

-- BESTAANDE POLICIES VERWIJDEREN (veilig om opnieuw te runnen)
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
    WHERE tablename IN (
      'countries','country_admins','clubs','club_members','club_teams',
      'team_accounts','player_borrows','player_transfers','tournaments',
      'tournament_applications','tournament_players','tournament_groups',
      'tournament_group_assignments','tournament_matches','tournament_settings',
      'tournament_awards','match_events','cricket_match_balls',
      'cricket_batting_innings','cricket_bowling_innings',
      'country_team_rankings','global_team_rankings',
      'athlete_registrations','notifications'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ── PUBLIEK LEZEN (iedereen kan lezen) ──
CREATE POLICY "public_read" ON countries                    FOR SELECT USING (true);
CREATE POLICY "public_read" ON clubs                        FOR SELECT USING (true);
CREATE POLICY "public_read" ON club_members                 FOR SELECT USING (true);
CREATE POLICY "public_read" ON club_teams                   FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournaments                  FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_applications      FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_players           FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_groups            FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_group_assignments FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_matches           FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_settings          FOR SELECT USING (true);
CREATE POLICY "public_read" ON tournament_awards            FOR SELECT USING (true);
CREATE POLICY "public_read" ON match_events                 FOR SELECT USING (true);
CREATE POLICY "public_read" ON cricket_match_balls          FOR SELECT USING (true);
CREATE POLICY "public_read" ON cricket_batting_innings      FOR SELECT USING (true);
CREATE POLICY "public_read" ON cricket_bowling_innings      FOR SELECT USING (true);
CREATE POLICY "public_read" ON country_team_rankings        FOR SELECT USING (true);
CREATE POLICY "public_read" ON global_team_rankings         FOR SELECT USING (true);
CREATE POLICY "public_read" ON player_borrows               FOR SELECT USING (true);
CREATE POLICY "public_read" ON athlete_registrations        FOR SELECT USING (true);
CREATE POLICY "public_insert" ON athlete_registrations      FOR INSERT WITH CHECK (true);

-- ── CLUB PORTAAL RECHTEN ──

CREATE POLICY "club_read_own_account" ON team_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "club_manage_members" ON club_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = club_members.club_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_teams" ON club_teams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = club_teams.club_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_own_tournaments" ON tournaments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = tournaments.organizer_club_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_applications" ON tournament_applications FOR ALL USING (
  -- Eigen aanvragen beheren
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = tournament_applications.club_id
      AND ta.is_active = true
  )
  OR
  -- Organizer kan aanvragen van anderen beheren
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_applications.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_players" ON tournament_players FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = tournament_players.club_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_borrows" ON player_borrows FOR ALL USING (
  -- Eigen speler wordt uitgeleend
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = player_borrows.from_club_id
      AND ta.is_active = true
  )
  OR
  -- Eigen team leent een speler
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN club_teams ct ON ct.club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND ct.id = player_borrows.to_club_team_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_transfers" ON player_transfers FOR ALL USING (
  -- Van club (eigen speler)
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = player_transfers.from_club_id
      AND ta.is_active = true
  )
  OR
  -- Naar club (transfer aanvragen)
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = player_transfers.to_club_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_groups" ON tournament_groups FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_groups.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_assignments" ON tournament_group_assignments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_group_assignments.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_matches" ON tournament_matches FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_matches.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_settings" ON tournament_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_settings.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_awards" ON tournament_awards FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = tournament_awards.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_match_events" ON match_events FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    WHERE ta.user_id = auth.uid()
      AND t.id = match_events.tournament_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_cricket_balls" ON cricket_match_balls FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    JOIN tournament_matches m ON m.tournament_id = t.id
    WHERE ta.user_id = auth.uid()
      AND m.id = cricket_match_balls.match_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_cricket_batting" ON cricket_batting_innings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    JOIN tournament_matches m ON m.tournament_id = t.id
    WHERE ta.user_id = auth.uid()
      AND m.id = cricket_batting_innings.match_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_manage_cricket_bowling" ON cricket_bowling_innings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    JOIN tournaments t ON t.organizer_club_id = ta.club_id
    JOIN tournament_matches m ON m.tournament_id = t.id
    WHERE ta.user_id = auth.uid()
      AND m.id = cricket_bowling_innings.match_id
      AND ta.is_active = true
  )
);

CREATE POLICY "club_read_notifications" ON notifications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_accounts ta
    WHERE ta.user_id = auth.uid()
      AND ta.club_id = notifications.club_id
  )
);

CREATE POLICY "club_write_notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ── COUNTRY ADMIN RECHTEN ──

CREATE POLICY "admin_manage_clubs" ON clubs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid()
      AND (ca.country_id = clubs.country_id OR ca.is_super_admin = true)
  )
);

CREATE POLICY "admin_manage_members" ON club_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    JOIN clubs c ON c.country_id = ca.country_id
    WHERE ca.user_id = auth.uid()
      AND c.id = club_members.club_id
  )
  OR
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

CREATE POLICY "admin_manage_club_teams" ON club_teams FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    JOIN clubs c ON c.country_id = ca.country_id
    WHERE ca.user_id = auth.uid()
      AND c.id = club_teams.club_id
  )
  OR
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

CREATE POLICY "admin_manage_accounts" ON team_accounts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
  OR
  EXISTS (
    SELECT 1 FROM country_admins ca
    JOIN clubs c ON c.country_id = ca.country_id
    WHERE ca.user_id = auth.uid()
      AND c.id = team_accounts.club_id
  )
);

CREATE POLICY "admin_approve_borrows" ON player_borrows FOR ALL USING (
  EXISTS (SELECT 1 FROM country_admins ca WHERE ca.user_id = auth.uid())
);

CREATE POLICY "admin_manage_transfers" ON player_transfers FOR ALL USING (
  EXISTS (SELECT 1 FROM country_admins ca WHERE ca.user_id = auth.uid())
);

CREATE POLICY "admin_manage_rankings_country" ON country_team_rankings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid()
      AND (ca.country_id = country_team_rankings.country_id OR ca.is_super_admin = true)
  )
);

CREATE POLICY "admin_manage_rankings_global" ON global_team_rankings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

CREATE POLICY "admin_manage_registrations" ON athlete_registrations FOR ALL USING (
  EXISTS (SELECT 1 FROM country_admins ca WHERE ca.user_id = auth.uid())
);

CREATE POLICY "admin_read_admins" ON country_admins FOR SELECT USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

CREATE POLICY "super_admin_countries" ON countries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

CREATE POLICY "super_admin_admins" ON country_admins FOR ALL USING (
  EXISTS (
    SELECT 1 FROM country_admins ca
    WHERE ca.user_id = auth.uid() AND ca.is_super_admin = true
  )
);

-- ── STAP 10: STARTDATA ────────────────────────────────────────

INSERT INTO countries (name, flag_emoji, code) VALUES
  ('België', '🇧🇪', 'BE');

-- ── KLAAR ─────────────────────────────────────────────────────
-- Tabellen aangemaakt:
--   countries, country_admins
--   clubs, club_members, club_teams, team_accounts
--   player_borrows, player_transfers
--   tournaments, tournament_applications, tournament_players
--   tournament_groups, tournament_group_assignments
--   tournament_matches, tournament_settings, tournament_awards
--   match_events (football: goals/assists/kaarten)
--   cricket_match_balls, cricket_batting_innings, cricket_bowling_innings
--   country_team_rankings, global_team_rankings
--   athlete_registrations (atletiek)
--   notifications
