"use client";

import React from 'react';
import { DailyState } from '../lib/data';
import { Cloud, CloudRain } from 'lucide-react';
import SunGraphic from './ui/SunGraphic';

interface StateSelectorProps {
  onSelect: (state: DailyState) => void;
}

export default function StateSelector({ onSelect }: StateSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-serif text-[#0A192F] tracking-tight">How's food feeling today?</h2>
        <p className="text-[#0A192F]/70 text-lg">We'll build a plan that works for right now.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => onSelect('feeling_good')}
          className="w-full group relative overflow-hidden bg-white/60 backdrop-blur-md border border-[#0A192F]/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 flex items-center text-left"
        >
          <div className="w-12 h-12 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-300">
            <SunGraphic size={48} showRays={true} glowOpacity={0.3} />
          </div>
          <div>
            <h3 className="text-xl font-medium text-[#0A192F]">Feeling good</h3>
            <p className="text-[#0A192F]/60 mt-1">Appetite is normal, ready for regular meals.</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('not_hungry')}
          className="w-full group relative overflow-hidden bg-white/60 backdrop-blur-md border border-[#0A192F]/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 flex items-center text-left"
        >
          <div className="w-12 h-12 rounded-full bg-[#0A192F]/5 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-300">
            <Cloud className="w-6 h-6 text-[#0A192F]/60" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-[#0A192F]">Not hungry</h3>
            <p className="text-[#0A192F]/60 mt-1">Low appetite, need things that are easy to eat.</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('rough_day')}
          className="w-full group relative overflow-hidden bg-white/60 backdrop-blur-md border border-[#0A192F]/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 flex items-center text-left"
        >
          <div className="w-12 h-12 rounded-full bg-blue-900/5 flex items-center justify-center mr-5 group-hover:scale-110 transition-transform duration-300">
            <CloudRain className="w-6 h-6 text-blue-900/60" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-[#0A192F]">Rough day</h3>
            <p className="text-[#0A192F]/60 mt-1">Nothing sounds good. Keep it as simple as possible.</p>
          </div>
        </button>
      </div>
    </div>
  );
}

