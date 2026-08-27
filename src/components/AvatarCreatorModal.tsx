import React, { useState } from 'react';
import { X, Sparkles, Dices, Check, Glasses, Palette, RefreshCw } from 'lucide-react';
import { AvatarConfig, AvatarStyle } from '../types';
import { AVATAR_COLORS, AVATAR_STYLES, buildAvatarUrl, generateRandomAvatarConfig } from '../utils/avatarGenerator';
import { sounds } from '../utils/audio';

interface AvatarCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: AvatarConfig;
  playerName?: string;
  onSave: (config: AvatarConfig, avatarUrl: string) => void;
}

export const AvatarCreatorModal: React.FC<AvatarCreatorModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  playerName = 'Jogador',
  onSave
}) => {
  const [config, setConfig] = useState<AvatarConfig>(
    initialConfig || generateRandomAvatarConfig(playerName)
  );

  if (!isOpen) return null;

  const currentAvatarUrl = buildAvatarUrl(config);

  const handleRandomize = () => {
    sounds.playDiceRoll();
    const rand = generateRandomAvatarConfig();
    setConfig(rand);
  };

  const handleSave = () => {
    sounds.playSuccess();
    onSave(config, currentAvatarUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-brand-500/30">
            ✨
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
              Criador de Avatar 3D
            </h3>
            <p className="text-xs text-slate-400">
              Personalize o visual e estilo para {playerName}
            </p>
          </div>
        </div>

        {/* Avatar Live Preview Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 mb-6 relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div 
            className="absolute inset-0 opacity-20 blur-2xl transition-all duration-500"
            style={{ backgroundColor: config.backgroundColor ? `#${config.backgroundColor}` : '#8b5cf6' }}
          />

          {/* 3D Framed Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-2 bg-gradient-to-tr from-brand-500 via-indigo-400 to-pink-400 shadow-2xl shadow-brand-500/30 animate-pulse-glow">
              <img
                src={currentAvatarUrl}
                alt="Avatar Preview"
                className="w-full h-full rounded-2xl bg-slate-900 object-cover"
              />
            </div>
            <button
              onClick={handleRandomize}
              title="Gerar Aleatório"
              className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/40 hover:scale-110 active:scale-95 transition-all"
            >
              <Dices className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Estilo: {AVATAR_STYLES.find(s => s.id === config.style)?.label}
            </span>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="space-y-5">
          
          {/* Style Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Escolha o Estilo do Avatar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVATAR_STYLES.map(style => {
                const isSelected = config.style === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setConfig({ ...config, style: style.id });
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">{style.emoji}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">{style.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seed / Expression Identifier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Semente / Expressão
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sortear
              </button>
            </div>
            <input
              type="text"
              value={config.seed}
              onChange={(e) => setConfig({ ...config, seed: e.target.value })}
              placeholder="Digite um nome para mudar traços..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Background Color Palette */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Cor de Fundo
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_COLORS.map(color => {
                const hexCode = color.replace('#', '');
                const isSelected = config.backgroundColor === hexCode;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setConfig({ ...config, backgroundColor: hexCode });
                    }}
                    style={{ backgroundColor: color }}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isSelected
                        ? 'scale-110 ring-2 ring-white shadow-lg'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extra Options (e.g. Glasses) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setConfig({ ...config, glasses: !config.glasses });
              }}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl border transition-all ${
                config.glasses
                  ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Glasses className="w-5 h-5" />
                <span className="text-sm font-semibold">Usar Óculos de Jogador</span>
              </div>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                config.glasses ? 'bg-brand-500 border-brand-400 text-white' : 'border-slate-600'
              }`}>
                {config.glasses && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4" />
            Salvar Avatar
          </button>
        </div>

      </div>
    </div>
  );
};
