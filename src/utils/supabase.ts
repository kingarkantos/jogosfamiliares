import { createClient } from '@supabase/supabase-js';
import { AppSettings, Game, Match, Player, Tournament } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fmpzzvznjgxxtbolqyds.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtcHp6dnpuamd4eHRib2xxeWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzc5OTQsImV4cCI6MjA5OTUxMzk5NH0.0u-CewHESeJT_F1_kB62Frq-T1Ayt8nYzHCbx_nDRJ0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_TABLES = {
  PLAYERS: 'game_family_players',
  GAMES: 'game_family_games',
  MATCHES: 'game_family_matches',
  TOURNAMENTS: 'game_family_tournaments',
  SETTINGS: 'game_family_settings',
};

// Check if Supabase is connected
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.PLAYERS).select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// PLAYERS
export async function fetchPlayersSupabase(): Promise<Player[] | null> {
  try {
    const { data, error } = await supabase.from(SUPABASE_TABLES.PLAYERS).select('*');
    if (error || !data) return null;
    return data.map(row => ({
      id: row.id,
      name: row.name,
      nickname: row.nickname,
      avatarUrl: row.avatar_url,
      avatarConfig: row.avatar_config || {},
      themeColor: row.theme_color || '#8b5cf6',
      phrase: row.phrase || '',
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function upsertPlayerSupabase(player: Player): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.PLAYERS).upsert({
      id: player.id,
      name: player.name,
      nickname: player.nickname,
      avatar_url: player.avatarUrl,
      avatar_config: player.avatarConfig,
      theme_color: player.themeColor,
      phrase: player.phrase,
      created_at: player.createdAt
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deletePlayerSupabase(playerId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.PLAYERS).delete().eq('id', playerId);
    return !error;
  } catch {
    return false;
  }
}

// GAMES
export async function fetchGamesSupabase(): Promise<Game[] | null> {
  try {
    const { data, error } = await supabase.from(SUPABASE_TABLES.GAMES).select('*');
    if (error || !data) return null;
    return data.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      icon: row.icon || '🎲',
      coverImage: row.cover_image,
      minPlayers: row.min_players,
      maxPlayers: row.max_players,
      durationMinutes: row.duration_minutes,
      complexity: row.complexity,
      scoringType: row.scoring_type,
      description: row.description || '',
      timesPlayed: row.times_played || 0
    }));
  } catch {
    return null;
  }
}

export async function upsertGameSupabase(game: Game): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.GAMES).upsert({
      id: game.id,
      name: game.name,
      category: game.category,
      icon: game.icon,
      cover_image: game.coverImage,
      min_players: game.minPlayers,
      max_players: game.maxPlayers,
      duration_minutes: game.durationMinutes,
      complexity: game.complexity,
      scoring_type: game.scoringType,
      description: game.description,
      times_played: game.timesPlayed
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteGameSupabase(gameId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.GAMES).delete().eq('id', gameId);
    return !error;
  } catch {
    return false;
  }
}

// MATCHES
export async function fetchMatchesSupabase(): Promise<Match[] | null> {
  try {
    const { data, error } = await supabase.from(SUPABASE_TABLES.MATCHES).select('*').order('date', { ascending: false });
    if (error || !data) return null;
    return data.map(row => ({
      id: row.id,
      date: row.date,
      gameId: row.game_id,
      location: row.location,
      durationMinutes: row.duration_minutes,
      isWeeklyCupMatch: row.is_weekly_cup_match,
      notes: row.notes || '',
      results: row.results || []
    }));
  } catch {
    return null;
  }
}

export async function insertMatchSupabase(match: Match): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.MATCHES).insert({
      id: match.id,
      date: match.date,
      game_id: match.gameId,
      location: match.location,
      duration_minutes: match.durationMinutes,
      is_weekly_cup_match: match.isWeeklyCupMatch,
      notes: match.notes,
      results: match.results
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteMatchSupabase(matchId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.MATCHES).delete().eq('id', matchId);
    return !error;
  } catch {
    return false;
  }
}

// TOURNAMENTS
export async function fetchTournamentsSupabase(): Promise<Tournament[] | null> {
  try {
    const { data, error } = await supabase.from(SUPABASE_TABLES.TOURNAMENTS).select('*');
    if (error || !data) return null;
    return data.map(row => ({
      id: row.id,
      title: row.title,
      gameId: row.game_id,
      date: row.date,
      size: row.size,
      playerIds: row.player_ids || [],
      matches: row.matches || [],
      status: row.status,
      winnerId: row.winner_id
    }));
  } catch {
    return null;
  }
}

export async function upsertTournamentSupabase(tourney: Tournament): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.TOURNAMENTS).upsert({
      id: tourney.id,
      title: tourney.title,
      game_id: tourney.gameId,
      date: tourney.date,
      size: tourney.size,
      player_ids: tourney.playerIds,
      matches: tourney.matches,
      status: tourney.status,
      winner_id: tourney.winnerId
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteTournamentSupabase(tourneyId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.TOURNAMENTS).delete().eq('id', tourneyId);
    return !error;
  } catch {
    return false;
  }
}

// SETTINGS
export async function fetchSettingsSupabase(): Promise<AppSettings | null> {
  try {
    const { data, error } = await supabase.from(SUPABASE_TABLES.SETTINGS).select('*').eq('id', 1).single();
    if (error || !data) return null;
    return {
      leagueName: data.league_name,
      weeklyDayNumber: data.weekly_day_number,
      weeklyDayName: data.weekly_day_name,
      pointRules: data.point_rules,
      soundEnabled: data.sound_enabled,
      theme: data.theme
    };
  } catch {
    return null;
  }
}

export async function upsertSettingsSupabase(settings: AppSettings): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.SETTINGS).upsert({
      id: 1,
      league_name: settings.leagueName,
      weekly_day_number: settings.weeklyDayNumber,
      weekly_day_name: settings.weeklyDayName,
      point_rules: settings.pointRules,
      sound_enabled: settings.soundEnabled,
      theme: settings.theme
    });
    return !error;
  } catch {
    return false;
  }
}


export async function clearAllMatchesSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.MATCHES).delete().neq('id', '___non_existent___');
    return !error;
  } catch {
    return false;
  }
}

export async function clearAllTournamentsSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.TOURNAMENTS).delete().neq('id', '___non_existent___');
    return !error;
  } catch {
    return false;
  }
}

export async function clearAllPlayersSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.PLAYERS).delete().neq('id', '___non_existent___');
    return !error;
  } catch {
    return false;
  }
}

export async function clearAllGamesSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.GAMES).delete().neq('id', '___non_existent___');
    return !error;
  } catch {
    return false;
  }
}

