/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DailyMission } from '../types/missions';
import {
  Check,
  Zap,
  Bomb,
  Hammer,
  RotateCw,
  Sparkles,
  Target,
} from 'lucide-react';

interface DailyMissionsCardProps {
  missions: DailyMission[];
  compact?: boolean;
}

export const DailyMissionsCard: React.FC<DailyMissionsCardProps> = ({
  missions,
  compact = false,
}) => {
  const completedCount = missions.filter((m) => m.isCompleted).length;

  const renderRewardIcon = (type: DailyMission['rewardType']) => {
    switch (type) {
      case 'multiplier':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'bomb':
        return <Bomb className="w-3.5 h-3.5 text-rose-400" />;
      case 'hammer':
        return <Hammer className="w-3.5 h-3.5 text-cyan-400" />;
      case 'refresh':
        return <RotateCw className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <Target className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-bold text-white">Missions</span>
        <span className="text-[11px] font-mono text-amber-400 font-bold">
          {completedCount}/{missions.length}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-3 sm:p-3.5 shadow-md flex flex-col gap-2.5 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Daily Missions
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
          <span>{completedCount}/{missions.length} Done</span>
          {completedCount === missions.length && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Mission Items */}
      <div className="flex flex-col gap-2">
        {missions.map((mission) => {
          const progressPct = mission.isCompleted
            ? 100
            : Math.min(100, Math.round((mission.current / mission.target) * 100));

          return (
            <div
              key={mission.id}
              className={`p-2.5 rounded-xl border transition-all ${
                mission.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : 'bg-slate-950/50 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                      mission.isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mission.isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      renderRewardIcon(mission.rewardType)
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      {mission.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Reward: <strong className="text-amber-300">{mission.rewardLabel}</strong>
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-300 tabular-nums shrink-0">
                  {mission.current}/{mission.target}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    mission.isCompleted
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
