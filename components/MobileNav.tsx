"use client";

import React from 'react';
import { Home, BarChart3 } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'home' | 'stats' | 'profile';
  setActiveTab: (tab: 'home' | 'stats' | 'profile') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111622]/90 backdrop-blur-md border-t border-slate-800/60 px-12 py-3 flex justify-around items-center z-50 md:max-w-xs md:mx-auto md:bottom-4 md:rounded-2xl md:border">
      
      {/* Dugme za Početnu */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
          activeTab === 'home' ? 'text-blue-500 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home size={22} />
        <span className="text-xs">Početna</span>
      </button>

      {/* Dugme za Statistiku */}
      <button
        onClick={() => setActiveTab('stats')}
        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
          activeTab === 'stats' ? 'text-blue-500 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart3 size={22} />
        <span className="text-xs">Statistika</span>
      </button>

    </div>
  );
};