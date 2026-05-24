"use client";

import React, { useState, useEffect } from 'react';
import StateSelector from '../components/StateSelector';
import DailyPlan from '../components/DailyPlan';
import OnboardingFlow from '../components/OnboardingFlow';
import MyFoods from '../components/MyFoods';
import MyGoals from '../components/MyGoals';
import Navigation from '../components/Navigation';
import Landing from '../components/Landing';
import CreateAccount from '../components/CreateAccount';
import { DailyState, UserPreferences } from '../lib/data';

type ViewState = 'landing' | 'create-account' | 'onboarding' | 'home' | 'my-foods' | 'my-goals';

interface DailySession {
  date: string;
  state: DailyState;
  selectedItems: string[];
  isCompleted?: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [preferences, setPreferences] = useState<UserPreferences>({ goTos: [], willEat: [], supplements: [] });
  const [userName, setUserName] = useState<string>('Maya'); // Default fallback
  
  const [session, setSession] = useState<DailySession | null>(null);
  const [draftState, setDraftState] = useState<DailyState | null>(null);

  // Reset session if it's a new calendar day
  useEffect(() => {
    const today = new Date().toDateString();
    if (session && session.date !== today) {
      setSession(null);
      setDraftState(null);
    }
  }, [session]);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setCurrentView('home');
  };

  const handleSaveSession = (items: string[], isCompleted?: boolean) => {
    setSession(prev => ({
      date: new Date().toDateString(),
      state: prev ? prev.state : draftState!,
      selectedItems: items,
      isCompleted: isCompleted !== undefined ? isCompleted : prev?.isCompleted
    }));
  };

  // Background Sun Graphic for Wide Screens
  const BackgroundSun = () => (
    <div className="hidden md:block fixed top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#F4D780]/20 to-transparent rounded-full blur-3xl"></div>
      {/* Subtle rays */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent rotate-12"></div>
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -rotate-12"></div>
    </div>
  );

  // If we are on the landing page, render it without the global layout constraints
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5E6C8] text-[#0A192F] selection:bg-[#D4AF37]/30 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[500px] bg-[#FDFBF7] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative min-h-[600px] max-h-[820px] flex flex-col">
          <Landing onStart={() => setCurrentView('create-account')} />
        </div>
      </div>
    );
  }

  // If we are on the create account page, render it without the global layout constraints
  if (currentView === 'create-account') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5E6C8] text-[#0A192F] selection:bg-[#D4AF37]/30 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[500px] bg-[#FDFBF7] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative min-h-[600px] max-h-[820px] flex flex-col">
          <CreateAccount 
            onBack={() => setCurrentView('landing')} 
            onComplete={(name) => {
              setUserName(name);
              setCurrentView('onboarding');
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#F5E6C8] text-[#0A192F] selection:bg-[#D4AF37]/30 relative flex flex-col md:items-center md:justify-center md:py-24">
      
      {/* Global Background Graphic */}
      {currentView !== 'onboarding' && <BackgroundSun />}

      {/* Persistent Navigation */}
      {currentView !== 'onboarding' && (
        <Navigation 
          currentView={currentView === 'home' ? 'home' : currentView} 
          onNavigate={(view) => setCurrentView(view)} 
        />
      )}

      {/* Main Content Area */}
      <main className={`relative z-10 w-full md:max-w-[500px] md:bg-[#FDFBF7] md:rounded-[2rem] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:min-h-[600px] md:max-h-[820px] md:overflow-hidden mx-auto flex flex-col ${currentView !== 'onboarding' ? 'pt-24 md:pt-0 pb-32 md:pb-0' : ''}`}>
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-6 md:px-8 py-6 md:py-8 min-h-full flex flex-col relative">
            {currentView === 'onboarding' && (
              <OnboardingFlow userName={userName} onComplete={handleOnboardingComplete} />
            )}

            {currentView === 'home' && (
              <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
                {!session && !draftState ? (
                  <StateSelector onSelect={setDraftState} />
                ) : (
                  <DailyPlan 
                    state={session ? session.state : draftState!} 
                    preferences={preferences}
                    initialItems={session ? session.selectedItems : []}
                    initialView={session ? 'saved' : 'draft'}
                    isCompleted={session?.isCompleted}
                    onSaveSession={handleSaveSession}
                    onBackToStateSelector={() => setDraftState(null)}
                  />
                )}
              </div>
            )}

            {currentView === 'my-foods' && (
              <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
                <MyFoods onBack={() => setCurrentView('home')} preferences={preferences} onUpdatePreferences={setPreferences} />
              </div>
            )}

            {currentView === 'my-goals' && (
              <div className="animate-in fade-in duration-500 flex-1 flex flex-col">
                <MyGoals onBack={() => setCurrentView('home')} preferences={preferences} onUpdatePreferences={setPreferences} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

