"use client";

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface CreateAccountProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function CreateAccount({ onBack, onComplete }: CreateAccountProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we'd validate and create the account here
    if (firstName && email && password) {
      onComplete();
    }
  };

  const isFormValid = firstName.trim() !== '' && email.trim() !== '' && password.trim() !== '';

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col py-8 px-6 animate-in fade-in duration-700">
      
      <button 
        onClick={onBack}
        className="flex items-center text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="flex-grow flex flex-col">
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-serif text-[#0A192F] tracking-tight leading-tight">
            Let's <span className="italic">begin.</span>
          </h1>
          <p className="text-[#0A192F]/80 text-lg leading-relaxed">
            A few details to get you started. We keep this simple — and private.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-widest block">
              FIRST NAME
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Maya"
              className="w-full bg-white border border-[#0A192F]/10 rounded-xl px-4 py-3.5 text-[#0A192F] placeholder:text-[#0A192F]/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-widest block">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@something.com"
              className="w-full bg-white border border-[#0A192F]/10 rounded-xl px-4 py-3.5 text-[#0A192F] placeholder:text-[#0A192F]/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-widest block">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-white border border-[#0A192F]/10 rounded-xl pl-4 pr-16 py-3.5 text-[#0A192F] placeholder:text-[#0A192F]/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#0A192F]/50 hover:text-[#0A192F] transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-6 pt-8 mt-auto">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full py-4 rounded-full bg-[#0A192F] text-white font-medium hover:bg-[#0A192F]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#0A192F]/10 text-lg"
        >
          Create account
        </button>
        
        <button
          onClick={onBack} // For prototype, just goes back to landing
          className="text-sm text-[#0A192F]/60 hover:text-[#0A192F] transition-colors underline underline-offset-4 decoration-[#0A192F]/20"
        >
          Sign in instead
        </button>
      </div>

    </div>
  );
}

