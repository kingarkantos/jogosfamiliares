import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Dices,
  Users,
  Volume2,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';
import { AvatarImage } from './AvatarImage';

export const GameTools: React.FC = () => {
  const { players, triggerConfetti } = useApp();

  // TIMER STATE
  const [timerDuration, setTimerDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            sounds.playTimerBeep(true);
            return 0;
          }
          if (prev <= 6) {
            sounds.playTimerBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleStartPauseTimer = () => {
    sounds.playClick();
    if (timeLeft === 0) {
      setTimeLeft(timerDuration);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (newDuration?: number) => {
    sounds.playClick();
    const dur = newDuration ?? timerDuration;
    if (newDuration) setTimerDuration(newDuration);
    setIsTimerRunning(false);
    setTimeLeft(dur);
  };

  // DICE ROLLER STATE
  const [diceType, setDiceType] = useState<6 | 10 | 12 | 20 | 100>(6);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (type: 6 | 10 | 12 | 20 | 100) => {
    setDiceType(type);
    setIsRolling(true);
    sounds.playDiceRoll();

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * type) + 1);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(interval);
        const finalResult = Math.floor(Math.random() * type) + 1;
        setDiceResult(finalResult);
        setIsRolling(false);
      }
    }, 60);
  };

  // FIRST PLAYER SPINNER / DECIDER STATE
  const [selectedFirstPlayerId, setSelectedFirstPlayerId] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const pickFirstPlayer = () => {
    if (players.length === 0) return;
    setIsSpinning(true);
    sounds.playDiceRoll();

    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * players.length);
      setSelectedFirstPlayerId(players[randomIdx].id);
      count++;
      if (count > 15) {
        clearInterval(interval);
        const finalWinner = players[Math.floor(Math.random() * players.length)];
        setSelectedFirstPlayerId(finalWinner.id);
        setIsSpinning(false);
        triggerConfetti();
      }
    }, 80);
  };

  const chosenPlayer = players.find(p => p.id === selectedFirstPlayerId);

  // Timer Progress Calculation
  const progressPercent = ((timerDuration - timeLeft) / timerDuration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
          <span>Ferramentas de Mesa da Noite de Jogos</span>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
            🎲 Utilitários de Partida
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Ampulheta inteligente, rolador de dados poliédricos e sorteador de primeiro jogador.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tool 1: Temporizador de Turno / Ampulheta */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
                ⏱️
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Temporizador de Turno</h3>
                <p className="text-xs text-slate-400">Ampulheta digital para ninguém travar a jogada</p>
              </div>
            </div>

            {/* Visual Timer Display */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className="text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="76"
                    className={`transition-all duration-300 ${
                      timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-brand-500'
                    }`}
                    strokeWidth="10"
                    strokeDasharray={477}
                    strokeDashoffset={477 - (477 * (100 - progressPercent)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Center Number */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`font-mono font-black text-4xl sm:text-5xl ${
                    timeLeft <= 5 ? 'text-red-400' : 'text-white'
                  }`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                    {timeLeft === 0 ? 'Tempo Esgotado!' : isTimerRunning ? 'Contando...' : 'Pausado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[30, 60, 90, 120].map(sec => (
                <button
                  key={sec}
                  onClick={() => handleResetTimer(sec)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    timerDuration === sec
                      ? 'bg-brand-600/40 border-brand-400 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleStartPauseTimer}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm shadow-lg transition-all ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-brand-600/30 hover:scale-[1.02]'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </button>

            <button
              onClick={() => handleResetTimer()}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Tool 2: Rolador de Dados 3D */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">
                🎲
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Rolador de Dados</h3>
                <p className="text-xs text-slate-400">D6, D10, D12, D20 e D100 animados</p>
              </div>
            </div>

            {/* 3D Visual Dice Result */}
            <div className="flex flex-col items-center justify-center my-8">
              <div
                className={`w-36 h-36 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-pink-500 p-1 shadow-2xl flex items-center justify-center transition-transform ${
                  isRolling ? 'scale-110 animate-wiggle' : 'glow-purple'
                }`}
              >
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase text-brand-300 mb-1">
                    D{diceType}
                  </span>
                  <span className="text-5xl font-black text-white font-display">
                    {diceResult !== null ? diceResult : '?'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dice Selectors */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {([6, 10, 12, 20, 100] as const).map(type => (
                <button
                  key={type}
                  onClick={() => rollDice(type)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all ${
                    diceType === type
                      ? 'bg-brand-600 border-brand-400 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  D{type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => rollDice(diceType)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Dices className="w-4 h-4" />
            Rolar D{diceType}
          </button>

        </div>

        {/* Tool 3: Sorteador de Primeiro Jogador */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">
                🎯
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Quem Começa a Jogar?</h3>
                <p className="text-xs text-slate-400">Sorteador imparcial para a primeira rodada</p>
              </div>
            </div>

            {/* Result Display */}
            <div className="flex flex-col items-center justify-center my-6">
              {chosenPlayer ? (
                <div className={`flex flex-col items-center text-center transition-all ${
                  isSpinning ? 'animate-pulse scale-95' : 'scale-105'
                }`}>
                  <div className="relative mb-3">
                    <div className="w-24 h-24 rounded-3xl p-1.5 bg-gradient-to-tr from-amber-400 to-emerald-500 shadow-xl glow-emerald">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                        <AvatarImage
                          src={chosenPlayer.avatarUrl}
                          alt={chosenPlayer.name}
                          fallbackText={chosenPlayer.name}
                          themeColor={chosenPlayer.themeColor}
                        />
                      </div>
                    </div>
                    {!isSpinning && (
                      <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-md">
                        1º Jogador
                      </div>
                    )}
                  </div>

                  <h4 className="font-display font-black text-lg text-white">
                    {chosenPlayer.name}
                  </h4>
                  <p className="text-xs text-amber-400 font-bold">
                    "{chosenPlayer.nickname}"
                  </p>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col items-center justify-center text-slate-600 mb-4">
                  <HelpCircle className="w-10 h-10" />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={pickFirstPlayer}
            disabled={isSpinning || players.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-sm shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {isSpinning ? 'Sorteando...' : 'Sortear Quem Começa 🎲'}
          </button>

        </div>

      </div>

    </div>
  );
};
