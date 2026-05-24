"use client";

import React from 'react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  // Golden Hour Full Sun Motif Component (Large for Landing)
  const HeroSunMotif = () => (
    <div className="flex justify-center mb-12 relative">
      <div className="w-40 h-40 bg-gradient-to-b from-[#F4D780] to-[#D4AF37] rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)] relative z-10"></div>
      {/* Subtle rays */}
      <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-6 h-0.5 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-6 h-0.5 bg-[#D4AF37]/40 rounded-full"></div>
      
      <div className="absolute top-[-8px] left-[-8px] w-5 h-0.5 bg-[#D4AF37]/40 rounded-full rotate-45 origin-bottom-right"></div>
      <div className="absolute top-[-8px] right-[-8px] w-5 h-0.5 bg-[#D4AF37]/40 rounded-full -rotate-45 origin-bottom-left"></div>
      <div className="absolute bottom-[-8px] left-[-8px] w-5 h-0.5 bg-[#D4AF37]/40 rounded-full -rotate-45 origin-top-right"></div>
      <div className="absolute bottom-[-8px] right-[-8px] w-5 h-0.5 bg-[#D4AF37]/40 rounded-full rotate-45 origin-top-left"></div>
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

