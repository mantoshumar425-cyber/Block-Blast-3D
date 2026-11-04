/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Play, Home, Sparkles, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHigh: boolean;
  linesCleared: number;
  maxCombo: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHigh,
  linesCleared,
  maxCombo,
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
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mb-6">No more moves possible!</p>

        {/* Score Display */}
        <div className="w-full py-4 px-6 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Final Score
          </span>
          <div className="text-5xl font-black tabular-nums text-white drop-shadow-md">
            {score.toLocaleString()}
          </div>

          {isNewHigh && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW HIGH SCORE!</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 gap-2 mb-6">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="text-[11px] font-medium text-slate-400">Lines Cleared</div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums">
              {linesCleared}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
            <div className="text-[11px] font-medium text-slate-400">Max Combo</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>x{maxCombo}</span>
            </div>
          </div>
        </div>

        {/* Primary Play Again CTA */}
        <button
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_4px_20px_rgba(6,182,212,0.4)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
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
      <div className="w-full max-w-xs rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        <h2 className="text-2xl font-black tracking-tight text-white mb-2">
          PAUSED
        </h2>
        <p className="text-xs text-slate-400 mb-6">Take a breath, champion!</p>

        <div className="w-full flex flex-col gap-2">
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

          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full py-2 px-4 rounded-xl font-medium text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  score: number;
  levelNumber: number;
  onNextLevel: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  levelNumber,
  onNextLevel,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          STAGE CLEARED!
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Level {levelNumber} gems captured!
        </p>

        <div className="w-full py-4 px-6 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Score
          </span>
          <div className="text-4xl font-black tabular-nums text-white">
            {score.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onNextLevel();
          }}
          className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_4px_20px_rgba(16,185,129,0.4)] transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>NEXT LEVEL</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Title Screen</span>
        </button>
      </div>
    </div>
  );
};
