import React from 'react';
import { GridCell, Piece, BoardTheme } from '../types/game';
import { GridBlockCell } from './BlockPiece';
import { BOARD_THEMES, STATIC_THEME_PARTICLES } from '../utils/themes';

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
  theme?: BoardTheme;
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
  theme = 'midnight',
}) => {
  const themeConfig = BOARD_THEMES[theme] || BOARD_THEMES.midnight;

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
      className={`relative p-2.5 sm:p-3 rounded-2xl ${themeConfig.boardBg} border ${themeConfig.boardBorder} ${themeConfig.boardShadow} select-none touch-none transition-all duration-300 ${
        shake ? 'animate-shake' : ''
      }`}
      style={{
        maxWidth: '100%',
        width: 'min(92vw, 420px)',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Subtle Ambient Gradient Layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{
          background: themeConfig.ambientGrad,
        }}
      />

      {/* Subtle Theme Floating Particles Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        {STATIC_THEME_PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${themeConfig.particleClass} pointer-events-none`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: themeConfig.particleColor,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle outer glow on combo or highlight */}
      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
          highlightedRows.length > 0 || highlightedCols.length > 0
            ? `opacity-100 ring-2 ${themeConfig.highlightGlow}`
            : 'opacity-0'
        }`}
      />

      {/* 8x8 Grid */}
      <div className="relative z-10 grid grid-cols-8 grid-rows-8 gap-1 sm:gap-1.5 w-full h-full">
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
                    boardTheme={theme}
                  />
                ) : (
                  <GridBlockCell
                    colorKey={cell?.colorKey}
                    hasGem={cell?.hasGem}
                    clearing={cell?.clearing}
                    isHighlighted={isLit}
                    boardTheme={theme}
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

