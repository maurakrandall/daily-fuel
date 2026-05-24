"use client";

import React, { useState, useMemo } from 'react';
import { DailyState, FoodItem, generatePlan, UserPreferences, mockFoodDatabase } from '../lib/data';
import FoodCard from './FoodCard';
import { ArrowLeft, Search } from 'lucide-react';

interface DailyPlanProps {
  state: DailyState;
  preferences: UserPreferences;
  initialItems?: string[];
  initialView?: 'draft' | 'saved';
  isCompleted?: boolean;
  onSaveSession: (items: string[], isCompleted?: boolean) => void;
  onBackToStateSelector: () => void;
}

type PlanView = 'pre-plan' | 'draft' | 'celebration' | 'saved' | 'close-gap' | 'soft-exit';

const GAP_SUGGESTIONS: FoodItem[] = mockFoodDatabase.filter(f => 
  ['Greek yogurt', 'Hard-boiled eggs', 'Edamame', 'Mixed nuts', 'String cheese', 'Hummus + veggies', 'Berries', 'Avocado', 'Banana', 'Peanut butter on toast'].includes(f.name)
);

export default function DailyPlan({ state, preferences, initialItems = [], initialView = 'draft', isCompleted = false, onSaveSession, onBackToStateSelector }: DailyPlanProps) {
  // If we're starting fresh (draft) and have Go-Tos, show the pre-plan screen first
  const startView = initialView === 'draft' && preferences.goTos.length > 0 ? 'pre-plan' : initialView;
  
  const [view, setView] = useState<PlanView>(startView);
  const [plan] = useState<FoodItem[]>(() => generatePlan(state, [...preferences.goTos, ...preferences.willEat]));
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(initialItems));
  const [showEndOfDayPrompt, setShowEndOfDayPrompt] = useState(false);
  
  // Search state for Close the Gap
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchConfirmation, setShowSearchConfirmation] = useState(false);

  const allFoods = useMemo(() => {
    // Combine plan, gap suggestions, and all mock database items to ensure we can find any selected food
    const combined = [...plan, ...GAP_SUGGESTIONS, ...mockFoodDatabase];
    // Deduplicate by ID
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  }, [plan]);

  // Get the user's Go-To foods for the pre-plan screen
  const goToFoods = useMemo(() => {
    return preferences.goTos.map(name => {
      const found = allFoods.find(f => f.name === name);
      if (found) return found;
      // Fallback if not in mock db
      return {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name,
        category: 'go-to',
        role: 'protein',
        effort_level: 'grab-and-go',
        benefit_label: 'Reliable staple',
        protein_g: 5,
        fiber_g: 0,
        serving_size: '1 serving'
      } as FoodItem;
    });
  }, [preferences.goTos, allFoods]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock adding a searched food to the plan
      const mockId = `search-${Date.now()}`;
      const newFood: FoodItem = {
        id: mockId,
        name: searchQuery.trim(),
        category: 'will-eat',
        role: 'both',
        effort_level: 'minimal-prep',
        benefit_label: 'Great choice',
        protein_g: 8,
        fiber_g: 3,
        serving_size: '1 serving'
      };
      
      // In a real app, we'd add this to the global food database/plan
      // For the prototype, we'll just show the confirmation
      setShowSearchConfirmation(true);
      setSearchQuery("");
      setTimeout(() => setShowSearchConfirmation(false), 3000);
    }
  };

  const getHeaderMessage = () => {
    switch (state) {
      case 'feeling_good':
        return "Good day to close the gap. Here's what could work.";
      case 'not_hungry':
        return "Even a little can help close the gap. Here's what could work.";
      case 'rough_day':
        return "Rough day or not, small wins still count.";
    }
  };

  const getPrePlanHeader = () => {
    switch (state) {
      case 'feeling_good':
        return {
          title: <>Any <span className="italic font-serif">go-tos</span> so far today?</>,
          sub: "Even something small counts toward today."
        };
      case 'not_hungry':
        return {
          title: <><span className="italic font-serif">Anything</span> so far? Even a shake or coffee counts.</>,
          sub: "Sometimes autopilot does more than we think."
        };
      case 'rough_day':
        return {
          title: <>Anything today? Even the <span className="italic font-serif">small stuff</span> counts.</>,
          sub: "We'll build from wherever today started."
        };
    }
  };

  const getStateSpecificWinMessage = () => {
    switch (state) {
      case 'rough_day':
        return "On a rough day, showing up is the win. You did more than that.";
      case 'not_hungry':
        return "Low appetite, still fueled. That's how it's done.";
      case 'feeling_good':
        return "Good days like this are where the gap really closes. Nice work.";
    }
  };

  const { totalProtein, totalFiber } = useMemo(() => {
    let p = 0;
    let f = 0;
    selectedItems.forEach(id => {
      // Check all possible sources for the item
      const item = allFoods.find(food => food.id === id) || goToFoods.find(food => food.id === id);
      if (item) {
        p += item.protein_g || 0;
        f += item.fiber_g || 0;
      }
    });
    return { totalProtein: p, totalFiber: f };
  }, [selectedItems, allFoods, goToFoods]);

  const barWidth = Math.min(100, selectedItems.size * 25);

  const renderRunningTotalAndBar = (label = "ESTIMATED SO FAR:") => (
    <div className="space-y-3 bg-white/40 rounded-2xl p-5 border border-[#0A192F]/5">
      <div className="flex items-center justify-between">
        <span className="text-[#0A192F]/80 font-bold text-[10px] uppercase tracking-widest">{label}</span>
        <span className="text-[#D4AF37] font-medium text-sm">
          ~{totalProtein}g protein · ~{totalFiber}g fiber
        </span>
      </div>
      <div className="h-3 w-full bg-[#0A192F]/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#FDFBF7] to-[#D4AF37] transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${barWidth}%` }}
        />
      </div>
      {view !== 'pre-plan' && (
        <div className={`text-sm text-[#0A192F]/60 transition-opacity duration-500 ${selectedItems.size > 0 ? 'opacity-100' : 'opacity-0'}`}>
          You're closing the gap.
        </div>
      )}
    </div>
  );

  const renderSupplementsReminder = () => {
    if (preferences.supplements.length === 0) return null;
    return (
      <div className="pt-6 border-t border-[#0A192F]/10">
        <div className="bg-[#0A192F]/5 rounded-2xl p-5 border border-[#0A192F]/10">
          <h3 className="font-medium text-[#0A192F] mb-1">Your Supplements</h3>
          <p className="text-sm text-[#0A192F]/60 mb-3">Don't forget your supplements today.</p>
          <div className="flex flex-wrap gap-2">
            {preferences.supplements.map(sup => (
              <span key={sup} className="px-3 py-1.5 bg-white rounded-full text-sm text-[#0A192F]/80 shadow-sm border border-[#0A192F]/5">
                {sup}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- PRE-PLAN SCREEN (A2) ---
  if (view === 'pre-plan') {
    const header = getPrePlanHeader();
    return (
      <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        <button 
          onClick={onBackToStateSelector}
          className="flex items-center text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">CHECKING IN</div>
            <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
              {header.title}
            </h2>
            <p className="text-[#0A192F]/80 text-lg leading-relaxed">
              {header.sub}
            </p>
          </div>
          
          {renderRunningTotalAndBar("SO FAR TODAY")}
        </div>

        <div className="space-y-3">
          {goToFoods.map((food, index) => (
            <div 
              key={food.id} 
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <FoodCard 
                food={food} 
                isSelected={selectedItems.has(food.id)}
                onToggle={() => toggleItem(food.id)}
                isPrePlan={true}
              />
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <button 
            onClick={() => setView('draft')}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
          >
            Let's close the gap
          </button>
          <button 
            onClick={() => {
              setSelectedItems(new Set()); // Clear selections if they skip
              setView('draft');
            }}
            className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors underline underline-offset-4"
          >
            Skip — start fresh
          </button>
        </div>
      </div>
    );
  }

  if (view === 'celebration') {
    const hasProtein = totalProtein > 0;
    const hasFiber = totalFiber > 0;

    const renderWinTitle = () => {
      if (hasProtein && hasFiber) {
        return <>You just lined up <span className="text-[#D4AF37]">~{totalProtein}g</span> of protein and <span className="text-[#D4AF37]">~{totalFiber}g</span> of fiber. That's a real win.</>;
      } else if (hasProtein && !hasFiber) {
        return <>You just lined up <span className="text-[#D4AF37]">~{totalProtein}g</span> of protein. Good start — closing the fiber gap is one tap away.</>;
      } else if (!hasProtein && hasFiber) {
        return <>You just lined up <span className="text-[#D4AF37]">~{totalFiber}g</span> of fiber. Good start — closing the protein gap is one tap away.</>;
      } else {
        return <>You showed up today. That counts. Want to add something to close the gap?</>;
      }
    };

    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] to-[#F4D780]/40 -z-10 pointer-events-none rounded-[2rem]" />
        <div className="w-full max-w-md mx-auto min-h-[60vh] flex flex-col justify-center text-center animate-in fade-in duration-1000 py-12">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
              {renderWinTitle()}
            </h2>
            <p className="text-xl text-[#0A192F]/80 leading-relaxed">
              {getStateSpecificWinMessage()}
            </p>
          </div>

          <div className="mt-16 space-y-4">
            <p className="text-sm text-[#0A192F]/50 font-medium mb-6">
              We'll check in tomorrow. Same time, same place — your Go-Tos will be ready.
            </p>
            <button 
              onClick={() => {
                onSaveSession(Array.from(selectedItems));
                setView('saved');
              }}
              className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
            >
              See my plan
            </button>
          </div>
        </div>
      </>
    );
  }

  if (view === 'soft-exit') {
    return (
      <div className="w-full max-w-md mx-auto min-h-[60vh] flex flex-col justify-center text-center animate-in fade-in duration-1000 py-12">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
            That's okay.
          </h2>
          <p className="text-xl text-[#0A192F]/80 leading-relaxed">
            Your Go-Tos are here whenever you're ready.
          </p>
        </div>

        <div className="mt-16 space-y-4">
          <button 
            onClick={() => {
              onSaveSession(Array.from(selectedItems));
              setView('saved');
            }}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
          >
            See my plan
          </button>
        </div>
      </div>
    );
  }

  if (view === 'close-gap') {
    const selectedNames = new Set(
      Array.from(selectedItems).map(id => allFoods.find(f => f.id === id)?.name)
    );
    const availableSuggestions = GAP_SUGGESTIONS.filter(gs => !selectedNames.has(gs.name));

    return (
      <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 pt-4">
        <button 
          onClick={() => setView('saved')}
          className="flex items-center text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to my plan
        </button>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">ROUND 2</div>
            <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
              Here are some popular options for <span className="italic font-serif">closing the gap.</span>
            </h2>
          </div>
          {renderRunningTotalAndBar("COMBINED SO FAR")}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#D4AF37]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for something that sounds good"
                className="w-full bg-white border border-[#0A192F]/10 rounded-full py-4 pl-12 pr-4 text-[#0A192F] placeholder:text-[#0A192F]/40 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm"
              />
            </div>
          </form>
          
          {showSearchConfirmation && (
            <div className="absolute -bottom-10 left-0 right-0 text-center animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-sm text-[#D4AF37] font-medium italic font-serif">Added to today's plan — and saved to My Foods.</span>
            </div>
          )}
          
          {searchQuery && !showSearchConfirmation && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#0A192F]/10 rounded-2xl p-4 shadow-lg z-10">
              <button 
                onClick={handleSearch}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#0A192F]/5 transition-colors flex items-center justify-between"
              >
                <span className="text-[#0A192F] font-medium">Add "{searchQuery}"</span>
                <span className="text-xs text-[#0A192F]/40 uppercase tracking-widest">Custom</span>
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {availableSuggestions.map((food, index) => (
            <div 
              key={food.id} 
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <FoodCard 
                food={food} 
                isSelected={selectedItems.has(food.id)}
                onToggle={() => toggleItem(food.id)}
              />
            </div>
          ))}
        </div>

        <p className="text-sm text-[#0A192F]/60 text-center italic font-serif px-4 pt-4">
          Like something new? Add it to My Foods and it'll show up in your plan next time.
        </p>

        <div className="pt-4">
          <button 
            onClick={() => setView('celebration')}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
          >
            Save to my plan
          </button>
        </div>
      </div>
    );
  }

  if (view === 'saved') {
    // Include both plan foods and go-tos that were selected
    const savedFoods = [...allFoods, ...goToFoods].filter((f, index, self) => 
      selectedItems.has(f.id) && self.findIndex(t => t.id === f.id) === index
    );

    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] to-[#F5E6C8]/80 -z-10 pointer-events-none rounded-[2rem]" />
        <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif text-[#0A192F] tracking-tight leading-tight">
                Today's Plan
              </h2>
              {isCompleted && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#0A192F]/5 text-[#0A192F]/60 uppercase tracking-wider">
                  Completed
                </span>
              )}
            </div>
            {renderRunningTotalAndBar()}
          </div>

          <div className="space-y-3">
            {savedFoods.length > 0 ? savedFoods.map((food, index) => (
              <div 
                key={food.id} 
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
              >
                <FoodCard 
                  food={food} 
                  isSelected={true}
                  onToggle={() => { if (!isCompleted) toggleItem(food.id); }}
                />
              </div>
            )) : (
              <div className="text-center py-8 text-[#0A192F]/60 italic font-serif">
                No foods selected yet.
              </div>
            )}
          </div>

          {renderSupplementsReminder()}

          {isCompleted ? (
            <div className="pt-8 border-t border-[#0A192F]/10 text-center animate-in fade-in duration-500">
              <h3 className="text-lg font-medium text-[#0A192F]">Nice work today. We'll check in tomorrow.</h3>
              <p className="text-sm text-[#0A192F]/50 mt-2">Same time, same place — your Go-Tos will be ready.</p>
            </div>
          ) : showEndOfDayPrompt ? (
            <div className="pt-8 border-t border-[#0A192F]/10 animate-in fade-in duration-500">
              <h3 className="text-xl font-serif text-[#0A192F] mb-4 text-center">How'd today go?</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onSaveSession(Array.from(selectedItems), true)}
                  className="w-full p-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#0A192F] font-medium hover:bg-[#D4AF37]/20 transition-colors text-center"
                >
                  Nailed it
                </button>
                <button 
                  onClick={() => onSaveSession(Array.from(selectedItems), true)}
                  className="w-full p-4 rounded-xl border border-[#0A192F]/10 bg-[#FDFBF7] text-[#0A192F] font-medium hover:bg-white transition-colors text-center"
                >
                  Survived it
                </button>
                <button 
                  onClick={() => onSaveSession(Array.from(selectedItems), true)}
                  className="w-full p-4 rounded-xl border border-transparent bg-[#0A192F]/5 text-[#0A192F]/70 font-medium hover:bg-[#0A192F]/10 transition-colors text-center"
                >
                  Skipped it
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-8 flex flex-col items-center">
              {selectedItems.size > 0 ? (
                <button 
                  onClick={() => setView('close-gap')}
                  className="w-full py-4 rounded-full bg-transparent border-2 border-[#0A192F] text-[#0A192F] font-medium hover:bg-[#0A192F]/5 transition-all text-lg"
                >
                  Close the gap
                </button>
              ) : (
                <button 
                  onClick={() => setView('draft')}
                  className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
                >
                  Add foods
                </button>
              )}
              <button 
                onClick={() => setShowEndOfDayPrompt(true)}
                className="mt-6 text-sm text-[#0A192F]/50 hover:text-[#0A192F] transition-colors underline underline-offset-4"
              >
                Done for today?
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  // Default: 'draft' view (The actual Daily Plan)
  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <button 
        onClick={onBackToStateSelector}
        className="flex items-center text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Change how I'm feeling
      </button>

      <div className="space-y-6">
        <h2 className="text-3xl font-serif text-[#0A192F] tracking-tight leading-tight">
          {getHeaderMessage()}
        </h2>
        {renderRunningTotalAndBar()}
      </div>

      <div className="space-y-3">
        {plan.length > 0 ? plan.map((food, index) => (
          <div 
            key={food.id} 
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <FoodCard 
              food={food} 
              isSelected={selectedItems.has(food.id)}
              onToggle={() => toggleItem(food.id)}
            />
          </div>
        )) : (
          <div className="text-center py-8 text-[#0A192F]/60 italic font-serif">
            No foods selected during onboarding.
          </div>
        )}
      </div>

      {renderSupplementsReminder()}

      <div className="pt-8 flex flex-col items-center gap-4">
        {selectedItems.size > 0 ? (
          <button 
            onClick={() => setView('celebration')}
            className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all shadow-lg shadow-[#0A192F]/10 text-lg"
          >
            Save my plan
          </button>
        ) : (
          <button 
            onClick={() => setView('soft-exit')}
            className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors underline underline-offset-4"
          >
            Not feeling it right now
          </button>
        )}
      </div>
    </div>
  );
}

