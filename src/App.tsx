
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
  BoardTheme,
} from './types/game';
import { sounds } from './utils/audio';
import { getSavedTheme, saveTheme } from './utils/themes';
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
  'radial-gradient(ellipse at 15% 20%, rgba(14, 165, 233, 0.75) 0%, transparent 50%), radial-gradient(ellipse at 85% 18%, rgba(20, 184, 166, 0.70) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(6, 182, 212, 0.60) 0%, transparent 55%), linear-gradient(135deg, #021f2d 0%, #053b4f 50%, #011520 100%)',
  'radial-gradient(ellipse at 20% 25%, rgba(2, 132, 199, 0.80) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(45, 212, 191, 0.70) 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, rgba(56, 189, 248, 0.65) 0%, transparent 55%), linear-gradient(135deg, #011d2b 0%, #033647 50%, #01111a 100%)',
  'radial-gradient(ellipse at 15% 25%, rgba(13, 148, 136, 0.75) 0%, transparent 52%), radial-gradient(ellipse at 85% 20%, rgba(14, 165, 233, 0.70) 0%, transparent 50%), radial-gradient(ellipse at 50% 90%, rgba(16, 185, 129, 0.55) 0%, transparent 55%), linear-gradient(135deg, #02232b 0%, #064047 50%, #01171d 100%)',
  'radial-gradient(ellipse at 25% 15%, rgba(6, 182, 212, 0.80) 0%, transparent 50%), radial-gradient(ellipse at 75% 25%, rgba(56, 189, 248, 0.75) 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, rgba(20, 184, 166, 0.60) 0%, transparent 55%), linear-gradient(135deg, #021b28 0%, #04384d 50%, #01121d 100%)',
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

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

  const [canRevive, setCanRevive] = useState<boolean>(true);

  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getIsMuted());
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => sounds.getHapticsEnabled());
  const [musicVolume, setMusicVolume] = useState<number>(() => sounds.getMusicVolume());
  const [sfxVolume, setSfxVolume] = useState<number>(() => sounds.getSfxVolume());

  const [grid, setGrid] = useState<(GridCell | null)[][]>(() => createEmptyGrid(8));
  const [pieces, setPieces] = useState<(Piece | null)[]>([null, null, null]);

  const [adventureLevelIndex, setAdventureLevelIndex] = useState<number>(0);
  const [collectedGems, setCollectedGems] = useState<number>(0);
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [dailyRank, setDailyRank] = useState<number | null>(null);

  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<BoardTheme>(() => getSavedTheme());
  const [isSlidebarOpen, setIsSlidebarOpen] = useState<boolean>(false);
  const [slidebarInitialTab, setSlidebarInitialTab] = useState<SlidebarTab>('menu');

  const handleThemeChange = (newTheme: BoardTheme) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);

  const [hoverPos, setHoverPos] = useState<{ row: number; col: number } | null>(null);
  const [isValidHover, setIsValidHover] = useState<boolean>(false);
  const [highlightedRows, setHighlightedRows] = useState<number[]>([]);
  const [highlightedCols, setHighlightedCols] = useState<number[]>([]);

  const [shake, setShake] = useState<boolean>(false);
  const [particleTriggers, setParticleTriggers] = useState<ParticleTrigger[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [blastBackgroundIndex, setBlastBackgroundIndex] = useState<number>(0);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const activePieceRef = useRef<Piece | null>(null);
  const dragPointerPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsNewHigh(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('blockblast_highscore', String(score));
      }
    }
  }, [score, highScore]);

  const validityMap = pieces.map((p) => (p ? canPlacePieceAnywhere(grid, p.shape) : false));

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
      setBlastBackgroundIndex(0);

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

  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const handleToggleHaptics = () => {
    const next = sounds.toggleHaptics();
    setHapticsEnabled(next);
  };

  const handleMusicVolumeChange = (vol: number) => {
    sounds.setMusicVolume(vol);
    setMusicVolume(vol);
  };

  const handleSfxVolumeChange = (vol: number) => {
    sounds.setSfxVolume(vol);
    setSfxVolume(vol);
  };

  const handleOpenSlidebar = (tab: SlidebarTab = 'menu') => {
    sounds.playClick();
    setSlidebarInitialTab(tab);
    setIsSlidebarOpen(true);
  };

  const handleResetAllData = () => {
    setHighScore(0);
    setScore(0);
    setDailyRank(null);
    initGame('classic', 0);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      sounds.startMusic();
    } else if (gameState === 'PAUSED') {
      sounds.pauseMusic();
    } else if (gameState === 'TITLE_MENU' || gameState === 'GAME_OVER' || gameState === 'VICTORY') {
      sounds.stopMusic();
    }
    return () => {
      sounds.stopMusic();
    };
  }, [gameState]);

  const handleRevive = () => {
    setCanRevive(false);
    sounds.playPlace();
    sounds.triggerHaptic('blast');

    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (r >= 2 && r <= 5 && c >= 2 && c <= 5) return null;
        return cell;
      })
    );

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
    setBlastBackgroundIndex((prev) => (prev + 1) % BLAST_BACKGROUNDS.length);

    let activePieces = pieces;
    if (!hasAnyValidMove(newGrid, activePieces)) {
      activePieces = generatePieceBatch(newGrid);
      setPieces(activePieces);
    }

    setGrid(newGrid);
    setGameState('PLAYING');
  };

  const handlePlacePiece = useCallback(
    (pieceIndex: number, targetRow: number, targetCol: number) => {
      const piece = pieces[pieceIndex];
      if (!piece) return;

      if (!canPlacePiece(grid, piece.shape, targetRow, targetCol)) return;

      sounds.playPlace();
      sounds.triggerHaptic('place');

      const newGrid = grid.map((row) => [...row]);
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            newGrid[targetRow + r][targetCol + c] = {
              id: `block-${Date.now()}-${r}-${c}`,
              colorKey: piece.colorKey,
              blockType: piece.blockTypes?.[r]?.[c] || 'standard',
            };
          }
        }
      }

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
            if (updated > stored) localStorage.setItem('blockblast_best_combo', String(updated));
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

        if (nextCombo > 1) sounds.playComboStreak(nextCombo);

        setShake(true);
        setTimeout(() => setShake(false), 240);

        const scoreCalc = calculatePlacementScore(piece.blockCount, totalClears, nextCombo);
        scoreGained = scoreCalc.score;
        multiplierLabel = scoreCalc.multiplierText;

        if (boardRef.current) {
          const boardRect = boardRef.current.getBoundingClientRect();
          const cellSize = boardRect.width / 8;
          const newTriggers: ParticleTrigger[] = [];
          let gemsBlasted = 0;
          let diamondsBlasted = 0;

          clears.rows.forEach((r) => {
            const centerY = boardRect.top + (r + 0.5) * cellSize;
            for (let c = 0; c < 8; c++) {
              const cell = newGrid[r][c];
              if (cell?.hasGem) gemsBlasted++;
              if (cell?.blockType === 'diamond' || cell?.hasGem) diamondsBlasted++;

              const centerX = boardRect.left + (c + 0.5) * cellSize;
              newTriggers.push({
                x: centerX,
                y: centerY,
                color: (cell?.blockType === 'diamond' || cell?.hasGem)
                  ? '#38bdf8'
                  : cell?.blockType === 'star'
                  ? '#facc15'
                  : cell ? (cell.colorKey === 'yellow' ? '#fde047' : '#0ea5e9') : '#0ea5e9',
                count: (cell?.blockType === 'diamond' || cell?.hasGem) ? 16 : 12,
                type: (cell?.hasGem || cell?.blockType === 'diamond') ? 'gem' : 'burst',
              });
            }
            newTriggers.push({
              x: boardRect.left + boardRect.width / 2,
              y: centerY,
              color: '#38bdf8',
              type: 'ring',
            });
          });

          clears.cols.forEach((c) => {
            const centerX = boardRect.left + (c + 0.5) * cellSize;
            for (let r = 0; r < 8; r++) {
              const cell = newGrid[r][c];
              if (!clears.rows.includes(r)) {
                if (cell?.hasGem) gemsBlasted++;
                if (cell?.blockType === 'diamond' || cell?.hasGem) diamondsBlasted++;
              }

              const centerY = boardRect.top + (r + 0.5) * cellSize;
              newTriggers.push({
                x: centerX,
                y: centerY,
                color: (cell?.blockType === 'diamond' || cell?.hasGem)
                  ? '#38bdf8'
                  : cell?.blockType === 'star'
                  ? '#facc15'
                  : '#14b8a6',
                count: (cell?.blockType === 'diamond' || cell?.hasGem) ? 16 : 12,
                type: (cell?.hasGem || cell?.blockType === 'diamond') ? 'gem' : 'burst',
              });
            }
            newTriggers.push({
              x: centerX,
              y: boardRect.top + boardRect.height / 2,
              color: '#14b8a6',
              type: 'ring',
            });
          });

          setParticleTriggers(newTriggers);

          // Diamond blast bonus points!
          if (diamondsBlasted > 0) {
            const diamondBonus = diamondsBlasted * 150;
            scoreGained += diamondBonus;
            multiplierLabel = multiplierLabel
              ? `${multiplierLabel} • 💎 +${diamondBonus}`
              : `💎 +${diamondBonus}`;
          }

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

          // Dynamic clearing transformation on the blasted blocks
          clears.rows.forEach((r) => {
            for (let c = 0; c < 8; c++) {
              if (newGrid[r][c]) {
                newGrid[r][c] = {
                  ...newGrid[r][c]!,
                  clearing: true,
                  clearingColor: (r + c) % 2 === 0 ? '#38bdf8' : '#2dd4bf',
                };
              }
            }
          });
          clears.cols.forEach((c) => {
            for (let r = 0; r < 8; r++) {
              if (newGrid[r][c]) {
                newGrid[r][c] = {
                  ...newGrid[r][c]!,
                  clearing: true,
                  clearingColor: (r + c) % 2 === 0 ? '#0ea5e9' : '#14b8a6',
                };
              }
            }
          });
        }

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
          setTimeout(() => setScorePopups((prev) => prev.filter((p) => p.id !== popup.id)), 1100);
        }
      } else {
        setCombo(0);
        scoreGained = piece.blockCount;
      }

      const newTotalScore = score + scoreGained;
      setScore(newTotalScore);

      if (gameMode === 'daily') {
        const challenge = getTodayChallenge();
        if (newTotalScore >= challenge.targetScore && !challenge.isCompleted) {
          const updatedStreak = markTodayChallengeComplete();
          setDailyStreak(updatedStreak);
          const lbResult = submitDailyScore(newTotalScore);
          if (lbResult.isTop5) setDailyRank(lbResult.rank);
          setTimeout(() => {
            sounds.playLevelVictory();
            setGameState('VICTORY');
          }, 450);
        }
      }

      const nextPieces = [...pieces];
      nextPieces[pieceIndex] = null;

      setGrid(newGrid);

      setTimeout(() => {
        const finalizedGrid = newGrid.map((row, r) =>
          row.map((cell, c) => {
            if (clears.rows.includes(r) || clears.cols.includes(c)) return null;
            return cell ? { ...cell, clearing: false } : null;
          })
        );
        setGrid(finalizedGrid);

        let activePieces = nextPieces;
        if (nextPieces.every((p) => p === null)) {
          activePieces = generatePieceBatch(finalizedGrid);
          setPieces(activePieces);
        } else {
          setPieces(nextPieces);
        }

        const canContinue = hasAnyValidMove(finalizedGrid, activePieces);
        if (!canContinue) {
          if (gameMode === 'daily') {
            const lbResult = submitDailyScore(newTotalScore);
            if (lbResult.isTop5) setDailyRank(lbResult.rank);
          }
          sounds.playGameOver();
          setGameState('GAME_OVER');
        }
      }, totalClears > 0 ? 180 : 0);

      setSelectedPieceIndex(null);
      setDraggingIndex(null);
      setHoverPos(null);
      setHighlightedRows([]);
      setHighlightedCols([]);
    },
    [grid, pieces, combo, score, gameMode, adventureLevelIndex]
  );

  const handleCellClick = (row: number, col: number) => {
    if (selectedPieceIndex !== null && pieces[selectedPieceIndex]) {
      handlePlacePiece(selectedPieceIndex, row, col);
    }
  };

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

  const handlePointerDownPiece = (index: number, e: React.PointerEvent) => {
    const piece = pieces[index];
    if (!piece) return;
    if (!canPlacePieceAnywhere(grid, piece.shape)) return;

    sounds.playPickup();
    sounds.triggerHaptic('pickup');

    const isTouch = e.pointerType === 'touch';
    const offsetY = isTouch ? -80 : -20;
    const offsetX = 0;

    isDraggingRef.current = true;
    activePieceRef.current = piece;
    setDraggingIndex(index);
    setSelectedPieceIndex(index);
    setDragOffset({ x: offsetX, y: offsetY });
    setDragPointerPos({ x: e.clientX, y: e.clientY });
    dragPointerPosRef.current = { x: e.clientX, y: e.clientY };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (draggingIndex === null) return;

    const handlePointerMove = (e: PointerEvent) => {
      const piece = pieces[draggingIndex];
      if (!piece) return;

      const px = e.clientX;
      const py = e.clientY;
      setDragPointerPos({ x: px, y: py });
      dragPointerPosRef.current = { x: px, y: py };

      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();
      const cellSize = boardRect.width / 8;

      const effectiveX = px + dragOffset.x;
      const effectiveY = py + dragOffset.y;

      const piecePixelWidth = piece.width * cellSize;
      const piecePixelHeight = piece.height * cellSize;

      const col = Math.round((effectiveX - boardRect.left - piecePixelWidth / 2) / cellSize);
      const row = Math.round((effectiveY - boardRect.top - piecePixelHeight / 2) / cellSize);

      if (row >= 0 && row + piece.height <= 8 && col >= 0 && col + piece.width <= 8) {
        const valid = canPlacePiece(grid, piece.shape, row, col);
        setHoverPos({ row, col });
        setIsValidHover(valid);

        if (valid) {
          const clears = getPotentialClears(grid, piece.shape, row, col);
          setHighlightedRows(clears.rows);
          setHighlightedCols(clears.cols);
        } else {
          setHighlightedRows([]);
          setHighlightedCols([]);
        }
      } else {
        setHoverPos(null);
        setIsValidHover(false);
        setHighlightedRows([]);
        setHighlightedCols([]);
      }
    };

    const handlePointerUp = () => {
      if (draggingIndex !== null && hoverPos && isValidHover) {
        handlePlacePiece(draggingIndex, hoverPos.row, hoverPos.col);
      } else {
        setDraggingIndex(null);
        setDragPointerPos(null);
        setHoverPos(null);
        setHighlightedRows([]);
        setHighlightedCols([]);
      }
      isDraggingRef.current = false;
      activePieceRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggingIndex, pieces, grid, dragOffset, hoverPos, isValidHover, handlePlacePiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (gameState === 'PLAYING') {
          sounds.playClick();
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          sounds.playClick();
          setGameState('PLAYING');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  if (gameState === 'TITLE_MENU') {
    return (
      <>
        <OfflineIndicator />
        <TitleScreen
          onStart={(mode) => {
            setGameMode(mode);
            initGame(mode, 0);
          }}
          highScore={highScore}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={handleToggleHaptics}
          selectedMode={gameMode}
          onSelectMode={setGameMode}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenStats={() => setShowStats(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenSlidebar={handleOpenSlidebar}
          dailyStreak={dailyStreak}
        />
        {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
        {showStats && <StatsModal onClose={() => setShowStats(false)} highScore={highScore} />}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            musicVolume={musicVolume}
            onMusicVolumeChange={handleMusicVolumeChange}
            sfxVolume={sfxVolume}
            onSfxVolumeChange={handleSfxVolumeChange}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            hapticsEnabled={hapticsEnabled}
            onToggleHaptics={handleToggleHaptics}
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        )}
        <SlidebarDrawer
          isOpen={isSlidebarOpen}
          onClose={() => setIsSlidebarOpen(false)}
          initialTab={slidebarInitialTab}
          onResetAllData={handleResetAllData}
        />
      </>
    );
  }

  const currentLevel =
    gameMode === 'adventure'
      ? ADVENTURE_LEVELS[adventureLevelIndex % ADVENTURE_LEVELS.length]
      : undefined;

  const draggedPiece = draggingIndex !== null ? pieces[draggingIndex] : null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center p-2 sm:p-3 select-none touch-none bg-[#021a28]"
      style={{
        backgroundImage: BLAST_BACKGROUNDS[blastBackgroundIndex],
        transition: 'background-image 900ms ease-in-out',
      }}
    >
      <OfflineIndicator />

      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.25) 0%, transparent 60%), linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      />

      <ParticleCanvas triggers={particleTriggers} />
      <ScorePopups popups={scorePopups} />

      <HUD
        score={score}
        highScore={highScore}
        combo={combo}
        gameMode={gameMode}
        levelNumber={adventureLevelIndex + 1}
        collectedGems={collectedGems}
        targetGems={currentLevel?.targetGems}
        dailyTargetScore={1200}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onPause={() => setGameState('PAUSED')}
        onRestart={() => initGame(gameMode, adventureLevelIndex)}
        onHowToPlay={() => setShowHowToPlay(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSlidebar={handleOpenSlidebar}
      />

      <main className="flex-1 flex items-center justify-center w-full z-10 py-1">
        <GameBoard
          grid={grid}
          activePiece={draggedPiece || (selectedPieceIndex !== null ? pieces[selectedPieceIndex] : null)}
          hoverPos={hoverPos}
          isValidHover={isValidHover}
          highlightedRows={highlightedRows}
          highlightedCols={highlightedCols}
          onCellClick={handleCellClick}
          boardRef={boardRef}
          shake={shake}
          theme={currentTheme}
        />
      </main>

      <footer className="w-full flex justify-center z-10 pb-2">
        <PieceTray
          pieces={pieces}
          selectedPieceIndex={selectedPieceIndex}
          draggingIndex={draggingIndex}
          validityMap={validityMap}
          onSelectPiece={handleSelectPiece}
          onPointerDownPiece={handlePointerDownPiece}
        />
      </footer>

      {draggedPiece && dragPointerPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${dragPointerPos.x + dragOffset.x}px`,
            top: `${dragPointerPos.y + dragOffset.y}px`,
          }}
        >
          <BlockPiece
            piece={draggedPiece}
            cellSize={boardRef.current ? boardRef.current.clientWidth / 8.6 : 38}
            isDragging={true}
          />
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHigh={isNewHigh}
          linesCleared={linesClearedTotal}
          maxCombo={maxCombo}
          canRevive={canRevive}
          onRevive={handleRevive}
          onRestart={() => initGame(gameMode, adventureLevelIndex)}
          onHome={() => setGameState('TITLE_MENU')}
          dailyRank={dailyRank}
          onOpenLeaderboard={() => handleOpenSlidebar('leaderboard')}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => setGameState('PLAYING')}
          onRestart={() => initGame(gameMode, adventureLevelIndex)}
          onHome={() => setGameState('TITLE_MENU')}
          onHowToPlay={() => setShowHowToPlay(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={handleToggleHaptics}
          musicVolume={musicVolume}
          onMusicVolumeChange={handleMusicVolumeChange}
          sfxVolume={sfxVolume}
          onSfxVolumeChange={handleSfxVolumeChange}
          onOpenSlidebar={handleOpenSlidebar}
        />
      )}

      {gameState === 'VICTORY' && (
        <VictoryModal
          score={score}
          levelNumber={adventureLevelIndex + 1}
          mode={gameMode === 'daily' ? 'daily' : 'adventure'}
          streakCount={dailyStreak}
          onNextLevel={() => {
            const nextIdx = adventureLevelIndex + 1;
            setAdventureLevelIndex(nextIdx);
            initGame('adventure', nextIdx);
          }}
          onHome={() => setGameState('TITLE_MENU')}
          dailyRank={dailyRank}
          onOpenLeaderboard={() => handleOpenSlidebar('leaderboard')}
        />
      )}

      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} highScore={highScore} />}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          musicVolume={musicVolume}
          onMusicVolumeChange={handleMusicVolumeChange}
          sfxVolume={sfxVolume}
          onSfxVolumeChange={handleSfxVolumeChange}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          hapticsEnabled={hapticsEnabled}
          onToggleHaptics={handleToggleHaptics}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      )}

      <SlidebarDrawer
        isOpen={isSlidebarOpen}
        onClose={() => setIsSlidebarOpen(false)}
        initialTab={slidebarInitialTab}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
