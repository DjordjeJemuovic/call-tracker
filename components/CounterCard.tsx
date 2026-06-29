"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardList, CircleDollarSign, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ==========================================
// MALA POD-KOMPONENTA ZA JEDNU KARTICU
// ==========================================
interface SingleCardProps {
  title: string;
  count: number;
  labelUnderCount: string;
  icon: React.ElementType;
  buttonText: string;
  variant: 'blue' | 'green';
  isLoading: boolean;
  onButtonClick: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({
  title,
  count,
  labelUnderCount,
  icon: Icon,
  buttonText,
  variant,
  isLoading,
  onButtonClick,
}) => {
  const isBlue = variant === 'blue';
  const iconBgColor = isBlue ? 'bg-blue-950/40 text-blue-400' : 'bg-emerald-950/40 text-emerald-400';
  const buttonColor = isBlue ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  return (
    <div className="bg-[#111622] border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between w-full md:max-w-sm min-h-[220px] shadow-xl">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <span className="text-slate-400 text-lg font-medium">{title}</span>
      </div>

      <div className="my-5">
        <h2 className="text-4xl font-bold text-white tracking-tight">{count}</h2>
        <p className="text-slate-500 text-sm mt-0.5">{labelUnderCount}</p>
      </div>

      <button
        onClick={onButtonClick}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200 text-sm tracking-wide disabled:opacity-50 ${buttonColor}`}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <span className="text-lg font-light">+</span>
            {buttonText.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
};

// ==========================================
// GLAVNA KOMPONENTA (CounterCard)
// ==========================================
export default function CounterCard() {
  const [surveys, setSurveys] = useState(0);
  const [offers, setOffers] = useState(0);
  
  // ID ulogovanog korisnika
  const [userId, setUserId] = useState<string | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSurvey, setLoadingSurvey] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(false);

  const danasnjiDatum = new Date().toISOString().split('T')[0];

  // Provera sesije i povlačenje podataka za ulogovanog korisnika
  useEffect(() => {
    const proveriKorisnikaIPovuciPodatke = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Ako niko nije ulogovan, preusmeri ga na /auth stranu
        if (!session?.user) {
          window.location.href = "/auth";
          return;
        }

        const currentUserId = session.user.id;
        setUserId(currentUserId);

        // Povlačenje podataka IZMENJENO: filtriramo po datumu I po user_id-ju
        const { data } = await supabase
          .from('daily_stats')
          .select('surveys_count, offers_count')
          .eq('date', danasnjiDatum)
          .eq('user_id', currentUserId)
          .maybeSingle();

        if (data) {
          setSurveys(data.surveys_count);
          setOffers(data.offers_count);
        }
      } catch (err) {
        console.error('Greška pri učitavanju podataka:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    proveriKorisnikaIPovuciPodatke();
  }, [danasnjiDatum]);

  // Povećavanje Anketa (UPSERT sa user_id)
  const handleAddSurvey = async () => {
    if (!userId) return;
    setLoadingSurvey(true);
    const sledeciBroj = surveys + 1;
    try {
      const { error } = await supabase
        .from('daily_stats')
        .upsert({ 
          user_id: userId,
          date: danasnjiDatum, 
          surveys_count: sledeciBroj,
          offers_count: offers 
        });

      if (error) throw error;
      setSurveys(sledeciBroj);
    } catch (err) {
      console.error('Greška sa bazom (ankete):', err);
    } finally {
      setLoadingSurvey(false);
    }
  };

  // Povećavanje Ponuda (UPSERT sa user_id)
  const handleAddOffer = async () => {
    if (!userId) return;
    setLoadingOffer(true);
    const sledeciBroj = offers + 1;
    try {
      const { error } = await supabase
        .from('daily_stats')
        .upsert({ 
          user_id: userId,
          date: danasnjiDatum, 
          surveys_count: surveys, 
          offers_count: sledeciBroj
        });

      if (error) throw error;
      setOffers(sledeciBroj);
    } catch (err) {
      console.error('Greška sa bazom (ponude):', err);
    } finally {
      setLoadingOffer(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[220px] w-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 pb-24 md:pb-4">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
        <SingleCard
          title="Ankete"
          count={surveys}
          labelUnderCount="danas"
          icon={ClipboardList}
          buttonText="Anketa"
          variant="blue"
          isLoading={loadingSurvey}
          onButtonClick={handleAddSurvey}
        />

        <SingleCard
          title="Ponude"
          count={offers}
          labelUnderCount="danas"
          icon={CircleDollarSign}
          buttonText="Ponuda"
          variant="green"
          isLoading={loadingOffer}
          onButtonClick={handleAddOffer}
        />
      </div>

   
    </div>
  );
}