/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trophy, Flame, Layers, Calendar, BarChart3 } from 'lucide-react';

interface StatsModalProps {
  onClose: () => void;
  highScore: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({ onClose, highScore }) => {
  // Read stats from localStorage
  const gamesPlayed = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_games_played') || '0', 10)
    : 0;
  const totalLines = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_total_lines') || '0', 10)
    : 0;
  const bestCombo = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_best_combo') || '0', 10)
    : 0;
  const dailyStreak = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_daily_streak') || '0', 10)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Player Records</h2>
              <p className="text-xs text-slate-400">Lifetime Statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 py-4">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Best Score</span>
            </div>
            <div className="text-xl font-black text-white tabular-nums">
              {highScore.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Best Combo</span>
            </div>
            <div className="text-xl font-black text-amber-400 tabular-nums">
              x{bestCombo}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total Lines</span>
            </div>
            <div className="text-xl font-black text-cyan-400 tabular-nums">
              {totalLines.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Daily Streak</span>
            </div>
            <div className="text-xl font-black text-purple-400 tabular-nums">
              {dailyStreak} {dailyStreak === 1 ? 'day' : 'days'}
            </div>
          </div>

          <div className="col-span-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">Total Games Played</span>
            <span className="text-lg font-bold text-white tabular-nums">{gamesPlayed}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
