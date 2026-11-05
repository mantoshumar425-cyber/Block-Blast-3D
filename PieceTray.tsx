/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Piece } from '../types/game';
import { BlockPiece } from './BlockPiece';

interface PieceTrayProps {
  pieces: (Piece | null)[];
  selectedPieceIndex: number | null;
  draggingIndex: number | null;
  validityMap: boolean[]; // whether piece[i] can fit anywhere on board
  onSelectPiece: (index: number) => void;
  onPointerDownPiece: (index: number, e: React.PointerEvent) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  pieces,
  selectedPieceIndex,
  draggingIndex,
  validityMap,
  onSelectPiece,
  onPointerDownPiece,
}) => {
  return (
    <div className="w-full max-w-md flex items-center justify-around gap-2 px-2 py-3 bg-[#0d1322]/80 border border-slate-800/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {pieces.map((piece, idx) => {
        if (!piece) {
          // Empty slot after piece was placed
          return (
            <div
              key={idx}
              className="flex-1 min-w-[80px] h-24 rounded-xl border border-dashed border-slate-800/60 flex items-center justify-center opacity-30"
            >
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>
          );
        }

        const isDragging = draggingIndex === idx;
        const isSelected = selectedPieceIndex === idx;
        const canFit = validityMap[idx] ?? true;

        // Dynamic block size based on shape dimensions so large 5-block or 3x3 shapes fit nicely
        const maxDim = Math.max(piece.width, piece.height);
        const cellSize = maxDim >= 5 ? 14 : maxDim >= 4 ? 18 : maxDim >= 3 ? 22 : 26;

        return (
          <div
            key={piece.id}
            className={`flex-1 min-w-[80px] h-24 flex items-center justify-center p-1 rounded-xl transition-all duration-150 relative ${
              isSelected
                ? 'bg-slate-800/80 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'hover:bg-slate-800/40'
            }`}
          >
            {/* If currently dragging, leave a ghost placeholder */}
            {isDragging ? (
              <div className="opacity-20 scale-95 pointer-events-none">
                <BlockPiece
                  piece={piece}
                  cellSize={cellSize}
                  disabled={true}
                />
              </div>
            ) : (
              <BlockPiece
                piece={piece}
                cellSize={cellSize}
                disabled={!canFit}
                isSelected={isSelected}
                onClick={() => onSelectPiece(idx)}
                onPointerDown={(e) => onPointerDownPiece(idx, e)}
              />
            )}

            {!canFit && !isDragging && (
              <div className="absolute bottom-1 text-[9px] font-bold text-rose-400/80 uppercase tracking-wider pointer-events-none">
                No Room
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
