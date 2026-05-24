"use client";

import React from 'react';
import { Sun, Heart, User, UserCircle } from 'lucide-react';

type ViewState = 'home' | 'my-foods' | 'my-goals';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as ViewState, label: 'Today', icon: Sun },
    { id: 'my-foods' as ViewState, label: 'My Foods', icon: Heart },
    { id: 'my-goals' as ViewState, label: 'My Goals', icon: User },
  ];

  return (
    <>
      {/* WIDE VIEW (≥ 768px) - Top Navigation */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4D780] to-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
            <span className="font-serif text-xl font-medium tracking-tight text-[#0A192F]">
              Daily Fuel
            </span>
          </div>

          {/* Center Nav Pills */}
          <div className="flex items-center bg-white/50 border border-[#0A192F]/5 rounded-full p-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#0A192F] text-white shadow-md' 
                      : 'text-[#0A192F]/60 hover:text-[#0A192F] hover:bg-[#0A192F]/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Profile Icon */}
          <button className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* NARROW VIEW (< 768px) - Bottom Floating Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-[#0A192F]/10 rounded-full p-1.5 shadow-lg flex items-center gap-1 pointer-events-auto w-full max-w-[320px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#0A192F] text-white shadow-md' 
                    : 'text-[#0A192F]/50 hover:text-[#0A192F]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#D4AF37]' : ''}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

