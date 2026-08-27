import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../context/AppContext';
import { AvatarImage } from './AvatarImage';

interface PodiumCardProps {
  entries: LeaderboardEntry[];
  title?: string;
  subtitle?: string;
}

export const PodiumCard: React.FC<PodiumCardProps> = ({
  entries,
  title = 'Pódio dos Campeões',
  subtitle = 'Os 3 melhores jogadores do momento'
}) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-slate-400">
        <Trophy className="w-12 h-12 mx-auto text-slate-600 mb-2" />
        <p className="font-semibold">Nenhum jogador pontuou ainda neste período.</p>
        <p className="text-xs text-slate-500 mt-1">Jogue uma partida para inaugurar o pódio!</p>
      </div>
    );
  }

  const first = entries[0];
  const second = entries.length > 1 ? entries[1] : null;
  const third = entries.length > 2 ? entries[2] : null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Crown className="w-3.5 h-3.5" />
          {title}
        </div>
        <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p>
      </div>

      {/* 3D Visual Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">
        
        {/* 2nd Place (Silver) */}
        {second ? (
          <div className="flex flex-col items-center group">
            {/* Avatar & Medal */}
            <div className="relative mb-3 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-500 shadow-lg shadow-slate-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                  <AvatarImage
                    src={second.player.avatarUrl}
                    alt={second.player.name}
                    fallbackText={second.player.name}
                    themeColor={second.player.themeColor}
                  />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-200 text-slate-900 flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                2º
              </div>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-200 truncate max-w-[90px] sm:max-w-[140px]">
                {second.player.name}
              </h4>
              <span className="text-[11px] text-brand-300 font-semibold">
                {second.totalPoints} pts
              </span>
            </div>

            {/* Podium Stand */}
            <div className="w-full h-24 sm:h-32 rounded-t-2xl bg-gradient-to-b from-slate-700/80 to-slate-800/90 border-t-2 border-x border-slate-400/40 flex flex-col items-center justify-center shadow-lg">
              <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 mb-1" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-300">2º Lugar</span>
              <span className="text-[10px] text-slate-400">{second.wins} vitórias</span>
            </div>
          </div>
        ) : (
          <div className="h-24 sm:h-32 opacity-20 bg-slate-800 rounded-t-2xl" />
        )}

        {/* 1st Place (Gold Champion) */}
        {first && (
          <div className="flex flex-col items-center group -mt-6">
            {/* Crown & Avatar */}
            <div className="relative mb-3 flex flex-col items-center">
              <Crown className="w-8 h-8 text-amber-400 animate-bounce-subtle drop-shadow-md" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1.5 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 shadow-xl shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[18px] overflow-hidden bg-slate-900">
                  <AvatarImage
                    src={first.player.avatarUrl}
                    alt={first.player.name}
                    fallbackText={first.player.name}
                    themeColor={first.player.themeColor}
                  />
                </div>
              </div>
              <div className="absolute bottom-0 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg border-2 border-slate-900">
                1º
              </div>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-300 truncate max-w-[110px] sm:max-w-[160px]">
                {first.player.name}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40">
                {first.totalPoints} pts
              </span>
            </div>

            {/* Podium Stand */}
            <div className="w-full h-36 sm:h-44 rounded-t-2xl bg-gradient-to-b from-amber-500/30 via-slate-800 to-slate-900 border-t-2 border-x border-amber-400/70 flex flex-col items-center justify-center shadow-xl glow-gold">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mb-1 drop-shadow-lg animate-pulse" />
              <span className="text-sm sm:text-base font-black text-amber-300">CAMPEÃO</span>
              <span className="text-[11px] text-amber-200/80">{first.wins} vitórias</span>
            </div>
          </div>
        )}

        {/* 3rd Place (Bronze) */}
        {third ? (
          <div className="flex flex-col items-center group">
            {/* Avatar & Medal */}
            <div className="relative mb-3 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-b from-amber-600 via-orange-500 to-amber-900 shadow-lg shadow-orange-700/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                  <AvatarImage
                    src={third.player.avatarUrl}
                    alt={third.player.name}
                    fallbackText={third.player.name}
                    themeColor={third.player.themeColor}
                  />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                3º
              </div>
            </div>

            <div className="text-center mb-2">
              <h4 className="font-bold text-xs sm:text-sm text-slate-200 truncate max-w-[90px] sm:max-w-[140px]">
                {third.player.name}
              </h4>
              <span className="text-[11px] text-brand-300 font-semibold">
                {third.totalPoints} pts
              </span>
            </div>

            {/* Podium Stand */}
            <div className="w-full h-20 sm:h-28 rounded-t-2xl bg-gradient-to-b from-orange-950/80 to-slate-800/90 border-t-2 border-x border-orange-600/40 flex flex-col items-center justify-center shadow-lg">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-1" />
              <span className="text-xs sm:text-sm font-extrabold text-amber-500">3º Lugar</span>
              <span className="text-[10px] text-slate-400">{third.wins} vitórias</span>
            </div>
          </div>
        ) : (
          <div className="h-20 sm:h-28 opacity-20 bg-slate-800 rounded-t-2xl" />
        )}

      </div>
    </div>
  );
};
