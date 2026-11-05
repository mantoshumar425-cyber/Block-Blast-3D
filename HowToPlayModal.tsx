/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, Flame, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">How to Play</h2>
              <p className="text-xs text-slate-400">Rules & Master Strategy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-4 space-y-4 text-xs text-slate-300">
          <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">Drag Blocks onto the 8x8 Board</div>
              <p className="text-slate-400 leading-relaxed">
                Choose from the 3 polyomino pieces at the bottom. Drag with your mouse or finger, or click a piece to select it then click any cell on the board.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">Clear Rows & Columns</div>
              <p className="text-slate-400 leading-relaxed">
                Fill any complete horizontal row or vertical column of 8 blocks to blast them away! When you blast multiple lines simultaneously, you earn exponential bonus points.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5 flex items-center gap-1.5">
                <span>Chain Consecutive Combos</span>
                <Flame className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-slate-400 leading-relaxed">
                Every consecutive move that clears at least one line raises your Combo Multiplier (x2, x3, x4...) granting massive score boosts!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </div>
            <div>
              <div className="font-bold text-white text-sm mb-0.5">Keep Space Open</div>
              <p className="text-slate-400 leading-relaxed">
                Always leave room for large 3x3 squares and 5-block lines. The game ends when no available pieces can fit on the board!
              </p>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-cyan-800/40">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300 text-xs mb-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pro Strategy Tips</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li>Place blocks near the corners and edges to keep the center flexible.</li>
              <li>Hover a piece to see glowing line anticipation indicators before dropping.</li>
              <li>You can play completely offline anytime — no WiFi or data needed!</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md cursor-pointer text-sm"
        >
          Got It, Let&apos;s Play!
        </button>
      </div>
    </div>
  );
};
