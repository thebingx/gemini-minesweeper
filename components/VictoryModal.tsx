
import React, { useState, useEffect } from 'react';
import { generateVictoryMessage } from '../services/geminiService';
import { BoardSize, Difficulty } from '../types';

interface Props {
  time: number;
  size: BoardSize;
  difficulty: Difficulty;
  onSave: (name: string) => void;
}

const VictoryModal: React.FC<Props> = ({ time, size, difficulty, onSave }) => {
  const [name, setName] = useState('');
  const [aiMessage, setAiMessage] = useState('Communicating with Gemini...');
  const [isLoadingAi, setIsLoadingAi] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      const msg = await generateVictoryMessage("Champion", time, size, difficulty);
      setAiMessage(msg);
      setIsLoadingAi(false);
    };
    fetchMessage();
  }, [time, size, difficulty]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-blue-500/30 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)] p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="mb-6 inline-block p-4 bg-blue-500/20 rounded-full">
          <i className="fa-solid fa-crown text-5xl text-blue-400 animate-pulse"></i>
        </div>
        <h2 className="text-3xl font-bold mb-2">Victory!</h2>
        <p className="text-slate-400 mb-6">
          You cleared the board in <span className="text-emerald-400 font-mono text-xl">{time}s</span>
        </p>

        <div className="bg-slate-800/50 p-4 rounded-xl mb-6 italic text-slate-300 text-sm">
          {isLoadingAi ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          ) : `"${aiMessage}"`}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-left text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Enter your name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous Hero"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-bold"
            />
          </div>
          <button
            onClick={() => onSave(name || 'Anonymous')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/40"
          >
            Submit to Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
