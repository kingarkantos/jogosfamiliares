import React, { useRef } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  ShieldAlert,
  Sparkles,
  Check,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportBackupJson, importBackupJson } from '../utils/storage';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSettings,
    resetAllData,
    reloadFromStorage,
    isCloudConnected,
    isCloudSyncing,
    syncWithCloud
  } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    sounds.playSuccess();
    exportBackupJson();
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importBackupJson(file);
      reloadFromStorage();
      sounds.playSuccess();
      alert('Backup restaurado com sucesso!');
      onClose();
    } catch (err) {
      alert('Falha ao restaurar o backup. Verifique se o arquivo JSON é válido.');
    }
  };

  const handleReset = () => {
    if (window.confirm('ATENÇÃO: Deseja redefinir os dados para os valores padrão de exemplo da família? Todos os dados customizados serão reiniciados.')) {
      resetAllData();
      alert('Dados redefinidos com sucesso!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 relative border border-white/10 shadow-2xl overflow-y-auto max-h-[92vh]">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20">
            ⚙️
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">
              Configurações Gerais & Backup
            </h3>
            <p className="text-xs text-slate-400">
              Personalize o sistema de pontuação da liga e salve seus dados localmente.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* League Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Nome da Copa / Liga Familiar
            </label>
            <input
              type="text"
              value={settings.leagueName}
              onChange={(e) => updateSettings({ leagueName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Point Distribution Rules */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white">Pontuação Oficial da Copa (Por Posição)</h4>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-amber-300 mb-1">1º Lugar</label>
                <input
                  type="number"
                  value={settings.pointRules.first}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, first: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">2º Lugar</label>
                <input
                  type="number"
                  value={settings.pointRules.second}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, second: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-amber-600 mb-1">3º Lugar</label>
                <input
                  type="number"
                  value={settings.pointRules.third}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, third: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">4º Lugar</label>
                <input
                  type="number"
                  value={settings.pointRules.fourth}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, fourth: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">5º Lugar +</label>
                <input
                  type="number"
                  value={settings.pointRules.fifthPlus}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, fifthPlus: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Participação</label>
                <input
                  type="number"
                  value={settings.pointRules.participation}
                  onChange={(e) => updateSettings({
                    pointRules: { ...settings.pointRules, participation: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-center font-bold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-brand-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <h5 className="font-bold text-sm text-white">Efeitos Sonoros do Jogo</h5>
                <p className="text-xs text-slate-400">Sons de dados, ampulheta e fanfarras de vitória</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded-lg accent-brand-500 cursor-pointer"
            />
          </div>

          {/* Cloud Database (Supabase) Integration */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-brand-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-brand-400" />
                <h4 className="font-bold text-sm text-white">Banco de Dados em Nuvem (Supabase)</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isCloudConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {isCloudConnected ? 'Conectado (game_family)' : 'Configurado'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Projeto conectado: <strong className="text-brand-300">fmpzzvznjgxxtbolqyds.supabase.co</strong> com tabelas com prefixo <strong className="text-amber-300">game_family_</strong>.
            </p>
            <button
              type="button"
              onClick={() => syncWithCloud()}
              disabled={isCloudSyncing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white border border-brand-500/40 text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              {isCloudSyncing ? 'Sincronizando com a Nuvem...' : 'Sincronizar com Supabase Agora'}
            </button>
          </div>

          {/* Local Data Backup & Restore */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <h4 className="font-bold text-sm text-white">Segurança & Backup dos Dados da Família</h4>
            <p className="text-xs text-slate-400">
              Todos os dados ficam salvos localmente neste navegador. Faça downloads periódicos para nunca perder nada!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Export */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand-600/30 hover:bg-brand-600 text-brand-200 hover:text-white border border-brand-500/40 text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                Exportar Backup (.JSON)
              </button>

              {/* Import */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 transition-all"
              >
                <Upload className="w-4 h-4" />
                Restaurar Arquivo JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </div>
          </div>

          {/* Reset to Default */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar Dados Padrão de Exemplo
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            Pronto
          </button>
        </div>

      </div>
    </div>
  );
};
