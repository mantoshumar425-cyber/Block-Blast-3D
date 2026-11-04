/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  Trophy,
  RotateCcw,
  Play,
  Home,
  Sparkles,
  Flame,
  Zap,
  HelpCircle,
  Volume2,
  VolumeX,
  Vibrate,
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  linesCleared: number;
  maxCombo: number;
  canRevive?: boolean;
  onRevive?: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  linesCleared,
  maxCombo,
  canRevive = false,
  onRevive,
  onRestart,
  onHome,
}) => {
  // Listen for Space/Enter to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sounds.playClick();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3 text-rose-400">
          <Trophy className="w-7 h-7 text-amber-400" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-0.5">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mb-4">No more moves possible!</p>

        {/* Score Display */}
        <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-3 flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Final Score
          </span>
          <div className="text-4xl sm:text-5xl font-black tabular-nums text-white drop-shadow-md">
            {score.toLocaleString()}
          </div>

          {isNewHigh && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>NEW HIGH SCORE!</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="text-[10px] font-medium text-slate-400">Lines Cleared</div>
            <div className="text-lg font-bold text-cyan-400 tabular-nums">
              {linesCleared}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="text-[10px] font-medium text-slate-400">Max Combo</div>
            <div className="text-lg font-bold text-amber-400 tabular-nums flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>x{maxCombo}</span>
            </div>
          </div>
        </div>

        {/* Second Chance Revive (1x per run) */}
        {canRevive && onRevive && (
          <button
            onClick={() => {
              sounds.playClick();
              onRevive();
            }}
            className="w-full py-3 px-4 rounded-xl font-black text-amber-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:brightness-110 shadow-[0_4px_20px_rgba(245,158,11,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2.5"
          >
            <Zap className="w-4 h-4 fill-amber-950" />
            <span>SECOND CHANCE (BLAST 3x3)</span>
          </button>
        )}

        {/* Primary Play Again CTA */}
        <button
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_4px_20px_rgba(6,182,212,0.4)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Title Screen</span>
        </button>
      </div>
    </div>
  );
};

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onHowToPlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  musicVolume: number;
  onMusicVolumeChange: (vol: number) => void;
  sfxVolume: number;
  onSfxVolumeChange: (vol: number) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  onHowToPlay,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
  musicVolume,
  onMusicVolumeChange,
  sfxVolume,
  onSfxVolumeChange,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'Space') {
        e.preventDefault();
        sounds.playClick();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        <h2 className="text-2xl font-black tracking-tight text-white mb-0.5">
          PAUSED
        </h2>
        <p className="text-xs text-slate-400 mb-4">Relax and plan your next blast</p>

        {/* Primary Actions */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <button
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onRestart();
              }}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onHowToPlay();
              }}
              className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>How to Play</span>
            </button>
          </div>
        </div>

        {/* Independent Volume Controls Card */}
        <div className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 space-y-3 text-left">
          {/* Ambient Music Volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Ambient Music</span>
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Sound Effects (SFX) Volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Sound FX</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Quick Toggles: Master Mute & Haptics */}
        <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 mb-3">
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>
          <div className="w-px h-4 bg-slate-800" />
          <button
            onClick={() => {
              sounds.playClick();
              onToggleHaptics();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            <Vibrate className={`w-3.5 h-3.5 ${hapticsEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>{hapticsEnabled ? 'Haptics On' : 'Haptics Off'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full py-1.5 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Title Screen</span>
        </button>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  score: number;
  levelNumber: number;
  onNextLevel: () => void;
  onHome: () => void;
  mode?: 'adventure' | 'daily';
  streakCount?: number;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  levelNumber,
  onNextLevel,
  onHome,
  mode = 'adventure',
  streakCount = 1,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-400 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white mb-0.5">
          {mode === 'daily' ? 'DAILY CHALLENGE WON!' : 'STAGE CLEARED!'}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {mode === 'daily'
            ? `Daily streak: ${streakCount} ${streakCount === 1 ? 'day' : 'days'}!`
            : `Level ${levelNumber} gems captured!`}
        </p>

        <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 flex flex-col items-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
            Score
          </span>
          <div className="text-4xl font-black tabular-nums text-white">
            {score.toLocaleString()}
          </div>
        </div>

        {mode === 'adventure' ? (
          <button
            onClick={() => {
              sounds.playClick();
              onNextLevel();
            }}
            className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_4px_20px_rgba(16,185,129,0.4)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>NEXT LEVEL</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full py-3 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO MENU</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Title Screen</span>
        </button>
      </div>
    </div>
  );
};
