/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockColorKey, GridCell } from '../types/game';
import { createEmptyGrid } from './pieces';

export interface DailyChallengeInfo {
  dateKey: string;
  displayDate: string;
  title: string;
  targetScore: number;
  targetLines: number;
  initialBoard: (GridCell | null)[][];
  isCompleted: boolean;
  streakCount: number;
}

// Simple pseudo-random generator seeded with date string
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayChallenge(): DailyChallengeInfo {
  const dateKey = getTodayDateKey();
  const now = new Date();
  const displayDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Numeric seed from date
  const seedNum = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

  const colors: BlockColorKey[] = ['cyan', 'amber', 'emerald', 'purple', 'rose', 'blue', 'yellow'];
  const titles = [
    'Solar Cascade',
    'Neon Horizon',
    'Emerald Matrix',
    'Diamond Rush',
    'Sapphire Grid',
    'Cosmic Blast',
    'Ruby Tempest',
  ];
  const title = titles[seedNum % titles.length];

  // Seeded initial puzzle board
  const board = createEmptyGrid(8);
  const blockCount = 8 + (seedNum % 6);

  for (let i = 0; i < blockCount; i++) {
    const r = Math.floor(pseudoRandom(seedNum + i * 3) * 6) + 1;
    const c = Math.floor(pseudoRandom(seedNum + i * 5) * 6) + 1;
    if (!board[r][c]) {
      const colorKey = colors[Math.floor(pseudoRandom(seedNum + i * 7) * colors.length)];
      board[r][c] = {
        id: `daily-${r}-${c}`,
        colorKey,
      };
    }
  }

  // Check completion in localStorage
  let isCompleted = false;
  let streakCount = 0;
  if (typeof window !== 'undefined') {
    const lastCompleted = localStorage.getItem('blockblast_daily_completed_date');
    isCompleted = lastCompleted === dateKey;
    const streak = localStorage.getItem('blockblast_daily_streak');
    streakCount = streak ? parseInt(streak, 10) || 0 : 0;
  }

  return {
    dateKey,
    displayDate,
    title,
    targetScore: 1200,
    targetLines: 8,
    initialBoard: board,
    isCompleted,
    streakCount,
  };
}

export function markTodayChallengeComplete(): number {
  if (typeof window === 'undefined') return 1;
  const dateKey = getTodayDateKey();
  const lastCompleted = localStorage.getItem('blockblast_daily_completed_date');

  let currentStreak = parseInt(localStorage.getItem('blockblast_daily_streak') || '0', 10);

  if (lastCompleted !== dateKey) {
    // Check if yesterday was completed
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (lastCompleted === yesterdayKey) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem('blockblast_daily_completed_date', dateKey);
    localStorage.setItem('blockblast_daily_streak', String(currentStreak));
  }

  return currentStreak;
}
