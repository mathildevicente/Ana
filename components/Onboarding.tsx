import React, { useState } from 'react';
import { UserData } from '../types';
import { Button } from './Button';

interface OnboardingProps {
  onComplete: (data: UserData) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [pronouns, setPronouns] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && pronouns.trim()) {
      onComplete({ name: name.trim(), pronouns: pronouns.trim() });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center p-4">
       
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         <div className="bg-gradient-to-br from-[#8EC5FC] to-[#E0C3FC] absolute inset-0 opacity-20"></div>
        <div className="orb orb-red w-[600px] h-[600px] top-[-150px] left-[-150px] animate-float-slow"></div>
        <div className="orb orb-green w-[500px] h-[500px] bottom-[-100px] right-[-100px] animate-float-medium"></div>
      </div>

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-[400px] p-10 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/10 flex flex-col items-center animate-fade-in">
        
        {/* Outlined Title */}
        <div className="mb-12 text-center">
          <h1 className="text-7xl font-display font-bold text-outline tracking-tight select-none uppercase">
            ANA
          </h1>
          <div className="w-16 h-0.5 bg-white/40 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="name" className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2 pl-4">
                Nom
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-center"
                placeholder="Entrez votre nom"
                autoComplete="off"
              />
            </div>

            <div className="group">
              <label htmlFor="pronouns" className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2 pl-4">
                Pronoms
              </label>
              <input
                type="text"
                id="pronouns"
                required
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all text-center"
                placeholder="Il/Elle/Iel"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-14 text-sm tracking-widest">
              ENTRER
            </Button>
          </div>
        </form>
      </div>

      {/* Decorative Texts: 2030 */}
      <div className="absolute top-8 right-8 text-white/30 font-display font-bold text-xl tracking-widest z-0 pointer-events-none hidden md:block">
        2030
      </div>

    </div>
  );
};