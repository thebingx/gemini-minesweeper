
export enum Difficulty {
  EASY = 'Easy',
  NORMAL = 'Normal',
  HARD = 'Hard'
}

export enum BoardSize {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large'
}

export interface CellData {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  time: number;
  date: string;
  size: BoardSize;
  difficulty: Difficulty;
}

export interface GameSettings {
  size: BoardSize;
  difficulty: Difficulty;
}

export type GameStatus = 'playing' | 'won' | 'lost' | 'idle';
