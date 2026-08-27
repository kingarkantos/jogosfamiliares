-- =========================================================================
-- BANCO DE DADOS GRATUITO SUPABASE / POSTGRESQL - COPA DE JOGOS FAMILIARES
-- Execute este script no SQL Editor do seu projeto gratuito no Supabase (https://supabase.com)
-- =========================================================================

-- 1. TABELA DE JOGADORES (PLAYERS)
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  avatar_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme_color TEXT NOT NULL DEFAULT '#8b5cf6',
  phrase TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE JOGOS (GAMES)
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎲',
  cover_image TEXT,
  min_players INT NOT NULL DEFAULT 2,
  max_players INT NOT NULL DEFAULT 6,
  duration_minutes INT NOT NULL DEFAULT 45,
  complexity TEXT NOT NULL DEFAULT 'Médio',
  scoring_type TEXT NOT NULL DEFAULT 'highest',
  description TEXT,
  times_played INT NOT NULL DEFAULT 0
);

-- 3. TABELA DE PARTIDAS (MATCHES)
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  location TEXT DEFAULT 'Mesa da Sala',
  is_weekly_cup_match BOOLEAN NOT NULL DEFAULT TRUE,
  duration_minutes INT DEFAULT 45,
  notes TEXT,
  results JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. TABELA DE TORNEIOS MATA-MATA (TOURNAMENTS)
CREATE TABLE IF NOT EXISTS public.tournaments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  size INT NOT NULL DEFAULT 4,
  player_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  matches JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  winner_id TEXT REFERENCES public.players(id) ON DELETE SET NULL
);

-- 5. TABELA DE CONFIGURAÇÕES DA LIGA (SETTINGS)
CREATE TABLE IF NOT EXISTS public.settings (
  id INT PRIMARY KEY DEFAULT 1,
  league_name TEXT NOT NULL DEFAULT 'Copa dos Tabuleiros da Família',
  weekly_day_number INT NOT NULL DEFAULT 4,
  weekly_day_name TEXT NOT NULL DEFAULT 'Quinta-feira',
  point_rules JSONB NOT NULL DEFAULT '{"first": 10, "second": 7, "third": 5, "fourth": 3, "fifthPlus": 2, "participation": 1}'::jsonb,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL DEFAULT 'dark'
);

-- HABILITAR RLS COM ACESSO PÚBLICO SEGURO PARA A FAMÍLIA
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write players" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write games" ON public.games FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write tournaments" ON public.tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
