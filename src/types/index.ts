export type AvatarStyle = 
  | 'personas'
  | 'adventurer'
  | 'bottts-neutral'
  | 'lorelei'
  | 'micah'
  | 'fun-emoji'
  | 'croodles'
  | 'big-smile'
  | 'thumbs'
  | 'open-peeps';

export interface AvatarConfig {
  style: AvatarStyle;
  seed: string;
  backgroundColor?: string;
  hair?: string;
  accessories?: string;
  glasses?: boolean;
  expression?: string;
  skinColor?: string;
  clothingColor?: string;
  customSvg?: string;
}

export interface PlayerStats {
  totalMatches: number;
  wins: number;
  podiums: number; // 1st, 2nd, 3rd
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  favoriteGameId?: string;
  weeklyTitles: number;
  monthlyTitles: number;
}

export interface Player {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  avatarConfig: AvatarConfig;
  themeColor: string;
  phrase: string;
  createdAt: string;
  stats?: PlayerStats;
}

export type GameComplexity = 'Fácil' | 'Médio' | 'Estratégico' | 'Festa';
export type ScoringType = 'highest' | 'lowest' | 'elimination' | 'coop';

export interface Game {
  id: string;
  name: string;
  category: string;
  icon: string;
  coverImage?: string;
  minPlayers: number;
  maxPlayers: number;
  durationMinutes: number;
  complexity: GameComplexity;
  scoringType: ScoringType;
  description: string;
  timesPlayed: number;
}

export interface MatchPlayerResult {
  playerId: string;
  rank: number;
  rawScore?: number;
  leaguePointsEarned: number;
  notes?: string;
}

export interface Match {
  id: string;
  date: string; // ISO format: YYYY-MM-DDTHH:mm
  gameId: string;
  location?: string;
  results: MatchPlayerResult[];
  durationMinutes?: number;
  notes?: string;
  isWeeklyCupMatch: boolean;
}

export interface TournamentMatch {
  id: string;
  round: number; // 1: Quartas, 2: Semifinal, 3: Final
  matchNumber: number;
  player1Id?: string;
  player2Id?: string;
  score1?: number;
  score2?: number;
  winnerId?: string;
  nextMatchId?: string;
  isCompleted: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  gameId: string;
  date: string;
  size: 4 | 8 | 16;
  playerIds: string[];
  matches: TournamentMatch[];
  status: 'setup' | 'in_progress' | 'completed';
  winnerId?: string;
}

export interface PointRuleSettings {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifthPlus: number;
  participation: number;
}

export interface AppSettings {
  leagueName: string;
  weeklyDayNumber: number; // 4 = Thursday (Quinta-feira)
  weeklyDayName: string;
  pointRules: PointRuleSettings;
  soundEnabled: boolean;
  theme: 'dark' | 'neon' | 'sunset' | 'emerald';
}
