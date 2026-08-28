import { AppSettings, Game, Match, Player } from '../types';
import { buildAvatarUrl } from './avatarGenerator';

export const DEFAULT_SETTINGS: AppSettings = {
  leagueName: 'Copa dos Tabuleiros da Família',
  weeklyDayNumber: 4, // Thursday
  weeklyDayName: 'Quinta-feira',
  pointRules: {
    first: 10,
    second: 7,
    third: 5,
    fourth: 3,
    fifthPlus: 2,
    participation: 1
  },
  soundEnabled: true,
  theme: 'dark'
};

export const INITIAL_PLAYERS: Player[] = [];

export const DEMO_PLAYERS: Player[] = [
  {
    id: 'player-1',
    name: 'Lucas (Pai)',
    nickname: 'O Estrategista',
    themeColor: '#3b82f6',
    phrase: 'Tudo faz parte de um plano maior!',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'personas',
      seed: 'LucasPai',
      backgroundColor: '3b82f6',
      glasses: true,
    },
    avatarUrl: buildAvatarUrl({
      style: 'personas',
      seed: 'LucasPai',
      backgroundColor: '3b82f6',
      glasses: true,
    })
  },
  {
    id: 'player-2',
    name: 'Camila (Mãe)',
    nickname: 'Rainha do Catan',
    themeColor: '#ec4899',
    phrase: 'Troco 2 ovelhas por 1 trigo, quem quer?',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'lorelei',
      seed: 'CamilaMae',
      backgroundColor: 'ec4899',
      glasses: false,
    },
    avatarUrl: buildAvatarUrl({
      style: 'lorelei',
      seed: 'CamilaMae',
      backgroundColor: 'ec4899',
      glasses: false,
    })
  },
  {
    id: 'player-3',
    name: 'Matheus (Filho)',
    nickname: 'Mestre dos Dados',
    themeColor: '#8b5cf6',
    phrase: 'Se tirou 6 no dado, a vitória é minha!',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'adventurer',
      seed: 'MatheusFilho',
      backgroundColor: '8b5cf6',
      glasses: false,
    },
    avatarUrl: buildAvatarUrl({
      style: 'adventurer',
      seed: 'MatheusFilho',
      backgroundColor: '8b5cf6',
      glasses: false,
    })
  },
  {
    id: 'player-4',
    name: 'Beatriz (Filha)',
    nickname: 'Soberana do Dixit',
    themeColor: '#10b981',
    phrase: 'A poesia visual está em cada carta.',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'fun-emoji',
      seed: 'BeatrizFilha',
      backgroundColor: '10b981',
      glasses: false,
    },
    avatarUrl: buildAvatarUrl({
      style: 'fun-emoji',
      seed: 'BeatrizFilha',
      backgroundColor: '10b981',
      glasses: false,
    })
  },
  {
    id: 'player-5',
    name: 'Rodrigo (Tio)',
    nickname: 'O Blefador',
    themeColor: '#f59e0b',
    phrase: 'Eu sou o Duque! Não ouse contestar...',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'bottts-neutral',
      seed: 'RodrigoTio',
      backgroundColor: 'f59e0b',
      glasses: true,
    },
    avatarUrl: buildAvatarUrl({
      style: 'bottts-neutral',
      seed: 'RodrigoTio',
      backgroundColor: 'f59e0b',
      glasses: true,
    })
  },
  {
    id: 'player-6',
    name: 'Vovô Carlos',
    nickname: 'Lenda do Dominó',
    themeColor: '#06b6d4',
    phrase: 'Paciência e calma vencem qualquer partida.',
    createdAt: '2026-01-10T10:00:00.000Z',
    avatarConfig: {
      style: 'personas',
      seed: 'VovoCarlos',
      backgroundColor: '06b6d4',
      glasses: true,
    },
    avatarUrl: buildAvatarUrl({
      style: 'personas',
      seed: 'VovoCarlos',
      backgroundColor: '06b6d4',
      glasses: true,
    })
  }
];

export const INITIAL_GAMES: Game[] = [];

export const DEMO_GAMES: Game[] = [
  {
    id: 'game-catan',
    name: 'Catan',
    category: 'Estratégia & Negociação',
    icon: '🌾',
    minPlayers: 3,
    maxPlayers: 4,
    durationMinutes: 75,
    complexity: 'Médio',
    scoringType: 'highest',
    description: 'Colonize a ilha de Catan negociando recursos, construindo estradas, aldeias e cidades.',
    timesPlayed: 0
  },
  {
    id: 'game-dixit',
    name: 'Dixit',
    category: 'Criatividade & Blefe',
    icon: '🎨',
    minPlayers: 3,
    maxPlayers: 8,
    durationMinutes: 40,
    complexity: 'Fácil',
    scoringType: 'highest',
    description: 'Um jogo poético de adivinhação com cartas surreais e ilustrações mágicas.',
    timesPlayed: 0
  },
  {
    id: 'game-carcassonne',
    name: 'Carcassonne',
    category: 'Colocação de Peças',
    icon: '🏰',
    minPlayers: 2,
    maxPlayers: 5,
    durationMinutes: 45,
    complexity: 'Médio',
    scoringType: 'highest',
    description: 'Construa cidades medievais, estradas, mosteiros e campos colocando peças estratégicas.',
    timesPlayed: 0
  },
  {
    id: 'game-ticket',
    name: 'Ticket to Ride',
    category: 'Conexão de Rotas',
    icon: '🚂',
    minPlayers: 2,
    maxPlayers: 5,
    durationMinutes: 60,
    complexity: 'Médio',
    scoringType: 'highest',
    description: 'Conecte cidades famosas dos trilhos ferroviários completando seus bilhetes de destino.',
    timesPlayed: 0
  },
  {
    id: 'game-coup',
    name: 'Coup',
    category: 'Blefe & Dedução',
    icon: '👑',
    minPlayers: 2,
    maxPlayers: 6,
    durationMinutes: 20,
    complexity: 'Fácil',
    scoringType: 'elimination',
    description: 'Blefe, influencie e elimine os oponentes para ser o único sobrevivente no governo.',
    timesPlayed: 0
  },
  {
    id: 'game-dobble',
    name: 'Dobble / Spot It!',
    category: 'Reflexo & Agilidade',
    icon: '⚡',
    minPlayers: 2,
    maxPlayers: 8,
    durationMinutes: 15,
    complexity: 'Festa',
    scoringType: 'highest',
    description: 'Encontre o único símbolo comum entre duas cartas antes de todo mundo.',
    timesPlayed: 0
  },
  {
    id: 'game-uno',
    name: 'Uno No Mercy',
    category: 'Cartas & Caos',
    icon: '🃏',
    minPlayers: 2,
    maxPlayers: 10,
    durationMinutes: 25,
    complexity: 'Fácil',
    scoringType: 'elimination',
    description: 'A versão mais cruel e divertida do clássico UNO com penalidades extremas!',
    timesPlayed: 0
  },
  {
    id: 'game-exploding',
    name: 'Exploding Kittens',
    category: 'Roleta Russa Felina',
    icon: '💣',
    minPlayers: 2,
    maxPlayers: 5,
    durationMinutes: 20,
    complexity: 'Festa',
    scoringType: 'elimination',
    description: 'Evite explodir com os gatinhos explosivos usando desarmes, ataques e pulos de turno.',
    timesPlayed: 0
  }
];

// Initial state is clean (no matches yet)
export const INITIAL_MATCHES: Match[] = [];

// Sample demo matches for preview / demonstration purposes
export const DEMO_MATCHES: Match[] = [
  // Quinta-feira recente
  {
    id: 'match-1',
    date: '2026-08-20T20:00:00.000Z',
    gameId: 'game-catan',
    location: 'Mesa da Sala',
    isWeeklyCupMatch: true,
    durationMinutes: 80,
    notes: 'Partida épica com vitória apertada nos últimos dados!',
    results: [
      { playerId: 'player-3', rank: 1, rawScore: 10, leaguePointsEarned: 10 },
      { playerId: 'player-2', rank: 2, rawScore: 9, leaguePointsEarned: 7 },
      { playerId: 'player-1', rank: 3, rawScore: 8, leaguePointsEarned: 5 },
      { playerId: 'player-4', rank: 4, rawScore: 6, leaguePointsEarned: 3 }
    ]
  },
  {
    id: 'match-2',
    date: '2026-08-20T21:30:00.000Z',
    gameId: 'game-coup',
    location: 'Mesa da Sala',
    isWeeklyCupMatch: true,
    durationMinutes: 25,
    notes: 'O tio Rodrigo blefou de Duque até o final!',
    results: [
      { playerId: 'player-5', rank: 1, rawScore: 1, leaguePointsEarned: 10 },
      { playerId: 'player-3', rank: 2, rawScore: 0, leaguePointsEarned: 7 },
      { playerId: 'player-1', rank: 3, rawScore: 0, leaguePointsEarned: 5 },
      { playerId: 'player-2', rank: 4, rawScore: 0, leaguePointsEarned: 3 },
      { playerId: 'player-4', rank: 5, rawScore: 0, leaguePointsEarned: 2 },
      { playerId: 'player-6', rank: 6, rawScore: 0, leaguePointsEarned: 1 }
    ]
  },
  {
    id: 'match-3',
    date: '2026-08-13T20:00:00.000Z',
    gameId: 'game-dixit',
    location: 'Mesa da Varanda',
    isWeeklyCupMatch: true,
    durationMinutes: 45,
    notes: 'Beatriz deu show de pistas misteriosas!',
    results: [
      { playerId: 'player-4', rank: 1, rawScore: 32, leaguePointsEarned: 10 },
      { playerId: 'player-1', rank: 2, rawScore: 28, leaguePointsEarned: 7 },
      { playerId: 'player-2', rank: 3, rawScore: 26, leaguePointsEarned: 5 },
      { playerId: 'player-3', rank: 4, rawScore: 22, leaguePointsEarned: 3 },
      { playerId: 'player-5', rank: 5, rawScore: 18, leaguePointsEarned: 2 }
    ]
  },
  {
    id: 'match-4',
    date: '2026-08-13T21:00:00.000Z',
    gameId: 'game-carcassonne',
    location: 'Mesa da Varanda',
    isWeeklyCupMatch: true,
    durationMinutes: 50,
    results: [
      { playerId: 'player-1', rank: 1, rawScore: 94, leaguePointsEarned: 10 },
      { playerId: 'player-2', rank: 2, rawScore: 89, leaguePointsEarned: 7 },
      { playerId: 'player-6', rank: 3, rawScore: 78, leaguePointsEarned: 5 },
      { playerId: 'player-3', rank: 4, rawScore: 65, leaguePointsEarned: 3 }
    ]
  },
  {
    id: 'match-5',
    date: '2026-08-06T20:00:00.000Z',
    gameId: 'game-ticket',
    location: 'Mesa da Sala',
    isWeeklyCupMatch: true,
    durationMinutes: 70,
    results: [
      { playerId: 'player-2', rank: 1, rawScore: 122, leaguePointsEarned: 10 },
      { playerId: 'player-1', rank: 2, rawScore: 115, leaguePointsEarned: 7 },
      { playerId: 'player-4', rank: 3, rawScore: 98, leaguePointsEarned: 5 },
      { playerId: 'player-3', rank: 4, rawScore: 84, leaguePointsEarned: 3 }
    ]
  }
];
