/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyScoreEntry } from '../types/game';
import { getTodayDateKey } from './daily';

const STORAGE_KEY = 'blockblast_daily_top_scores';

function getInitialChallengers(): DailyScoreEntry[] {
  const today = getTodayDateKey();
  return [
    { id: 'bot-1', name: 'Nova_99', score: 1840, date: today },
    { id: 'bot-2', name: 'Alex_Blast', score: 1610, date: today },
    { id: 'bot-3', name: 'ZenPuzzler', score: 1450, date: today },
    { id: 'bot-4', name: 'SkyBlocker', score: 1280, date: today },
    { id: 'bot-5', name: 'EchoWave', score: 1150, date: today },
  ];
}

export function getDailyTopScores(): DailyScoreEntry[] {
  if (typeof window === 'undefined') return getInitialChallengers();

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const initial = getInitialChallengers();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(saved) as DailyScoreEntry[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.sort((a, b) => b.score - a.score).slice(0, 5);
    }
  } catch {}

  const fallback = getInitialChallengers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
  return fallback;
}

export function submitDailyScore(
  score: number,
  userName: string = 'You (Champion)'
): { isTop5: boolean; rank: number; scores: DailyScoreEntry[] } {
  const currentScores = getDailyTopScores();
  const today = getTodayDateKey();

  const userEntry: DailyScoreEntry = {
    id: `user-${Date.now()}`,
    name: userName,
    score,
    date: today,
    isUser: true,
  };

  const combined = [...currentScores, userEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const rank = combined.findIndex((entry) => entry.id === userEntry.id) + 1;
  const isTop5 = rank > 0;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
  }

  return {
    isTop5,
    rank,
    scores: combined,
  };
}

export function resetDailyLeaderboard(): DailyScoreEntry[] {
  const initial = getInitialChallengers();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }
  return initial;
}
