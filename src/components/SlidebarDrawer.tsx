/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SlidebarTab, DailyScoreEntry } from '../types/game';
import { sounds } from '../utils/audio';
import { getDailyTopScores, resetDailyLeaderboard } from '../utils/dailyLeaderboard';
import { getAchievementsList, getAwardsList } from '../utils/achievements';
import {
  X,
  ChevronRight,
  ArrowLeft,
  Trophy,
  Award,
  HelpCircle,
  Info,
  Shield,
  Sliders,
  Sparkles,
  Flame,
  CheckCircle2,
  Trash2,
  Lock,
  WifiOff,
  Zap,
} from 'lucide-react';

interface SlidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SlidebarTab;
  onResetAllData?: () => void;
}

export const SlidebarDrawer: React.FC<SlidebarDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'menu',
  onResetAllData,
}) => {
  const [currentTab, setCurrentTab] = useState<SlidebarTab>(initialTab);
  const [dailyScores, setDailyScores] = useState<DailyScoreEntry[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [saveLocalHighScores, setSaveLocalHighScores] = useState<boolean>(true);
  const [saveLocalAudioPrefs, setSaveLocalAudioPrefs] = useState<boolean>(true);

  // Sync tab when opening with a specific tab
  useEffect(() => {
    if (isOpen) {
      setCurrentTab(initialTab);
      setDailyScores(getDailyTopScores());
    }
  }, [isOpen, initialTab]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const achievements = getAchievementsList();
  const awards = getAwardsList();
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;
  const unlockedAwardsCount = awards.filter((a) => a.unlocked).length;

  const handleResetData = () => {
    sounds.playClick();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    resetDailyLeaderboard();
    setShowClearConfirm(false);
    if (onResetAllData) {
      onResetAllData();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Drawer Container */}
      <aside className="relative z-50 w-full max-w-xs sm:max-w-sm h-full bg-[#0d1424] border-r border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-slide-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-[#090e1b]">
          <div className="flex items-center gap-2">
            {currentTab !== 'menu' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('menu');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1 cursor-pointer"
                title="Back to menu"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-white">
                {currentTab === 'menu' && 'GAME MENU'}
                {currentTab === 'leaderboard' && 'DAILY TOP SCORES'}
                {currentTab === 'achievement' && 'ACHIEVEMENTS'}
                {currentTab === 'awards' && 'AWARDS & TROPHIES'}
                {currentTab === 'help' && 'HOW TO PLAY'}
                {currentTab === 'about' && 'ABOUT BLOCK BLAST'}
                {currentTab === 'privacy_rights' && 'PRIVACY RIGHTS'}
                {currentTab === 'privacy_preference' && 'PRIVACY PREFERENCES'}
              </h2>
              <p className="text-[10px] text-slate-400">Block Blast · Offline Ready</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {/* Main Navigation List */}
          {currentTab === 'menu' && (
            <div className="space-y-2">
              {/* Daily Top Scores Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('leaderboard');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/15 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                      Daily Top Scores
                    </div>
                    <div className="text-[11px] text-slate-400">Top 5 daily challenge champions</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>

              {/* Achievement Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('achievement');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                      Achievement
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {unlockedAchievementsCount} of {achievements.length} unlocked
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>

              {/* Awards Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('awards');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                      Awards
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {unlockedAwardsCount} of {awards.length} trophies earned
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </button>

              {/* Help Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('help');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                      Help & Rules
                    </div>
                    <div className="text-[11px] text-slate-400">Strategy, rules & block tips</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* About Game Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('about');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                      About Game
                    </div>
                    <div className="text-[11px] text-slate-400">Version, features & offline play</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>

              {/* Privacy Rights Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('privacy_rights');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-rose-300 transition-colors">
                      Privacy Rights
                    </div>
                    <div className="text-[11px] text-slate-400">Your rights, zero data tracking</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
              </button>

              {/* Privacy Preference Item */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentTab('privacy_preference');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-slate-200 transition-colors">
                      Privacy Preference
                    </div>
                    <div className="text-[11px] text-slate-400">Manage storage & reset data</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </button>
            </div>
          )}

          {/* Sub-view: Daily Top Scores Leaderboard */}
          {currentTab === 'leaderboard' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center gap-2 mb-1 font-bold text-sm text-amber-300">
                  <Trophy className="w-4 h-4" />
                  <span>Daily Challenge Top 5</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  The top 5 scores achieved specifically in today&apos;s Daily Challenge mode.
                </p>
              </div>

              <div className="space-y-2">
                {dailyScores.map((entry, index) => {
                  const rank = index + 1;
                  const isFirst = rank === 1;
                  const isSecond = rank === 2;
                  const isThird = rank === 3;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        entry.isUser
                          ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                          : isFirst
                          ? 'bg-amber-500/10 border-amber-500/40'
                          : 'bg-slate-900/70 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                            isFirst
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : isSecond
                              ? 'bg-slate-300 text-slate-950'
                              : isThird
                              ? 'bg-amber-700 text-amber-100'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{rank}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {entry.isUser && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{entry.date}</div>
                        </div>
                      </div>

                      <div className="font-black text-sm text-right tabular-nums text-amber-300">
                        {entry.score.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-normal ml-1">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                Play the Daily Challenge mode to record your score on today&apos;s leaderboard!
              </div>
            </div>
          )}

          {/* Sub-view: Achievements */}
          {currentTab === 'achievement' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300">
                <span>Total Unlocked:</span>
                <span className="font-bold tabular-nums">
                  {unlockedAchievementsCount} / {achievements.length}
                </span>
              </div>

              {achievements.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    item.unlocked
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.description}</div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {item.progress} / {item.maxProgress}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.unlocked
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                          : 'bg-slate-600'
                      }`}
                      style={{
                        width: `${Math.min(100, (item.progress / item.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-view: Awards */}
          {currentTab === 'awards' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-purple-300">
                <span>Trophies Earned:</span>
                <span className="font-bold tabular-nums">
                  {unlockedAwardsCount} / {awards.length}
                </span>
              </div>

              {awards.map((award) => (
                <div
                  key={award.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                    award.unlocked
                      ? 'bg-slate-900/90 border-purple-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      award.unlocked
                        ? award.tier === 'diamond'
                          ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400'
                          : award.tier === 'gold'
                          ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400'
                          : 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-400'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-xs">{award.title}</div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-purple-400">
                        {award.tier}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{award.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-view: Help */}
          {currentTab === 'help' && (
            <div className="space-y-3 leading-relaxed text-slate-300 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Drag & Drop Blocks</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Place shapes onto the 8x8 grid. Touch users have an automatic upward finger offset so blocks aren&apos;t covered by fingers.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Clear Rows & Columns</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Completing any 8-block line blasts it away. Clearing multiple rows and columns together awards massive multiplier points!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Chain Consecutive Combos</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Every back-to-back placement that clears a line builds up your Combo Multiplier (`x2`, `x3`, `x4`...) with rising musical chime pitches.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  <span>Second Chance Revive</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  When you run out of moves, use your 1-time &quot;Second Chance&quot; per session to blast the center 3x3 tiles and keep going!
                </p>
              </div>
            </div>
          )}

          {/* Sub-view: About Game */}
          {currentTab === 'about' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 mx-auto flex items-center justify-center mb-2 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-black text-white text-base">Block Blast</h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Version 1.2.0 · Progressive Web App</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Offline Game</span>
                </div>
                <p>
                  Block Blast is designed from the ground up to be enjoyed anywhere—at home, on a commute, on a flight, or in airplane mode. No internet or WiFi required.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="font-bold text-white text-xs">Game Highlights</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Classic 8x8 Board Endless Mode</li>
                  <li>Gem Hunt Adventure with trapped gems</li>
                  <li>Daily Challenge with seeded puzzles</li>
                  <li>Procedural Web Audio soundtrack & chimes</li>
                  <li>Tactile Haptic vibration support</li>
                </ul>
              </div>
            </div>
          )}

          {/* Sub-view: Privacy Rights */}
          {currentTab === 'privacy_rights' && (
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">Your Privacy is Fully Respected</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Block Blast operates entirely on your device. We do not collect, transmit, share, or sell your personal information.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-xs">Data Rights Overview (GDPR & CCPA Compliant)</div>
                <div className="space-y-2 text-[11px] text-slate-400">
                  <div>
                    <strong className="text-white block">Right to Know & Access:</strong>
                    All game scores, audio settings, and streaks reside exclusively in your browser&apos;s local storage.
                  </div>
                  <div>
                    <strong className="text-white block">Right to Delete:</strong>
                    You can clear all stored scores and achievements at any time in Privacy Preferences.
                  </div>
                  <div>
                    <strong className="text-white block">No Third-Party Trackers:</strong>
                    This application contains zero external tracking beacons, ad pixels, or telemetric identifiers.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Privacy Preference */}
          {currentTab === 'privacy_preference' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Store High Scores Locally</div>
                  <div className="text-[10px] text-slate-400">Keep career high scores on this device</div>
                </div>
                <button
                  onClick={() => setSaveLocalHighScores(!saveLocalHighScores)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    saveLocalHighScores ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      saveLocalHighScores ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Remember Audio & Haptics</div>
                  <div className="text-[10px] text-slate-400">Save volume sliders & vibration preference</div>
                </div>
                <button
                  onClick={() => setSaveLocalAudioPrefs(!saveLocalAudioPrefs)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    saveLocalAudioPrefs ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      saveLocalAudioPrefs ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Reset Data Confirmation */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2 mt-4">
                <div className="font-bold text-rose-300 text-xs flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset All Stored Game Data</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Wipes local high scores, daily leaderboard entries, and streak records.
                </p>

                {showClearConfirm ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleResetData}
                      className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Clear Game Data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090e1b] text-center text-[10px] text-slate-500">
          Block Blast · Relaxation & Strategic Puzzles
        </div>
      </aside>
    </div>
  );
};
