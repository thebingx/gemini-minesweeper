
import React from 'react';
import { CellData } from '../types';

interface Props {
  cell: CellData;
  onClick: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const Cell: React.FC<Props> = ({ cell, onClick, onDoubleClick, onContextMenu }) => {
  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-400';
      case 2: return 'text-emerald-400';
      case 3: return 'text-rose-400';
      case 4: return 'text-purple-400';
      case 5: return 'text-amber-400';
      case 6: return 'text-cyan-400';
      case 7: return 'text-pink-400';
      case 8: return 'text-slate-200';
      default: return 'text-transparent';
    }
  };

  const baseClasses = "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-slate-700 text-lg font-bold transition-all cursor-pointer select-none";
  
  if (!cell.isRevealed) {
    return (
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`${baseClasses} bg-slate-800 hover:bg-slate-700 active:bg-slate-600 shadow-inner rounded-sm`}
      >
        {cell.isFlagged && <i className="fa-solid fa-flag text-rose-500 text-sm md:text-base animate-bounce"></i>}
      </div>
    );
  }

  if (cell.isMine) {
    return (
      <div className={`${baseClasses} bg-rose-900/50 border-rose-500/50 rounded-sm`}>
        <i className="fa-solid fa-bomb text-rose-400 drop-shadow-lg"></i>
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} bg-slate-900/80 rounded-sm`}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    >
      {cell.neighborCount > 0 && (
        <span className={getNumberColor(cell.neighborCount)}>
          {cell.neighborCount}
        </span>
      )}
    </div>
  );
};

export default Cell;
