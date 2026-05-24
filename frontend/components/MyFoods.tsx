"use client";

import React, { useState } from 'react';
import { ArrowLeft, Info, Search } from 'lucide-react';
import { UserPreferences } from '../lib/data';

interface MyFoodsProps {
  onBack: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
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

export default function MyFoods({ onBack, preferences, onUpdatePreferences }: MyFoodsProps) {
  const [selectedGoTos, setSelectedGoTos] = useState<Set<string>>(new Set(preferences.goTos));
  const [willEat, setWillEat] = useState<Set<string>>(new Set(preferences.willEat));
  const [selectedSupplements, setSelectedSupplements] = useState<Set<string>>(new Set(preferences.supplements));
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchConfirmation, setShowSearchConfirmation] = useState(false);

  const allWillEatItems = WILL_EAT_CATEGORIES.flatMap(c => c.items);
  const wontEatArray = allWillEatItems.filter(item => !willEat.has(item));
  const [wontEat, setWontEat] = useState<Set<string>>(new Set(wontEatArray));

  const toggleGoTo = (item: string) => {
    const next = new Set(selectedGoTos);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setSelectedGoTos(next);
    onUpdatePreferences({ ...preferences, goTos: Array.from(next) });
  };

  const toggleWillWont = (item: string) => {
    const nextWill = new Set(willEat);
    const nextWont = new Set(wontEat);

    if (nextWill.has(item)) {
      nextWill.delete(item);
      nextWont.add(item);
    } else {
      nextWont.delete(item);
      nextWill.add(item);
    }

    setWillEat(nextWill);
    setWontEat(nextWont);
    onUpdatePreferences({ ...preferences, willEat: Array.from(nextWill) });
  };

  const toggleSupplement = (item: string) => {
    const next = new Set(selectedSupplements);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setSelectedSupplements(next);
    onUpdatePreferences({ ...preferences, supplements: Array.from(next) });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Mock adding a searched food
      const nextWill = new Set(willEat);
      nextWill.add(searchQuery.trim());
      setWillEat(nextWill);
      onUpdatePreferences({ ...preferences, willEat: Array.from(nextWill) });
      
      setShowSearchConfirmation(true);
      setSearchQuery("");
      setTimeout(() => setShowSearchConfirmation(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to today's plan
      </button>

      <div className="space-y-4">
        <h2 className="text-4xl font-serif text-[#0A192F] tracking-tight">
          My <span className="italic">Foods.</span>
        </h2>
        <p className="text-[#0A192F]/80 text-lg leading-relaxed">
          Manage your staples and preferences. Your plan updates immediately.
        </p>
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
              placeholder="Search for foods you already love"
              className="w-full bg-white border border-[#0A192F]/10 rounded-full py-4 pl-12 pr-4 text-[#0A192F] placeholder:text-[#0A192F]/40 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm"
            />
          </div>
        </form>
        
        {showSearchConfirmation && (
          <div className="absolute -bottom-10 left-0 right-0 text-center animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-sm text-[#D4AF37] font-medium italic">That's in your rotation now.</span>
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

      {/* My Go-Tos */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">My Go-Tos</h3>
        <div className="flex flex-wrap gap-2">
          {GO_TOS.map(item => {
            const isSelected = selectedGoTos.has(item);
            return (
              <button
                key={item}
                onClick={() => toggleGoTo(item)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
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
      </div>

      {/* Will Eat */}
      <div className="space-y-6 pt-6">
        {WILL_EAT_CATEGORIES.map(category => {
          const categoryWillEat = category.items.filter(item => willEat.has(item));
          const categoryWontEat = category.items.filter(item => wontEat.has(item));
          
          if (categoryWillEat.length === 0 && categoryWontEat.length === 0) return null;

          return (
            <div key={category.name} className="space-y-4">
              <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Will Eat Items */}
                {categoryWillEat.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleWillWont(item)}
                    className="px-4 py-2.5 rounded-full text-sm bg-white border border-[#0A192F]/10 text-[#0A192F] font-medium hover:bg-[#0A192F]/5 transition-colors"
                  >
                    {item}
                  </button>
                ))}
                {/* Won't Eat Items (Dimmed/Dashed) */}
                {categoryWontEat.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleWillWont(item)}
                    className="px-4 py-2.5 rounded-full text-sm bg-transparent border border-dashed border-[#0A192F]/20 text-[#0A192F]/40 hover:bg-[#0A192F]/5 transition-colors line-through decoration-[#0A192F]/20"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Supplements */}
      <div className="space-y-6 pt-6 border-t border-[#0A192F]/10">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">Your Supplements</h3>
          <p className="text-sm text-[#0A192F]/60">We'll remind you to take these.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-[#0A192F]/30 uppercase tracking-widest">Tier 1</h4>
            <div className="flex flex-wrap gap-2">
              {SUPPLEMENTS.tier1.map(item => {
                const isSelected = selectedSupplements.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleSupplement(item)}
                    className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${
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
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-[#0A192F]/30 uppercase tracking-widest">Tier 2</h4>
            <div className="flex flex-wrap gap-2">
              {SUPPLEMENTS.tier2.map(item => {
                const isSelected = selectedSupplements.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleSupplement(item)}
                    className={`px-4 py-2.5 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${
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
          </div>
        </div>
      </div>

    </div>
  );
}

