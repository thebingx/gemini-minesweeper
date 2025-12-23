
import { BoardSize, Difficulty } from './types';

export const SIZE_CONFIG = {
  [BoardSize.SMALL]: { width: 9, height: 9 },
  [BoardSize.MEDIUM]: { width: 16, height: 16 },
  [BoardSize.LARGE]: { width: 30, height: 16 },
};

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: 0.1, // 10% mines
  [Difficulty.NORMAL]: 0.15, // 15% mines
  [Difficulty.HARD]: 0.2, // 20% mines
};

export const STORAGE_KEY = 'minesweeper_leaderboard';
