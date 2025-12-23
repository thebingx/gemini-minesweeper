
import React, { useMemo } from 'react';
import { getLeaderboard } from '../services/storageService';
import { BoardSize, Difficulty } from '../types';

interface Props {
  onClose: () => void;
}

const Leaderboard: React.FC<Props> = ({ onClose }) => {
  const entries = useMemo(() => getLeaderboard(), []);
  
  const [filterSize, setFilterSize] = React.useState<BoardSize>(BoardSize.SMALL);
  const [filterDiff, setFilterDiff] = React.useState<Difficulty>(Difficulty.EASY);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => e.size === filterSize && e.difficulty === filterDiff);
  }, [entries, filterSize, filterDiff]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-trophy text-amber-400"></i>
            Global Rankings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4 bg-slate-800/10">
          <select
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value as BoardSize)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none"
          >
            {Object.values(BoardSize).map(s => <option key={s} value={s}>{s} Board</option>)}
          </select>
          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value as Difficulty)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none"
          >
            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d} Difficulty</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-20 text-slate-500 italic">
              No champions in this category yet. Be the first!
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-sm border-b border-slate-800">
                  <th className="pb-3 px-2">Rank</th>
                  <th className="pb-3 px-2">Player</th>
                  <th className="pb-3 px-2">Time</th>
                  <th className="pb-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-2 font-mono text-slate-400">#{index + 1}</td>
                    <td className="py-4 px-2 font-bold text-blue-400">{entry.playerName}</td>
                    <td className="py-4 px-2 text-emerald-400 font-mono">{entry.time}s</td>
                    <td className="py-4 px-2 text-slate-500 text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
