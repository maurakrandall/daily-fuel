"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronRight, Sun, Clock } from 'lucide-react';
import { UserPreferences } from '../lib/data';

interface OnboardingFlowProps {
  onComplete: (prefs: UserPreferences) => void;
}

const GO_TOS = [
  "Protein shake", "Protein bar", "Protein powder", "Hard-boiled eggs", 
  "Mixed nuts", "Beef/turkey jerky", "Bone broth", "String cheese"
];

const WILL_EAT_CATEGORIES = [
  {
    name: "Protein Boosters",
    items: ["Chicken", "Turkey", "Lean beef", "Canned tuna", "Salmon", "Shrimp", "White fish", "Eggs", "Greek yogurt", "Cottage cheese", "Cheese snacks", "Protein smoothie", "Protein overnight oats"]
  },
  {
    name: "Double Wins",
    items: ["Edamame", "Beans", "Lentils", "Tofu", "Hummus"]
  },
  {
    name: "Crunchy Staples",
    items: ["Almonds", "Pistachios", "Peanuts", "Cashews", "Brazil nuts", "Hazelnuts", "Macadamia nuts", "Hemp seeds", "Pumpkin seeds", "Chia seeds", "Flaxseeds", "Sunflower seeds"]
  },
  {
    name: "Fresh Add-Ons",
    items: ["Broccoli", "Brussels sprouts", "Leafy greens", "Carrots", "Sweet potato", "Avocado", "Berries", "Apples", "Pears", "Pomegranate seeds", "Prunes", "Guava", "Banana"]
  },
  {
    name: "Gentle Helpers",
    items: ["Toast", "Crackers", "Soup"]
  }
];

const SUPPLEMENTS = {
  tier1: ["Fiber supplement", "Fiber gummies", "Magnesium glycinate", "Magnesium citrate", "Probiotics", "B12"],
  tier2: ["Omega-3/fish oil", "Vitamin D+Calcium", "Multivitamin", "Ginger"]
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);

  // State for collected data
  const [medicalConfirmed, setMedicalConfirmed] = useState(false);
  const [hasTargets, setHasTargets] = useState<'yes' | 'no' | null>(null);
  const [proteinTarget, setProteinTarget] = useState<string | null>(null);
  const [fiberTarget, setFiberTarget] = useState<string | null>(null);
  const [selectedGoTos, setSelectedGoTos] = useState<Set<string>>(new Set());
  const [selectedWillEat, setSelectedWillEat] = useState<Set<string>>(new Set());
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [shotDay, setShotDay] = useState<string | null>(null);
  const [selectedSupplements, setSelectedSupplements] = useState<Set<string>>(new Set());
  const [notificationTime, setNotificationTime] = useState("09:00");

  const totalSteps = 10;

  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        goTos: Array.from(selectedGoTos),
        willEat: Array.from(selectedWillEat),
        supplements: Array.from(selectedSupplements),
        proteinTarget: proteinTarget ? parseInt(proteinTarget) : undefined,
        fiberTarget: fiberTarget ? parseInt(fiberTarget) : undefined,
      });
    }
  };

  const toggleSetItem = (set: Set<string>, item: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    const newSet = new Set(set);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setter(newSet);
  };

  // Golden Hour Sun Motif Component (Half Sun)
  const HalfSunMotif = () => (
    <div className="flex justify-center mb-8">
      <div className="w-12 h-6 bg-[#D4AF37] rounded-b-full opacity-90"></div>
    </div>
  );

  // Golden Hour Full Sun Motif Component
  const FullSunMotif = () => (
    <div className="flex justify-center mb-8 relative">
      <div className="w-16 h-16 bg-gradient-to-b from-[#F4D780] to-[#D4AF37] rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] relative z-10"></div>
      {/* Subtle rays */}
      <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0.5 h-3 bg-[#D4AF37]/30 rounded-full"></div>
      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0.5 h-3 bg-[#D4AF37]/30 rounded-full"></div>
      <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-3 h-0.5 bg-[#D4AF37]/30 rounded-full"></div>
      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-3 h-0.5 bg-[#D4AF37]/30 rounded-full"></div>
      <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#D4AF37]/30 rounded-full rotate-45 origin-bottom-right"></div>
      <div className="absolute top-0 right-0 w-2 h-0.5 bg-[#D4AF37]/30 rounded-full -rotate-45 origin-bottom-left"></div>
      <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-[#D4AF37]/30 rounded-full -rotate-45 origin-top-right"></div>
      <div className="absolute bottom-0 right-0 w-2 h-0.5 bg-[#D4AF37]/30 rounded-full rotate-45 origin-top-left"></div>
    </div>
  );

  // Progress Bar Component
  const ProgressBar = () => (
    <div className="flex items-center justify-between w-full mb-12">
      <div className="flex gap-1 flex-grow mr-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 flex-grow rounded-full ${i < step ? 'bg-[#D4AF37]' : 'bg-[#0A192F]/10'}`}
          />
        ))}
      </div>
      <div className="text-xs font-medium text-[#0A192F]/40 tracking-widest">
        {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
      </div>
    </div>
  );

  // --- Sun Arc Time Picker Component ---
  const SunArcPicker = () => {
    const [isDragging, setIsDragging] = useState(false);
    const arcRef = useRef<HTMLDivElement>(null);

    // Convert "HH:MM" to minutes since midnight
    const timeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Convert minutes since midnight to "HH:MM"
    const minutesToTime = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // Format time for display (e.g., "9:00 AM")
    const formatDisplayTime = (timeStr: string) => {
      const [hoursStr, minutesStr] = timeStr.split(':');
      let hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return { time: `${hours}:${minutesStr}`, ampm };
    };

    // Range: 6 AM (360 mins) to 8 PM (1200 mins)
    const MIN_TIME = 360;
    const MAX_TIME = 1200;
    const TOTAL_RANGE = MAX_TIME - MIN_TIME;

    const currentMins = Math.max(MIN_TIME, Math.min(MAX_TIME, timeToMinutes(notificationTime)));
    
    // Calculate position (0 to 1)
    const progress = (currentMins - MIN_TIME) / TOTAL_RANGE;
    
    // Calculate X and Y on the semi-circle
    // Angle goes from 180deg (PI) to 0deg (0)
    const angle = Math.PI - (progress * Math.PI);
    const radius = 100; // Half of the 200px width
    
    // Center is at (100, 100) relative to the arc container
    const x = 100 + radius * Math.cos(angle);
    const y = 100 - radius * Math.sin(angle);

    const handleInteraction = (clientX: number) => {
      if (!arcRef.current) return;
      const rect = arcRef.current.getBoundingClientRect();
      
      // Calculate progress based on X position relative to the arc width
      // Clamp between 0 and 1
      let newProgress = (clientX - rect.left) / rect.width;
      newProgress = Math.max(0, Math.min(1, newProgress));
      
      // Convert progress back to minutes, round to nearest 15 mins
      const newMins = MIN_TIME + (newProgress * TOTAL_RANGE);
      const roundedMins = Math.round(newMins / 15) * 15;
      
      setNotificationTime(minutesToTime(roundedMins));
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      handleInteraction(clientX);
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      handleInteraction(clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
      }
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      };
    }, [isDragging]);

    const displayTime = formatDisplayTime(notificationTime);

    return (
      <div className="flex flex-col items-center w-full max-w-[280px] mx-auto">
        
        {/* Arc Container */}
        <div 
          ref={arcRef}
          className="relative w-[200px] h-[100px] mb-8 cursor-pointer touch-none"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          {/* Dotted Arc SVG */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 200 100">
            <path 
              d="M 0 100 A 100 100 0 0 1 200 100" 
              fill="none" 
              stroke="#D4AF37" 
              strokeWidth="1.5" 
              strokeDasharray="4 6" 
              className="opacity-40"
            />
            {/* Solid baseline */}
            <line x1="0" y1="100" x2="200" y2="100" stroke="#D4AF37" strokeWidth="1.5" className="opacity-60" />
          </svg>

          {/* Labels */}
          <div className="absolute top-[108px] left-0 text-[10px] font-medium text-[#0A192F]/50 -translate-x-1/2">6 AM</div>
          <div className="absolute top-[108px] left-1/2 text-[10px] font-medium text-[#0A192F]/50 -translate-x-1/2">NOON</div>
          <div className="absolute top-[108px] right-0 text-[10px] font-medium text-[#0A192F]/50 translate-x-1/2">8 PM</div>

          {/* The Sun */}
          <div 
            className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-gradient-to-b from-[#F4D780] to-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center transition-none"
            style={{ 
              left: `${x}px`, 
              top: `${y}px`,
              transform: isDragging ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {/* Inner glow */}
            <div className="w-6 h-6 rounded-full bg-white/20 blur-[2px]"></div>
          </div>
        </div>

        {/* Large Time Display */}
        <div className="flex items-baseline gap-2 mb-8 mt-4">
          <span className="text-6xl font-serif text-[#0A192F] tracking-tight">{displayTime.time}</span>
          <span className="text-2xl font-serif text-[#0A192F]/40">{displayTime.ampm}</span>
        </div>

        {/* Time Input Pill */}
        <div className="relative">
          <input
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="bg-white border border-[#0A192F]/10 rounded-full py-3 pl-6 pr-12 text-[#0A192F] font-medium focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm appearance-none"
            style={{ WebkitAppearance: 'none' }}
          />
          <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A192F]/40 pointer-events-none" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[90vh] flex flex-col py-8 animate-in fade-in duration-700">
      
      <ProgressBar />

      <div className="flex-grow flex flex-col justify-center pb-20">
        {/* Step 1: Medical Oversight */}
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <HalfSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Welcome to <span className="italic">Daily Fuel.</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                Daily Fuel is designed to support — not replace — your medical care. By continuing, you confirm you're using this medication with medical guidance.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setMedicalConfirmed(!medicalConfirmed)}
                className={`w-full flex items-center p-5 rounded-2xl border transition-all duration-300 ${
                  medicalConfirmed 
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40' 
                    : 'bg-transparent border-[#D4AF37]/40 hover:bg-[#D4AF37]/5'
                }`}
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center mr-4 transition-colors ${
                  medicalConfirmed ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-[#0A192F]/30'
                }`}>
                  {medicalConfirmed && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </div>
                <span className="text-[#0A192F] font-medium">I confirm I am under medical care.</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Privacy Commitment (1a) */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <FullSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Your data stays <span className="italic">yours.</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                We don't sell your data, share it with insurers, or use it for advertising. Daily Fuel exists to help you eat — that's it.
              </p>
            </div>

            <div className="bg-white/40 border border-[#0A192F]/5 rounded-2xl p-6 text-left space-y-4 mt-8">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-[#D4AF37] stroke-[3]" />
                </div>
                <span className="text-[#0A192F]/80 font-medium">No sale of your information</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-[#D4AF37] stroke-[3]" />
                </div>
                <span className="text-[#0A192F]/80 font-medium">No sharing with insurers or employers</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border border-[#D4AF37] flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-[#D4AF37] stroke-[3]" />
                </div>
                <span className="text-[#0A192F]/80 font-medium">No advertising profile, ever</span>
              </div>
            </div>

            <div className="pt-6">
              <button className="text-sm text-[#D4AF37] font-medium hover:text-[#D4AF37]/80 transition-colors underline underline-offset-4 decoration-[#D4AF37]/30">
                Read our full privacy policy
              </button>
            </div>
          </div>
        )}

        {/* Step 3: My Goals - Targets (1b) */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-left">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">About You</div>
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
                Did your <span className="italic">provider</span> share daily protein or fiber targets with you?
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed">
                If they did, we'll use them to personalize your Daily Fuel.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setHasTargets('yes')}
                className={`flex-1 py-4 rounded-full font-medium transition-all duration-300 ${
                  hasTargets === 'yes'
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                }`}
              >
                Yes, I have targets
              </button>
              <button
                onClick={() => setHasTargets('no')}
                className={`flex-1 py-4 rounded-full font-medium transition-all duration-300 ${
                  hasTargets === 'no'
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                }`}
              >
                Not yet
              </button>
            </div>

            {hasTargets === 'yes' && (
              <div className="space-y-8 pt-4 animate-in fade-in duration-500">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">Protein Target · Grams/Day</h3>
                  <div className="flex flex-wrap gap-2">
                    {['60g', '80g', '100g', '120g'].map(val => (
                      <button
                        key={val}
                        onClick={() => setProteinTarget(val)}
                        className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                          proteinTarget === val
                            ? 'bg-[#0A192F] text-white shadow-md'
                            : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    <button className="px-5 py-3 rounded-full text-sm font-medium border border-dashed border-[#0A192F]/30 text-[#0A192F]/50 bg-transparent hover:bg-[#0A192F]/5 transition-colors">
                      Custom
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">Fiber Target · Grams/Day</h3>
                  <div className="flex flex-wrap gap-2">
                    {['25g', '30g', '35g'].map(val => (
                      <button
                        key={val}
                        onClick={() => setFiberTarget(val)}
                        className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                          fiberTarget === val
                            ? 'bg-[#0A192F] text-white shadow-md'
                            : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    <button className="px-5 py-3 rounded-full text-sm font-medium border border-dashed border-[#0A192F]/30 text-[#0A192F]/50 bg-transparent hover:bg-[#0A192F]/5 transition-colors">
                      Custom
                    </button>
                  </div>
                </div>

                {(proteinTarget || fiberTarget) && (
                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 flex items-start gap-3 animate-in fade-in duration-500">
                    <Sun className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="text-[#0A192F]/80 text-sm leading-relaxed">
                      <span className="italic">Perfect — we'll use those to help you close the gap.</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {hasTargets === 'no' && (
              <div className="pt-4 animate-in fade-in duration-500">
                <p className="text-[#0A192F]/80 text-lg leading-relaxed">
                  That's okay. Your provider can help set targets based on your medication and body's needs. You can add them anytime in My Goals.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: My Go-Tos */}
        {step === 4 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-left">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Your Kit</div>
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
                My <span className="italic">Go-Tos.</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed">
                These are your grab-and-go staples — the foods you reach for without thinking. Tap the ones you already eat.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              {GO_TOS.map(item => {
                const isSelected = selectedGoTos.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleSetItem(selectedGoTos, item, setSelectedGoTos)}
                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#0A192F] text-white shadow-md'
                        : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>}
                    {item}
                  </button>
                );
              })}
            </div>

            {selectedGoTos.size > 0 && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in duration-500 mt-8">
                <Sun className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <p className="text-[#0A192F]/80 text-sm">
                  <span className="font-bold">{selectedGoTos.size}</span> in your corner. Add more anytime.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Will Eat / Won't Eat */}
        {step === 5 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-left">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Your Kit</div>
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
                Will eat. <span className="italic text-[#0A192F]/40">Won't eat.</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed">
                Tap the foods that don't work for you. Skip the rest. Nothing is permanent — change anytime.
              </p>
            </div>

            <div className="space-y-10 pt-4">
              {WILL_EAT_CATEGORIES.map(category => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map(item => {
                      // Inverted logic for the new design: selected = won't eat (dimmed)
                      const isWontEat = selectedWillEat.has(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleSetItem(selectedWillEat, item, setSelectedWillEat)}
                          className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 ${
                            isWontEat
                              ? 'bg-transparent text-[#0A192F]/40 border border-dashed border-[#0A192F]/20 hover:bg-[#0A192F]/5 line-through decoration-[#0A192F]/20'
                              : 'bg-white text-[#0A192F] font-medium border border-[#0A192F]/10 hover:bg-[#0A192F]/5'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Optional Weight */}
        {step === 6 && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <HalfSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Current <span className="italic">Weight</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                Your current weight helps us personalize your protein target. Add it now or anytime later.
              </p>
              <div className="relative max-w-[200px] mx-auto pt-2">
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent border-b-2 border-[#0A192F]/20 px-2 py-4 text-4xl text-center text-[#0A192F] focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0A192F]/40 text-xl">lbs</span>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-[#0A192F]/10">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Goal <span className="italic">Weight</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                Your goal helps us celebrate progress with you. Add it whenever you're ready.
              </p>
              <div className="relative max-w-[200px] mx-auto pt-2">
                <input
                  type="number"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent border-b-2 border-[#0A192F]/20 px-2 py-4 text-4xl text-center text-[#0A192F] focus:outline-none focus:border-[#D4AF37] transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0A192F]/40 text-xl">lbs</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Shot Day */}
        {step === 7 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <HalfSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Shot <span className="italic">Day</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                What day do you take your shot?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setShotDay(day)}
                  className={`py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    shotDay === day
                      ? 'bg-[#0A192F] text-white shadow-md scale-105'
                      : 'bg-transparent text-[#0A192F]/80 border border-[#0A192F]/20 hover:bg-[#0A192F]/5'
                  } ${day === 'Sun' ? 'col-span-2' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Supplements */}
        {step === 8 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <HalfSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                Your <span className="italic">Supplements</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                If you take any of these, tap to select. We'll include a gentle reminder in your daily plan. Capture only — we'll never recommend or prescribe.
              </p>
            </div>

            <div className="space-y-8 pt-4">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">Tier 1</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUPPLEMENTS.tier1.map(item => {
                    const isSelected = selectedSupplements.has(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleSetItem(selectedSupplements, item, setSelectedSupplements)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#0A192F] text-white shadow-md'
                            : 'bg-transparent text-[#0A192F]/80 border border-[#0A192F]/20 hover:bg-[#0A192F]/5'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">Tier 2</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUPPLEMENTS.tier2.map(item => {
                    const isSelected = selectedSupplements.has(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleSetItem(selectedSupplements, item, setSelectedSupplements)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#0A192F] text-white shadow-md'
                            : 'bg-transparent text-[#0A192F]/80 border border-[#0A192F]/20 hover:bg-[#0A192F]/5'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Notification Time */}
        {step === 9 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-left">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">YOUR RHYTHM</div>
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
                When should we <span className="italic">check in?</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed">
                A daily nudge at a time that fits your life.
              </p>
            </div>

            <div className="pt-12 pb-8">
              <SunArcPicker />
            </div>
          </div>
        )}

        {/* Step 10: Celebration */}
        {step === 10 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 text-center">
            <FullSunMotif />
            
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
                You're <span className="italic">all set.</span>
              </h2>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                {selectedGoTos.size > 0 
                  ? `You've got ${Array.from(selectedGoTos).slice(0, 2).join(', ')}${selectedGoTos.size > 2 ? ', and more' : ''} in your corner.`
                  : "Your profile is ready to go."}
              </p>
              <p className="text-[#0A192F]/80 text-lg leading-relaxed max-w-sm mx-auto">
                Every day, tell us how eating feels — and we'll build your Daily Fuel from there.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent pb-8">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button
            onClick={nextStep}
            disabled={(step === 1 && !medicalConfirmed) || (step === 3 && hasTargets === null)}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#0A192F]/10 text-lg"
          >
            {step === 1 ? "Let's get started" : step === totalSteps ? "Start my day" : step === 9 ? "I'm ready" : "Next"}
          </button>
          
          {/* Skip links for optional steps */}
          {(step === 6 || step === 7 || step === 8) && (
            <button
              onClick={nextStep}
              className="w-full py-2 text-[#0A192F]/50 font-medium hover:text-[#0A192F] transition-colors text-sm"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

