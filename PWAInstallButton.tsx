/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide
  if (isInstalled) return null;

  // Android / Chrome / Edge flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/50 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        title="Install Block Blast to home screen for offline play"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/50 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xs rounded-2xl bg-[#0f172a] border border-slate-800 p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-sm">Install Block Blast on iOS</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <span className="block">1. Tap the <strong className="text-cyan-400 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</strong> icon in your Safari toolbar.</span>
                <span className="block">2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</span>
                <span className="block text-slate-400 text-[11px] pt-1">
                  You can now launch and play Block Blast offline anytime without WiFi!
                </span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
