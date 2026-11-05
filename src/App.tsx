/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  GameMode,
  GridCell,
  Piece,
  ScorePopup,
} from './types/game';
import { sounds } from './utils/audio';
import {
  generatePieceBatch,
  createEmptyGrid,
  canPlacePiece,
  canPlacePieceAnywhere,
  hasAnyValidMove,
  getPotentialClears,
  calculatePlacementScore,
} from './utils/pieces';
import { ADVENTURE_LEVELS } from './utils/levels';
import { getTodayChallenge, markTodayChallengeComplete } from './utils/daily';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { GameBoard } from './components/GameBoard';
import { PieceTray } from './components/PieceTray';
import { BlockPiece } from './components/BlockPiece';
import { ParticleCanvas, ParticleTrigger } from './components/ParticleCanvas';
import { ScorePopups } from './components/ScorePopups';
import { SlidebarTab } from './types/game';
import { GameOverModal, PauseModal, VictoryModal } from './components/Modals';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatsModal } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { SlidebarDrawer } from './components/SlidebarDrawer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { submitDailyScore } from './utils/dailyLeaderboard';

const BLAST_BACKGROUNDS = [
  'radial-gradient(circle at 18% 22%, rgba(255, 0, 128, 0.30), transparent 42%), radial-gradient(circle at 82% 28%, rgba(0, 210, 255, 0.28), transparent 44%), radial-gradient(circle at 50% 85%, rgba(255, 210, 0, 0.22), transparent 48%), linear-gradient(135deg, #090e1b, #17102b, #071a26)',
  'radial-gradient(circle at 18% 22%, rgba(0, 255, 170, 0.30), transparent 42%), radial-gradient(circle at 82% 28%, rgba(150, 70, 255, 0.30), transparent 44%), radial-gradient(circle at 50% 85%, rgba(255, 90, 50, 0.24), transparent 48%), linear-gradient(135deg, #071820, #1a1030, #160b1b)',
  'radial-gradient(circle at 18% 22%, rgba(255, 70, 70, 0.30), transparent 42%), radial-gradient(circle at 82% 28%, rgba(60, 120, 255, 0.30), transparent 44%), radial-gradient(circle at 50% 85%, rgba(255, 0, 190, 0.22), transparent 48%), linear-gradient(135deg, #160b1b, #10152b, #071522)',
  'radial-gradient(circle at 18% 22%, rgba(255, 190, 0, 0.30), transparent 42%), radial-gradient(circle at 82% 28%, rgba(0, 230, 255, 0.28), transparent 44%), radial-gradient(circle at 50% 85%, rgba(120, 0, 255, 0.24), transparent 48%), linear-gradient(135deg, #111020, #071a2b, #1c1028)',
];

export default function App() {
  // Game state machine
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  // Scores
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blockblast_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);

  // Second chance revive (1x per run)
  const [canRevive, setCanRevive] = useState<boolean>(true);

  // Audio & Haptics settings
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getIsMuted());
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => sounds.getHapticsEnabled());
  const [musicVolume, setMusicVolume] = useState<number>(() => sounds.getMusicVolume());
  const [sfxVolume, setSfxVolume] = useState<number>(() => sounds.getSfxVolume());

  // Board and piece slots
  const [grid, setGrid] = useState<(GridCell | null)[][]>(() => createEmptyGrid(8));
  const [pieces, setPieces] = useState<(Piece | null)[]>([null, null, null]);

  // Adventure & Daily mode state
  const [adventureLevelIndex, setAdventureLevelIndex] = useState<number>(0);
  const [collectedGems, setCollectedGems] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [dailyRank, setDailyRank] = useState<number | null>(null);

  // Modals & Slidebar Drawer
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState<boolean>(false);
  const [slidebarInitialTab, setSlidebarInitialTab] = useState<SlidebarTab>('menu');

  // Dragging state
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);

  // Hover & Line highlight preview
  const [hoverPos, setHoverPos] = useState<{ row: number; col: number } | null>(null);
  const [isValidHover, setIsValidHover] = useState<boolean>(false);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  const [highlightedCols, setHighlightedCols] = useState<number[]>([]);

  // Juice & FX
  const [shake, setShake] = useState<boolean>(false);
  const [particleTriggers, setParticleTriggers] = useState<ParticleTrigger[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [blastBackgroundIndex, setBlastBackgroundIndex] = useState<number>(0);

  // References
  const boardRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const activePieceRef = useRef<Piece | null>(null);
  const dragPointerPosRef = useRef<{ x: number; y: number } | null>(null);

  // Sync high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewHigh(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('blockblast_highscore', String(score));
      }
    }
  }, [score, highScore]);

  // Check which pieces can fit on the current board
  const validityMap = pieces.map((p) => (p ? canPlacePieceAnywhere(grid, p.shape) : false));

  // Initialize a new game session
  const initGame = useCallback(
    (mode: GameMode, levelIdx: number = 0) => {
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setLinesClearedTotal(0);
      setIsNewHigh(false);
      setCanRevive(true);
      setDailyRank(null);
      setSelectedPieceIndex(null);
      setDraggingIndex(null);
      setHoverPos(null);
      setHighlightedRows([]);
      setHighlightedCols([]);

      // Career stats: increment games played
      if (typeof window !== 'undefined') {
        const games = parseInt(localStorage.getItem('blockblast_games_played') || '0', 10);
        localStorage.setItem('blockblast_games_played', String(games + 1));
      }

      if (mode === 'classic') {
        const emptyGrid = createEmptyGrid(8);
        setGrid(emptyGrid);
        setPieces(generatePieceBatch(emptyGrid));
      } else if (mode === 'daily') {
        const challenge = getTodayChallenge();
        setGrid(challenge.initialBoard);
        setPieces(generatePieceBatch(challenge.initialBoard));
      } else {
        // Adventure Level
        const level = ADVENTURE_LEVELS[levelIdx % ADVENTURE_LEVELS.length];
        const newGrid = createEmptyGrid(8);
        level.initialBoard.forEach((row, r) => {
          row.forEach((type, c) => {
            if (type === 'gem') {
              newGrid[r][c] = {
                id: `gem-${r}-${c}`,
                colorKey: 'purple',
                hasGem: true,
              };
            } else if (type !== null) {
              newGrid[r][c] = {
                id: `block-${r}-${c}`,
                colorKey: type,
              };
            }
          });
        });
        setGrid(newGrid);
        setCollectedGems(0);
        setAdventureLevelIndex(levelIdx);
        setPieces(generatePieceBatch(newGrid));
      }

      setGameState('PLAYING');
    },
    []
  );

  // Toggle audio
  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  // Toggle haptics
  const handleToggleHaptics = () => {
    const next = sounds.toggleHaptics();
    setHapticsEnabled(next);
  };

  // Music & SFX independent volume handlers
  const handleMusicVolumeChange = (vol: number) => {
    sounds.setMusicVolume(vol);
    setMusicVolume(vol);
  };

  const handleSfxVolumeChange = (vol: number) => {
    sounds.setSfxVolume(vol);
    setSfxVolume(vol);
  };

  // Open Slidebar Drawer
  const handleOpenSlidebar = (tab: SlidebarTab = 'menu') => {
    sounds.playClick();
    setSlidebarInitialTab(tab);
    setIsSlidebarOpen(true);
  };

  // Clear all data callback
  const handleResetAllData = () => {
    setHighScore(0);
    setScore(0);
    setDailyRank(null);
    initGame('classic', 0);
  };

  // Ambient music lifecycle: starts looping in 'PLAYING', ducks in 'PAUSED', stops in menus
  useEffect(() => {
    if (gameState === 'PLAYING') {
      sounds.startMusic();
    } else if (gameState === 'PAUSED') {
      sounds.pauseMusic();
    } else if (gameState === 'TITLE_MENU' || gameState === 'GAME_OVER' || gameState === 'VICTORY') {
      sounds.stopMusic();
    }

    return () => {
      // Cleanup on unmount
      sounds.stopMusic();
    };
  }, [gameState]);

  // Second Chance Blast
  const handleRevive = () => {
    setCanRevive(false);
    sounds.playPlace();
    sounds.triggerHaptic('blast');

    // Clear center 3x3: rows 2..4, cols 2..4
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (r >= 2 && r <= 5 && c >= 2 && c <= 5) {
          return null;
        }
        return cell;
      })
    );

    // Particle explosion at center
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const centerX = boardRect.left + boardRect.width / 2;
      const centerY = boardRect.top + boardRect.height / 2;
      setParticleTriggers([
        { x: centerX, y: centerY, color: '#f59e0b', count: 40, type: 'burst' },
        { x: centerX, y: centerY, color: '#38bdf8', type: 'ring' },
      ]);
    }

    setShake(true);
    setTimeout(() => setShake(false), 300);

    // Ensure remaining pieces can fit, or refresh tray
    let activePieces = pieces;
    if (!hasAnyValidMove(newGrid, activePieces)) {
      activePieces = generatePieceBatch(newGrid);
      setPieces(activePieces);
    }

    setGrid(newGrid);
    setGameState('PLAYING');
  };

  // Place piece logic
  const handlePlacePiece = useCallback(
    (pieceIndex: number, targetRow: number, targetCol: number) => {
      const piece = pieces[pieceIndex];
      if (!piece) return;

      if (!canPlacePiece(grid, piece.shape, targetRow, targetCol)) {
        return;
      }

      sounds.playPlace();
      sounds.triggerHaptic('place');

      // Place blocks on grid
      const newGrid = grid.map((row) => [...row]);
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            newGrid[targetRow + r][targetCol + c] = {
              id: `block-${Date.now()}-${r}-${c}`,
              colorKey: piece.colorKey,
            };
          }
        }
      }

      // Check lines completed
      const clears = getPotentialClears(grid, piece.shape, targetRow, targetCol);
      const totalClears = clears.rows.length + clears.cols.length;

      let nextCombo = 0;
      let scoreGained = 0;
      let multiplierLabel: string | undefined;

      if (totalClears > 0) {
        setBlastBackgroundIndex((prev) => (prev + 1) % BLAST_BACKGROUNDS.length);
        nextCombo = combo + 1;
        setCombo(nextCombo);
        setMaxCombo((prev) => {
          const updated = Math.max(prev, nextCombo);
          if (typeof window !== 'undefined') {
            const stored = parseInt(localStorage.getItem('blockblast_best_combo') || '0', 10);
            if (updated > stored) {
              localStorage.setItem('blockblast_best_combo', String(updated));
            }
          }
          return updated;
        });

        setLinesClearedTotal((prev) => {
          const updated = prev + totalClears;
          if (typeof window !== 'undefined') {
            const stored = parseInt(localStorage.getItem('blockblast_total_lines') || '0', 10);
            localStorage.setItem('blockblast_total_lines', String(stored + totalClears));
          }
          return updated;
        });

        sounds.playLineClear(totalClears, nextCombo);
        sounds.triggerHaptic('blast');

        if (nextCombo > 1) {
          sounds.playComboStreak(nextCombo);
        }

        // Screen shake
        setShake(true);
        setTimeout(() => setShake(false), 240);

        // Score calculation
        const scoreCalc = calculatePlacementScore(piece.blockCount, totalClears, nextCombo);
        scoreGained = scoreCalc.score;
        multiplierLabel = scoreCalc.multiplierText;

        // Visual particles along cleared rows and cols
        if (boardRef.current) {
          const boardRect = boardRef.current.getBoundingClientRect();
          const cellSize = boardRect.width / 8;
          const newTriggers: ParticleTrigger[] = [];
          let gemsBlasted = 0;

          // Rows
          clears.rows.forEach((r) => {
            const centerY = boardRect.top + (r + 0.5) * cellSize;
            for (let c = 0; c < 8; c++) {
              const cell = newGrid[r][c];
              if (cell?.hasGem) gemsBlasted++;
              const centerX = boardRect.left + (c + 0.5) * cellSize;
              newTriggers.push({
                x: centerX,
                y: centerY,
                color: cell ? (cell.colorKey === 'yellow' ? '#fde047' : '#38bdf8') : '#38bdf8',
                count: 12,
                type: cell?.hasGem ? 'gem' : 'burst',
              });
            }
            newTriggers.push({
              x: boardRect.left + boardRect.width / 2,
              y: centerY,
              color: '#38bdf8',
              type: 'ring',
            });
          });

          // Columns
          clears.cols.forEach((c) => {
            const centerX = boardRect.left + (c + 0.5) * cellSize;
            for (let r = 0; r < 8; r++) {
              const cell = newGrid[r][c];
              if (cell?.hasGem) gemsBlasted++;
              const centerY = boardRect.top + (r + 0.5) * cellSize;
              newTriggers.push({
                x: centerX,
                y: centerY,
                color: '#fbbf24',
                count: 12,
                type: cell?.hasGem ? 'gem' : 'burst',
              });
            }
            newTriggers.push({
              x: centerX,
              y: boardRect.top + boardRect.height / 2,
              color: '#fbbf24',
              type: 'ring',
            });
          });

          setParticleTriggers(newTriggers);

          // Adventure mode check
          if (gemsBlasted > 0 && gameMode === 'adventure') {
            setCollectedGems((prev) => {
              const updated = prev + gemsBlasted;
              const level = ADVENTURE_LEVELS[adventureLevelIndex % ADVENTURE_LEVELS.length];
              if (updated >= level.targetGems) {
                setTimeout(() => {
                  sounds.playLevelVictory();
                  setGameState('VICTORY');
                }, 400);
              }
              return updated;
            });
          }

          // Mark cells as clearing
          clears.rows.forEach((r) => {
            for (let c = 0; c < 8; c++) {
              if (newGrid[r][c]) {
                newGrid[r][c] = { ...newGrid[r][c]!, clearing: true };
              }
            }
          });
          clears.cols.forEach((c) => {
            for (let r = 0; r < 8; r++) {
              if (newGrid[r][c]) {
                newGrid[r][c] = { ...newGrid[r][c]!, clearing: true };
              }
            }
          });
        }

        // Floating score popup centered over board
        if (boardRef.current) {
          const boardRect = boardRef.current.getBoundingClientRect();
          const popup: ScorePopup = {
            id: `popup-${Date.now()}`,
            text: multiplierLabel || '',
            points: scoreGained,
            x: boardRect.left + boardRect.width / 2,
            y: boardRect.top + boardRect.height / 2,
            isCombo: nextCombo > 1,
          };
          setScorePopups((prev) => [...prev, popup]);
          setTimeout(() => {
            setScorePopups((prev) => prev.filter((p) => p.id !== popup.id));
          }, 1100);
        }
      } else {
        // No lines cleared: combo drops
        setCombo(0);
        scoreGained = piece.blockCount;
      }

      const newTotalScore = score + scoreGained;
      setScore(newTotalScore);

      // Daily mode victory check
      if (gameMode === 'daily') {
        const challenge = getTodayChallenge();
        if (newTotalScore >= challenge.targetScore && !challenge.isCompleted) {
          const updatedStreak = markTodayChallengeComplete();
          setDailyStreak(updatedStreak);
          const lbResult = submitDailyScore(newTotalScore);
          if (lbResult.isTop5) {
            setDailyRank(lbResult.rank);
          }
          setTimeout(() => {
            sounds.playLevelVictory();
            setGameState('VICTORY');
          }, 450);
        }
      }

      // Consume piece from tray
      const nextPieces = [...pieces];
      nextPieces[pieceIndex] = null;

      // Update grid with temporary clearing animations, then actually clear
      setGrid(newGrid);

      setTimeout(() => {
        const finalizedGrid = newGrid.map((row, r) =>
          row.map((cell, c) => {
            if (clears.rows.includes(r) || clears.cols.includes(c)) {
              return null;
            }
            return cell ? { ...cell, clearing: false } : null;
          })
        );
        setGrid(finalizedGrid);

        // Check if all 3 pieces are consumed
        let activePieces = nextPieces;
        if (nextPieces.every((p) => p === null)) {
          activePieces = generatePieceBatch(finalizedGrid);
          setPieces(activePieces);
        } else {
          setPieces(nextPieces);
        }

        // Check Game Over: can ANY remaining piece be placed anywhere?
        const canContinue = hasAnyValidMove(finalizedGrid, activePieces);
        if (!canContinue) {
          if (gameMode === 'daily') {
            const lbResult = submitDailyScore(newTotalScore);
            if (lbResult.isTop5) {
              setDailyRank(lbResult.rank);
            }
          }
          sounds.playGameOver();
          setGameState('GAME_OVER');
        }
      }, totalClears > 0 ? 180 : 0);

      // Reset selection and previews
      setSelectedPieceIndex(null);
      setDraggingIndex(null);
      setHoverPos(null);
      setHighlightedRows([]);
      setHighlightedCols([]);
    },
    [grid, pieces, combo, score, gameMode, adventureLevelIndex]
  );

  // Click on cell when a piece is selected
  const handleCellClick = (row: number, col: number) => {
    if (selectedPieceIndex !== null && pieces[selectedPieceIndex]) {
      handlePlacePiece(selectedPieceIndex, row, col);
    }
  };

  // Select piece from tray for click-to-place
  const handleSelectPiece = (index: number) => {
    if (draggingIndex !== null) return;
    if (selectedPieceIndex === index) {
      setSelectedPieceIndex(null);
      setHoverPos(null);
      setHighlightedRows([]);
      setHighlightedCols([]);
    } else {
      sounds.playClick();
      setSelectedPieceIndex(index);
    }
  };

  // P
