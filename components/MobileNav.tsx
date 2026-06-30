"use client";

import React from 'react';
import { Home, BarChart3, User, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MobileNavProps {
  activeTab: 'home' | 'stats' | 'profile';
  setActiveTab: (tab: 'home' | 'stats' | 'profile') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  
  const handleLogout = async () => {
    const potvrda = window.confirm("Da li sigurno želiš da se odjaviš?");
    if (!potvrda) return;

    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111622]/90 backdrop-blur-md border-t border-slate-800/60 px-4 py-3 flex justify-around items-center z-50 md:max-w-md md:mx-auto md:bottom-4 md:rounded-2xl md:border">
      
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

      {/* Dugme za Profil */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
          activeTab === 'profile' ? 'text-blue-500 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User size={22} />
        <span className="text-xs">Profil</span>
      </button>

      {/* Dugme za Odjavu */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors duration-200"
      >
        <LogOut size={22} />
        <span className="text-xs">Odjavi se</span>
      </button>

    </div>
  );
};