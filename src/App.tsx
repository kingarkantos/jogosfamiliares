import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RankingsView } from './components/RankingsView';
import { PlayersManager } from './components/PlayersManager';
import { GamesManager } from './components/GamesManager';
import { TournamentBracket } from './components/TournamentBracket';
import { LiveGameCounter } from './components/LiveGameCounter';
import { GameTools } from './components/GameTools';
import { MatchRecorderModal } from './components/MatchRecorderModal';
import { SettingsModal } from './components/SettingsModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Prefilled match recorder state from live counter
  const [prefilledGameId, setPrefilledGameId] = useState<string | undefined>(undefined);
  const [prefilledScores, setPrefilledScores] = useState<{ playerId: string; score: number }[] | undefined>(undefined);

  const handleOpenRecordModal = () => {
    setPrefilledGameId(undefined);
    setPrefilledScores(undefined);
    setIsRecordModalOpen(true);
  };

  const handleFinishLiveMatch = (gameId: string, playerScores: { playerId: string; score: number }[]) => {
    setPrefilledGameId(gameId);
    setPrefilledScores(playerScores);
    setIsRecordModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          onOpenRecordModal={handleOpenRecordModal}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        />

        {/* Main Content View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard onOpenRecordModal={handleOpenRecordModal} />
          )}

          {activeTab === 'rankings' && (
            <RankingsView />
          )}

          {activeTab === 'players' && (
            <PlayersManager />
          )}

          {activeTab === 'games' && (
            <GamesManager />
          )}

          {activeTab === 'tournament' && (
            <TournamentBracket />
          )}

          {/* Always mounted so scores & timer persist across tab changes */}
          <div className={activeTab === 'counter' ? '' : 'hidden'}>
            <LiveGameCounter onFinishMatch={handleFinishLiveMatch} />
          </div>

          {activeTab === 'tools' && (
            <GameTools />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 backdrop-blur-md bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🎲</span>
            <span>Copa de Jogos Familiares • Noites de Quinta-feira</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Dados Salvos Localmente no Navegador
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MatchRecorderModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        initialGameId={prefilledGameId}
        initialPlayerScores={prefilledScores}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
