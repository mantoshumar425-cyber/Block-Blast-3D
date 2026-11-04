/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockColorKey, GridCell, Piece } from '../types/game';

export interface ColorTheme {
  primary: string;
  gradient: string;
  border: string;
  shadow: string;
  glow: string;
  gem: string;
}

export const COLOR_THEMES: Record<BlockColorKey, ColorTheme> = {
  cyan: {
    primary: '#06b6d4',
    gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
    border: 'border-cyan-300',
    shadow: 'shadow-[0_3px_10px_rgba(6,182,212,0.4)]',
    glow: 'rgba(6, 182, 212, 0.8)',
    gem: '#22d3ee',
  },
  amber: {
    primary: '#f59e0b',
    gradient: 'from-amber-300 via-amber-500 to-amber-600',
    border: 'border-amber-200',
    shadow: 'shadow-[0_3px_10px_rgba(245,158,11,0.4)]',
    glow: 'rgba(245, 158, 11, 0.8)',
    gem: '#fde047',
  },
  emerald: {
    primary: '#10b981',
    gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
    border: 'border-emerald-200',
    shadow: 'shadow-[0_3px_10px_rgba(16,185,129,0.4)]',
    glow: 'rgba(16, 185, 129, 0.8)',
    gem: '#34d399',
  },
  purple: {
    primary: '#a855f7',
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    border: 'border-purple-200',
    shadow: 'shadow-[0_3px_10px_rgba(168,85,247,0.4)]',
    glow: 'rgba(168, 85, 247, 0.8)',
    gem: '#c084fc',
  },
  rose: {
    primary: '#f43f5e',
    gradient: 'from-rose-400 via-rose-500 to-rose-600',
    border: 'border-rose-200',
    shadow: 'shadow-[0_3px_10px_rgba(244,63,94,0.4)]',
    glow: 'rgba(244, 63, 94, 0.8)',
    gem: '#fb7185',
  },
  blue: {
    primary: '#3b82f6',
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    border: 'border-blue-200',
    shadow: 'shadow-[0_3px_10px_rgba(59,130,246,0.4)]',
    glow: 'rgba(59, 130, 246, 0.8)',
    gem: '#60a5fa',
  },
  yellow: {
    primary: '#eab308',
    gradient: 'from-yellow-300 via-yellow-400 to-yellow-500',
    border: 'border-yellow-100',
    shadow: 'shadow-[0_3px_10px_rgba(234,179,8,0.4)]',
    glow: 'rgba(234, 179, 8, 0.8)',
    gem: '#fef08a',
  },
};

const COLOR_KEYS: BlockColorKey[] = ['cyan', 'amber', 'emerald', 'purple', 'rose', 'blue', 'yellow'];

// Catalog of Polyomino shapes
interface ShapeDef {
  shape: boolean[][];
  colorKey: BlockColorKey;
  weight: number; // Higher = more common
}

export const SHAPES_CATALOG: ShapeDef[] = [
  // 1x1 dot
  { shape: [[true]], colorKey: 'yellow', weight: 4 },

  // Lines 2
  { shape: [[true, true]], colorKey: 'cyan', weight: 4 },
  { shape: [[true], [true]], colorKey: 'cyan', weight: 4 },

  // Lines 3
  { shape: [[true, true, true]], colorKey: 'blue', weight: 5 },
  { shape: [[true], [true], [true]], colorKey: 'blue', weight: 5 },

  // Lines 4
  { shape: [[true, true, true, true]], colorKey: 'purple', weight: 4 },
  { shape: [[true], [true], [true], [true]], colorKey: 'purple', weight: 4 },

  // Lines 5
  { shape: [[true, true, true, true, true]], colorKey: 'rose', weight: 3 },
  { shape: [[true], [true], [true], [true], [true]], colorKey: 'rose', weight: 3 },

  // Squares
  {
    shape: [
      [true, true],
      [true, true],
    ],
    colorKey: 'amber',
    weight: 5,
  },
  {
    shape: [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ],
    colorKey: 'rose',
    weight: 2,
  },

  // Small Corner (2x2 tromino)
  {
    shape: [
      [true, true],
      [true, false],
    ],
    colorKey: 'emerald',
    weight: 4,
  },
  {
    shape: [
      [true, true],
      [false, true],
    ],
    colorKey: 'emerald',
    weight: 4,
  },
  {
    shape: [
      [true, false],
      [true, true],
    ],
    colorKey: 'emerald',
    weight: 4,
  },
  {
    shape: [
      [false, true],
      [true, true],
    ],
    colorKey: 'emerald',
    weight: 4,
  },

  // L-Shapes (3x2)
  {
    shape: [
      [true, false],
      [true, false],
      [true, true],
    ],
    colorKey: 'amber',
    weight: 3,
  },
  {
    shape: [
      [false, true],
      [false, true],
      [true, true],
    ],
    colorKey: 'amber',
    weight: 3,
  },
  {
    shape: [
      [true, true],
      [true, false],
      [true, false],
    ],
    colorKey: 'amber',
    weight: 3,
  },
  {
    shape: [
      [true, true],
      [false, true],
      [false, true],
    ],
    colorKey: 'amber',
    weight: 3,
  },

  // L-Shapes horizontal (2x3)
  {
    shape: [
      [true, true, true],
      [true, false, false],
    ],
    colorKey: 'blue',
    weight: 3,
  },
  {
    shape: [
      [true, true, true],
      [false, false, true],
    ],
    colorKey: 'blue',
    weight: 3,
  },
  {
    shape: [
      [true, false, false],
      [true, true, true],
    ],
    colorKey: 'blue',
    weight: 3,
  },
  {
    shape: [
      [false, false, true],
      [true, true, true],
    ],
    colorKey: 'blue',
    weight: 3,
  },

  // T-Shapes
  {
    shape: [
      [true, true, true],
      [false, true, false],
    ],
    colorKey: 'purple',
    weight: 3,
  },
  {
    shape: [
      [false, true, false],
      [true, true, true],
    ],
    colorKey: 'purple',
    weight: 3,
  },
  {
    shape: [
      [true, false],
      [true, true],
      [true, false],
    ],
    colorKey: 'purple',
    weight: 3,
  },
  {
    shape: [
      [false, true],
      [true, true],
      [false, true],
    ],
    colorKey: 'purple',
    weight: 3,
  },

  // Z / S Shapes
  {
    shape: [
      [true, true, false],
      [false, true, true],
    ],
    colorKey: 'rose',
    weight: 3,
  },
  {
    shape: [
      [false, true, true],
      [true, true, false],
    ],
    colorKey: 'rose',
    weight: 3,
  },
  {
    shape: [
      [true, false],
      [true, true],
      [false, true],
    ],
    colorKey: 'rose',
    weight: 3,
  },
  {
    shape: [
      [false, true],
      [true, true],
      [true, false],
    ],
    colorKey: 'rose',
    weight: 3,
  },

  // Big L-Shapes (3x3)
  {
    shape: [
      [true, false, false],
      [true, false, false],
      [true, true, true],
    ],
    colorKey: 'cyan',
    weight: 2,
  },
  {
    shape: [
      [false, false, true],
      [false, false, true],
      [true, true, true],
    ],
    colorKey: 'cyan',
    weight: 2,
  },
  {
    shape: [
      [true, true, true],
      [true, false, false],
      [true, false, false],
    ],
    colorKey: 'cyan',
    weight: 2,
  },
  {
    shape: [
      [true, true, true],
      [false, false, true],
      [false, false, true],
    ],
    colorKey: 'cyan',
    weight: 2,
  },
];

// Helper to count active blocks in a shape
export function countBlocks(shape: boolean[][]): number {
  let count = 0;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) count++;
    }
  }
  return count;
}

// Generate single piece
export function createPieceFromShape(def: ShapeDef): Piece {
  const height = def.shape.length;
  const width = def.shape[0].length;
  return {
    id: `piece-${Math.random().toString(36).substring(2, 9)}`,
    shape: def.shape,
    colorKey: def.colorKey,
    width,
    height,
    blockCount: countBlocks(def.shape),
  };
}

// Weighted selection of pieces
export function generatePieceBatch(grid?: (GridCell | null)[][]): Piece[] {
  // Total weight
  const totalWeight = SHAPES_CATALOG.reduce((acc, item) => acc + item.weight, 0);

  const getOne = (): Piece => {
    let rand = Math.random() * totalWeight;
    for (const item of SHAPES_CATALOG) {
      if (rand < item.weight) {
        // Randomly assign a fresh vivid color
        const colorKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
        return createPieceFromShape({ ...item, colorKey });
      }
      rand -= item.weight;
    }
    return createPieceFromShape(SHAPES_CATALOG[0]);
  };

  const batch: Piece[] = [getOne(), getOne(), getOne()];

  // If a grid was passed, check that at least one of the 3 pieces can fit,
  // to avoid instant unfair game overs on round 1 or 2
  if (grid) {
    let canFitAny = batch.some((p) => canPlacePieceAnywhere(grid, p.shape));
    let attempts = 0;
    while (!canFitAny && attempts < 15) {
      attempts++;
      // Replace the 3rd piece with a small shape (1x1, 1x2, or 2x2)
      const smaller = SHAPES_CATALOG.slice(0, 7);
      const chosen = smaller[Math.floor(Math.random() * smaller.length)];
      batch[2] = createPieceFromShape({
        ...chosen,
        colorKey: COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
      });
      canFitAny = batch.some((p) => canPlacePieceAnywhere(grid, p.shape));
    }
  }

  return batch;
}

// Check if a piece can be placed at specific (row, col)
export function canPlacePiece(
  grid: (GridCell | null)[][],
  shape: boolean[][],
  row: number,
  col: number
): boolean {
  const gridRows = grid.length;
  const gridCols = grid[0].length;
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;

  if (row < 0 || col < 0 || row + shapeRows > gridRows || col + shapeCols > gridCols) {
    return false;
  }

  for (let r = 0; r < shapeRows; r++) {
    for (let c = 0; c < shapeCols; c++) {
      if (shape[r][c]) {
        if (grid[row + r][col + c] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check if a piece shape can fit ANYWHERE on the board
export function canPlacePieceAnywhere(
  grid: (GridCell | null)[][],
  shape: boolean[][]
): boolean {
  const gridRows = grid.length;
  const gridCols = grid[0].length;
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;

  for (let r = 0; r <= gridRows - shapeRows; r++) {
    for (let c = 0; c <= gridCols - shapeCols; c++) {
      if (canPlacePiece(grid, shape, r, c)) {
        return true;
      }
    }
  }
  return false;
}

// Check if player has any moves remaining among available pieces
export function hasAnyValidMove(
  grid: (GridCell | null)[][],
  pieces: (Piece | null)[]
): boolean {
  for (const piece of pieces) {
    if (!piece) continue;
    if (canPlacePieceAnywhere(grid, piece.shape)) {
      return true;
    }
  }
  return false;
}

// Calculate which rows and cols WOULD BE CLEARED if the piece were placed at (row, col)
export function getPotentialClears(
  grid: (GridCell | null)[][],
  shape: boolean[][],
  row: number,
  col: number
): { rows: number[]; cols: number[] } {
  const gridRows = grid.length;
  const gridCols = grid[0].length;
  const shapeRows = shape.length;
  const shapeCols = shape[0].length;

  // Clone virtual occupancy
  const virtualOccupied: boolean[][] = Array.from({ length: gridRows }, (_, r) =>
    Array.from({ length: gridCols }, (_, c) => grid[r][c] !== null)
  );

  for (let r = 0; r < shapeRows; r++) {
    for (let c = 0; c < shapeCols; c++) {
      if (shape[r][c]) {
        const targetR = row + r;
        const targetC = col + c;
        if (targetR >= 0 && targetR < gridRows && targetC >= 0 && targetC < gridCols) {
          virtualOccupied[targetR][targetC] = true;
        }
      }
    }
  }

  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];

  // Check full rows
  for (let r = 0; r < gridRows; r++) {
    if (virtualOccupied[r].every((cell) => cell)) {
      rowsToClear.push(r);
    }
  }

  // Check full columns
  for (let c = 0; c < gridCols; c++) {
    let colFull = true;
    for (let r = 0; r < gridRows; r++) {
      if (!virtualOccupied[r][c]) {
        colFull = false;
        break;
      }
    }
    if (colFull) {
      colsToClear.push(c);
    }
  }

  return { rows: rowsToClear, cols: colsToClear };
}

// Create an empty 8x8 grid
export function createEmptyGrid(size: number = 8): (GridCell | null)[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

// Calculate score for a placement
export function calculatePlacementScore(
  blockCount: number,
  clearedLinesCount: number,
  comboCount: number
): { score: number; multiplierText?: string } {
  let score = blockCount; // Base points for dropped blocks

  if (clearedLinesCount > 0) {
    // Multi-line bonus: 1 line = 100, 2 = 300, 3 = 600, 4 = 1000, 5 = 1500, etc.
    const lineBonus = (clearedLinesCount * (clearedLinesCount + 1) * 50);
    // Combo multiplier: combo 1 = x1, combo 2 = x1.5, combo 3 = x2, etc.
    const comboMultiplier = 1 + (comboCount - 1) * 0.5;
    const lineTotal = Math.round(lineBonus * comboMultiplier);
    score += lineTotal;

    let multiplierText: string | undefined;
    if (comboCount > 1) {
      multiplierText = `COMBO x${comboCount}!`;
    } else if (clearedLinesCount >= 3) {
      multiplierText = `${clearedLinesCount} LINES BLAST!`;
    } else if (clearedLinesCount === 2) {
      multiplierText = 'DOUBLE BLAST!';
    } else {
      multiplierText = 'LINE BLAST!';
    }

    return { score, multiplierText };
  }

  return { score };
}
