"use client";

import React, { useState } from 'react';
import { ArrowLeft, Info, Search } from 'lucide-react';
import { UserPreferences } from '../lib/data';

interface MyGoalsProps {
  onBack: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MyGoals({ onBack, preferences, onUpdatePreferences }: MyGoalsProps) {
  const [proteinTarget, setProteinTarget] = useState<string | null>(preferences.proteinTarget ? String(preferences.proteinTarget) : null);
  const [fiberTarget, setFiberTarget] = useState<string | null>(preferences.fiberTarget ? String(preferences.fiberTarget) : null);
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [shotDay, setShotDay] = useState<string | null>(null);
  const [notificationTime, setNotificationTime] = useState("09:00");

  const handleUpdateProtein = (val: string) => {
    setProteinTarget(val);
    onUpdatePreferences({ ...preferences, proteinTarget: parseInt(val) });
  };

  const handleUpdateFiber = (val: string) => {
    setFiberTarget(val);
    onUpdatePreferences({ ...preferences, fiberTarget: parseInt(val) });
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
          My <span className="italic">Goals.</span>
        </h2>
      </div>

      {/* Daily Targets Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">DAILY TARGETS</h3>
          <p className="text-sm text-[#0A192F]/60 italic">Ask your provider for the right numbers for you.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0A192F]/5 space-y-4">
          <h4 className="font-serif text-lg text-[#0A192F]">Protein target</h4>
          <div className="flex flex-wrap gap-2">
            {['60g', '80g', '100g', '120g'].map(val => (
              <button
                key={val}
                onClick={() => handleUpdateProtein(val)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  proteinTarget === val || proteinTarget === val.replace('g', '')
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-transparent border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                }`}
              >
                {val}
              </button>
            ))}
            <button className="px-5 py-2.5 rounded-full text-sm font-medium border border-dashed border-[#0A192F]/30 text-[#0A192F]/50 bg-transparent hover:bg-[#0A192F]/5 transition-colors">
              Custom
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0A192F]/5 space-y-4">
          <h4 className="font-serif text-lg text-[#0A192F]">Fiber target</h4>
          <div className="flex flex-wrap gap-2">
            {['25g', '30g', '35g'].map(val => (
              <button
                key={val}
                onClick={() => handleUpdateFiber(val)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  fiberTarget === val || fiberTarget === val.replace('g', '')
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-transparent border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
                }`}
              >
                {val}
              </button>
            ))}
            <button className="px-5 py-2.5 rounded-full text-sm font-medium border border-dashed border-[#0A192F]/30 text-[#0A192F]/50 bg-transparent hover:bg-[#0A192F]/5 transition-colors">
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Weight Section */}
      <div className="space-y-6 pt-4">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">CURRENT WEIGHT</h3>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0A192F]/5 flex items-center justify-between">
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="184"
              className="bg-transparent text-2xl font-serif text-[#0A192F] focus:outline-none w-32"
            />
            <span className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">LBS</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">GOAL WEIGHT</h3>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0A192F]/5 flex items-center justify-between">
            <input
              type="number"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              placeholder="160"
              className="bg-transparent text-2xl font-serif text-[#0A192F] focus:outline-none w-32"
            />
            <span className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">LBS</span>
          </div>
        </div>
      </div>

      {/* Shot Day Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">SHOT DAY</h3>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setShotDay(day)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 min-w-[60px] ${
                shotDay === day || (day === 'Wed' && !shotDay) // Mock default for demo
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'bg-white border border-[#0A192F]/10 text-[#0A192F] hover:bg-[#0A192F]/5'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Time Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-bold text-[#0A192F]/40 uppercase tracking-widest">DAILY CHECK-IN TIME</h3>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#0A192F]/5 flex items-center justify-between">
          <input
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="bg-transparent text-lg font-medium text-[#0A192F] focus:outline-none"
          />
        </div>
      </div>

    </div>
  );
}

