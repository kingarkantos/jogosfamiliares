import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  Flame,
  Gamepad2,
  Smile,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Game, GameComplexity, ScoringType } from '../types';
import { useApp } from '../context/AppContext';

const EMOJI_OPTIONS = ['🎲', '🌾', '🎨', '🏰', '🚂', '👑', '⚡', '🃏', '💣', '🧙‍♂️', '💎', '🚀', '🐱', '🏝️', '🕵️‍♂️', '🍕'];

export const GamesManager: React.FC = () => {
  const { games, addGame, updateGame, deleteGame } = useApp();

  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('🎲');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [complexity, setComplexity] = useState<GameComplexity>('Médio');
  const [scoringType, setScoringType] = useState<ScoringType>('highest');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingGame(null);
    setName('');
    setCategory('Estratégia & Tabuleiro');
    setIcon('🎲');
    setMinPlayers(2);
    setMaxPlayers(6);
    setDurationMinutes(45);
    setComplexity('Médio');
    setScoringType('highest');
    setDescription('');
    setIsGameModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setName(game.name);
    setCategory(game.category);
    setIcon(game.icon);
    setMinPlayers(game.minPlayers);
    setMaxPlayers(game.maxPlayers);
    setDurationMinutes(game.durationMinutes);
    setComplexity(game.complexity);
    setScoringType(game.scoringType);
    setDescription(game.description);
    setIsGameModalOpen(true);
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingGame) {
      updateGame({
        ...editingGame,
        name: name.trim(),
        category: category.trim(),
        icon,
        minPlayers: Number(minPlayers),
        maxPlayers: Number(maxPlayers),
        durationMinutes: Number(durationMinutes),
        complexity,
        scoringType,
        description: description.trim()
      });
    } else {
      addGame({
        name: name.trim(),
        category: category.trim() || 'Geral',
        icon,
        minPlayers: Number(minPlayers),
        maxPlayers: Number(maxPlayers),
        durationMinutes: Number(durationMinutes),
        complexity,
        scoringType,
        description: description.trim()
      });
    }

    setIsGameModalOpen(false);
  };

  const handleDeleteGame = (game: Game) => {
    if (window.confirm(`Tem certeza que deseja remover o jogo "${game.name}"?`)) {
      deleteGame(game.id);
    }
  };

  const getComplexityBadge = (c: GameComplexity) => {
    switch (c) {
      case 'Fácil':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Médio':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Estratégico':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Festa':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            <span>Acervo de Jogos da Família</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {games.length} Jogos Cadastrados
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Catálogo completo com tempos, complexidade e regras de pontuação para as quintas-feiras.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Jogo
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map(game => (
          <div
            key={game.id}
            className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between relative group"
          >
            <div>
              {/* Top Icons & Actions */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-900 to-slate-800 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(game)}
                    className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-brand-300 transition-colors"
                    title="Editar Jogo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGame(game)}
                    className="p-2 rounded-xl bg-slate-900/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Excluir Jogo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="mb-3">
                <h3 className="font-display font-black text-lg text-white group-hover:text-brand-300 transition-colors">
                  {game.name}
                </h3>
                <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                  {game.category}
                </span>
              </div>

              {/* Description */}
              {game.description && (
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {game.description}
                </p>
              )}
            </div>

            {/* Badges and Details */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-brand-400" />
                  {game.minPlayers} - {game.maxPlayers} Jogadores
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ~{game.durationMinutes} min
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${getComplexityBadge(game.complexity)}`}>
                  {game.complexity}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {game.timesPlayed} {game.timesPlayed === 1 ? 'partida' : 'partidas'}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Game Modal */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <h3 className="font-display font-extrabold text-xl text-white mb-1">
              {editingGame ? 'Editar Jogo de Tabuleiro' : 'Novo Jogo de Tabuleiro'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Adicione os detalhes do jogo para a liga familiar
            </p>

            <form onSubmit={handleSaveGame} className="space-y-4">
              
              {/* Name & Emoji Icon */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nome do Jogo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Catan, Dixit, Ticket to Ride..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Ícone
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-xl focus:outline-none focus:border-brand-500 transition-colors"
                  >
                    {EMOJI_OPTIONS.map(em => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Categoria / Gênero
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Estratégia, Blefe, Cartas, Cooperativo..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Player Count & Duration */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Min. Jogadores
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={minPlayers}
                    onChange={(e) => setMinPlayers(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Máx. Jogadores
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Duração (min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Complexity & Scoring Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Complexidade
                  </label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value as GameComplexity)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="Fácil">Fácil (Iniciante)</option>
                    <option value="Médio">Médio (Familiar)</option>
                    <option value="Estratégico">Estratégico (Pesado)</option>
                    <option value="Festa">Festa (Party Game)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Modo de Vitória
                  </label>
                  <select
                    value={scoringType}
                    onChange={(e) => setScoringType(e.target.value as ScoringType)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="highest">Maior Pontuação Vence</option>
                    <option value="lowest">Menor Pontuação Vence</option>
                    <option value="elimination">Eliminação / Último Sobrevivente</option>
                    <option value="coop">Cooperativo</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Descrição / Objetivo
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo das regras e objetivo do jogo..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsGameModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
                >
                  {editingGame ? 'Salvar Jogo' : 'Adicionar Jogo'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
