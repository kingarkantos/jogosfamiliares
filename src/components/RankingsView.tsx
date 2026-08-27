import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PodiumCard } from './PodiumCard';
import { AvatarImage } from './AvatarImage';
import { formatDatePt, getMonthKey, getMonthLabel, getWeekKey } from '../utils/dateHelpers';

export const RankingsView: React.FC = () => {
  const { matches, players, getLeaderboard } = useApp();

  const [scope, setScope] = useState<'week' | 'month' | 'all'>('month');

  // Extract unique weeks & months from existing matches
  const availableWeeks = Array.from(new Set(matches.map(m => getWeekKey(m.date))));
  const availableMonths = Array.from(new Set(matches.map(m => getMonthKey(m.date))));

  const currentWeekKey = availableWeeks[0] || getWeekKey(new Date().toISOString());
  const currentMonthKey = availableMonths[0] || getMonthKey(new Date().toISOString());

  const [selectedWeek, setSelectedWeek] = useState<string>(currentWeekKey);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const filterKey = scope === 'week' ? selectedWeek : scope === 'month' ? selectedMonth : undefined;
  const leaderboard = getLeaderboard(scope, filterKey);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header & Scope Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            <span>Tabela de Classificação & Troféus</span>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              🏆 Copa Familiar
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Acompanhe o campeão da semana, o líder do mês e o ranking geral acumulado da temporada.
          </p>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg">
          <button
            onClick={() => setScope('week')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              scope === 'week'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Semanal (Quintas)
          </button>

          <button
            onClick={() => setScope('month')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              scope === 'month'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            Campeão do Mês
          </button>

          <button
            onClick={() => setScope('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              scope === 'all'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Geral / Temporada
          </button>
        </div>
      </div>

      {/* Sub-Filters: Select specific week or month if applicable */}
      {scope === 'week' && availableWeeks.length > 1 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtrar Quinta-feira:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
          >
            {availableWeeks.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      )}

      {scope === 'month' && availableMonths.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtrar Mês da Temporada:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{getMonthLabel(m)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Top 3 3D Podium for current selection */}
      <PodiumCard
        entries={leaderboard}
        title={
          scope === 'week'
            ? `Pódio da Semana (${selectedWeek})`
            : scope === 'month'
            ? `Pódio do Mês de ${getMonthLabel(selectedMonth)}`
            : 'Pódio Geral da Temporada'
        }
        subtitle="Os 3 maiores pontuadores com maior aproveitamento"
      />

      {/* Full Leaderboard Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-black text-lg sm:text-xl text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            Classificação Completa da Tabela
          </h3>
          <span className="text-xs text-slate-400">
            {leaderboard.length} competidores
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Posição</th>
                <th className="py-3 px-4">Jogador</th>
                <th className="py-3 px-4 text-center">Partidas</th>
                <th className="py-3 px-4 text-center">Vitórias</th>
                <th className="py-3 px-4 text-center">Pódios</th>
                <th className="py-3 px-4 text-center">Média/Partida</th>
                <th className="py-3 px-4 text-right">Pontos Totais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((entry) => {
                const isGold = entry.rank === 1 && entry.totalPoints > 0;
                const isSilver = entry.rank === 2 && entry.totalPoints > 0;
                const isBronze = entry.rank === 3 && entry.totalPoints > 0;

                return (
                  <tr
                    key={entry.player.id}
                    className={`hover:bg-slate-900/50 transition-colors ${
                      isGold ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4 font-black">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                            isGold
                              ? 'bg-amber-500 text-slate-950 shadow-md glow-gold'
                              : isSilver
                              ? 'bg-slate-300 text-slate-900'
                              : isBronze
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {entry.rank}º
                        </div>
                        {isGold && <Crown className="w-4 h-4 text-amber-400 animate-bounce-subtle" />}
                      </div>
                    </td>

                    {/* Player Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-900 shadow-sm shrink-0">
                          <AvatarImage
                            src={entry.player.avatarUrl}
                            alt={entry.player.name}
                            fallbackText={entry.player.name}
                            themeColor={entry.player.themeColor}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{entry.player.name}</p>
                          <p className="text-xs text-amber-400 font-semibold">{entry.player.nickname}</p>
                        </div>
                      </div>
                    </td>

                    {/* Matches */}
                    <td className="py-4 px-4 text-center font-semibold text-slate-400">
                      {entry.matchesPlayed}
                    </td>

                    {/* Wins */}
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        {entry.wins}
                      </span>
                    </td>

                    {/* Podiums */}
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold">
                        {entry.podiums}
                      </span>
                    </td>

                    {/* Average */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-300">
                      {entry.averageScore}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-4 text-right">
                      <span className="text-lg font-black text-amber-300 font-display">
                        {entry.totalPoints}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">pts</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
