import React, { useState } from 'react';
import {
  UserPlus,
  Edit2,
  Trash2,
  Sparkles,
  Trophy,
  Flame,
  Gamepad2,
  Quote,
  Medal,
  Award,
  Crown
} from 'lucide-react';
import { Player, AvatarConfig } from '../types';
import { useApp } from '../context/AppContext';
import { AvatarCreatorModal } from './AvatarCreatorModal';
import { AvatarImage } from './AvatarImage';
import { generateRandomAvatarConfig, buildAvatarUrl } from '../utils/avatarGenerator';

export const PlayersManager: React.FC = () => {
  const { players, games, addPlayer, updatePlayer, deletePlayer, getPlayerStats } = useApp();
  
  // State for Add / Edit Player modal
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phrase, setPhrase] = useState('');
  const [themeColor, setThemeColor] = useState('#8b5cf6');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(generateRandomAvatarConfig());

  // State for 3D Avatar Customizer Modal
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);

  const openAddModal = () => {
    setEditingPlayer(null);
    setName('');
    setNickname('');
    setPhrase('');
    setThemeColor('#8b5cf6');
    const newCfg = generateRandomAvatarConfig('NovoJogador');
    setAvatarConfig(newCfg);
    setIsPlayerModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setName(player.name);
    setNickname(player.nickname);
    setPhrase(player.phrase);
    setThemeColor(player.themeColor || '#8b5cf6');
    setAvatarConfig(player.avatarConfig || generateRandomAvatarConfig(player.name));
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const avatarUrl = buildAvatarUrl(avatarConfig);

    if (editingPlayer) {
      updatePlayer({
        ...editingPlayer,
        name: name.trim(),
        nickname: nickname.trim() || name.trim(),
        phrase: phrase.trim(),
        themeColor,
        avatarConfig,
        avatarUrl
      });
    } else {
      addPlayer({
        name: name.trim(),
        nickname: nickname.trim() || name.trim(),
        phrase: phrase.trim(),
        themeColor,
        avatarConfig,
        avatarUrl
      });
    }

    setIsPlayerModalOpen(false);
  };

  const handleDeletePlayer = (player: Player) => {
    if (window.confirm(`Tem certeza que deseja remover ${player.name}?`)) {
      deletePlayer(player.id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            <span>Jogadores da Família</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {players.length} Atletas de Tabuleiro
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie os competidores das quintas-feiras, personalize avatares 3D e acompanhe conquistas.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Cadastrar Jogador
        </button>
      </div>

      {/* Players Cards Grid */}
      {players.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map(player => {
            const stats = getPlayerStats(player.id);
            const favoriteGame = games.find(g => g.id === stats.favoriteGameId);
            const winRate = stats.totalMatches > 0 ? Math.round((stats.wins / stats.totalMatches) * 100) : 0;

            return (
              <div
                key={player.id}
                className="glass-panel glass-panel-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between group"
                style={{
                  borderColor: player.themeColor ? `${player.themeColor}33` : 'rgba(255,255,255,0.08)'
                }}
              >
                {/* Background Glow based on Player Theme */}
                <div
                  className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-35"
                  style={{ backgroundColor: player.themeColor || '#8b5cf6' }}
                />

                {/* Card Header: Avatar & Main Info */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    
                    {/* 3D Avatar */}
                    <div className="relative">
                      <div
                        className="w-20 h-20 rounded-3xl p-1.5 shadow-xl transition-transform group-hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${player.themeColor || '#8b5cf6'}, #312e81)`
                        }}
                      >
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                          <AvatarImage
                            src={player.avatarUrl}
                            alt={player.name}
                            fallbackText={player.name}
                            themeColor={player.themeColor}
                          />
                        </div>
                      </div>
                      {stats.currentStreak >= 2 && (
                        <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md">
                          <Flame className="w-3 h-3 text-red-700 fill-red-700 animate-bounce-subtle" />
                          {stats.currentStreak}x
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(player)}
                        className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Editar Jogador"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player)}
                        className="p-2 rounded-xl bg-slate-900/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remover Jogador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Nickname */}
                  <div>
                    <h3 className="font-display font-black text-xl text-white">
                      {player.name}
                    </h3>
                    <p className="text-xs font-bold text-brand-300">
                      "{player.nickname}"
                    </p>
                  </div>

                  {/* Catchphrase */}
                  {player.phrase && (
                    <p className="text-xs italic text-slate-400 mt-2 flex items-start gap-1">
                      <Quote className="w-3 h-3 text-brand-400 shrink-0 mt-0.5" />
                      <span>{player.phrase}</span>
                    </p>
                  )}
                </div>

                {/* Player Mini Stats */}
                <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-2xl bg-slate-900/80 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pontos</span>
                      <span className="text-sm font-black text-amber-300">{stats.totalScore}</span>
                    </div>
                    <div className="p-2 rounded-2xl bg-slate-900/80 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Vitórias</span>
                      <span className="text-sm font-black text-white">{stats.wins}</span>
                    </div>
                    <div className="p-2 rounded-2xl bg-slate-900/80 border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Partidas</span>
                      <span className="text-sm font-black text-slate-300">{stats.totalMatches}</span>
                    </div>
                  </div>

                  {/* Achievements badges */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      {stats.weeklyTitles > 0 && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold flex items-center gap-1" title="Títulos da Semana">
                          <Trophy className="w-3 h-3" /> {stats.weeklyTitles} Semanas
                        </span>
                      )}
                      {stats.monthlyTitles > 0 && (
                        <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-bold flex items-center gap-1" title="Títulos do Mês">
                          <Crown className="w-3 h-3" /> {stats.monthlyTitles} Meses
                        </span>
                      )}
                    </div>
                    {favoriteGame && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[130px]" title={`Jogo Favorito: ${favoriteGame.name}`}>
                        <span>{favoriteGame.icon}</span>
                        <span className="truncate">{favoriteGame.name}</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/20 text-brand-300 flex items-center justify-center text-3xl mx-auto shadow-inner">
            👥
          </div>
          <h3 className="font-display font-black text-xl text-white">Nenhum jogador cadastrado ainda</h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Comece cadastrando os membros da família com seus avatares personalizados para iniciar a liga!
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Primeiro Jogador
          </button>
        </div>
      )}

      {/* Add / Edit Player Modal */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <h3 className="font-display font-extrabold text-xl text-white mb-1">
              {editingPlayer ? 'Editar Jogador' : 'Novo Membro da Copa'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Preencha os dados e crie um avatar 3D exclusivo
            </p>

            <form onSubmit={handleSavePlayer} className="space-y-4">
              
              {/* Avatar Selector Preview Button */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
                <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-brand-600 to-pink-500 shadow-md">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                    <AvatarImage
                      src={buildAvatarUrl(avatarConfig)}
                      alt="Avatar"
                      fallbackText={name}
                      themeColor={themeColor}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white">Avatar 3D do Jogador</h4>
                  <p className="text-xs text-slate-400">Escolha estilos, expressões e óculos</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarCreatorOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white border border-brand-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Personalizar
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nome do Jogador *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lucas (Pai)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Apelido de Batalha / Título
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ex: O Estrategista, Rainha do Catan..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Phrase */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Frase de Efeito
                </label>
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="Ex: Tudo faz parte de um plano maior!"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Cor Temática do Jogador
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs text-slate-400 font-mono">{themeColor}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPlayerModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
                >
                  {editingPlayer ? 'Salvar Alterações' : 'Adicionar Jogador'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Avatar Creator Submodal */}
      <AvatarCreatorModal
        isOpen={isAvatarCreatorOpen}
        onClose={() => setIsAvatarCreatorOpen(false)}
        initialConfig={avatarConfig}
        playerName={name || 'Jogador'}
        onSave={(newCfg) => setAvatarConfig(newCfg)}
      />

    </div>
  );
};
