import React, { useState } from 'react';
import {
  RotateCcw,
  Trophy,
  Check,
  ChevronRight,
  Timer,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';
import { AvatarImage } from './AvatarImage';

interface LiveGameCounterProps {
  onFinishMatch: (gameId: string, playerScores: { playerId: string; score: number }[]) => void;
}

const TIMER_PRESETS = [
  { label: '3 min', seconds: 3 * 60 },
  { label: '5 min', seconds: 5 * 60 },
  { label: '10 min', seconds: 10 * 60 },
  { label: '20 min', seconds: 20 * 60 },
  { label: '30 min', seconds: 30 * 60 },
];

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export const LiveGameCounter: React.FC<LiveGameCounterProps> = ({ onFinishMatch }) => {
  const {
    players,
    games,
    liveCounter,
    setLiveCounterGame,
    toggleLiveCounterPlayer,
    updateLiveScore,
    resetLiveScores,
    nextLiveTurn,
    setLiveTimer,
    startLiveTimer,
    pauseLiveTimer,
    resetLiveTimer,
  } = useApp();

  const [customMinutes, setCustomMinutes] = useState('');
  const [showTimerPanel, setShowTimerPanel] = useState(false);

  const {
    selectedGameId,
    tablePlayerIds,
    scores,
    round,
    activeTurnPlayerIndex,
    timerDurationSeconds,
    timerSecondsLeft,
    timerRunning,
  } = liveCounter;

  const selectedGame = games.find(g => g.id === selectedGameId);

  // Sort players by score descending for live leaderboard
  const sortedTablePlayers = [...tablePlayerIds]
    .map(pId => ({
      player: players.find(p => p.id === pId)!,
      score: scores[pId] ?? 0,
    }))
    .filter(item => item.player)
    .sort((a, b) => b.score - a.score);

  const handleFinish = () => {
    sounds.playSuccess();
    const rankedResults = sortedTablePlayers.map(item => ({
      playerId: item.player.id,
      score: item.score,
    }));
    onFinishMatch(selectedGameId, rankedResults);
  };

  const handleResetScores = () => {
    if (window.confirm('Deseja zerar os pontos de todos os jogadores na mesa?')) {
      resetLiveScores();
    }
  };

  const handleSetCustomTimer = () => {
    const mins = Number(customMinutes);
    if (!isNaN(mins) && mins > 0) {
      setLiveTimer(mins * 60);
      setCustomMinutes('');
    }
  };

  // Timer color & urgency
  const timerPercent = timerDurationSeconds > 0 ? timerSecondsLeft / timerDurationSeconds : 1;
  const isUrgent = timerSecondsLeft > 0 && timerSecondsLeft <= 10;
  const isExpired = timerDurationSeconds > 0 && timerSecondsLeft === 0 && !timerRunning;

  // SVG circular progress ring
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timerPercent);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            <span>Contador de Pontos por Partida</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              ⚡ Placar ao Vivo
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Controle os pontos rodada a rodada em tempo real na mesa de jogo.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowTimerPanel(v => !v)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              timerRunning
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-white/10 text-slate-300'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            {timerDurationSeconds > 0 ? formatTime(timerSecondsLeft) : 'Temporizador'}
          </button>

          <button
            onClick={handleResetScores}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Zerar Placar
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Trophy className="w-4 h-4" />
            Encerrar &amp; Salvar na Copa
          </button>
        </div>
      </div>

      {/* ── Timer Panel (collapsible) ── */}
      {showTimerPanel && (
        <div className="glass-panel p-5 rounded-3xl border border-brand-500/30 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Circular timer ring */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-28 h-28">
              <svg width="112" height="112" className="-rotate-90">
                {/* Background ring */}
                <circle
                  cx="56" cy="56" r={radius}
                  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"
                />
                {/* Progress ring */}
                <circle
                  cx="56" cy="56" r={radius}
                  fill="none"
                  stroke={isUrgent ? '#ef4444' : isExpired ? '#6b7280' : '#8b5cf6'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={timerDurationSeconds > 0 ? dashOffset : 0}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black font-display ${isUrgent ? 'text-red-400 animate-pulse' : isExpired ? 'text-slate-500' : 'text-white'}`}>
                  {timerDurationSeconds > 0 ? formatTime(timerSecondsLeft) : '--:--'}
                </span>
                {isExpired && (
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Tempo!</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              {/* Preset buttons */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tempo Rápido</p>
                <div className="flex flex-wrap gap-2">
                  {TIMER_PRESETS.map(preset => (
                    <button
                      key={preset.seconds}
                      onClick={() => setLiveTimer(preset.seconds)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                        timerDurationSeconds === preset.seconds
                          ? 'bg-brand-600 border-brand-400 text-white shadow-md'
                          : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={customMinutes}
                  onChange={e => setCustomMinutes(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSetCustomTimer()}
                  placeholder="Minutos personalizados"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={handleSetCustomTimer}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
                >
                  Definir
                </button>
              </div>

              {/* Play / Pause / Reset controls */}
              {timerDurationSeconds > 0 && (
                <div className="flex items-center gap-2">
                  {timerRunning ? (
                    <button
                      onClick={pauseLiveTimer}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pausar
                    </button>
                  ) : (
                    <button
                      onClick={startLiveTimer}
                      disabled={timerSecondsLeft === 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      <Play className="w-3.5 h-3.5" /> Iniciar
                    </button>
                  )}
                  <button
                    onClick={resetLiveTimer}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-bold transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Game Selector & Round Info ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Game Picker */}
        <div className="glass-panel p-4 rounded-3xl md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedGame?.icon || '🎲'}</span>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Jogo em Andamento
              </label>
              <select
                value={selectedGameId}
                onChange={e => setLiveCounterGame(e.target.value)}
                className="bg-transparent text-white font-black text-base sm:text-lg focus:outline-none cursor-pointer"
              >
                {games.map(g => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                    {g.icon} {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Jogadores na Mesa:</span>
            <span className="px-2.5 py-1 rounded-xl bg-brand-500/20 text-brand-300 font-black text-xs">
              {tablePlayerIds.length} Atletas
            </span>
          </div>
        </div>

        {/* Round & Turn Tracker */}
        <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Controle de Turnos
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">Rodada {round}</span>
              {tablePlayerIds[activeTurnPlayerIndex] && (
                <span className="text-xs text-amber-300 font-bold">
                  (Vez de {players.find(p => p.id === tablePlayerIds[activeTurnPlayerIndex])?.name})
                </span>
              )}
            </div>
          </div>

          <button
            onClick={nextLiveTurn}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all"
            title="Passar Vez / Próximo Jogador"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Players at Table selector ── */}
      <div className="glass-panel p-4 rounded-3xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quem está sentado na mesa agora? (Clique para adicionar/remover)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map(p => {
            const isAtTable = tablePlayerIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleLiveCounterPlayer(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
                  isAtTable
                    ? 'bg-brand-600/30 border-brand-400 text-white shadow-md'
                    : 'bg-slate-900/60 border-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-6 h-6 rounded-full bg-slate-800 object-cover"
                />
                <span>{p.name}</span>
                {isAtTable && <Check className="w-3.5 h-3.5 text-brand-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Player Score Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tablePlayerIds.map(playerId => {
          const player = players.find(p => p.id === playerId);
          if (!player) return null;

          const currentScore = scores[playerId] ?? 0;
          const isTurn = tablePlayerIds[activeTurnPlayerIndex] === playerId;
          const rankIndex = sortedTablePlayers.findIndex(item => item.player.id === playerId);
          const rank = rankIndex + 1;

          return (
            <div
              key={player.id}
              className={`glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
                isTurn
                  ? 'border-brand-400 glow-purple ring-2 ring-brand-500/50 scale-[1.02]'
                  : 'border-white/10'
              }`}
            >
              {/* Turn Indicator Banner */}
              {isTurn && (
                <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider py-0.5 text-center shadow">
                  🎯 É A VEZ DE JOGAR!
                </div>
              )}

              {/* Player Header */}
              <div className={`flex items-center justify-between mb-4 ${isTurn ? 'mt-2' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 shadow-md shrink-0">
                    <AvatarImage
                      src={player.avatarUrl}
                      alt={player.name}
                      fallbackText={player.name}
                      themeColor={player.themeColor}
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-white">{player.name}</h4>
                    <span className="text-xs text-amber-400 font-semibold">{player.nickname}</span>
                  </div>
                </div>

                {/* Live Rank Pill */}
                <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-xs shadow-md ${
                  rank === 1
                    ? 'bg-amber-500 text-slate-950 glow-gold'
                    : rank === 2
                    ? 'bg-slate-300 text-slate-900'
                    : rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {rank}º
                </div>
              </div>

              {/* Big Score */}
              <div className="py-4 my-2 text-center rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Pontos Atuais
                </span>
                <span className={`text-4xl sm:text-5xl font-black font-display ${
                  currentScore < 0 ? 'text-red-400' : 'text-transparent bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text'
                }`}>
                  {currentScore}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateLiveScore(player.id, 1)}
                    className="py-2.5 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white font-black text-sm border border-brand-500/40 active:scale-95 transition-all"
                  >+1</button>
                  <button
                    onClick={() => updateLiveScore(player.id, 5)}
                    className="py-2.5 rounded-xl bg-brand-600/50 hover:bg-brand-500 text-white font-black text-sm border border-brand-400/50 active:scale-95 transition-all shadow-sm"
                  >+5</button>
                  <button
                    onClick={() => updateLiveScore(player.id, 10)}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-sm shadow-md active:scale-95 transition-all"
                  >+10</button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateLiveScore(player.id, -1)}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs border border-white/5 active:scale-95 transition-all"
                  >-1</button>
                  <button
                    onClick={() => updateLiveScore(player.id, -5)}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs border border-white/5 active:scale-95 transition-all"
                  >-5</button>
                  <button
                    onClick={() => {
                      const custom = prompt(`Pontuação para ${player.name}:`, '0');
                      if (custom !== null && !isNaN(Number(custom))) {
                        updateLiveScore(player.id, Number(custom));
                      }
                    }}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-300 font-bold text-xs border border-brand-500/20 active:scale-95 transition-all"
                  >Custom</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
