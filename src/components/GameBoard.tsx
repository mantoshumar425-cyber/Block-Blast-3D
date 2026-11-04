/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { GridCell, Piece } from '../types/game';
import { GridBlockCell } from './BlockPiece';

interface GameBoardProps {
  grid: (GridCell | null)[][];
  activePiece: Piece | null;
  hoverPos: { row: number; col: number } | null;
  isValidHover: boolean;
  highlightedRows: number[];
  highlightedCols: number[];
  onCellClick: (row: number, col: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
  shake: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  activePiece,
  hoverPos,
  isValidHover,
  highlightedRows,
  highlightedCols,
  onCellClick,
  boardRef,
  shake,
}) => {
  const gridSize = grid.length;

  // Build a lookup for ghost cells
  const isGhostCell = (r: number, c: number): boolean => {
    if (!activePiece || !hoverPos || !isValidHover) return false;
    const pieceR = r - hoverPos.row;
    const pieceC = c - hoverPos.col;
    if (
      pieceR >= 0 &&
      pieceR < activePiece.shape.length &&
      pieceC >= 0 &&
      pieceC < activePiece.shape[0].length
    ) {
      return activePiece.shape[pieceR][pieceC];
    }
    return false;
  };

  return (
    <div
      ref={boardRef}
      className={`relative p-2.5 sm:p-3 rounded-2xl bg-[#0b101c]/90 border border-slate-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.7)] select-none touch-none transition-transform duration-75 ${
        shake ? 'animate-shake' : ''
      }`}
      style={{
        maxWidth: '100%',
        width: 'min(92vw, 420px)',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Subtle outer glow on combo or highlight */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          highlightedRows.length > 0 || highlightedCols.length > 0
            ? 'opacity-100 ring-2 ring-cyan-400/80 shadow-[0_0_24px_rgba(6,182,212,0.4)]'
            : 'opacity-0'
        }`}
      />

      {/* 8x8 Grid */}
      <div className="grid grid-cols-8 grid-rows-8 gap-1 sm:gap-1.5 w-full h-full">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const ghost = isGhostCell(r, c);
            const isRowLit = highlightedRows.includes(r);
            const isColLit = highlightedCols.includes(c);
            const isLit = isRowLit || isColLit;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className="relative w-full h-full flex items-center justify-center cursor-pointer transition-transform"
                data-row={r}
                data-col={c}
              >
                {ghost && activePiece ? (
                  <GridBlockCell
                    colorKey={activePiece.colorKey}
                    isGhost={true}
                  />
                ) : (
                  <GridBlockCell
                    colorKey={cell?.colorKey}
                    hasGem={cell?.hasGem}
                    clearing={cell?.clearing}
                    isHighlighted={isLit}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
