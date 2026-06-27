"use client";

import React, { useState } from 'react';
import { ClipboardList, CircleDollarSign } from 'lucide-react';

// ==========================================
// REUSABLE KARTICA (CounterCard)
// ==========================================
interface CounterCardProps {
  title: string;
  count: number;
  labelUnderCount: string;
  icon: React.ElementType;
  buttonText: string;
  variant: 'blue' | 'green';
  onButtonClick: () => void;
}

const CounterCard: React.FC<CounterCardProps> = ({
  title,
  count,
  labelUnderCount,
  icon: Icon,
  buttonText,
  variant,
  onButtonClick,
}) => {
  const isBlue = variant === 'blue';
  const iconBgColor = isBlue ? 'bg-blue-950/40 text-blue-400' : 'bg-emerald-950/40 text-emerald-400';
  const buttonColor = isBlue ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  return (
    <div className="bg-[#111622] border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between w-full max-w-sm min-h-[220px] shadow-xl">
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
        className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200 text-sm tracking-wide ${buttonColor}`}
      >
        <span className="text-lg font-light">+</span>
        {buttonText.toUpperCase()}
      </button>
    </div>
  );
};

// ==========================================
// GLAVNA SEKCIJA SA LOKALNIM STANJEM
// ==========================================
interface AnketePonudeSekcijaProps {
  initialSurveyCount?: number;
  initialOfferCount?: number;
}

export default function AnketePonudeSekcija({ 
  initialSurveyCount = 54, 
  initialOfferCount = 23 
}: AnketePonudeSekcijaProps) {
  
  // Lokalno stanje kreće od vrednosti koje proslediš (ili default 54 i 23)
  const [surveys, setSurveys] = useState(initialSurveyCount);
  const [offers, setOffers] = useState(initialOfferCount);

  const handleAddSurvey = () => {
    setSurveys((prev) => prev + 1);
  };

  const handleAddOffer = () => {
    setOffers((prev) => prev + 1);
  };

  return (
    <div className="flex gap-6 items-center justify-center w-full p-4">
      {/* Kartica za Ankete */}
      <CounterCard
        title="Ankete"
        count={surveys}
        labelUnderCount="danas"
        icon={ClipboardList}
        buttonText="Anketa"
        variant="blue"
        onButtonClick={handleAddSurvey}
      />

      {/* Kartica za Ponude */}
      <CounterCard
        title="Ponude"
        count={offers}
        labelUnderCount="danas"
        icon={CircleDollarSign}
        buttonText="Ponuda"
        variant="green"
        onButtonClick={handleAddOffer}
      />
    </div>
  );
}