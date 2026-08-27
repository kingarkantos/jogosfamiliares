import React from 'react';
import {
  Trophy,
  Crown,
  Calendar,
  Sparkles,
  Flame,
  Gamepad2,
  Users,
  Clock,
  Swords,
  PlusCircle,
  TrendingUp,
  ArrowUpRight,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PodiumCard } from './PodiumCard';
import { AvatarImage } from './AvatarImage';
import { formatDatePt, formatDateWithWeekday, getCountdownToNextThursday, getMonthKey, getMonthLabel, getWeekKey } from '../utils/dateHelpers';

interface DashboardProps {
  onOpenRecordModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenRecordModal }) => {
  const {
    players,
    games,
    matches,
    settings,
    setActiveTab,
    getLeaderboard,
    getWeeklyChampion,
    getMonthlyChampion
  } = useApp();

  const countdown = getCountdownToNextThursday();
  const overallLeaderboard = getLeaderboard('all');
  const weeklyChamp = getWeeklyChampion();
  const monthlyChamp = getMonthlyChampion();

  // Find most played game
  const sortedGames = [...games].sort((a, b) => (b.timesPlayed || 0) - (a.timesPlayed || 0));
  const mostPlayedGame = sortedGames[0];

  // Total points distributed
  const totalLeaguePoints = matches.reduce(
    (acc, m) => acc + (m.results || []).reduce((sub, r) => sub + (r.leaguePointsEarned || 0), 0),
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Welcome & Weekly Countdown Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {settings.leagueName}
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Toda Quinta é Dia de <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Glória no Tabuleiro! 🎲
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 font-normal leading-relaxed">
              Bem-vindo ao quartel-general da nossa Copa Familiar. Lance partidas, dispute troféus semanais e descubra quem é o Grande Mestre do mês!
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={onOpenRecordModal}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Registrar Partida de Quinta
              </button>

              <button
                onClick={() => setActiveTab('counter')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-sm hover:scale-[1.02] transition-all"
              >
                <Calculator className="w-4 h-4 text-brand-400" />
                Abrir Placar ao Vivo
              </button>
            </div>
          </div>

          {/* Countdown Pill Card */}
          <div className="w-full lg:w-auto p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Calendar className="w-4 h-4" />
              Próxima Noite de Jogos
            </div>
            
            {countdown.isToday ? (
              <div className="py-2 text-center">
                <span className="text-3xl font-black text-amber-300 animate-pulse block">
                  🎉 É HOJE!
                </span>
                <span className="text-xs text-slate-400 mt-1 block">Preparem os tabuleiros e cartas!</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 my-2">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 min-w-[64px]">
                  <span className="font-mono font-black text-2xl text-white block">{countdown.days}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Dias</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 min-w-[64px]">
                  <span className="font-mono font-black text-2xl text-white block">{countdown.hours}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Horas</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 min-w-[64px]">
                  <span className="font-mono font-black text-2xl text-white block">{countdown.minutes}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Min</span>
                </div>
              </div>
            )}

            <span className="text-[11px] text-slate-400 font-medium mt-1">
              Todas as quintas-feiras às 19:30
            </span>
          </div>
        </div>
      </div>

      {/* Highlights: Campeão da Semana & Campeão do Mês */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Campeão da Semana */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/30">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              Campeão da Semana
            </div>
            <button
              onClick={() => setActiveTab('rankings')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              Ver Tabela <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {weeklyChamp ? (
            <div className="flex items-center gap-5 pt-2">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 to-yellow-600 shadow-xl glow-gold">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                    <AvatarImage
                      src={weeklyChamp.player.avatarUrl}
                      alt={weeklyChamp.player.name}
                      fallbackText={weeklyChamp.player.name}
                      themeColor={weeklyChamp.player.themeColor}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-400 text-slate-950 shadow-md">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {weeklyChamp.player.name}
                </h3>
                <p className="text-xs font-bold text-amber-400">
                  "{weeklyChamp.player.nickname}"
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                    {weeklyChamp.totalPoints} Pontos
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {weeklyChamp.wins} {weeklyChamp.wins === 1 ? 'Vitória' : 'Vitórias'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhuma partida registrada nesta semana.</p>
          )}
        </div>

        {/* Card: Campeão do Mês */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-purple-500/30">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              Líder do Mês de {getMonthLabel(getMonthKey(new Date().toISOString()))}
            </div>
            <button
              onClick={() => setActiveTab('rankings')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              Ver Tabela <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {monthlyChamp ? (
            <div className="flex items-center gap-5 pt-2">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1.5 bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-xl glow-purple">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                    <AvatarImage
                      src={monthlyChamp.player.avatarUrl}
                      alt={monthlyChamp.player.name}
                      fallbackText={monthlyChamp.player.name}
                      themeColor={monthlyChamp.player.themeColor}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-purple-500 text-white shadow-md">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  {monthlyChamp.player.name}
                </h3>
                <p className="text-xs font-bold text-purple-300">
                  "{monthlyChamp.player.nickname}"
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-black text-xs border border-purple-500/30">
                    {monthlyChamp.totalPoints} Pontos Acumulados
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {monthlyChamp.matchesPlayed} partidas
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhuma partida registrada neste mês.</p>
          )}
        </div>

      </div>

      {/* 3D Podium for Season Standing */}
      <PodiumCard
        entries={overallLeaderboard}
        title="Pódio da Copa Geral da Temporada"
        subtitle="Classificação acumulada com todos os pontos da família"
      />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-300 flex items-center justify-center text-lg">
              🎲
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total de Partidas</span>
              <span className="text-2xl font-black text-white font-display">{matches.length}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Registradas nas quintas</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
              🔥
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mais Disputado</span>
              <span className="text-base font-black text-white truncate max-w-[130px] block font-display">
                {mostPlayedGame?.name || 'N/A'}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            {mostPlayedGame?.timesPlayed || 0} vezes na mesa
          </span>
        </div>

        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-lg">
              👥
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Jogadores Ativos</span>
              <span className="text-2xl font-black text-white font-display">{players.length}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Avatares 3D cadastrados</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-lg">
              ✨
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pontos na Copa</span>
              <span className="text-2xl font-black text-amber-300 font-display">{totalLeaguePoints}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">Pontos distribuídos</span>
        </div>

      </div>

      {/* Recent Matches Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-brand-400" />
            <h3 className="font-display font-black text-xl text-white">Últimas Partidas Disputadas</h3>
          </div>
          <button
            onClick={onOpenRecordModal}
            className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
          >
            + Registrar Nova
          </button>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.slice(0, 5).map(match => {
              const game = games.find(g => g.id === match.gameId);
              const winnerResult = (match.results || []).find(r => r.rank === 1);
              const winner = players.find(p => p.id === winnerResult?.playerId);

              return (
                <div
                  key={match.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {game?.icon || '🎲'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                        <span>{game?.name || 'Jogo de Tabuleiro'}</span>
                        {match.isWeeklyCupMatch && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                            Copa
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {formatDateWithWeekday(match.date)} • {match.location || 'Mesa da Sala'}
                      </span>
                    </div>
                  </div>

                  {/* Results preview */}
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    {winner && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-slate-400 text-[11px]">1º:</span>
                        <strong className="text-amber-300 font-bold">{winner.name}</strong>
                      </div>
                    )}

                    <div className="flex -space-x-2 overflow-hidden">
                      {(match.results || []).map(res => {
                        const p = players.find(player => player.id === res.playerId);
                        if (!p) return null;
                        return (
                          <div
                            key={p.id}
                            title={`${p.name} (${res.rank}º lugar - ${res.leaguePointsEarned} pts)`}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 overflow-hidden bg-slate-800"
                          >
                            <AvatarImage
                              src={p.avatarUrl}
                              alt={p.name}
                              fallbackText={p.name}
                              themeColor={p.themeColor}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">Nenhuma partida registrada ainda.</p>
        )}
      </div>

    </div>
  );
};
