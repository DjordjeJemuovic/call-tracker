"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, Calendar, ShieldAlert } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DnevnaStatistika {
  id: string;
  date: string;
  offers_count: number;  // Ispravljeno na množinu 'offers_count' 🎯
  surveys_count: number; // Tačan naziv za ankete
}

export default function MonthlyCard() {
  const [loading, setLoading] = useState(true);
  const [podaci, setPodaci] = useState<DnevnaStatistika[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistika = async () => {
      try {
        setLoading(true);
        
        // 1. Uzmi trenutnu sesiju korisnika
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setError("Korisnik nije ulogovan.");
          setLoading(false);
          return;
        }

        // 2. Povuci podatke iz 'daily_stats' i sortiraj po 'date' koloni
        const { data, error: dbError } = await supabase
          .from('daily_stats')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: false });

        if (dbError) throw dbError;

        setPodaci(data || []);
      } catch (err: any) {
        console.error("Greška pri povlačenju podataka - Detalji:", err);
        setError(err.message || "Došlo je do greške pri čitanju iz baze.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistika();
  }, []);

  // Formatiranje datuma da bude čitljiv (npr. 30. Jun 2026)
  const formatirajDatum = (dateString: string) => {
    if (!dateString) return "-";
    const opcije: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('sr-RS', opcije);
  };

  if (loading) {
    return (
      <div className="bg-[#111622] border border-slate-800/80 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-slate-400 mt-4 text-sm">Učitavam statistiku...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111622] border border-rose-900/40 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <ShieldAlert className="text-rose-400 w-10 h-10 mb-2" />
        <p className="text-rose-400 text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-3xl p-5 w-full max-w-md shadow-2xl md:p-6 mb-6">
      <div className="flex items-center gap-3 border-b border-slate-800/60 pb-4 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
          <BarChart3 size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Mesečni Izveštaj</h2>
          <p className="text-xs text-slate-400">Pregled statistike po danima</p>
        </div>
      </div>

      {podaci.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Nema zabeleženih podataka u tabeli daily_stats.
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
          {podaci.map((dan, index) => (
            <div 
              key={`${dan.date}-${index}`} 
              className="bg-[#181f30] border border-slate-850 rounded-2xl p-3.5 flex items-center justify-between transition-all hover:border-slate-700/60"
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-200">
                  {formatirajDatum(dan.date)}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-semibold">
                {/* Ponude (Zelena kockica) */}
                <div className="flex flex-col items-center px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg min-w-[55px]">
                  <span>{dan.offers_count ?? 0}</span> {/* Ažurirano na dan.offers_count 🎯 */}
                  <span className="text-[9px] text-emerald-500/70 font-normal uppercase mt-0.5">Ponude</span>
                </div>
                
                {/* Ankete (Plava kockica) */}
                <div className="flex flex-col items-center px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg min-w-[55px]">
                  <span>{dan.surveys_count ?? 0}</span>
                  <span className="text-[9px] text-blue-500/70 font-normal uppercase mt-0.5">Ankete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}