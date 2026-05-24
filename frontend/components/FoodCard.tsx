"use client";

import React, { useState } from 'react';
import { FoodItem } from '../lib/data';
import { Check, Circle } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  isSelected: boolean;
  onToggle: () => void;
  isPrePlan?: boolean;
}

export default function FoodCard({ food, isSelected, onToggle, isPrePlan = false }: FoodCardProps) {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleToggle = () => {
    if (!isSelected) {
      setIsCelebrating(true);
      setTimeout(() => setIsCelebrating(false), 2000);
    }
    onToggle();
  };

  const getMacroText = () => {
    const parts = [];
    if (food.protein_g) parts.push(`~${food.protein_g}g protein`);
    if (food.fiber_g) parts.push(`~${food.fiber_g}g fiber`);
    return parts.join(' · ');
  };

  const getCelebrationText = () => {
    const parts = [];
    if (food.protein_g) parts.push(`~${food.protein_g}g protein`);
    if (food.fiber_g) parts.push(`~${food.fiber_g}g fiber`);
    return parts.join(' + ');
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`w-full text-left relative overflow-hidden backdrop-blur-md border rounded-2xl p-5 transition-all duration-500 flex items-start min-h-[88px] ${
          isSelected 
            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-sm' 
            : 'bg-white/80 border-[#0A192F]/10 shadow-sm hover:shadow-md hover:bg-white'
        }`}
      >
        {/* Celebration Overlay */}
        <div 
          className={`absolute inset-0 bg-[#D4AF37] flex items-center justify-center z-10 transition-all duration-500 ${
            isCelebrating ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <span className="text-white font-medium text-lg tracking-wide animate-in zoom-in duration-300 delay-100">
            {getCelebrationText()}!
          </span>
        </div>

        <div className="flex-grow relative z-0 w-full pr-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-lg font-serif text-[#0A192F] transition-colors">
              {food.name}
            </h4>
            {food.role !== 'none' && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest bg-[#0A192F]/5 text-[#0A192F]/60">
                {food.role === 'both' ? 'Protein + Fiber' : food.role}
              </span>
            )}
          </div>
          
          {/* Two-line structure */}
          <div className="space-y-1">
            <p className="text-sm text-[#0A192F]/70 transition-colors">
              {food.benefit_label}
            </p>
            <p className="text-xs text-[#D4AF37] font-medium transition-colors">
              {getMacroText()}{food.protein_g || food.fiber_g ? ' · ' : ''}{food.serving_size || '1 serving'}
            </p>
          </div>
        </div>

        {/* Circular Tap Target */}
        <div className="flex-shrink-0 mt-1">
          {isSelected ? (
            <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center animate-in zoom-in duration-300">
              <Check className="w-4 h-4 text-white stroke-[3]" />
            </div>
          ) : (
            <Circle className="w-6 h-6 text-[#0A192F]/20" />
          )}
        </div>
      </button>

      {/* Pre-plan specific "In your corner" message */}
      {isPrePlan && isSelected && (
        <div className="absolute -bottom-3 right-4 bg-[#FDFBF7] px-3 py-1 rounded-full border border-[#D4AF37]/20 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300 z-20">
          <span className="text-xs text-[#D4AF37] italic font-serif">In your corner.</span>
        </div>
      )}
    </div>
  );
}

