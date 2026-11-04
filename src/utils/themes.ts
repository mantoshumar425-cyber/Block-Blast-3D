/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoardTheme } from '../types/game';

export interface ThemeParticle {
  id: number;
  left: number; // percentage 0-100
  top: number; // percentage 0-100
  size: number; // px 3-8
  delay: number; // seconds
  duration: number; // seconds
  opacity: number;
}

export interface ThemeConfig {
  id: BoardTheme;
  name: string;
  tagline: string;
  accentColor: string;
  previewGradient: string;
  boardBg: string;
  boardBorder: string;
  boardShadow: string;
  cellEmptyBg: string;
  cellEmptyBorder: string;
  cellDotColor: string;
  highlightGlow: string;
  ringGlow: string;
  particleClass: string;
  particleColor: string;
  ambientGrad: string;
}

export const BOARD_THEMES: Record<BoardTheme, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Deep obsidian & sapphire starlight',
    accentColor: '#38bdf8',
    previewGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    boardBg: 'bg-[#0b101c]/95',
    boardBorder: 'border-slate-800/90',
    boardShadow: 'shadow-[0_14px_45px_rgba(2,132,199,0.22)]',
    cellEmptyBg: 'bg-[#121927]',
    cellEmptyBorder: 'border-[#1b263b]/70',
    cellDotColor: 'bg-cyan-500/25',
    highlightGlow: 'ring-cyan-400/80 shadow-[0_0_24px_rgba(6,182,212,0.4)]',
    ringGlow: 'ring-cyan-400',
    particleClass: 'animate-float-starlight',
    particleColor: 'rgba(56, 189, 248, 0.75)',
    ambientGrad: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
  },
  neon: {
    id: 'neon',
    name: 'Neon Cyber',
    tagline: 'Electric violet & hot magenta motes',
    accentColor: '#e879f9',
    previewGradient: 'from-fuchsia-600 via-purple-700 to-slate-950',
    boardBg: 'bg-[#0f071a]/95',
    boardBorder: 'border-fuchsia-900/60',
    boardShadow: 'shadow-[0_14px_45px_rgba(217,70,239,0.28)]',
    cellEmptyBg: 'bg-[#1a0e2e]',
    cellEmptyBorder: 'border-[#331852]/80',
    cellDotColor: 'bg-fuchsia-500/35',
    highlightGlow: 'ring-fuchsia-400/80 shadow-[0_0_24px_rgba(217,70,239,0.5)]',
    ringGlow: 'ring-fuchsia-400',
    particleClass: 'animate-float-neon',
    particleColor: 'rgba(232, 121, 249, 0.8)',
    ambientGrad: 'radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.14) 0%, transparent 70%)',
  },
  solar: {
    id: 'solar',
    name: 'Solar Amber',
    tagline: 'Molten bronze & floating embers',
    accentColor: '#fbbf24',
    previewGradient: 'from-amber-500 via-orange-600 to-stone-900',
    boardBg: 'bg-[#160c07]/95',
    boardBorder: 'border-amber-950/80',
    boardShadow: 'shadow-[0_14px_45px_rgba(245,158,11,0.28)]',
    cellEmptyBg: 'bg-[#24130a]',
    cellEmptyBorder: 'border-[#422110]/80',
    cellDotColor: 'bg-amber-500/35',
    highlightGlow: 'ring-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.5)]',
    ringGlow: 'ring-amber-400',
    particleClass: 'animate-float-ember',
    particleColor: 'rgba(245, 158, 11, 0.85)',
    ambientGrad: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.14) 0%, transparent 70%)',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Grove',
    tagline: 'Deep jade & bioluminescent fireflies',
    accentColor: '#34d399',
    previewGradient: 'from-emerald-500 via-teal-700 to-zinc-950',
    boardBg: 'bg-[#06140d]/95',
    boardBorder: 'border-emerald-950/80',
    boardShadow: 'shadow-[0_14px_45px_rgba(16,185,129,0.28)]',
    cellEmptyBg: 'bg-[#0c2417]',
    cellEmptyBorder: 'border-[#17462c]/80',
    cellDotColor: 'bg-emerald-500/35',
    highlightGlow: 'ring-emerald-400/80 shadow-[0_0_24px_rgba(16,185,129,0.5)]',
    ringGlow: 'ring-emerald-400',
    particleClass: 'animate-float-firefly',
    particleColor: 'rgba(52, 211, 153, 0.85)',
    ambientGrad: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
  },
};

// 12 deterministic floating particle positions inside GameBoard
export const STATIC_THEME_PARTICLES: ThemeParticle[] = [
  { id: 1, left: 12, top: 22, size: 4, delay: 0, duration: 4.5, opacity: 0.6 },
  { id: 2, left: 82, top: 18, size: 5, delay: 0.8, duration: 5.2, opacity: 0.75 },
  { id: 3, left: 34, top: 76, size: 3, delay: 1.5, duration: 4.8, opacity: 0.5 },
  { id: 4, left: 68, top: 84, size: 6, delay: 2.1, duration: 6.0, opacity: 0.7 },
  { id: 5, left: 20, top: 52, size: 3.5, delay: 0.4, duration: 5.0, opacity: 0.65 },
  { id: 6, left: 88, top: 58, size: 4.5, delay: 1.8, duration: 4.2, opacity: 0.6 },
  { id: 7, left: 50, top: 30, size: 5, delay: 2.7, duration: 5.5, opacity: 0.8 },
  { id: 8, left: 45, top: 90, size: 4, delay: 1.1, duration: 4.9, opacity: 0.55 },
  { id: 9, left: 74, top: 38, size: 3, delay: 0.6, duration: 5.7, opacity: 0.65 },
  { id: 10, left: 28, top: 12, size: 4, delay: 2.3, duration: 4.4, opacity: 0.7 },
  { id: 11, left: 60, top: 65, size: 3.5, delay: 1.9, duration: 5.3, opacity: 0.6 },
  { id: 12, left: 15, top: 88, size: 5, delay: 3.0, duration: 6.2, opacity: 0.75 },
];

export function getSavedTheme(): BoardTheme {
  if (typeof window === 'undefined') return 'midnight';
  try {
    const saved = localStorage.getItem('blockblast_board_theme') as BoardTheme;
    if (saved && BOARD_THEMES[saved]) {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'midnight';
}

export function saveTheme(theme: BoardTheme): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('blockblast_board_theme', theme);
    } catch {
      // fallback
    }
  }
}
