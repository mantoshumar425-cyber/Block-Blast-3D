/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category: 'gameplay' | 'combos' | 'daily' | 'mastery';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  description: string;
  iconType: 'crown' | 'trophy' | 'medal' | 'star' | 'shield';
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
}

export function getAchievementsList(): AchievementItem[] {
  const totalLines = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_total_lines') || '0', 10)
    : 0;
  const bestCombo = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_best_combo') || '0', 10)
    : 0;
  const highScore = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_highscore') || '0', 10)
    : 0;
  const dailyStreak = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_daily_streak') || '0', 10)
    : 0;
  const gamesPlayed = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_games_played') || '0', 10)
    : 0;

  return [
    {
      id: 'first-blast',
      title: 'First Line Blast',
      description: 'Clear your first horizontal or vertical line',
      category: 'gameplay',
      progress: Math.min(totalLines, 1),
      maxProgress: 1,
      unlocked: totalLines >= 1,
    },
    {
      id: 'combo-spark',
      title: 'Combo Spark',
      description: 'Achieve a Combo streak of x2 or higher',
      category: 'combos',
      progress: Math.min(bestCombo, 2),
      maxProgress: 2,
      unlocked: bestCombo >= 2,
    },
    {
      id: 'combo-master',
      title: 'Combo Master',
      description: 'Reach a blistering x4 Combo multiplier',
      category: 'combos',
      progress: Math.min(bestCombo, 4),
      maxProgress: 4,
      unlocked: bestCombo >= 4,
    },
    {
      id: 'score-1k',
      title: 'Score Striker',
      description: 'Reach a score of 1,000 points in a single run',
      category: 'mastery',
      progress: Math.min(highScore, 1000),
      maxProgress: 1000,
      unlocked: highScore >= 1000,
    },
    {
      id: 'score-2k5',
      title: 'High Roller',
      description: 'Reach a score of 2,500 points in a single run',
      category: 'mastery',
      progress: Math.min(highScore, 2500),
      maxProgress: 2500,
      unlocked: highScore >= 2500,
    },
    {
      id: 'century-lines',
      title: 'Centurion',
      description: 'Clear a lifetime total of 50 lines',
      category: 'gameplay',
      progress: Math.min(totalLines, 50),
      maxProgress: 50,
      unlocked: totalLines >= 50,
    },
    {
      id: 'daily-starter',
      title: 'Daily Challenger',
      description: 'Complete at least 1 Daily Challenge',
      category: 'daily',
      progress: Math.min(dailyStreak, 1),
      maxProgress: 1,
      unlocked: dailyStreak >= 1,
    },
    {
      id: 'daily-streak-3',
      title: 'Consecutive Victor',
      description: 'Maintain a 3-day Daily Challenge winning streak',
      category: 'daily',
      progress: Math.min(dailyStreak, 3),
      maxProgress: 3,
      unlocked: dailyStreak >= 3,
    },
    {
      id: 'veteran-puzzler',
      title: 'Dedicated Player',
      description: 'Play 10 rounds of Block Blast',
      category: 'mastery',
      progress: Math.min(gamesPlayed, 10),
      maxProgress: 10,
      unlocked: gamesPlayed >= 10,
    },
  ];
}

export function getAwardsList(): AwardItem[] {
  const highScore = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_highscore') || '0', 10)
    : 0;
  const bestCombo = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_best_combo') || '0', 10)
    : 0;
  const dailyStreak = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_daily_streak') || '0', 10)
    : 0;
  const totalLines = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('blockblast_total_lines') || '0', 10)
    : 0;

  return [
    {
      id: 'award-daily-crown',
      title: 'Crown of the Daily Master',
      description: 'Awarded for achieving a 3+ day streak in Daily Challenge mode.',
      iconType: 'crown',
      tier: 'gold',
      unlocked: dailyStreak >= 3,
    },
    {
      id: 'award-combo-trophy',
      title: 'Hyper Cascade Trophy',
      description: 'Awarded for stringing together a x5 or higher Combo cascade.',
      iconType: 'trophy',
      tier: 'diamond',
      unlocked: bestCombo >= 5,
    },
    {
      id: 'award-score-shield',
      title: 'Grandmaster Aegis',
      description: 'Awarded for scoring 2,000+ points in a single session.',
      iconType: 'shield',
      tier: 'gold',
      unlocked: highScore >= 2000,
    },
    {
      id: 'award-line-medal',
      title: 'Line Sweeper Medal',
      description: 'Awarded for blasting 30 or more rows and columns.',
      iconType: 'medal',
      tier: 'silver',
      unlocked: totalLines >= 30,
    },
    {
      id: 'award-apprentice-star',
      title: 'Novice Star of Strategy',
      description: 'Awarded for scoring your first 500 points.',
      iconType: 'star',
      tier: 'bronze',
      unlocked: highScore >= 500,
    },
  ];
}
