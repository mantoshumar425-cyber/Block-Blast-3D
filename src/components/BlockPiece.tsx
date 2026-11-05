/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlockColorKey, Piece, BoardTheme } from '../types/game';
import { COLOR_THEMES } from '../utils/pieces';
import { BOARD_THEMES } from '../utils/themes';

interface BlockPieceProps {
  piece: Piece;
  cellSize?: number; // Size in px per grid block
  isDragging?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({
  piece,
  cellSize = 32,
  isDragging = false,
  isSelected = false,
  disabled = false,
  onClick,
  onPointerDown,
}) => {
  const theme = COLOR_THEMES[piece.colorKey];
  const gap = 3;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      onPointerDown={!disabled ? onPointerDown : undefined}
      className={`relative inline-flex flex-col select-none touch-none transition-transform duration-150 ${
        disabled
          ? 'opacity-35 cursor-not-allowed grayscale-[40%]'
          : 'cursor-grab active:cursor-grabbing hover:scale-105'
      } ${isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : ''} ${
        isDragging ? 'opacity-90 scale-105 pointer-events-none' : ''
      }`}
      style={{
        gap: `${gap}px`,
      }}
    >
      {piece.shape.map((row, r) => (
        <div key={r} className="flex" style={{ gap: `${gap}px` }}>
          {row.map((active, c) => {
            if (!active) {
              return (
                <div
                  key={c}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                  }}
                  className="invisible"
                />
              );
            }

            const blockType = piece.blockTypes?.[r]?.[c] || 'standard';

            return (
              <div
                key={c}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                className={`relative rounded-lg bg-gradient-to-br ${theme.gradient} ${theme.shadow} border-t border-l border-white/50 border-b border-r border-black/30 overflow-hidden transform-gpu`}
              >
                {/* 3D Top-left gloss sheen */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 bg-white/30 rounded-t-md pointer-events-none" />

                {/* Multiple block types preview in tray */}
                {blockType === 'diamond' ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[12px] sm:text-sm select-none drop-shadow-[0_0_6px_rgba(56,189,248,0.9)] animate-pulse">
                      💎
                    </span>
                  </div>
                ) : blockType === 'star' ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] sm:text-xs select-none drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]">
                      ⭐
                    </span>
                  </div>
                ) : (
                  /* Subtle core jewel dot */
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Render single isolated cell block on the grid
interface CellProps {
  colorKey?: BlockColorKey;
  hasGem?: boolean;
  blockType?: 'standard' | 'diamond' | 'neon' | 'star';
  clearing?: boolean;
  isGhost?: boolean;
  isHighlighted?: boolean;
  size?: number;
  boardTheme?: BoardTheme;
}

export const GridBlockCell: React.FC<CellProps> = ({
  colorKey,
  hasGem = false,
  blockType = 'standard',
  clearing = false,
  isGhost = false,
  isHighlighted = false,
  size,
  boardTheme = 'sky_blue',
}) => {
  const themeConfig = BOARD_THEMES[boardTheme] || BOARD_THEMES.sky_blue;

  if (!colorKey) {
    // Empty cell slot themed
    return (
      <div
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        className={`w-full h-full rounded-lg transition-colors duration-150 flex items-center justify-center ${
          isHighlighted
            ? `${themeConfig.cellEmptyBg} ring-2 ${themeConfig.ringGlow} shadow-[inset_0_0_12px_rgba(255,255,255,0.25)]`
            : `${themeConfig.cellEmptyBg} border ${themeConfig.cellEmptyBorder} shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]`
        }`}
      >
        <div className={`w-1 h-1 rounded-full ${themeConfig.cellDotColor}`} />
      </div>
    );
  }

  const pieceColorTheme = COLOR_THEMES[colorKey];

  if (isGhost) {
    return (
      <div
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        className={`w-full h-full rounded-lg bg-gradient-to-br ${pieceColorTheme.gradient} opacity-60 ring-2 ring-white/80 animate-pulse flex items-center justify-center`}
      >
        <div className="w-2 h-2 rounded-full bg-white/80" />
      </div>
    );
  }

  const isDiamond = hasGem || blockType === 'diamond';
  const isStar = blockType === 'star';
  const isNeon = blockType === 'neon';

  return (
    <div
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      className={`relative w-full h-full rounded-lg overflow-hidden transition-all transform-gpu ${
        clearing
          ? 'scale-115 bg-gradient-to-r from-sky-300 via-teal-200 to-amber-200 shadow-[0_0_24px_rgba(56,189,248,1)] ring-4 ring-cyan-200 animate-ping duration-300'
          : `bg-gradient-to-br ${pieceColorTheme.gradient} ${pieceColorTheme.shadow} border-t border-l border-white/60 border-b border-r border-black/40 ${
              isHighlighted ? 'brightness-125 ring-2 ring-white' : 'hover:brightness-110'
            }`
      }`}
    >
      {/* Top gloss sheen */}
      <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 bg-white/35 rounded-t-md pointer-events-none" />

      {/* Multiple Block Types & 💎 Diamond Emoji Rendering */}
      {isDiamond ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg select-none drop-shadow-[0_0_10px_rgba(56,189,248,1)] animate-pulse">
            💎
          </span>
        </div>
      ) : isStar ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm sm:text-base select-none drop-shadow-[0_0_8px_rgba(251,191,36,1)] animate-bounce">
            ⭐
          </span>
        </div>
      ) : isNeon ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-300 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
        </div>
      ) : (
        /* Standard core highlight */
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-white/50 blur-[0.5px]" />
        </div>
      )}
    </div>
  );
};
