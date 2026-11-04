/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Volume2, Music, Vibrate, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
  musicVolume: number;
  onMusicVolumeChange: (val: number) => void;
  sfxVolume: number;
  onSfxVolumeChange: (val: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  musicVolume,
  onMusicVolumeChange,
  sfxVolume,
  onSfxVolumeChange,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Audio & Settings</h2>
              <p className="text-xs text-slate-400">Ambient Music & FX Controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Mute Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <div>
              <div className="text-xs font-bold text-white">Sound Output</div>
              <div className="text-[10px] text-slate-400">{isMuted ? 'All audio muted' : 'Audio enabled'}</div>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isMuted
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
            }`}
          >
            {isMuted ? 'Unmute' : 'Mute All'}
          </button>
        </div>

        {/* Ambient Background Music Slider */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Ambient Music</span>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Tranquil background pad and raindrops loop while playing.
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Sound Effects Slider */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Sound Effects (SFX)</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
              {Math.round(sfxVolume * 100)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Block placements, line blasts, and combo chime chords.
          </p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Haptics Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Vibrate className={`w-4 h-4 ${hapticsEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-bold text-white">Haptic Vibration</div>
              <div className="text-[10px] text-slate-400">Tactile buzz on touch devices</div>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onToggleHaptics();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hapticsEnabled
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {hapticsEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};
