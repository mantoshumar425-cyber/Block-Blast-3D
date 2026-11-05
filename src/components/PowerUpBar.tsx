/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hammer, Bomb, RotateCw, Target, Zap, Sparkles } from 'lucide-react';
import { PowerUpInventory, DailyMission } from '../types/missions';
import { sounds } from '../utils/audio';

interface PowerUpBarProps {
  inventory: PowerUpInventory;
  missions: DailyMission[];
  isTargetingHammer: boolean;
  onToggleHammer: () => void;
  onUseBomb: () => void;
  onUseRefresh: () => void;
  onOpenMissions: () => void;
}

export const PowerUpBar: React.FC<PowerUpBarProps> = ({
  inventory,
  missions,
  isTargetingHammer,
  onToggleHammer,
  onUseBomb,
  onUseRefresh,
  onOpenMissions,
}) => {
  const completedMissions = missions.filter((m) => m.isCompleted).length;

  return (
    <div className="w-full max-w-md flex flex-col gap-1.5 px-2 z-20">
      {/* Active Multiplier Banner if active */}
      {inventory.multiplierMovesLeft > 0 && (
        <div className="w-full py-1 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300 animate-pulse">
          <span className="flex items-center gap-1.5 font-black">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>2X SCORE MULTIPLIER ACTIVE!</span>
          </span>
          <span className="font-mono font-bold text-[11px] bg-amber-500/30 px-1.5 py-0.5 rounded-md">
            {inventory.multiplierMovesLeft} {inventory.multiplierMovesLeft === 1 ? 'move' : 'moves'} left
          </span>
        </div>
      )}

      {/* Hammer Active Targeting Hint */}
      {isTargetingHammer && (
        <div className="w-full py-1.5 px-3 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-between text-xs text-cyan-300 animate-pulse">
          <span className="font-bold flex items-center gap-1.5">
            <Hammer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Targeting: Click any block to smash a 3x3 area!</span>
          </span>
          <button
            onClick={onToggleHammer}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-600 text-white cursor-pointer hover:bg-cyan-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Power-Up Action Buttons & Missions Status */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          {/* Hammer Button */}
          <button
            onClick={() => {
              if (inventory.hammers > 0) {
                sounds.playClick();
                onToggleHammer();
              }
            }}
            disabled={inventory.hammers <= 0}
            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all ${
              isTargetingHammer
                ? 'bg-cyan-500 text-white shadow-lg ring-2 ring-cyan-300'
                : inventory.hammers > 0
                ? 'bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer shadow-sm'
                : 'bg-slate-900/40 border border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
            }`}
            title="Smash a 3x3 grid area"
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Hammer</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              inventory.hammers > 0 ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-500'
            }`}>
              x{inventory.hammers}
            </span>
          </button>

          {/* Color Bomb Button */}
          <button
            onClick={() => {
              if (inventory.bombs > 0) {
                onUseBomb();
              }
            }}
            disabled={inventory.bombs <= 0}
            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all ${
              inventory.bombs > 0
                ? 'bg-slate-900/90 border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 cursor-pointer shadow-sm'
                : 'bg-slate-900/40 border border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
            }`}
            title="Clear all mission-target color blocks"
          >
            <Bomb className="w-3.5 h-3.5" />
            <span>Bomb</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              inventory.bombs > 0 ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-800 text-slate-500'
            }`}>
              x{inventory.bombs}
            </span>
          </button>

          {/* Tray Refresh Button */}
          <button
            onClick={() => {
              if (inventory.refreshes > 0) {
                onUseRefresh();
              }
            }}
            disabled={inventory.refreshes <= 0}
            className={`flex items-center gap-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all ${
              inventory.refreshes > 0
                ? 'bg-slate-900/90 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer shadow-sm'
                : 'bg-slate-900/40 border border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
            }`}
            title="Reroll tray pieces for fresh options"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reroll</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              inventory.refreshes > 0 ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
            }`}>
              x{inventory.refreshes}
            </span>
          </button>
        </div>

        {/* Missions Modal Opener */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenMissions();
          }}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all text-xs font-bold cursor-pointer"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Missions</span>
          <span className="text-[10px] font-mono font-bold bg-amber-500/30 px-1 rounded text-amber-200">
            {completedMissions}/{missions.length}
          </span>
        </button>
      </div>
    </div>
  );
};
