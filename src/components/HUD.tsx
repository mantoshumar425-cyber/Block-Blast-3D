/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameMode } from '../types/game';
import { Trophy, Volume2, VolumeX, Pause, RotateCcw, Flame, Sparkles, Calendar, HelpCircle, Settings, Menu } from 'lucide-react';
import { sounds } from '../utils/audio';
import { SlidebarTab } from '../types/game';

interface HUDProps {
  score: number;
  highScore: number;
  combo: number;
  gameMode: GameMode;
  levelNumber?: number;
  collectedGems?: number;
  targetGems?: number;
  dailyTargetScore?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onHowToPlay?: () => void;
  onOpenSettings?: () => void;
  onOpenSlidebar?: (tab?: SlidebarTab) => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  highScore,
  combo,
  gameMode,
  levelNumber,
  collectedGems = 0,
  targetGems = 0,
  dailyTargetScore = 1200,
  isMuted,
  onToggleMute,
  onPause,
  onRestart,
  onHowToPlay,
  onOpenSettings,
  onOpenSlidebar,
}) => {
  return (
    <header className="w-full max-w-md flex flex-col gap-2 z-20 px-2 pt-1">
      {/* Top Row: Best Score, Mode Info, Controls */}
      <div className="flex items-center justify-between text-xs">
        {/* Left: Menu & Best Score */}
        <div className="flex items-center gap-1.5">
          {onOpenSlidebar && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSlidebar('menu');
              }}
              className="p-1.5 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Game Menu"
              aria-label="Menu"
            >
              <Menu className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-amber-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">Best</span>
            <span className="font-bold text-white tabular-nums tracking-wide">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Center: Adventure Level or Daily Goal */}
        {gameMode === 'adventure' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Level {levelNumber}</span>
            <span className="text-purple-400">·</span>
            <span className="tabular-nums font-bold text-white">
              {collectedGems}/{targetGems} Gems
            </span>
          </div>
        )}

        {gameMode === 'daily' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Goal: {dailyTargetScore.toLocaleString()}</span>
          </div>
        )}

        {/* Right: Controls (Help, Restart, Mute, Pause) */}
        <div className="flex items-center gap-1">
          {onHowToPlay && (
            <button
              onClick={() => {
                sounds.playClick();
                onHowToPlay();
              }}
              className="p-2 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="How to Play"
              aria-label="Help"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="p-2 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Restart Game"
            aria-label="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onOpenSettings && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Audio & Settings"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-slate-300" />
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onPause();
            }}
            className="p-2 rounded-lg bg-[#0e1626]/80 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Pause Game (Esc)"
            aria-label="Pause"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Score & Combo Center Cluster */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            Score
          </span>
          <div className="text-4xl sm:text-5xl font-black tracking-tight text-white tabular-nums drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Combo Multiplier Tag */}
        {combo > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 animate-bounce">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-sm font-black tracking-wide">
              COMBO x{combo}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
