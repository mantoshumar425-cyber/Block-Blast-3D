/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockColorKey } from './game';

export type MissionTaskType =
  | 'clear_lines_single'
  | 'clear_color_blocks'
  | 'reach_combo'
  | 'clear_total_lines';

export type MissionRewardType =
  | 'multiplier'
  | 'hammer'
  | 'bomb'
  | 'refresh';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  taskType: MissionTaskType;
  target: number;
  current: number;
  isCompleted: boolean;
  rewardType: MissionRewardType;
  rewardLabel: string;
  colorKey?: BlockColorKey;
}

export interface PowerUpInventory {
  hammers: number;
  bombs: number;
  refreshes: number;
  activeMultiplier: number;
  multiplierMovesLeft: number;
}
