"use client";

import React from 'react';
import SunGraphic from './ui/SunGraphic';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  // Golden Hour Full Sun Motif Component (Large for Landing)
  const HeroSunMotif = () => (
    <div className="flex justify-center mb-12 relative">
      <SunGraphic size={240} showRays={true} glowOpacity={0.6} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-8 animate-in fade-in duration-1000">
      
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <HeroSunMotif />
        
        <div className="space-y-4 mb-8">
          <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
            DAILY FUEL
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-[#0A192F] tracking-tight leading-[1.1]">
            Eating can feel <span className="italic font-serif">good</span> again.
          </h1>
          
          <p className="text-[#0A192F]/80 text-base leading-relaxed max-w-sm mx-auto">
            A gentle companion for the days food feels different — not a tracker, not a diet. Just support, day by day.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto pt-4">
        <button
          onClick={onStart}
          className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-xl shadow-[#0A192F]/10 text-base"
        >
          Create account
        </button>
        
        <button
          onClick={onStart} // For prototype, this just moves forward
          className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors underline underline-offset-4 decoration-[#0A192F]/20 pb-2"
        >
          I already have an account
        </button>
      </div>

    </div>
  );
}

