"use client";

import { useState } from 'react';
import CounterCard from '@/components/CounterCard';
import MonthlyCard from '@/components/MonthlyCard';
import { MobileNav } from '@/components/MobileNav';

export default function Home() {
  // Prati koji je tab aktivan: 'home' (brojači) ili 'stats' (statistika)
  const [activeTab, setActiveTab] = useState<'home' | 'stats'>('home');

  return (
    <main className="bg-[#090d16] min-h-screen text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center flex-1">
        
        {/* Uslovni prikaz: Ako je 'home' prikaži brojače, ako je 'stats' prikaži mesečni izveštaj */}
        {activeTab === 'home' ? (
          <div className="w-full flex items-center justify-center">
            <CounterCard />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <MonthlyCard />
          </div>
        )}

      </div>

      {/* Navigacija na dnu koja kontroliše stanje iznad */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}