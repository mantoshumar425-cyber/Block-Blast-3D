/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScorePopup } from '../types/game';

interface ScorePopupsProps {
  popups: ScorePopup[];
}

export const ScorePopups: React.FC<ScorePopupsProps> = ({ popups }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 animate-float-fade"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
          }}
        >
          {/* Main Points Banner */}
          <div
            className={`font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center ${
              popup.isCombo
                ? 'text-4xl text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] scale-110'
                : 'text-3xl text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]'
            }`}
          >
            +{popup.points}
          </div>

          {/* Subtitle (e.g., COMBO x2!, TRIPLE BLAST!) */}
          {popup.text && (
            <div
              className={`text-sm font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                popup.isCombo
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
              }`}
            >
              {popup.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
