import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Check,
  Flame,
  Dices,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { MatchPlayerResult, Player } from '../types';
import { useApp } from '../context/AppContext';
import { AvatarImage } from './AvatarImage';

interface MatchRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGameId?: string;
  initialPlayerScores?: { playerId: string; score: number }[];
}

export const MatchRecorderModal: React.FC<MatchRecorderModalProps> = ({
  isOpen,
  onClose,
  initialGameId,
  initialPlayerScores
}) => {
  const { players, games, addMatch, calculateLeaguePoints } = useApp();

  const nowIso = new Date().toISOString().slice(0, 16);
  const [date, setDate] = useState(nowIso);
  const [selectedGameId, setSelectedGameId] = useState<string>(
    initialGameId || (games.length > 0 ? games[0].id : '')
  );
  const [location, setLocation] = useState('Mesa da Sala');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isWeeklyCupMatch, setIsWeeklyCupMatch] = useState(true);
  const [notes, setNotes] = useState('');

  // Player ranking order (1st to last)
  const [rankedPlayerIds, setRankedPlayerIds] = useState<string[]>([]);
  const [rawScores, setRawScores] = useState<{ [playerId: string]: number }>({});

  // Reinitialize state whenever the modal opens so prefilled scores from
  // the live counter (or any caller) are always applied fresh.
  useEffect(() => {
    if (!isOpen) return;

    // Fresh timestamp on each open
    setDate(new Date().toISOString().slice(0, 16));
    setNotes('');

    if (initialGameId) {
      setSelectedGameId(initialGameId);
    } else if (games.length > 0) {
      setSelectedGameId(games[0].id);
    }

    if (initialPlayerScores && initialPlayerScores.length > 0) {
      // Sort highest score → lowest so 1st place is at top
      const sorted = [...initialPlayerScores].sort((a, b) => b.score - a.score);
      setRankedPlayerIds(sorted.map(p => p.playerId));
      const scores: { [playerId: string]: number } = {};
      sorted.forEach(p => { scores[p.playerId] = p.score; });
      setRawScores(scores);
    } else {
      // Default: first 4 players, no raw scores
      setRankedPlayerIds(players.slice(0, 4).map(p => p.id));
      setRawScores({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedGame = games.find(g => g.id === selectedGameId);

  const togglePlayerInclusion = (playerId: string) => {
    if (rankedPlayerIds.includes(playerId)) {
      if (rankedPlayerIds.length <= 2) {
        alert('Uma partida precisa de no mínimo 2 jogadores!');
        return;
      }
      setRankedPlayerIds(rankedPlayerIds.filter(id => id !== playerId));
    } else {
      setRankedPlayerIds([...rankedPlayerIds, playerId]);
    }
  };

  const moveRank = (index: number, direction: 'up' | 'down') => {
    const newRanks = [...rankedPlayerIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newRanks.length) return;
    const temp = newRanks[index];
    newRanks[index] = newRanks[targetIndex];
    newRanks[targetIndex] = temp;
    setRankedPlayerIds(newRanks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGameId) {
      alert('Selecione um jogo!');
      return;
    }
    if (rankedPlayerIds.length < 2) {
      alert('Selecione ao menos 2 jogadores para a partida!');
      return;
    }

    const results: MatchPlayerResult[] = rankedPlayerIds.map((playerId, index) => {
      const rank = index + 1;
      const pts = isWeeklyCupMatch ? calculateLeaguePoints(rank) : 0;
      return {
        playerId,
        rank,
        rawScore: rawScores[playerId],
        leaguePointsEarned: pts
      };
    });

    addMatch({
      date: new Date(date).toISOString(),
      gameId: selectedGameId,
      location: location.trim() || 'Mesa da Sala',
      durationMinutes: Number(durationMinutes) || 30,
      isWeeklyCupMatch,
      notes: notes.trim(),
      results
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-brand-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
            🏆
          </div>
          <div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Registrar Resultado de Partida
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Lance a pontuação oficial para atualizar o ranking da semana e do mês!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Game Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Jogo Disputado *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {games.map(game => {
                const isSelected = selectedGameId === game.id;
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setSelectedGameId(game.id)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl">{game.icon}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">{game.name}</p>
                      <span className="text-[10px] text-slate-400 block truncate">{game.complexity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Location, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Data & Hora
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Local
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Mesa da Sala"
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Duração (min)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min="5"
                step="5"
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Toggle: Valendo para a Copa da Semana */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 via-purple-950/40 to-slate-900/60 border border-brand-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base">
                ✨
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Partida Oficial da Copa Familiar</h4>
                <p className="text-xs text-slate-400">Pontua nos rankings semanal, mensal e geral da liga</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isWeeklyCupMatch}
              onChange={(e) => setIsWeeklyCupMatch(e.target.checked)}
              className="w-5 h-5 rounded-lg accent-brand-500 cursor-pointer"
            />
          </div>

          {/* Players Selection & Ranking Order */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Jogadores Participantes (Selecione quem jogou)
              </label>
              <span className="text-xs text-slate-400">
                {rankedPlayerIds.length} selecionados
              </span>
            </div>

            {/* Quick Player Inclusion Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {players.map(p => {
                const isSelected = rankedPlayerIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlayerInclusion(p.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-500/30 border-brand-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="w-5 h-5 rounded-full bg-slate-800 object-cover"
                    />
                    <span>{p.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-300" />}
                  </button>
                );
              })}
            </div>

            {/* Reorder Ranking from 1st to Last */}
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Classificação Final da Partida (1º Lugar até o Último)
            </label>

            <div className="space-y-2">
              {rankedPlayerIds.map((playerId, index) => {
                const player = players.find(p => p.id === playerId);
                if (!player) return null;
                const rank = index + 1;
                const earnedPts = calculateLeaguePoints(rank);

                return (
                  <div
                    key={playerId}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      rank === 1
                        ? 'bg-amber-500/15 border-amber-500/40 glow-gold'
                        : rank === 2
                        ? 'bg-slate-800/80 border-slate-400/30'
                        : rank === 3
                        ? 'bg-orange-950/40 border-orange-600/30'
                        : 'bg-slate-900/60 border-white/5'
                    }`}
                  >
                    {/* Rank Badge & Avatar & Name */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                          rank === 1
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-900'
                            : rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rank}º
                      </div>

                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <AvatarImage
                          src={player.avatarUrl}
                          alt={player.name}
                          fallbackText={player.name}
                          themeColor={player.themeColor}
                        />
                      </div>

                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-white">{player.name}</h5>
                        <span className="text-[10px] text-slate-400 font-semibold">{player.nickname}</span>
                      </div>
                    </div>

                    {/* Points Preview & Move Buttons */}
                    <div className="flex items-center gap-3">
                      
                      {/* Optional Raw Game Score (e.g. 10 Victory Points in Catan) */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 hidden sm:inline">Pontos no Jogo:</span>
                        <input
                          type="number"
                          placeholder="Score"
                          value={rawScores[playerId] ?? ''}
                          onChange={(e) => setRawScores({ ...rawScores, [playerId]: Number(e.target.value) })}
                          className="w-16 px-2 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      {/* Earned League Points Pill */}
                      <div className="px-3 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black min-w-[65px] text-center">
                        +{earnedPts} pts
                      </div>

                      {/* Order Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveRank(index, 'up')}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          title="Mover para cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === rankedPlayerIds.length - 1}
                          onClick={() => moveRank(index, 'down')}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          title="Mover para baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Momentos Marcantes / Observações
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Virada histórica na última jogada de dados!"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-brand-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Trophy className="w-4 h-4" />
              Salvar Partida Oficial
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
