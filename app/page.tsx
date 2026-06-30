"use client";

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import CounterCard from '@/components/CounterCard';
import MonthlyCard from '@/components/MonthlyCard';
import ProfileCard from '@/components/ProfileCard';
import { MobileNav } from '@/components/MobileNav';
import { User, LogOut, Mail, ChevronDown } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'profile'>('home');
  const [username, setUsername] = useState('Korisnik');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uzmiKorisnika = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.user_metadata?.name || 'Korisnik');
        setEmail(session.user.email || '');
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
    };

    uzmiKorisnika();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.user_metadata?.name || 'Korisnik');
        setEmail(session.user.email || '');
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
    });

    // Zatvori dropdown ako korisnik klikne bilo gde van njega
    const klikVanDropdowna = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', klikVanDropdowna);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', klikVanDropdowna);
    };
  }, []);

  const handleLogout = async () => {
    const potvrda = window.confirm("Da li sigurno želiš da se odjaviš?");
    if (!potvrda) return;
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <main className="bg-[#090d16] min-h-screen text-white flex flex-col items-center justify-center p-4 pt-20">
      
      {/* FIKSIRANO ZAGLAVLJE GORE LEVO SA DROPDOWN MENIJEM */}
      <div className="absolute top-4 left-4 z-50" ref={dropdownRef}>
        {/* Okidač za klik */}
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-[#111622]/80 hover:bg-[#151b2a] backdrop-blur-md border border-slate-800/60 px-3 py-1.5 rounded-full shadow-lg cursor-pointer transition-all active:scale-[0.98] select-none"
        >
          <div className="w-7 h-7 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/10 overflow-hidden border border-slate-700/50">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Mini Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={14} />
            )}
          </div>
          <span className="text-xs font-medium text-slate-200">
            {username}
          </span>
          <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* SAM PADUĆI MENI (DROPDOWN) */}
        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 bg-[#111622] border border-slate-800/80 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Info o korisniku */}
            <div className="px-3 py-2.5 border-b border-slate-800/50 mb-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{username}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                <Mail size={10} className="text-slate-500 flex-shrink-0" /> {email}
              </p>
            </div>

            {/* Opcija za otvaranje profila */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#181f30] rounded-xl transition-colors text-left"
            >
              <User size={14} className="text-slate-400" />
              Moj Profil
            </button>

            {/* Dugme za odjavu */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
            >
              <LogOut size={14} />
              Odjavi se
            </button>
          </div>
        )}
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