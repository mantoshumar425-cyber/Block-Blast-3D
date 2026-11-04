/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AdventureLevel, BlockColorKey } from '../types/game';

// Handcrafted adventure levels with trapped gems to blast
export const ADVENTURE_LEVELS: AdventureLevel[] = [
  {
    id: 1,
    name: 'Gem Sparkle',
    targetGems: 4,
    targetScore: 300,
    initialBoard: [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, 'cyan', 'gem', 'gem', 'cyan', null, null],
      [null, null, 'gem', null, null, 'gem', null, null],
      [null, null, 'cyan', null, null, 'cyan', null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ],
  },
  {
    id: 2,
    name: 'Emerald Cross',
    targetGems: 6,
    targetScore: 600,
    initialBoard: [
      [null, null, null, 'emerald', null, null, null, null],
      [null, null, null, 'gem', null, null, null, null],
      [null, null, null, 'gem', null, null, null, null],
      ['emerald', 'gem', 'gem', 'amber', 'gem', 'gem', 'emerald', null],
      [null, null, null, 'gem', null, null, null, null],
      [null, null, null, 'gem', null, null, null, null],
      [null, null, null, 'emerald', null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ],
  },
  {
    id: 3,
    name: 'Ruby Diamond',
    targetGems: 8,
    targetScore: 900,
    initialBoard: [
      [null, null, null, 'gem', null, null, null, null],
      [null, null, 'rose', null, 'rose', null, null, null],
      [null, 'gem', null, null, null, 'gem', null, null],
      ['rose', null, null, null, null, null, 'rose', null],
      [null, 'gem', null, null, null, 'gem', null, null],
      [null, null, 'rose', null, 'rose', null, null, null],
      [null, null, null, 'gem', null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ],
  },
  {
    id: 4,
    name: 'Crystal Fortress',
    targetGems: 8,
    targetScore: 1200,
    initialBoard: [
      ['blue', 'gem', 'blue', null, null, 'blue', 'gem', 'blue'],
      ['gem', null, null, null, null, null, null, 'gem'],
      ['blue', null, null, null, null, null, null, 'blue'],
      [null, null, null, 'gem', 'gem', null, null, null],
      [null, null, null, 'gem', 'gem', null, null, null],
      ['blue', null, null, null, null, null, null, 'blue'],
      ['gem', null, null, null, null, null, null, 'gem'],
      ['blue', 'gem', 'blue', null, null, 'blue', 'gem', 'blue'],
    ],
  },
  {
    id: 5,
    name: 'Solar Flare',
    targetGems: 10,
    targetScore: 1600,
    initialBoard: [
      [null, null, 'amber', 'amber', 'amber', 'amber', null, null],
      [null, 'gem', null, null, null, null, 'gem', null],
      ['amber', null, 'gem', null, null, 'gem', null, 'amber'],
      ['amber', null, null, 'gem', 'gem', null, null, 'amber'],
      ['amber', null, null, 'gem', 'gem', null, null, 'amber'],
      ['amber', null, 'gem', null, null, 'gem', null, 'amber'],
      [null, 'gem', null, null, null, null, 'gem', null],
      [null, null, 'amber', 'amber', 'amber', 'amber', null, null],
    ],
  },
  {
    id: 6,
    name: 'Neon Cascade',
    targetGems: 12,
    targetScore: 2000,
    initialBoard: [
      ['purple', 'gem', null, null, null, null, 'gem', 'purple'],
      ['gem', 'purple', 'gem', null, null, 'gem', 'purple', 'gem'],
      [null, 'gem', 'purple', null, null, 'purple', 'gem', null],
      [null, null, null, 'gem', 'gem', null, null, null],
      [null, null, null, 'gem', 'gem', null, null, null],
      [null, 'gem', 'purple', null, null, 'purple', 'gem', null],
      ['gem', 'purple', 'gem', null, null, 'gem', 'purple', 'gem'],
      ['purple', 'gem', null, null, null, null, 'gem', 'purple'],
    ],
  },
];
