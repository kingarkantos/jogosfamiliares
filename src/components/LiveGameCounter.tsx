import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Minus,
  RotateCcw,
  Trophy,
  Users,
  Dices,
  Check,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';
import { AvatarImage } from './AvatarImage';

interface LiveGameCounterProps {
  onFinishMatch: (gameId: string, playerScores: { playerId: string; score: number }[]) => void;
}

export const LiveGameCounter: React.FC<LiveGameCounterProps> = ({ onFinishMatch }) => {
  const { players, games } = useApp();

  const [selectedGameId, setSelectedGameId] = useState<string>(games[0]?.id || '');
  const [round, setRound] = useState(1);
  const [activeTurnPlayerIndex, setActiveTurnPlayerIndex] = useState(0);

  // Table players & scores
  const [tablePlayerIds, setTablePlayerIds] = useState<string[]>(
    players.slice(0, 4).map(p => p.id)
  );
  const [scores, setScores] = useState<{ [playerId: string]: number }>(() => {
    const s: { [pId: string]: number } = {};
    players.forEach(p => { s[p.id] = 0; });
    return s;
  });

  const selectedGame = games.find(g => g.id === selectedGameId);

  const togglePlayerAtTable = (playerId: string) => {
    if (tablePlayerIds.includes(playerId)) {
      if (tablePlayerIds.length <= 1) return;
      setTablePlayerIds(tablePlayerIds.filter(id => id !== playerId));
    } else {
      setTablePlayerIds([...tablePlayerIds, playerId]);
    }
  };

  const updateScore = (playerId: string, delta: number) => {
    sounds.playClick();
    setScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + delta
    }));
  };

  const resetAllScores = () => {
    if (window.confirm('Deseja zerar os pontos de todos os jogadores na mesa?')) {
      const reset: { [pId: string]: number } = {};
      tablePlayerIds.forEach(id => { reset[id] = 0; });
      setScores(reset);
      setRound(1);
      setActiveTurnPlayerIndex(0);
      sounds.playClick();
    }
  };

  const nextTurn = () => {
    sounds.playClick();
    if (activeTurnPlayerIndex + 1 >= tablePlayerIds.length) {
      setActiveTurnPlayerIndex(0);
      setRound(r => r + 1);
    } else {
      setActiveTurnPlayerIndex(idx => idx + 1);
    }
  };

  // Sort players by score descending for live leaderboard preview
  const sortedTablePlayers = [...tablePlayerIds]
    .map(pId => ({
      player: players.find(p => p.id === pId)!,
      score: scores[pId] || 0
    }))
    .filter(item => item.player)
    .sort((a, b) => b.score - a.score);

  const handleFinish = () => {
    sounds.playSuccess();
    const rankedResults = sortedTablePlayers.map(item => ({
      playerId: item.player.id,
      score: item.score
    }));
    onFinishMatch(selectedGameId, rankedResults);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header */}
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

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetAllScores}
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
            Encerrar & Salvar na Copa
          </button>
        </div>
      </div>

      {/* Game Selector & Round Info */}
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
                onChange={(e) => setSelectedGameId(e.target.value)}
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
            onClick={nextTurn}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 hover:scale-105 active:scale-95 transition-all"
            title="Passar Vez / Próximo Jogador"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Choose who is at the table */}
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
                onClick={() => togglePlayerAtTable(p.id)}
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

      {/* Interactive Player Score Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tablePlayerIds.map((playerId, index) => {
          const player = players.find(p => p.id === playerId);
          if (!player) return null;

          const currentScore = scores[playerId] || 0;
          const isTurn = tablePlayerIds[activeTurnPlayerIndex] === playerId;

          // Find current rank in this live match
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

              {/* Big Score Display */}
              <div className="py-4 my-2 text-center rounded-2xl bg-slate-950/70 border border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Pontos Atuais
                </span>
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text font-display">
                  {currentScore}
                </span>
              </div>

              {/* Quick Tactile Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateScore(player.id, 1)}
                    className="py-2.5 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white font-black text-sm border border-brand-500/40 active:scale-95 transition-all"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateScore(player.id, 5)}
                    className="py-2.5 rounded-xl bg-brand-600/50 hover:bg-brand-500 text-white font-black text-sm border border-brand-400/50 active:scale-95 transition-all shadow-sm"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => updateScore(player.id, 10)}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-sm shadow-md active:scale-95 transition-all"
                  >
                    +10
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateScore(player.id, -1)}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs border border-white/5 active:scale-95 transition-all"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateScore(player.id, -5)}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs border border-white/5 active:scale-95 transition-all"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => {
                      const custom = prompt(`Adicionar pontuação manual para ${player.name}:`, '0');
                      if (custom && !isNaN(Number(custom))) {
                        updateScore(player.id, Number(custom));
                      }
                    }}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-300 font-bold text-xs border border-brand-500/20 active:scale-95 transition-all"
                  >
                    Custom
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
