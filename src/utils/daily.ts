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

export interface CalendarDayStatus {
  dateKey: string;
  dayLetter: string;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCompleted: boolean;
}

export interface StreakMilestone {
  currentStreak: number;
  nextMilestone: number;
  prevMilestone: number;
  progressPercent: number;
  milestoneName: string;
  daysRemaining: number;
}

export function getDailyHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('blockblast_daily_history');
    if (raw) {
      return JSON.parse(raw);
    }
    // Backfill from streak if history not yet initialized
    const streak = parseInt(localStorage.getItem('blockblast_daily_streak') || '0', 10);
    const lastCompleted = localStorage.getItem('blockblast_daily_completed_date');
    if (streak > 0 && lastCompleted) {
      const history: string[] = [];
      const baseDate = new Date(lastCompleted + 'T12:00:00');
      for (let i = 0; i < streak; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        history.push(`${y}-${m}-${day}`);
      }
      localStorage.setItem('blockblast_daily_history', JSON.stringify(history));
      return history;
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * Returns the 7 days of the current week (Monday to Sunday)
 */
export function getWeekCalendarDays(): CalendarDayStatus[] {
  const history = getDailyHistory();
  const todayKey = getTodayDateKey();
  const now = new Date();
  
  // Calculate current Monday (1)
  const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
  // Distance to Monday: if Sun (0), distance is -6; otherwise 1 - currentDayOfWeek
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);

  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const days: CalendarDayStatus[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const isToday = dateKey === todayKey;
    const isCompleted = history.includes(dateKey) || (isToday && getTodayChallenge().isCompleted);

    // Normalize comparison at midnight
    const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isFuture = d > new Date(now.getFullYear(), now.getMonth(), now.getDate());

    days.push({
      dateKey,
      dayLetter: dayLetters[i],
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      isToday,
      isPast,
      isFuture,
      isCompleted,
    });
  }

  return days;
}

const MILESTONES = [
  { days: 3, name: '3-Day Spark' },
  { days: 7, name: '7-Day Champion' },
  { days: 14, name: '14-Day Master' },
  { days: 30, name: '30-Day Legend' },
  { days: 60, name: '60-Day Immortal' },
];

export function getStreakMilestone(currentStreak: number): StreakMilestone {
  let prev = 0;
  let target = MILESTONES[0];

  for (const m of MILESTONES) {
    if (currentStreak < m.days) {
      target = m;
      break;
    }
    prev = m.days;
  }

  // If streak exceeds the highest milestone
  if (currentStreak >= MILESTONES[MILESTONES.length - 1].days) {
    const last = MILESTONES[MILESTONES.length - 1];
    return {
      currentStreak,
      nextMilestone: last.days,
      prevMilestone: prev,
      progressPercent: 100,
      milestoneName: last.name,
      daysRemaining: 0,
    };
  }

  const range = target.days - prev;
  const currentInRange = currentStreak - prev;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return {
    currentStreak,
    nextMilestone: target.days,
    prevMilestone: prev,
    progressPercent,
    milestoneName: target.name,
    daysRemaining: Math.max(0, target.days - currentStreak),
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

    // Append to history
    const history = getDailyHistory();
    if (!history.includes(dateKey)) {
      history.push(dateKey);
      localStorage.setItem('blockblast_daily_history', JSON.stringify(history));
    }
  }

  return currentStreak;
}
