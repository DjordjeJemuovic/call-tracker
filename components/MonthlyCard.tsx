"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, Calendar, ClipboardList, CircleDollarSign, Loader2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface StatRow {
  date: string;
  surveys_count: number;
  offers_count: number;
}

export default function MonthlyCard() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistika = async () => {
      try {
        // 1. Provera ulogovanog korisnika preko sesije
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) return; // Ako nema korisnika, ne vučemo ništa

        const currentUserId = session.user.id;

        // 2. Povlačenje svih istorijskih podataka za tog korisnika poređanih po datumu (od najnovijeg)
        const { data, error } = await supabase
          .from('daily_stats')
          .select('date, surveys_count, offers_count')
          .eq('user_id', currentUserId)
          .order('date', { ascending: false });

        if (error) throw error;
        if (data) setStats(data);

      } catch (err) {
        console.error('Greška pri učitavanju statistike:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistika();
  }, []);

  // Formatiranje datuma (npr. 29. jun 2026.)
  const formatirajDatum = (inputDate: string) => {
    const d = new Date(inputDate);
    return d.toLocaleDateString('sr-RS', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[150px] w-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 mt-8">
      {/* Naslov sekcije */}
      <div className="mb-6 flex items-center gap-2">
        <BarChart3 className="text-blue-500" size={22} />
        <h3 className="text-xl font-bold text-white tracking-tight">Istorija i Statistika</h3>
      </div>

      {/* Lista po danima */}
      {stats.length === 0 ? (
        <div className="bg-[#111622] border border-slate-800/60 rounded-2xl p-6 text-center text-slate-500 text-sm">
          Nema zabeleženih podataka za prethodne dane.
        </div>
      ) : (
        <div className="space-y-3">
          {stats.map((row) => (
            <div 
              key={row.date} 
              className="bg-[#111622] border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md hover:border-slate-700/50 transition"
            >
              {/* Datum */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 rounded-lg text-slate-400 border border-slate-800">
                  <Calendar size={18} />
                </div>
                <span className="font-semibold text-slate-200 text-base">
                  {formatirajDatum(row.date)}
                </span>
              </div>

              {/* Rezultati (Ankete i Ponude) */}
              <div className="flex items-center gap-6">
                {/* Ankete */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-950/40 text-blue-400 rounded-md">
                    <ClipboardList size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ankete</div>
                    <div className="text-base font-bold text-white">{row.surveys_count}</div>
                  </div>
                </div>

                {/* Ponude */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-950/40 text-emerald-400 rounded-md">
                    <CircleDollarSign size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ponude</div>
                    <div className="text-base font-bold text-white">{row.offers_count}</div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}