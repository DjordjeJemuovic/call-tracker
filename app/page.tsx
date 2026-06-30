"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CounterCard from '@/components/CounterCard';
import MonthlyCard from '@/components/MonthlyCard';
import ProfileCard from '@/components/ProfileCard';
import { MobileNav } from '@/components/MobileNav';
import { User } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'profile'>('home');
  const [username, setUsername] = useState('Korisnik');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const uzmiKorisnika = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.user_metadata?.name || 'Korisnik');
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
    };

    uzmiKorisnika();

    // Slušamo sve događaje (uključujući i USER_UPDATED koji okida refreshSession) 🎯
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.user_metadata?.name || 'Korisnik');
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="bg-[#090d16] min-h-screen text-white flex flex-col items-center justify-center p-4 pt-20">
      
      {/* FIKSIRANO ZAGLAVLJE GORE LEVO */}
      <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-[#111622]/60 backdrop-blur-md border border-slate-800/40 px-3 py-1.5 rounded-full shadow-sm z-40">
        <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/10 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Mini Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={14} />
          )}
        </div>
        <span className="text-xs font-medium text-slate-200 pr-1 select-none">
          {username}
        </span>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center justify-center flex-1">
        
        {activeTab === 'home' && (
          <div className="w-full flex items-center justify-center">
            <CounterCard />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="w-full flex items-center justify-center">
            <MonthlyCard />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full flex items-center justify-center">
            <ProfileCard />
          </div>
        )}

      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}