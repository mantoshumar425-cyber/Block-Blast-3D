/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockColorKey } from '../types/game';
import { DailyMission, PowerUpInventory } from '../types/missions';
import { getTodayDateKey } from './daily';

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const MISSION_COLORS: BlockColorKey[] = ['purple', 'cyan', 'amber', 'emerald', 'rose', 'blue'];

export function generateDailyMissions(dateKey: string = getTodayDateKey()): DailyMission[] {
  // Deterministic seed based on date string
  const parts = dateKey.split('-').map(Number);
  const seed = (parts[0] || 2026) * 10000 + (parts[1] || 1) * 100 + (parts[2] || 1);

  // Pick a target color for mission 2
  const colorIndex = Math.floor(pseudoRandom(seed + 1) * MISSION_COLORS.length);
  const targetColor = MISSION_COLORS[colorIndex];
  const colorCapitalized = targetColor.charAt(0).toUpperCase() + targetColor.slice(1);

  // Pick lines in one go target (2 or 3)
  const singleLinesTarget = 2 + (Math.floor(pseudoRandom(seed + 3) * 2)); // 2 or 3

  // Pick combo target (2 or 3)
  const comboTarget = 2 + (Math.floor(pseudoRandom(seed + 5) * 2)); // 2 or 3

  // Pick color blocks count (10 to 16)
  const colorBlocksTarget = 10 + (Math.floor(pseudoRandom(seed + 7) * 7)); // 10-16

  return [
    {
      id: `m-single-${dateKey}`,
      title: `Clear ${singleLinesTarget} lines in one go`,
      description: `Complete a multi-line blast with ${singleLinesTarget} or more lines simultaneously.`,
      taskType: 'clear_lines_single',
      target: singleLinesTarget,
      current: 0,
      isCompleted: false,
      rewardType: 'multiplier',
      rewardLabel: '2x Score Multiplier (5 moves)',
    },
    {
      id: `m-color-${dateKey}`,
      title: `Clear ${colorBlocksTarget} ${colorCapitalized} blocks`,
      description: `Eliminate ${colorBlocksTarget} ${targetColor} blocks through line clears or power-ups.`,
      taskType: 'clear_color_blocks',
      target: colorBlocksTarget,
      current: 0,
      isCompleted: false,
      rewardType: 'bomb',
      rewardLabel: `Color Bomb (${colorCapitalized})`,
      colorKey: targetColor,
    },
    {
      id: `m-combo-${dateKey}`,
      title: `Achieve a ${comboTarget}x Combo streak`,
      description: `Clear consecutive lines in ${comboTarget} back-to-back moves without missing.`,
      taskType: 'reach_combo',
      target: comboTarget,
      current: 0,
      isCompleted: false,
      rewardType: 'hammer',
      rewardLabel: '3x3 Blast Hammer',
    },
  ];
}

export function getDailyMissions(): DailyMission[] {
  if (typeof window === 'undefined') return generateDailyMissions();
  const dateKey = getTodayDateKey();
  try {
    const saved = localStorage.getItem(`blockblast_missions_${dateKey}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }

  const generated = generateDailyMissions(dateKey);
  saveDailyMissions(generated);
  return generated;
}

export function saveDailyMissions(missions: DailyMission[]): void {
  if (typeof window === 'undefined') return;
  const dateKey = getTodayDateKey();
  try {
    localStorage.setItem(`blockblast_missions_${dateKey}`, JSON.stringify(missions));
  } catch {
    // ignore
  }
}

export function getDailyInventory(): PowerUpInventory {
  const initial: PowerUpInventory = {
    hammers: 0,
    bombs: 0,
    refreshes: 1, // Start with 1 friendly tray refresh in daily challenge
    activeMultiplier: 1,
    multiplierMovesLeft: 0,
  };

  if (typeof window === 'undefined') return initial;
  const dateKey = getTodayDateKey();
  try {
    const saved = localStorage.getItem(`blockblast_inventory_${dateKey}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }

  return initial;
}

export function saveDailyInventory(inv: PowerUpInventory): void {
  if (typeof window === 'undefined') return;
  const dateKey = getTodayDateKey();
  try {
    localStorage.setItem(`blockblast_inventory_${dateKey}`, JSON.stringify(inv));
  } catch {
    // ignore
  }
}
