
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Cell from './components/Cell';
import Leaderboard from './components/Leaderboard';
import VictoryModal from './components/VictoryModal';
import { GameSettings, BoardSize, Difficulty, CellData, GameStatus } from './types';
import { createBoard, revealCell, chordReveal, checkWin } from './utils/minesweeperLogic';
import { saveLeaderboardEntry } from './services/storageService';
import { generateLossMessage } from './services/geminiService';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>({
    size: BoardSize.SMALL,
    difficulty: Difficulty.EASY,
  });

  const [board, setBoard] = useState<CellData[][]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [lossMessage, setLossMessage] = useState<string | null>(null);
  
  // Fix: Use any for the timer reference to avoid NodeJS namespace issues in browser environment
  const timerRef = useRef<any>(null);

  const initGame = useCallback((firstClick?: { x: number, y: number }) => {
    const newBoard = createBoard(settings, firstClick);
    setBoard(newBoard);
    setStatus('playing');
    setTime(0);
    setLossMessage(null);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  }, [settings]);

  // Initial load
  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initGame]);

  const handleCellClick = (x: number, y: number) => {
    if (status !== 'playing' || board[y][x].isFlagged || board[y][x].isRevealed) return;

    if (board[y][x].isMine) {
      const newBoard = board.map(row => row.map(cell => ({ ...cell, isRevealed: cell.isMine ? true : cell.isRevealed })));
      setBoard(newBoard);
      setStatus('lost');
      if (timerRef.current) clearInterval(timerRef.current);
      
      generateLossMessage().then(setLossMessage);
      return;
    }

    const newBoard = revealCell(board, x, y);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setStatus('won');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleCellDoubleClick = (x: number, y: number) => {
    if (status !== 'playing' || !board[y][x].isRevealed) return;

    const { newBoard, exploded } = chordReveal(board, x, y);
    if (newBoard === board) return; // No change if flags don't match count

    setBoard(newBoard);

    if (exploded) {
      setStatus('lost');
      if (timerRef.current) clearInterval(timerRef.current);
      generateLossMessage().then(setLossMessage);
    } else if (checkWin(newBoard)) {
      setStatus('won');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (status !== 'playing' || board[y][x].isRevealed) return;

    const newBoard = board.map(row => 
      row.map(cell => 
        cell.x === x && cell.y === y 
          ? { ...cell, isFlagged: !cell.isFlagged } 
          : cell
      )
    );
    setBoard(newBoard);
  };

  const handleSaveWin = (playerName: string) => {
    saveLeaderboardEntry({
      playerName,
      time,
      size: settings.size,
      difficulty: settings.difficulty,
    });
    setShowLeaderboard(true);
    setStatus('idle');
  };

  const flagCount = board.flat().filter(c => c.isFlagged).length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <Controls 
          settings={settings} 
          setSettings={setSettings} 
          onReset={() => initGame()} 
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />

        <div className="flex flex-col items-center gap-6">
          {/* Stats Bar */}
          <div className="flex gap-8 px-8 py-3 bg-slate-800/40 rounded-full border border-slate-700/50 backdrop-blur-sm text-lg font-mono">
            <div className="flex items-center gap-2 text-rose-400">
              <i className="fa-solid fa-flag"></i>
              <span>{Math.max(0, board.flat().filter(c => c.isMine).length - flagCount)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <i className="fa-solid fa-clock"></i>
              <span>{time}s</span>
            </div>
            {status === 'lost' && (
              <div className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-widest animate-pulse">
                Game Over
              </div>
            )}
            {status === 'won' && (
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest">
                Victory!
              </div>
            )}
          </div>

          {/* Board Container */}
          <div className="p-4 bg-slate-800 rounded-2xl border-4 border-slate-700 shadow-2xl overflow-auto max-w-full custom-scrollbar">
            <div 
              className="grid gap-1"
              style={{ 
                gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))`,
                width: 'fit-content'
              }}
            >
              {board.map((row, y) => (
                row.map((cell, x) => (
                  <Cell 
                    key={`${x}-${y}`} 
                    cell={cell} 
                    onClick={() => handleCellClick(x, y)}
                    onDoubleClick={() => handleCellDoubleClick(x, y)}
                    onContextMenu={(e) => handleContextMenu(e, x, y)}
                  />
                ))
              ))}
            </div>
          </div>

          {status === 'lost' && lossMessage && (
            <div className="max-w-md text-center p-4 bg-rose-900/20 border border-rose-500/30 rounded-xl text-rose-200 italic shadow-lg">
              "{lossMessage}"
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      
      {status === 'won' && (
        <VictoryModal 
          time={time} 
          size={settings.size} 
          difficulty={settings.difficulty} 
          onSave={handleSaveWin} 
        />
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-xs uppercase tracking-[0.2em] border-t border-slate-900">
        Powered by Gemini AI • 2025
      </footer>
    </div>
  );
};

export default App;
