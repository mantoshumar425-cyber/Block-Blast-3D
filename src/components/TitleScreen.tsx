/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GameMode } from '../types/game';
import { sounds } from '../utils/audio';
import {
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Play,
  Calendar,
  HelpCircle,
  BarChart3,
  Vibrate,
  Settings,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { getTodayChallenge } from '../utils/daily';

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  highScore,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
  selectedMode,
  onSelectMode,
  onOpenHowToPlay,
  onOpenStats,
  onOpenSettings,
}) => {
  const dailyInfo = getTodayChallenge();

  // Listen for Enter / Space keys to immediately start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sounds.playClick();
        onStart(selectedMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, selectedMode]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center p-4 sm:p-6 bg-gradient-to-b from-[#080d1a] via-[#0b1329] to-[#060a14]">
      {/* Ambient background particles / grid pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.25) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      {/* Top perimeter cluster: Best Score, Install Button, Settings */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-amber-400 font-medium text-xs sm:text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">Best</span>
            <span className="font-bold text-white tabular-nums tracking-wide">
              {highScore.toLocaleString()}
            </span>
          </div>

          <PWAInstallButton />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenStats();
            }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Lifetime Statistics"
            aria-label="Stats"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenHowToPlay();
            }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="How to Play"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleHaptics();
            }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:inline-flex"
            title={hapticsEnabled ? 'Disable Haptics' : 'Enable Haptics'}
            aria-label="Haptics"
          >
            <Vibrate className={`w-4 h-4 ${hapticsEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Audio & Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Centerpiece: Title Lockup & Hero Simulation */}
      <main className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-md my-auto py-2">
        {/* Bespoke inline SVG Title Lockup */}
        <div className="relative mb-4 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          <svg
            className="w-68 sm:w-84 max-w-full h-auto overflow-visible"
            viewBox="0 0 380 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <filter id="glow-title" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284c7" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* BLOCK */}
            <g filter="url(#glow-title)">
              <text x="30" y="52" fill="url(#grad-cyan)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="50" stroke="#fff" strokeWidth="1.5" letterSpacing="1">
                B
              </text>
              <text x="68" y="52" fill="url(#grad-amber)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="50" stroke="#fff" strokeWidth="1.5" letterSpacing="1">
                L
              </text>
              <text x="98" y="52" fill="url(#grad-emerald)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="50" stroke="#fff" strokeWidth="1.5" letterSpacing="1">
                O
              </text>
              <text x="142" y="52" fill="url(#grad-rose)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="50" stroke="#fff" strokeWidth="1.5" letterSpacing="1">
                C
              </text>
              <text x="180" y="52" fill="url(#grad-purple)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="50" stroke="#fff" strokeWidth="1.5" letterSpacing="1">
                K
              </text>

              {/* BLAST */}
              <text x="110" y="105" fill="#ffffff" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="54" letterSpacing="4" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill">
                BLAST
              </text>
              <text x="110" y="105" fill="url(#grad-amber)" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="54" letterSpacing="4">
                BLAST
              </text>
            </g>

            {/* Decorative 3D Cube accents */}
            <rect x="235" y="16" width="18" height="18" rx="4" fill="url(#grad-cyan)" stroke="#fff" strokeWidth="1" />
            <rect x="257" y="16" width="18" height="18" rx="4" fill="url(#grad-cyan)" stroke="#fff" strokeWidth="1" />
            <rect x="235" y="38" width="18" height="18" rx="4" fill="url(#grad-cyan)" stroke="#fff" strokeWidth="1" />
            <rect x="55" y="70" width="16" height="16" rx="4" fill="url(#grad-rose)" stroke="#fff" strokeWidth="1" />
            <rect x="75" y="70" width="16" height="16" rx="4" fill="url(#grad-rose)" stroke="#fff" strokeWidth="1" />
            <rect x="310" y="72" width="20" height="20" rx="4" fill="url(#grad-emerald)" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>

        {/* Offline Friendly Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Offline Ready · No WiFi Needed</span>
        </div>

        {/* Mode Selector - 3 Modes: Classic, Adventure, Daily Challenge */}
        <div className="flex w-full max-w-sm p-1 mb-4 bg-slate-900/80 border border-slate-800 rounded-2xl gap-1">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('classic');
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedMode === 'classic'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Classic</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('adventure');
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedMode === 'adventure'
                ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gem Hunt</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectMode('daily');
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl transition-all relative ${
              selectedMode === 'daily'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily</span>
            {dailyInfo.isCompleted && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        </div>

        {/* Mode Info Blurb */}
        <div className="w-full max-w-sm px-4 py-2 mb-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center text-xs text-slate-300">
          {selectedMode === 'classic' && (
            <span>Endless 8x8 block puzzle. Build combos, protect space, and beat your best score.</span>
          )}
          {selectedMode === 'adventure' && (
            <span>Blast trapped gems across progressive stages. Plan strategic multi-line clears.</span>
          )}
          {selectedMode === 'daily' && (
            <span className="flex items-center justify-center gap-1.5">
              <span>{dailyInfo.displayDate} · Target: {dailyInfo.targetScore} pts</span>
              {dailyInfo.isCompleted && <span className="text-emerald-400 font-bold">(Completed ✓)</span>}
            </span>
          )}
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onStart(selectedMode);
          }}
          className="group relative w-full max-w-sm py-3.5 px-6 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_4px_24px_rgba(6,182,212,0.45)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.6)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
          <span>START GAME</span>
        </button>

        {/* Keyboard shortcut hint */}
        <p className="mt-2 text-xs text-slate-400 tracking-wide font-medium">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[11px]">Enter</kbd> to play
        </p>
      </main>

      {/* Footer: Single flat control hint line */}
      <footer className="w-full text-center z-10 pb-1">
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Drag Pieces · Clear Rows & Columns · Combo Multipliers · Esc Pause
        </p>
      </footer>
    </div>
  );
};
