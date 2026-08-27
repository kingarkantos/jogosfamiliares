-- =========================================================================
-- MIGRAÇÃO OFICIAL SUPABASE - COPA DE JOGOS FAMILIARES
-- Rótulo das Tabelas: game_family_NOMEDATABELA
-- Projeto: https://fmpzzvznjgxxtbolqyds.supabase.co
-- =========================================================================

-- 1. TABELA DE JOGADORES (game_family_players)
CREATE TABLE IF NOT EXISTS public.game_family_players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  avatar_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme_color TEXT NOT NULL DEFAULT '#8b5cf6',
  phrase TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE JOGOS DE TABULEIRO (game_family_games)
CREATE TABLE IF NOT EXISTS public.game_family_games (
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

-- 3. TABELA DE HISTÓRICO DE PARTIDAS (game_family_matches)
CREATE TABLE IF NOT EXISTS public.game_family_matches (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  game_id TEXT NOT NULL REFERENCES public.game_family_games(id) ON DELETE CASCADE,
  location TEXT DEFAULT 'Mesa da Sala',
  is_weekly_cup_match BOOLEAN NOT NULL DEFAULT TRUE,
  duration_minutes INT DEFAULT 45,
  notes TEXT,
  results JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. TABELA DE TORNEIOS MATA-MATA (game_family_tournaments)
CREATE TABLE IF NOT EXISTS public.game_family_tournaments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  game_id TEXT NOT NULL REFERENCES public.game_family_games(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  size INT NOT NULL DEFAULT 4,
  player_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  matches JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  winner_id TEXT REFERENCES public.game_family_players(id) ON DELETE SET NULL
);

-- 5. TABELA DE CONFIGURAÇÕES DA LIGA (game_family_settings)
CREATE TABLE IF NOT EXISTS public.game_family_settings (
  id INT PRIMARY KEY DEFAULT 1,
  league_name TEXT NOT NULL DEFAULT 'Copa dos Tabuleiros da Família',
  weekly_day_number INT NOT NULL DEFAULT 4,
  weekly_day_name TEXT NOT NULL DEFAULT 'Quinta-feira',
  point_rules JSONB NOT NULL DEFAULT '{"first": 10, "second": 7, "third": 5, "fourth": 3, "fifthPlus": 2, "participation": 1}'::jsonb,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  theme TEXT NOT NULL DEFAULT 'dark'
);

-- HABILITAR ROW LEVEL SECURITY (RLS) COM ACESSO PÚBLICO SEGURO
ALTER TABLE public.game_family_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_family_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_family_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_family_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_family_settings ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO PÚBLICO (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow all for game_family_players" ON public.game_family_players;
CREATE POLICY "Allow all for game_family_players" ON public.game_family_players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for game_family_games" ON public.game_family_games;
CREATE POLICY "Allow all for game_family_games" ON public.game_family_games FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for game_family_matches" ON public.game_family_matches;
CREATE POLICY "Allow all for game_family_matches" ON public.game_family_matches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for game_family_tournaments" ON public.game_family_tournaments;
CREATE POLICY "Allow all for game_family_tournaments" ON public.game_family_tournaments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for game_family_settings" ON public.game_family_settings;
CREATE POLICY "Allow all for game_family_settings" ON public.game_family_settings FOR ALL USING (true) WITH CHECK (true);

-- POVOAMENTO INICIAL DE DADOS DA FAMÍLIA (SEED)
INSERT INTO public.game_family_players (id, name, nickname, avatar_url, theme_color, phrase, avatar_config)
VALUES
  ('player-1', 'Lucas (Pai)', 'O Estrategista', 'https://api.dicebear.com/9.x/personas/svg?seed=LucasPai&backgroundColor=3b82f6&glassesProbability=100', '#3b82f6', 'Tudo faz parte de um plano maior!', '{"style":"personas","seed":"LucasPai","backgroundColor":"3b82f6","glasses":true}'::jsonb),
  ('player-2', 'Camila (Mãe)', 'Rainha do Catan', 'https://api.dicebear.com/9.x/lorelei/svg?seed=CamilaMae&backgroundColor=ec4899&glassesProbability=0', '#ec4899', 'Troco 2 ovelhas por 1 trigo, quem quer?', '{"style":"lorelei","seed":"CamilaMae","backgroundColor":"ec4899","glasses":false}'::jsonb),
  ('player-3', 'Matheus (Filho)', 'Mestre dos Dados', 'https://api.dicebear.com/9.x/adventurer/svg?seed=MatheusFilho&backgroundColor=8b5cf6&glassesProbability=0', '#8b5cf6', 'Se tirou 6 no dado, a vitória é minha!', '{"style":"adventurer","seed":"MatheusFilho","backgroundColor":"8b5cf6","glasses":false}'::jsonb),
  ('player-4', 'Beatriz (Filha)', 'Soberana do Dixit', 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=BeatrizFilha&backgroundColor=10b981&glassesProbability=0', '#10b981', 'A poesia visual está em cada carta.', '{"style":"fun-emoji","seed":"BeatrizFilha","backgroundColor":"10b981","glasses":false}'::jsonb),
  ('player-5', 'Rodrigo (Tio)', 'O Blefador', 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=RodrigoTio&backgroundColor=f59e0b&glassesProbability=100', '#f59e0b', 'Eu sou o Duque! Não ouse contestar...', '{"style":"bottts-neutral","seed":"RodrigoTio","backgroundColor":"f59e0b","glasses":true}'::jsonb),
  ('player-6', 'Vovô Carlos', 'Lenda do Dominó', 'https://api.dicebear.com/9.x/personas/svg?seed=VovoCarlos&backgroundColor=06b6d4&glassesProbability=100', '#06b6d4', 'Paciência e calma vencem qualquer partida.', '{"style":"personas","seed":"VovoCarlos","backgroundColor":"06b6d4","glasses":true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_family_games (id, name, category, icon, min_players, max_players, duration_minutes, complexity, scoring_type, description, times_played)
VALUES
  ('game-catan', 'Catan', 'Estratégia & Negociação', '🌾', 3, 4, 75, 'Médio', 'highest', 'Colonize a ilha de Catan negociando recursos, construindo estradas, aldeias e cidades.', 14),
  ('game-dixit', 'Dixit', 'Criatividade & Blefe', '🎨', 3, 8, 40, 'Fácil', 'highest', 'Um jogo poético de adivinhação com cartas surreais e ilustrações mágicas.', 11),
  ('game-carcassonne', 'Carcassonne', 'Colocação de Peças', '🏰', 2, 5, 45, 'Médio', 'highest', 'Construa cidades medievais, estradas, mosteiros e campos colocando peças estratégicas.', 9),
  ('game-ticket', 'Ticket to Ride', 'Conexão de Rotas', '🚂', 2, 5, 60, 'Médio', 'highest', 'Conecte cidades famosas dos trilhos ferroviários completando seus bilhetes de destino.', 8),
  ('game-coup', 'Coup', 'Blefe & Dedução', '👑', 2, 6, 20, 'Fácil', 'elimination', 'Blefe, influencie e elimine os oponentes para ser o único sobrevivente no governo.', 16),
  ('game-dobble', 'Dobble / Spot It!', 'Reflexo & Agilidade', '⚡', 2, 8, 15, 'Festa', 'highest', 'Encontre o único símbolo comum entre duas cartas antes de todo mundo.', 12),
  ('game-uno', 'Uno No Mercy', 'Cartas & Caos', '🃏', 2, 10, 25, 'Fácil', 'elimination', 'A versão mais cruel e divertida do clássico UNO com penalidades extremas!', 18),
  ('game-exploding', 'Exploding Kittens', 'Roleta Russa Felina', '💣', 2, 5, 20, 'Festa', 'elimination', 'Evite explodir com os gatinhos explosivos usando desarmes, ataques e pulos de turno.', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.game_family_settings (id, league_name, weekly_day_number, weekly_day_name, point_rules, sound_enabled, theme)
VALUES (1, 'Copa dos Tabuleiros da Família', 4, 'Quinta-feira', '{"first": 10, "second": 7, "third": 5, "fourth": 3, "fifthPlus": 2, "participation": 1}'::jsonb, true, 'dark')
ON CONFLICT (id) DO NOTHING;
