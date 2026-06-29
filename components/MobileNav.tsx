"use client";

import React, { useState } from 'react';
import { Home, BarChart3, Settings, User } from 'lucide-react';

export const MobileNav = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Početna' },
    { id: 'stats', icon: BarChart3, label: 'Statistika' },
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'settings', icon: Settings, label: 'Podešavanja' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111622]/90 backdrop-blur-lg border-t border-slate-800/60 px-6 py-2 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors duration-200 ${
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};