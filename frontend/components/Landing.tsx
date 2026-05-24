"use client";

import React from 'react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  // Golden Hour Full Sun Motif Component (Large for Landing)
  const HeroSunMotif = () => (
    <div className="flex justify-center mb-16 relative">
      <div className="w-48 h-48 bg-gradient-to-b from-[#F4D780] to-[#D4AF37] rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)] relative z-10"></div>
      {/* Subtle rays */}
      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-8 h-0.5 bg-[#D4AF37]/40 rounded-full"></div>
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-8 h-0.5 bg-[#D4AF37]/40 rounded-full"></div>
      
      <div className="absolute top-[-10px] left-[-10px] w-6 h-0.5 bg-[#D4AF37]/40 rounded-full rotate-45 origin-bottom-right"></div>
      <div className="absolute top-[-10px] right-[-10px] w-6 h-0.5 bg-[#D4AF37]/40 rounded-full -rotate-45 origin-bottom-left"></div>
      <div className="absolute bottom-[-10px] left-[-10px] w-6 h-0.5 bg-[#D4AF37]/40 rounded-full -rotate-45 origin-top-right"></div>
      <div className="absolute bottom-[-10px] right-[-10px] w-6 h-0.5 bg-[#D4AF37]/40 rounded-full rotate-45 origin-top-left"></div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-6 animate-in fade-in duration-1000 bg-[#FDFBF7]">
      
      <div className="w-full max-w-[460px] flex flex-col">
        <HeroSunMotif />
        
        <div className="space-y-6 mb-12">
          <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
            DAILY FUEL
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-[#0A192F] tracking-tight leading-[1.1]">
            Eating can feel <span className="italic">good</span> again.
          </h1>
          
          <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm">
            A gentle companion for the days food feels different — not a tracker, not a diet. Just support, day by day.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={onStart}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-xl shadow-[#0A192F]/10 text-lg"
          >
            Create account
          </button>
          
          <button
            onClick={onStart} // For prototype, this just moves forward
            className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors underline underline-offset-4 decoration-[#0A192F]/20"
          >
            I already have an account
          </button>
        </div>
      </div>

    </div>
  );
}

