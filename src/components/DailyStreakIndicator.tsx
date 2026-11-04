/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  Check,
  Trophy,
  Calendar,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  DailyChallengeInfo,
  getWeekCalendarDays,
  getStreakMilestone,
} from '../utils/daily';
import { sounds } from '../utils/audio';

interface DailyStreakIndicatorProps {
  dailyInfo: DailyChallengeInfo;
  onOpenLeaderboard?: () => void;
  compact?: boolean;
}

export const DailyStreakIndicator: React.FC<DailyStreakIndicatorProps> = ({
  dailyInfo,
  onOpenLeaderboard,
  compact = false,
}) => {
  const calendarDays = getWeekCalendarDays();
  const milestone = getStreakMilestone(dailyInfo.streakCount);

  if (compact) {
    // Mini streak badge for headers or mode buttons
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
        <Flame className={`w-3.5 h-3.5 ${dailyInfo.streakCount > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
        <span>{dailyInfo.streakCount} {dailyInfo.streakCount === 1 ? 'day' : 'days'}</span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-3 sm:p-3.5 shadow-lg flex flex-col gap-2.5 text-left animate-fade-in">
      {/* Top Row: Streak Header & Target Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              dailyInfo.streakCount > 0
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <Flame className={`w-5 h-5 ${dailyInfo.streakCount > 0 ? 'fill-white animate-pulse' : ''}`} />
            </div>
            {dailyInfo.isCompleted && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-tight">
                {dailyInfo.streakCount > 0 ? `${dailyInfo.streakCount} Day Streak` : 'Daily Challenge'}
              </span>
              {dailyInfo.isCompleted && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Completed
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {dailyInfo.isCompleted
                ? 'Streak preserved! Great job today.'
                : dailyInfo.streakCount > 0
                ? 'Play today to maintain your streak!'
                : 'Complete today to start your streak!'}
            </p>
          </div>
        </div>

        {/* Target score pill */}
        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
            Target
          </span>
          <span className="text-xs font-black text-amber-400 font-mono">
            {dailyInfo.targetScore.toLocaleString()} pts
          </span>
        </div>
      </div>

      {/* 7-Day Calendar Streak Indicator Bar */}
      <div className="w-full bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Calendar className="w-3 h-3 text-cyan-400" />
            <span>This Week</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {dailyInfo.displayDate}
          </span>
        </div>

        {/* Days Strip */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 relative">
          {calendarDays.map((day) => {
            return (
              <div
                key={day.dateKey}
                className={`relative flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all ${
                  day.isToday
                    ? day.isCompleted
                      ? 'bg-emerald-500/15 border-2 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : 'bg-amber-500/15 border-2 border-amber-400 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : day.isCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : day.isPast
                    ? 'bg-slate-900/60 border border-slate-800/60 opacity-60'
                    : 'bg-slate-900/40 border border-slate-800/40 opacity-40'
                }`}
              >
                {/* Day Letter */}
                <span className={`text-[10px] font-bold uppercase mb-1 ${
                  day.isToday
                    ? day.isCompleted ? 'text-emerald-300' : 'text-amber-300'
                    : day.isCompleted ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {day.dayLetter}
                </span>

                {/* Day Icon / Status Badge */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  day.isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : day.isToday
                    ? 'bg-amber-500 text-white font-black'
                    : day.isPast
                    ? 'bg-slate-800 text-slate-500 font-mono text-[10px]'
                    : 'bg-slate-800/50 text-slate-600'
                }`}>
                  {day.isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : day.isToday ? (
                    <Flame className="w-3.5 h-3.5 fill-white" />
                  ) : day.isPast ? (
                    <span>{day.dayNumber}</span>
                  ) : (
                    <Lock className="w-2.5 h-2.5 opacity-60" />
                  )}
                </div>

                {/* Today label if active */}
                {day.isToday && (
                  <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter ${
                    day.isCompleted ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Streak Milestone Progress Bar */}
      <div className="w-full flex flex-col gap-1.5 px-0.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Next Milestone: <span className="text-amber-300 font-black">{milestone.milestoneName}</span></span>
          </span>
          <span className="font-mono text-[11px] font-bold text-slate-400">
            {milestone.currentStreak}/{milestone.nextMilestone} days
          </span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-500 relative"
            style={{ width: `${Math.max(6, milestone.progressPercent)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Milestone info / days remaining */}
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>
            {milestone.daysRemaining === 0 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Milestone achieved!
              </span>
            ) : (
              <span>{milestone.daysRemaining} {milestone.daysRemaining === 1 ? 'day' : 'days'} until {milestone.milestoneName}</span>
            )}
          </span>
          {onOpenLeaderboard && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenLeaderboard();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Trophy className="w-2.5 h-2.5" />
              <span>Daily Top 5</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
