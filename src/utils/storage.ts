import { AppSettings, Game, Match, Player, Tournament } from '../types';
import { DEFAULT_SETTINGS, DEMO_GAMES, DEMO_MATCHES, DEMO_PLAYERS, INITIAL_GAMES, INITIAL_MATCHES, INITIAL_PLAYERS } from './initialData';

const STORAGE_KEYS = {
  PLAYERS: 'jogosfamiliares_players_v2',
  GAMES: 'jogosfamiliares_games_v2',
  MATCHES: 'jogosfamiliares_matches_v2',
  TOURNAMENTS: 'jogosfamiliares_tournaments_v2',
  SETTINGS: 'jogosfamiliares_settings_v2',
};

// Clean legacy v1 keys if present
try {
  localStorage.removeItem('jogosfamiliares_players_v1');
  localStorage.removeItem('jogosfamiliares_games_v1');
  localStorage.removeItem('jogosfamiliares_matches_v1');
  localStorage.removeItem('jogosfamiliares_tournaments_v1');
  localStorage.removeItem('jogosfamiliares_settings_v1');
} catch {}

export interface BackupData {
  version: string;
  exportDate: string;
  players: Player[];
  games: Game[];
  matches: Match[];
  tournaments: Tournament[];
  settings: AppSettings;
}

export function loadStoredPlayers(): Player[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (!raw) {
      saveStoredPlayers(INITIAL_PLAYERS);
      return INITIAL_PLAYERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PLAYERS;
  }
}

export function saveStoredPlayers(players: Player[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players to localStorage', e);
  }
}

export function loadStoredGames(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    if (!raw) {
      saveStoredGames(INITIAL_GAMES);
      return INITIAL_GAMES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_GAMES;
  }
}

export function saveStoredGames(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  } catch (e) {
    console.error('Failed to save games to localStorage', e);
  }
}

export function loadStoredMatches(): Match[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!raw) {
      saveStoredMatches(INITIAL_MATCHES);
      return INITIAL_MATCHES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MATCHES;
  }
}

export function saveStoredMatches(matches: Match[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch (e) {
    console.error('Failed to save matches to localStorage', e);
  }
}

export function loadStoredTournaments(): Tournament[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredTournaments(tournaments: Tournament[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  } catch (e) {
    console.error('Failed to save tournaments to localStorage', e);
  }
}

export function loadStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveStoredSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function exportBackupJson(): void {
  const data: BackupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    players: loadStoredPlayers(),
    games: loadStoredGames(),
    matches: loadStoredMatches(),
    tournaments: loadStoredTournaments(),
    settings: loadStoredSettings()
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_copa_jogos_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackupJson(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as BackupData;
        if (parsed.players && parsed.games && parsed.matches) {
          saveStoredPlayers(parsed.players);
          saveStoredGames(parsed.games);
          saveStoredMatches(parsed.matches);
          if (parsed.tournaments) saveStoredTournaments(parsed.tournaments);
          if (parsed.settings) saveStoredSettings(parsed.settings);
          resolve(true);
        } else {
          reject(new Error('Formato de arquivo inválido.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsText(file);
  });
}

export function resetMatchesOnly(): void {
  saveStoredMatches([]);
  const games = loadStoredGames().map(g => ({ ...g, timesPlayed: 0 }));
  saveStoredGames(games);
  saveStoredTournaments([]);
}

export function resetAllDataToDefault(): void {
  saveStoredPlayers(INITIAL_PLAYERS);
  saveStoredGames(INITIAL_GAMES);
  saveStoredMatches([]);
  saveStoredTournaments([]);
  saveStoredSettings(DEFAULT_SETTINGS);
}

export function resetAllDataToEmpty(): void {
  saveStoredPlayers([]);
  saveStoredGames([]);
  saveStoredMatches([]);
  saveStoredTournaments([]);
  saveStoredSettings(DEFAULT_SETTINGS);
}

export function loadDemoData(): void {
  saveStoredPlayers(DEMO_PLAYERS);
  const demoGames = DEMO_GAMES.map(g => {
    const played = DEMO_MATCHES.filter(m => m.gameId === g.id).length;
    return { ...g, timesPlayed: played };
  });
  saveStoredGames(demoGames);
  saveStoredMatches(DEMO_MATCHES);
  saveStoredTournaments([]);
}

