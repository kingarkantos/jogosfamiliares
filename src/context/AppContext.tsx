import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AppSettings, Game, Match, MatchPlayerResult, Player, PlayerStats, Tournament } from '../types';
import {
  loadStoredGames,
  loadStoredMatches,
  loadStoredPlayers,
  loadStoredSettings,
  loadStoredTournaments,
  resetAllDataToDefault,
  saveStoredGames,
  saveStoredMatches,
  saveStoredPlayers,
  saveStoredSettings,
  saveStoredTournaments
} from '../utils/storage';
import { sounds } from '../utils/audio';
import { getMonthKey, getWeekKey } from '../utils/dateHelpers';

export type NavTab = 'dashboard' | 'rankings' | 'players' | 'games' | 'tournament' | 'counter' | 'tools';

const VALID_TABS: NavTab[] = ['dashboard', 'rankings', 'players', 'games', 'tournament', 'counter', 'tools'];

export interface LeaderboardEntry {
  player: Player;
  totalPoints: number;
  matchesPlayed: number;
  wins: number;
  podiums: number;
  rank: number;
  averageScore: number;
}

interface AppContextType {
  players: Player[];
  games: Game[];
  matches: Match[];
  tournaments: Tournament[];
  settings: AppSettings;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  // Player Actions
  addPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
  // Game Actions
  addGame: (game: Omit<Game, 'id' | 'timesPlayed'>) => void;
  updateGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  // Match Actions
  addMatch: (match: Omit<Match, 'id'>) => void;
  deleteMatch: (matchId: string) => void;
  // Tournament Actions
  addTournament: (tournament: Tournament) => void;
  updateTournament: (tournament: Tournament) => void;
  deleteTournament: (tournamentId: string) => void;
  // Settings Actions
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllData: () => void;
  reloadFromStorage: () => void;
  // Analytics & Ranking helpers
  getPlayerStats: (playerId: string) => PlayerStats;
  getLeaderboard: (scope: 'all' | 'month' | 'week', filterKey?: string) => LeaderboardEntry[];
  getWeeklyChampion: (weekKey?: string) => LeaderboardEntry | null;
  getMonthlyChampion: (monthKey?: string) => LeaderboardEntry | null;
  calculateLeaguePoints: (rank: number) => number;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getInitialTab(): NavTab {
  try {
    const hash = window.location.hash.replace('#', '') as NavTab;
    if (VALID_TABS.includes(hash)) return hash;
    const stored = localStorage.getItem('jogosfamiliares_active_tab') as NavTab;
    if (VALID_TABS.includes(stored)) return stored;
  } catch {}
  return 'dashboard';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(loadStoredPlayers);
  const [games, setGames] = useState<Game[]>(loadStoredGames);
  const [matches, setMatches] = useState<Match[]>(loadStoredMatches);
  const [tournaments, setTournaments] = useState<Tournament[]>(loadStoredTournaments);
  const [settings, setSettings] = useState<AppSettings>(loadStoredSettings);
  const [activeTab, setActiveTabState] = useState<NavTab>(getInitialTab);

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    try {
      window.location.hash = tab;
      localStorage.setItem('jogosfamiliares_active_tab', tab);
    } catch {}
    sounds.playClick();
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (VALID_TABS.includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const reloadFromStorage = () => {
    setPlayers(loadStoredPlayers());
    setGames(loadStoredGames());
    setMatches(loadStoredMatches());
    setTournaments(loadStoredTournaments());
    setSettings(loadStoredSettings());
  };

  const triggerConfetti = () => {
    sounds.playFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  };

  const calculateLeaguePoints = (rank: number): number => {
    const rules = settings.pointRules || {
      first: 10,
      second: 7,
      third: 5,
      fourth: 3,
      fifthPlus: 2,
      participation: 1
    };
    switch (rank) {
      case 1:
        return rules.first;
      case 2:
        return rules.second;
      case 3:
        return rules.third;
      case 4:
        return rules.fourth;
      default:
        return rank > 4 ? rules.fifthPlus : rules.participation;
    }
  };

  // Player Operations
  const addPlayer = (playerData: Omit<Player, 'id' | 'createdAt'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...players, newPlayer];
    setPlayers(updated);
    saveStoredPlayers(updated);
    sounds.playSuccess();
  };

  const updatePlayer = (updatedPlayer: Player) => {
    const updated = players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    setPlayers(updated);
    saveStoredPlayers(updated);
    sounds.playClick();
  };

  const deletePlayer = (playerId: string) => {
    const updated = players.filter(p => p.id !== playerId);
    setPlayers(updated);
    saveStoredPlayers(updated);
    sounds.playClick();
  };

  // Game Operations
  const addGame = (gameData: Omit<Game, 'id' | 'timesPlayed'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timesPlayed: 0
    };
    const updated = [...games, newGame];
    setGames(updated);
    saveStoredGames(updated);
    sounds.playSuccess();
  };

  const updateGame = (updatedGame: Game) => {
    const updated = games.map(g => (g.id === updatedGame.id ? updatedGame : g));
    setGames(updated);
    saveStoredGames(updated);
    sounds.playClick();
  };

  const deleteGame = (gameId: string) => {
    const updated = games.filter(g => g.id !== gameId);
    setGames(updated);
    saveStoredGames(updated);
    sounds.playClick();
  };

  // Match Operations
  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    const updatedMatches = [newMatch, ...matches];
    setMatches(updatedMatches);
    saveStoredMatches(updatedMatches);

    // Update game timesPlayed
    const updatedGames = games.map(g => {
      if (g.id === matchData.gameId) {
        return { ...g, timesPlayed: (g.timesPlayed || 0) + 1 };
      }
      return g;
    });
    setGames(updatedGames);
    saveStoredGames(updatedGames);

    triggerConfetti();
  };

  const deleteMatch = (matchId: string) => {
    const matchToDelete = matches.find(m => m.id === matchId);
    const updatedMatches = matches.filter(m => m.id !== matchId);
    setMatches(updatedMatches);
    saveStoredMatches(updatedMatches);

    if (matchToDelete) {
      const updatedGames = games.map(g => {
        if (g.id === matchToDelete.gameId) {
          return { ...g, timesPlayed: Math.max(0, (g.timesPlayed || 0) - 1) };
        }
        return g;
      });
      setGames(updatedGames);
      saveStoredGames(updatedGames);
    }
    sounds.playClick();
  };

  // Tournament Operations
  const addTournament = (tournament: Tournament) => {
    const updated = [tournament, ...tournaments];
    setTournaments(updated);
    saveStoredTournaments(updated);
    sounds.playSuccess();
  };

  const updateTournament = (updatedTournament: Tournament) => {
    const updated = tournaments.map(t => (t.id === updatedTournament.id ? updatedTournament : t));
    setTournaments(updated);
    saveStoredTournaments(updated);
    if (updatedTournament.status === 'completed') {
      triggerConfetti();
    } else {
      sounds.playClick();
    }
  };

  const deleteTournament = (tournamentId: string) => {
    const updated = tournaments.filter(t => t.id !== tournamentId);
    setTournaments(updated);
    saveStoredTournaments(updated);
    sounds.playClick();
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
    sounds.playClick();
  };

  const resetAllData = () => {
    resetAllDataToDefault();
    reloadFromStorage();
    sounds.playSuccess();
  };

  // Analytics & Stats
  const getPlayerStats = (playerId: string): PlayerStats => {
    let totalMatches = 0;
    let wins = 0;
    let podiums = 0;
    let totalScore = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    const gameCounts: { [gameId: string]: number } = {};

    const sortedMatches = [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedMatches.forEach(m => {
      const pResult = (m.results || []).find((r: MatchPlayerResult) => r.playerId === playerId);
      if (pResult) {
        totalMatches++;
        totalScore += (pResult.leaguePointsEarned || 0);
        gameCounts[m.gameId] = (gameCounts[m.gameId] || 0) + 1;

        if (pResult.rank === 1) {
          wins++;
          podiums++;
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          if (pResult.rank <= 3) {
            podiums++;
          }
          tempStreak = 0;
        }
      }
    });

    currentStreak = tempStreak;

    let favoriteGameId: string | undefined = undefined;
    let maxGameCount = 0;
    Object.entries(gameCounts).forEach(([gId, count]) => {
      if (count > maxGameCount) {
        maxGameCount = count;
        favoriteGameId = gId;
      }
    });

    let weeklyTitles = 0;
    let monthlyTitles = 0;

    const weeksMap = new Map<string, Match[]>();
    const monthsMap = new Map<string, Match[]>();

    matches.forEach(m => {
      const wKey = getWeekKey(m.date);
      const mKey = getMonthKey(m.date);
      weeksMap.set(wKey, [...(weeksMap.get(wKey) || []), m]);
      monthsMap.set(mKey, [...(monthsMap.get(mKey) || []), m]);
    });

    weeksMap.forEach(wMatches => {
      const scores = new Map<string, number>();
      wMatches.forEach(m => {
        (m.results || []).forEach(r => {
          scores.set(r.playerId, (scores.get(r.playerId) || 0) + (r.leaguePointsEarned || 0));
        });
      });
      let topP: string | null = null;
      let topS = -1;
      scores.forEach((s, pId) => {
        if (s > topS) {
          topS = s;
          topP = pId;
        }
      });
      if (topP === playerId && topS > 0) weeklyTitles++;
    });

    monthsMap.forEach(mMatches => {
      const scores = new Map<string, number>();
      mMatches.forEach(m => {
        (m.results || []).forEach(r => {
          scores.set(r.playerId, (scores.get(r.playerId) || 0) + (r.leaguePointsEarned || 0));
        });
      });
      let topP: string | null = null;
      let topS = -1;
      scores.forEach((s, pId) => {
        if (s > topS) {
          topS = s;
          topP = pId;
        }
      });
      if (topP === playerId && topS > 0) monthlyTitles++;
    });

    return {
      totalMatches,
      wins,
      podiums,
      totalScore,
      currentStreak,
      bestStreak,
      favoriteGameId,
      weeklyTitles,
      monthlyTitles
    };
  };

  const getLeaderboard = (scope: 'all' | 'month' | 'week', filterKey?: string): LeaderboardEntry[] => {
    let filteredMatches = [...matches];

    if (scope === 'week') {
      const targetWeek = filterKey || (matches.length > 0 ? getWeekKey(matches[0].date) : getWeekKey(new Date().toISOString()));
      filteredMatches = filteredMatches.filter(m => getWeekKey(m.date) === targetWeek);
    } else if (scope === 'month') {
      const targetMonth = filterKey || (matches.length > 0 ? getMonthKey(matches[0].date) : getMonthKey(new Date().toISOString()));
      filteredMatches = filteredMatches.filter(m => getMonthKey(m.date) === targetMonth);
    }

    const map = new Map<string, { totalPoints: number; matchesPlayed: number; wins: number; podiums: number }>();

    players.forEach(p => {
      map.set(p.id, { totalPoints: 0, matchesPlayed: 0, wins: 0, podiums: 0 });
    });

    filteredMatches.forEach(m => {
      (m.results || []).forEach(r => {
        const curr = map.get(r.playerId) || { totalPoints: 0, matchesPlayed: 0, wins: 0, podiums: 0 };
        curr.totalPoints += (r.leaguePointsEarned || 0);
        curr.matchesPlayed += 1;
        if (r.rank === 1) curr.wins += 1;
        if (r.rank <= 3) curr.podiums += 1;
        map.set(r.playerId, curr);
      });
    });

    const entries: LeaderboardEntry[] = players
      .map(p => {
        const stats = map.get(p.id) || { totalPoints: 0, matchesPlayed: 0, wins: 0, podiums: 0 };
        const averageScore = stats.matchesPlayed > 0 ? Number((stats.totalPoints / stats.matchesPlayed).toFixed(1)) : 0;
        return {
          player: p,
          totalPoints: stats.totalPoints,
          matchesPlayed: stats.matchesPlayed,
          wins: stats.wins,
          podiums: stats.podiums,
          rank: 1,
          averageScore
        };
      })
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.podiums - a.podiums;
      });

    let currentRank = 1;
    entries.forEach((entry, idx) => {
      if (idx > 0 && entry.totalPoints < entries[idx - 1].totalPoints) {
        currentRank = idx + 1;
      }
      entry.rank = currentRank;
    });

    return entries;
  };

  const getWeeklyChampion = (weekKey?: string): LeaderboardEntry | null => {
    const list = getLeaderboard('week', weekKey);
    return list.length > 0 && list[0].totalPoints > 0 ? list[0] : null;
  };

  const getMonthlyChampion = (monthKey?: string): LeaderboardEntry | null => {
    const list = getLeaderboard('month', monthKey);
    return list.length > 0 && list[0].totalPoints > 0 ? list[0] : null;
  };

  return (
    <AppContext.Provider
      value={{
        players,
        games,
        matches,
        tournaments,
        settings,
        activeTab,
        setActiveTab,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addGame,
        updateGame,
        deleteGame,
        addMatch,
        deleteMatch,
        addTournament,
        updateTournament,
        deleteTournament,
        updateSettings,
        resetAllData,
        reloadFromStorage,
        getPlayerStats,
        getLeaderboard,
        getWeeklyChampion,
        getMonthlyChampion,
        calculateLeaguePoints,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
