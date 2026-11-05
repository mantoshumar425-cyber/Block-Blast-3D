/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BlockColorKey =
  | 'cyan'
  | 'amber'
  | 'emerald'
  | 'purple'
  | 'rose'
  | 'blue'
  | 'yellow';

export type BlockType = 'standard' | 'diamond' | 'neon' | 'star';
export type BlockVisualTheme = 'diamond' | 'classic' | 'neon' | 'glass';

export interface GridCell {
  colorKey: BlockColorKey;
  id: string;
  hasGem?: boolean;
  blockType?: BlockType;
  clearing?: boolean;
  clearingColor?: string;
}

export interface Piece {
  id: string;
  shape: boolean[][];
  colorKey: BlockColorKey;
  width: number;
  height: number;
  blockCount: number;
  blockTypes?: BlockType[][];
}

export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';
export type GameMode = 'classic' | 'adventure' | 'daily';

export interface ScorePopup {
  id: string;
  text: string;
  points: number;
  x: number;
  y: number;
  isCombo?: boolean;
  color?: string;
}

export interface AdventureLevel {
  id: number;
  name: string;
  targetGems: number;
  targetScore: number;
  initialBoard: (BlockColorKey | 'gem' | null)[][];
}

export interface DailyScoreEntry {
  id: string;
  name: string;
  score: number;
  date: string;
  isUser?: boolean;
}

export type SlidebarTab =
  | 'menu'
  | 'leaderboard'
  | 'achievement'
  | 'awards'
  | 'help'
  | 'about'
  | 'privacy_rights'
  | 'privacy_preference';

export type BoardTheme = 'sky_blue' | 'midnight' | 'neon' | 'solar' | 'emerald';

