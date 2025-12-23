
import { LeaderboardEntry, BoardSize, Difficulty } from '../types';
import { STORAGE_KEY } from '../constants';

export const getLeaderboard = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveLeaderboardEntry = (entry: Omit<LeaderboardEntry, 'id' | 'date'>) => {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
  };
  
  const updated = [...current, newEntry].sort((a, b) => a.time - b.time);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getBestTime = (size: BoardSize, difficulty: Difficulty): LeaderboardEntry | null => {
  const entries = getLeaderboard().filter(e => e.size === size && e.difficulty === difficulty);
  return entries.length > 0 ? entries[0] : null;
};
