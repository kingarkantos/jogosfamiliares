import React from 'react';
import {
  Trophy,
  Users,
  Dices,
  Swords,
  PlusCircle,
  Settings,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Layers,
  Calculator,
  Cloud
} from 'lucide-react';
import { NavTab, useApp } from '../context/AppContext';
import { getCountdownToNextThursday } from '../utils/dateHelpers';

interface NavbarProps {
  onOpenRecordModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRecordModal, onOpenSettingsModal }) => {
  const { activeTab, setActiveTab, settings, updateSettings, isCloudConnected, isCloudSyncing, syncWithCloud } = useApp();
  const countdown = getCountdownToNextThursday();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Início', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'rankings', label: 'Rankings & Pódio', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tournament', label: 'Mata-Mata', icon: <Swords className="w-4 h-4" /> },
    { id: 'counter', label: 'Contador ao Vivo', icon: <Calculator className="w-4 h-4" /> },
    { id: 'tools', label: 'Ferramentas de Mesa', icon: <Clock className="w-4 h-4" /> },
    { id: 'players', label: 'Jogadores 3D', icon: <Users className="w-4 h-4" /> },
    { id: 'games', label: 'Catálogo de Jogos', icon: <Dices className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-amber-400 p-[2px] shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                🎲
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Copa de Jogos
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full">
                  Familiares
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Quintas-feiras de Tabuleiro 🏆
              </p>
            </div>
          </div>

          {/* Countdown Pill to Next Thursday */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-950/60 border border-brand-500/30 text-xs font-semibold text-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            {countdown.isToday ? (
              <span className="text-amber-400 font-bold animate-pulse">
                🎉 Hoje é Quinta de Jogos!
              </span>
            ) : (
              <span>
                Próxima Quinta em <strong className="text-amber-300">{countdown.days}d {countdown.hours}h {countdown.minutes}m</strong>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Record Match CTA */}
            <button
              onClick={onOpenRecordModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Lançar Partida</span>
              <span className="sm:hidden">Partida</span>
            </button>

            {/* Cloud Sync Status Indicator */}
            <button
              onClick={() => syncWithCloud()}
              disabled={isCloudSyncing}
              title={isCloudConnected ? 'Conectado ao Supabase (Sincronizar)' : 'Conectando ao Supabase...'}
              className={`p-2.5 rounded-2xl border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Cloud className={`w-5 h-5 ${isCloudSyncing ? 'animate-spin text-brand-400' : ''}`} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              title={settings.soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-brand-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              title="Configurações e Backup"
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Horizontal Scrollable for Mobile) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-white/5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
