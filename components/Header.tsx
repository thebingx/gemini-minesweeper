
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        GEMINI MINESWEEPER PRO
      </h1>
      <p className="mt-2 text-slate-400 text-sm md:text-base">
        Strategic Sweeping with AI Motivation
      </p>
    </header>
  );
};

export default Header;
