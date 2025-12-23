
import React from 'react';
import { BoardSize, Difficulty, GameSettings } from '../types';

interface Props {
  settings: GameSettings;
  setSettings: (s: GameSettings) => void;
  onReset: () => void;
  onShowLeaderboard: () => void;
}

const Controls: React.FC<Props> = ({ settings, setSettings, onReset, onShowLeaderboard }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-300">Size:</label>
        <select
          value={settings.size}
          onChange={(e) => setSettings({ ...settings, size: e.target.value as BoardSize })}
          className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 outline-none"
        >
          {Object.values(BoardSize).map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-300">Difficulty:</label>
        <select
          value={settings.difficulty}
          onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
          className="bg-slate-900 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 outline-none"
        >
          {Object.values(Difficulty).map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
        <button
          onClick={onReset}
          className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
        >
          <i className="fa-solid fa-rotate-right"></i> New Game
        </button>
        <button
          onClick={onShowLeaderboard}
          className="flex-1 md:flex-none px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-semibold"
        >
          <i className="fa-solid fa-trophy"></i> Ranking
        </button>
      </div>
    </div>
  );
};

export default Controls;
