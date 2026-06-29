"use client";

import { useState } from 'react';
import CounterCard from '@/components/CounterCard';
 // Koristi tačan naziv tvog fajla (MountlyCard ili MonthlyCard)
import {MobileNav}  from '@/components/MobileNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats'>('home');

  return (
    <main className="bg-[#090d16] min-h-screen text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col items-center justify-center flex-1">
        
        {/* Prikaz komponenti u zavisnosti od taba */}
        
          <div className="w-full flex items-center justify-center">
            <CounterCard />
          </div>
        

      </div>

      {/* Navigacija na dnu sa ispravno prosleđenim parametrima */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}