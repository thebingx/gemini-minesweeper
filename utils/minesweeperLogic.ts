
import { CellData, GameSettings } from '../types';
import { SIZE_CONFIG, DIFFICULTY_CONFIG } from '../constants';

export const createBoard = (settings: GameSettings, firstClick?: { x: number, y: number }): CellData[][] => {
  const { width, height } = SIZE_CONFIG[settings.size];
  const mineRatio = DIFFICULTY_CONFIG[settings.difficulty];
  const mineCount = Math.floor(width * height * mineRatio);
  
  // Initialize empty board
  const board: CellData[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x, y, isMine: false, isRevealed: false, isFlagged: false, neighborCount: 0
    }))
  );

  // Plant mines
  let planted = 0;
  while (planted < mineCount) {
    const rx = Math.floor(Math.random() * width);
    const ry = Math.floor(Math.random() * height);
    
    // Ensure we don't place a mine on the first click or on an existing mine
    const isFirstClick = firstClick && firstClick.x === rx && firstClick.y === ry;
    if (!board[ry][rx].isMine && !isFirstClick) {
      board[ry][rx].isMine = true;
      planted++;
    }
  }

  // Calculate neighbors
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!board[y][x].isMine) {
        board[y][x].neighborCount = countMines(board, x, y, width, height);
      }
    }
  }

  return board;
};

const countMines = (board: CellData[][], x: number, y: number, w: number, h: number) => {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && board[ny][nx].isMine) {
        count++;
      }
    }
  }
  return count;
};

export const revealCell = (board: CellData[][], x: number, y: number): CellData[][] => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const width = board[0].length;
  const height = board.length;

  const stack = [[x, y]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop()!;
    const cell = newBoard[cy][cx];
    
    if (cell.isRevealed || cell.isFlagged) continue;
    
    cell.isRevealed = true;
    
    if (cell.neighborCount === 0 && !cell.isMine) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            stack.push([nx, ny]);
          }
        }
      }
    }
  }
  
  return newBoard;
};

export const chordReveal = (board: CellData[][], x: number, y: number): { newBoard: CellData[][], exploded: boolean } => {
  const cell = board[y][x];
  if (!cell.isRevealed || cell.neighborCount === 0) return { newBoard: board, exploded: false };

  const width = board[0].length;
  const height = board.length;
  let flagCount = 0;
  const neighbors: { x: number, y: number }[] = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        neighbors.push({ x: nx, y: ny });
        if (board[ny][nx].isFlagged) flagCount++;
      }
    }
  }

  if (flagCount !== cell.neighborCount) return { newBoard: board, exploded: false };

  let exploded = false;
  let nextBoard = board;

  for (const n of neighbors) {
    const targetCell = nextBoard[n.y][n.x];
    if (!targetCell.isRevealed && !targetCell.isFlagged) {
      if (targetCell.isMine) {
        exploded = true;
      } else {
        nextBoard = revealCell(nextBoard, n.x, n.y);
      }
    }
  }

  if (exploded) {
    nextBoard = nextBoard.map(row => row.map(c => ({
      ...c,
      isRevealed: c.isMine ? true : c.isRevealed
    })));
  }

  return { newBoard: nextBoard, exploded };
};

export const checkWin = (board: CellData[][]): boolean => {
  return board.every(row =>
    row.every(cell =>
      (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed)
    )
  );
};
