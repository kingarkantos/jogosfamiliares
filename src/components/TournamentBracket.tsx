import React, { useState } from 'react';
import {
  Swords,
  Trophy,
  Crown,
  Plus,
  Play,
  Check,
  Dices,
  RefreshCw,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Tournament, TournamentMatch, Player } from '../types';
import { useApp } from '../context/AppContext';
import { AvatarImage } from './AvatarImage';

export const TournamentBracket: React.FC = () => {
  const { players, games, tournaments, addTournament, updateTournament, deleteTournament, triggerConfetti } = useApp();

  // Create tournament modal state
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [gameId, setGameId] = useState(games.length > 0 ? games[0].id : '');
  const [size, setSize] = useState<4 | 8>(4);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    players.slice(0, 4).map(p => p.id)
  );

  // Active viewed tournament
  const [activeTournamentId, setActiveTournamentId] = useState<string>(
    tournaments.length > 0 ? tournaments[0].id : ''
  );

  const activeTournament = tournaments.find(t => t.id === activeTournamentId) || tournaments[0];

  const handleTogglePlayer = (playerId: string) => {
    if (selectedPlayerIds.includes(playerId)) {
      setSelectedPlayerIds(selectedPlayerIds.filter(id => id !== playerId));
    } else {
      if (selectedPlayerIds.length >= size) {
        alert(`Você selecionou o limite de ${size} jogadores para esta chave.`);
        return;
      }
      setSelectedPlayerIds([...selectedPlayerIds, playerId]);
    }
  };

  const generateMatchesForTournament = (playerIds: string[], tournamentSize: 4 | 8): TournamentMatch[] => {
    // Shuffle players
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    const matches: TournamentMatch[] = [];

    if (tournamentSize === 4) {
      // 2 Semifinals (Round 1), 1 Final (Round 2)
      matches.push({
        id: `match-semi-1`,
        round: 1,
        matchNumber: 1,
        player1Id: shuffled[0],
        player2Id: shuffled[1],
        isCompleted: false,
        nextMatchId: 'match-final'
      });
      matches.push({
        id: `match-semi-2`,
        round: 1,
        matchNumber: 2,
        player1Id: shuffled[2],
        player2Id: shuffled[3],
        isCompleted: false,
        nextMatchId: 'match-final'
      });
      matches.push({
        id: `match-final`,
        round: 2,
        matchNumber: 3,
        isCompleted: false
      });
    } else {
      // 8 Players: 4 Quarterfinals (Round 1), 2 Semifinals (Round 2), 1 Final (Round 3)
      for (let i = 0; i < 4; i++) {
        matches.push({
          id: `match-qf-${i + 1}`,
          round: 1,
          matchNumber: i + 1,
          player1Id: shuffled[i * 2],
          player2Id: shuffled[i * 2 + 1],
          isCompleted: false,
          nextMatchId: i < 2 ? 'match-semi-1' : 'match-semi-2'
        });
      }
      matches.push({
        id: `match-semi-1`,
        round: 2,
        matchNumber: 5,
        isCompleted: false,
        nextMatchId: 'match-final'
      });
      matches.push({
        id: `match-semi-2`,
        round: 2,
        matchNumber: 6,
        isCompleted: false,
        nextMatchId: 'match-final'
      });
      matches.push({
        id: `match-final`,
        round: 3,
        matchNumber: 7,
        isCompleted: false
      });
    }

    return matches;
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayerIds.length !== size) {
      alert(`Por favor, selecione exatamente ${size} jogadores para o torneio!`);
      return;
    }

    const newTournamentId = `tourney-${Date.now()}`;
    const generatedMatches = generateMatchesForTournament(selectedPlayerIds, size);

    const newTourney: Tournament = {
      id: newTournamentId,
      title: title.trim() || `Copa Mata-Mata (${size} Jogadores)`,
      gameId: gameId || games[0]?.id || 'game-catan',
      date: new Date().toISOString(),
      size,
      playerIds: selectedPlayerIds,
      matches: generatedMatches,
      status: 'in_progress'
    };

    addTournament(newTourney);
    setActiveTournamentId(newTournamentId);
    setIsCreating(false);
  };

  const handleSetWinner = (tournament: Tournament, match: TournamentMatch, winnerId: string) => {
    const updatedMatches = tournament.matches.map(m => {
      if (m.id === match.id) {
        return {
          ...m,
          winnerId,
          isCompleted: true
        };
      }
      return m;
    });

    // Advance winner to the next match if exists
    if (match.nextMatchId) {
      const nextMatch = updatedMatches.find(m => m.id === match.nextMatchId);
      if (nextMatch) {
        // Determine whether to assign to player1 or player2
        const isFirstFeed = match.matchNumber % 2 === 1;
        if (isFirstFeed) {
          nextMatch.player1Id = winnerId;
        } else {
          nextMatch.player2Id = winnerId;
        }
      }
    }

    // Check if the final match is completed
    const finalMatch = updatedMatches.find(m => !m.nextMatchId);
    let tourneyWinnerId: string | undefined = undefined;
    let tourneyStatus: 'setup' | 'in_progress' | 'completed' = tournament.status;

    if (finalMatch && finalMatch.winnerId) {
      tourneyWinnerId = finalMatch.winnerId;
      tourneyStatus = 'completed';
      triggerConfetti();
    }

    updateTournament({
      ...tournament,
      matches: updatedMatches,
      winnerId: tourneyWinnerId,
      status: tourneyStatus
    });
  };

  const getPlayer = (id?: string): Player | undefined => {
    return players.find(p => p.id === id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            <span>Torneio Mata-Mata Eliminatório</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              ⚔️ Chave de Confrontos
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gere chaves eliminatórias com 4 ou 8 competidores, avance vencedores e coroe o campeão!
          </p>
        </div>

        <button
          onClick={() => {
            setTitle(`Copa Eliminatória de ${new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}`);
            setSelectedPlayerIds(players.slice(0, 4).map(p => p.id));
            setIsCreating(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Mata-Mata
        </button>
      </div>

      {/* List of active/past tournaments selector if any exist */}
      {tournaments.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tournaments.map(t => {
            const isSelected = (activeTournament?.id === t.id);
            const tourneyGame = games.find(g => g.id === t.gameId);
            const champ = getPlayer(t.winnerId);

            return (
              <div
                key={t.id}
                onClick={() => setActiveTournamentId(t.id)}
                className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-600/30 border-brand-500 text-white shadow-lg'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="text-xl">{tourneyGame?.icon || '🏆'}</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">{t.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {t.status === 'completed' && champ ? `👑 Vencedor: ${champ.name}` : `${t.size} Jogadores em disputa`}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Excluir este torneio?')) {
                      deleteTournament(t.id);
                    }
                  }}
                  className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Tournament View */}
      {activeTournament ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          
          {/* Tournament Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {games.find(g => g.id === activeTournament.gameId)?.icon || '🎲'}
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {activeTournament.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Jogo: <strong className="text-brand-300">{games.find(g => g.id === activeTournament.gameId)?.name}</strong> • Chave de {activeTournament.size} Jogadores
              </p>
            </div>

            {/* Status / Winner Tag */}
            {activeTournament.status === 'completed' && activeTournament.winnerId ? (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 glow-gold">
                <Crown className="w-6 h-6 text-amber-400 animate-bounce-subtle" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">Grande Campeão</span>
                  <strong className="text-sm text-white font-extrabold">
                    {getPlayer(activeTournament.winnerId)?.name}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-amber-400" />
                Torneio em Andamento
              </div>
            )}
          </div>

          {/* Interactive Bracket Grid */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-[700px] gap-8">
              
              {/* Round 1 (Quarterfinals or Semifinals) */}
              <div className="flex-1 space-y-6">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                  {activeTournament.size === 8 ? 'Quartas de Final' : 'Semifinais'}
                </div>
                
                {activeTournament.matches
                  .filter(m => m.round === 1)
                  .map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      getPlayer={getPlayer}
                      onSetWinner={(wId) => handleSetWinner(activeTournament, match, wId)}
                    />
                  ))}
              </div>

              {/* Arrow Connector */}
              <div className="text-slate-600 flex flex-col items-center justify-center">
                <ArrowRight className="w-6 h-6 text-brand-500/40" />
              </div>

              {/* Round 2 (Semifinals if 8 players) */}
              {activeTournament.size === 8 && (
                <>
                  <div className="flex-1 space-y-12">
                    <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">
                      Semifinais
                    </div>
                    {activeTournament.matches
                      .filter(m => m.round === 2)
                      .map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          getPlayer={getPlayer}
                          onSetWinner={(wId) => handleSetWinner(activeTournament, match, wId)}
                        />
                      ))}
                  </div>

                  <div className="text-slate-600 flex flex-col items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-brand-500/40" />
                  </div>
                </>
              )}

              {/* Final Round */}
              <div className="flex-1 space-y-6">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-400 mb-4 flex items-center justify-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Grande Final
                </div>
                {activeTournament.matches
                  .filter(m => !m.nextMatchId)
                  .map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isFinal
                      getPlayer={getPlayer}
                      onSetWinner={(wId) => handleSetWinner(activeTournament, match, wId)}
                    />
                  ))}
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-12 rounded-3xl text-center">
          <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Nenhum Torneio Criado</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Inicie um mata-mata rápido para decidir quem é o melhor jogador do dia na mesa!
          </p>
          <button
            onClick={() => {
              setTitle(`Copa Eliminatória de Quinta-Feira`);
              setSelectedPlayerIds(players.slice(0, 4).map(p => p.id));
              setIsCreating(true);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-brand-600/30"
          >
            Criar Primeiro Mata-Mata
          </button>
        </div>
      )}

      {/* Create Tournament Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <h3 className="font-display font-black text-xl text-white mb-1">
              Criar Chave de Mata-Mata
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure o torneio eliminatório para a jogatina
            </p>

            <form onSubmit={handleCreateTournament} className="space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Título do Torneio
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Copa Relâmpago de Uno"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Game Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Jogo Disputado
                </label>
                <select
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                >
                  {games.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.name} ({g.complexity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bracket Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tamanho da Chave
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSize(4);
                      setSelectedPlayerIds(players.slice(0, 4).map(p => p.id));
                    }}
                    className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all ${
                      size === 4
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-white/5 text-slate-400'
                    }`}
                  >
                    4 Jogadores (Semifinais + Final)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSize(8);
                      setSelectedPlayerIds(players.slice(0, 8).map(p => p.id));
                    }}
                    className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all ${
                      size === 8
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-white/5 text-slate-400'
                    }`}
                  >
                    8 Jogadores (Quartas + Semis + Final)
                  </button>
                </div>
              </div>

              {/* Select Players */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selecione os {size} Jogadores
                  </label>
                  <span className={`text-xs font-bold ${
                    selectedPlayerIds.length === size ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {selectedPlayerIds.length} / {size} selecionados
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {players.map(p => {
                    const isSelected = selectedPlayerIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleTogglePlayer(p.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-brand-500/30 border-brand-400 text-white shadow-sm'
                            : 'bg-slate-900/60 border-white/5 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-6 h-6 rounded-full bg-slate-800 object-cover"
                        />
                        <span className="truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-brand-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={selectedPlayerIds.length !== size}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-sm shadow-lg shadow-brand-600/30 transition-all"
                >
                  <Dices className="w-4 h-4" />
                  Sortear Chaves & Iniciar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for individual Match Bracket Card
interface MatchCardProps {
  match: TournamentMatch;
  isFinal?: boolean;
  getPlayer: (id?: string) => Player | undefined;
  onSetWinner: (winnerId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isFinal, getPlayer, onSetWinner }) => {
  const p1 = getPlayer(match.player1Id);
  const p2 = getPlayer(match.player2Id);

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isFinal
        ? 'bg-amber-500/10 border-amber-500/40 shadow-xl glow-gold'
        : 'bg-slate-900/80 border-white/10 shadow-md'
    }`}>
      
      {/* Player 1 Slot */}
      <div
        onClick={() => p1 && onSetWinner(p1.id)}
        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer mb-2 ${
          match.winnerId === p1?.id
            ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
            : match.winnerId && match.winnerId !== p1?.id
            ? 'opacity-40 border-transparent bg-slate-950/40 text-slate-500'
            : 'bg-slate-950/60 border-white/5 hover:border-brand-500/50 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {p1 ? (
            <>
              <div className="w-7 h-7 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <AvatarImage
                  src={p1.avatarUrl}
                  alt={p1.name}
                  fallbackText={p1.name}
                  themeColor={p1.themeColor}
                />
              </div>
              <span className="text-xs sm:text-sm truncate">{p1.name}</span>
            </>
          ) : (
            <span className="text-xs text-slate-600 italic">Aguardando vencedor...</span>
          )}
        </div>
        {match.winnerId === p1?.id && (
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
      </div>

      {/* VS Divider */}
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500 my-1">
        VS
      </div>

      {/* Player 2 Slot */}
      <div
        onClick={() => p2 && onSetWinner(p2.id)}
        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
          match.winnerId === p2?.id
            ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold'
            : match.winnerId && match.winnerId !== p2?.id
            ? 'opacity-40 border-transparent bg-slate-950/40 text-slate-500'
            : 'bg-slate-950/60 border-white/5 hover:border-brand-500/50 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {p2 ? (
            <>
              <div className="w-7 h-7 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <AvatarImage
                  src={p2.avatarUrl}
                  alt={p2.name}
                  fallbackText={p2.name}
                  themeColor={p2.themeColor}
                />
              </div>
              <span className="text-xs sm:text-sm truncate">{p2.name}</span>
            </>
          ) : (
            <span className="text-xs text-slate-600 italic">Aguardando vencedor...</span>
          )}
        </div>
        {match.winnerId === p2?.id && (
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
      </div>

      {/* Helper text */}
      {!match.winnerId && p1 && p2 && (
        <p className="text-[10px] text-center text-brand-300 mt-2 font-medium">
          Clique no jogador que venceu a partida
        </p>
      )}

    </div>
  );
};
