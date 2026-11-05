/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Target, Zap, Hammer, Bomb, RotateCw } from 'lucide-react';
import { DailyMission, PowerUpInventory } from '../types/missions';
import { DailyMissionsCard } from './DailyMissionsCard';

interface DailyMissionsModalProps {
  missions: DailyMission[];
  inventory: PowerUpInventory;
  onClose: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  missions,
  inventory,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Daily Missions</h2>
              <p className="text-xs text-slate-400">Complete tasks to unlock power-ups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions Card */}
        <DailyMissionsCard missions={missions} />

        {/* Power-up Inventory Overview */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Unlocked Power-Ups
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col items-center">
              <Hammer className="w-4 h-4 text-cyan-400 mb-1" />
              <span className="text-slate-300 font-bold">Hammer</span>
              <span className="text-[11px] font-mono font-bold text-cyan-400">x{inventory.hammers}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30 flex flex-col items-center">
              <Bomb className="w-4 h-4 text-rose-400 mb-1" />
              <span className="text-slate-300 font-bold">Color Bomb</span>
              <span className="text-[11px] font-mono font-bold text-rose-400">x{inventory.bombs}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col items-center">
              <RotateCw className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-slate-300 font-bold">Reroll</span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">x{inventory.refreshes}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
