"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import JungleParticles from "@/components/jungle-particles";
import {
  Trophy,
  Users,
  ShoppingCart,
  Settings,
  Flame,
  ChevronRight,
  Wifi,
  ShieldCheck,
  Map as MapIcon,
  ChevronLeft
} from "lucide-react";
import GamePlay from '@/components/game-play';

const GAME_MODES = [
  {
    id: 'temple',
    title: 'Temple of the Golden Peel',
    difficulty: 'HARD',
    reward: '50 BANANAS',
    icon: 'inventory_2',
    status: 'Temple Unlocked',
    description: 'An ancient temple filled with traps and golden rewards.',
    isAvailable: true
  },
  {
    id: 'river',
    title: 'Amazon River Run',
    difficulty: 'MEDIUM',
    reward: '30 BANANAS',
    icon: 'water_drop',
    status: 'Level 15 Required',
    description: 'Race through the dangerous rapids and avoid the piranhas.',
    isAvailable: false
  },
  {
    id: 'cave',
    title: 'Hidden Echo Cave',
    difficulty: 'EXPERT',
    reward: '100 BANANAS',
    icon: 'landscape',
    status: 'Boss Key Needed',
    description: 'A dark, mysterious cave where sound is your only guide.',
    isAvailable: false
  },
  {
    id: 'canopy',
    title: 'Canopy Glider',
    difficulty: 'EASY',
    reward: '20 BANANAS',
    icon: 'airplanemode_active',
    status: 'Free Play',
    description: 'Soar through the treetops and collect floating fruits.',
    isAvailable: false
  }
];

export default function MissionHub() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingMode, setPlayingMode] = useState<typeof GAME_MODES[0] | null>(null);

  const nextMode = () => {
    setCurrentIndex((prev) => (prev + 1) % GAME_MODES.length);
  };

  const prevMode = () => {
    setCurrentIndex((prev) => (prev - 1 + GAME_MODES.length) % GAME_MODES.length);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col text-slate-900 dark:text-slate-100">
      
      {/* 0. GAME OVERLAY */}
      {playingMode && (
        <GamePlay 
          mode={playingMode} 
          onClose={() => setPlayingMode(null)} 
        />
      )}

      {/* 1. LAYERED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Jungle background"
          className="w-full h-full object-cover opacity-20 grayscale-[0.3]"
          src="/bg1.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background-light/40 to-background-light dark:via-background-dark/40 dark:to-background-dark pointer-events-none"></div>
      </div>

      <JungleParticles />

      {/* 2. DECORATIVE VINES */}
      <div className="fixed top-0 left-10 w-2 h-64 vines opacity-40 z-0 hidden lg:block"></div>
      <div className="fixed top-0 right-10 w-2 h-48 vines opacity-40 z-0 hidden lg:block"></div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* --- HEADER --- */}
        <header className="flex items-center justify-between border-b-4 border-wood-dark/20 bg-background-light/60 dark:bg-background-dark/60 backdrop-blur-md px-6 py-4 lg:px-20 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl shadow-lg border-2 border-wood-dark transform -rotate-3">
              <span className="material-symbols-outlined text-wood-dark text-3xl">potted_plant</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black leading-tight tracking-tight text-wood-dark dark:text-primary uppercase">Banana Puzzle</h2>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-leaf-dark uppercase tracking-[0.2em] bg-leaf-dark/10 px-2 py-0.5 rounded-full">Mission Hub</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-4 bg-wood-dark/5 dark:bg-primary/5 px-4 py-2 rounded-2xl border-2 border-wood-dark/10 dark:border-primary/10">
              <div className="flex items-center gap-2 group cursor-help" title="Daily Streak">
                <Flame className="size-5 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="font-black text-sm text-wood-dark dark:text-primary">5 DAY STREAK</span>
              </div>
              <div className="h-6 w-0.5 bg-wood-dark/20 dark:bg-primary/20"></div>
              <div className="flex items-center gap-2 group cursor-help" title="Total Bananas">
                <img src="/banana.svg" alt="Banana" className="size-5 drop-shadow-sm" />
                <span className="font-black text-sm text-wood-dark dark:text-primary">12 BANANAS</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l-2 border-wood-dark/10 dark:border-primary/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-wood-dark dark:text-white uppercase tracking-tight">Golden Gorilla</p>
                <p className="text-xs font-bold text-leaf-dark dark:text-primary/70">Level 42 Explorer</p>
              </div>
              <div className="size-12 rounded-2xl border-4 border-wood-dark shadow-xl overflow-hidden bg-primary rotate-3 transform hover:rotate-0 transition-transform duration-300 cursor-pointer">
                <img src="https://images.unsplash.com/photo-1540573133985-87bd1709da65?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* --- MAIN PAGE LAYOUT --- */}
        <main className="flex-1 flex flex-col lg:flex-row px-6 py-8 lg:px-20 gap-8">

          <aside className="w-full lg:w-80 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <nav className="wooden-texture p-4 rounded-3xl shadow-2xl flex flex-col gap-3">
              <Link href="#" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary text-wood-dark font-black shadow-[0_4px_0_0_var(--color-shadow-yellow)] transform hover:translate-y-[-2px] transition-all">
                <MapIcon className="size-6" />
                <span>MISSIONS</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5">
                <Users className="size-6" />
                <span>TRIBE</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5">
                <ShoppingCart className="size-6" />
                <span>BANANA SHOP</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5">
                <Settings className="size-6" />
                <span>SETTINGS</span>
              </Link>
            </nav>

            <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border-2 border-wood-dark/10 dark:border-white/5 shadow-xl">
              <h3 className="text-lg font-black text-wood-dark dark:text-primary mb-6 flex items-center gap-2 uppercase italic tracking-tighter">
                <Trophy className="size-6 text-yellow-500" />
                Top Explorers
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Zimba', time: '2:45 min', rank: 1, color: 'text-yellow-400', img: 'https://images.unsplash.com/photo-1540573133985-87bd1709da65?auto=format&fit=crop&q=80&w=100' },
                  { name: 'Kala', time: '3:12 min', rank: 2, color: 'text-slate-300', img: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=100' },
                  { name: 'Tarzan', time: '3:45 min', rank: 3, color: 'text-amber-600', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=100' }
                ].map((user) => (
                  <div key={user.rank} className="flex items-center justify-between group transition-all hover:translate-x-1">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl border-2 border-wood-dark/20 overflow-hidden`}>
                        <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-wood-dark dark:text-white">{user.name}</p>
                        <p className="text-[10px] font-bold text-leaf-dark uppercase">{user.time}</p>
                      </div>
                    </div>
                    {user.rank === 1 ? (
                      <span className="material-symbols-outlined text-yellow-500 fill-1">workspace_premium</span>
                    ) : (
                      <span className={`text-xs font-black ${user.color}`}>#{user.rank}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN MISSION AREA - CAROUSEL */}
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>

            <div className="relative w-full flex items-center justify-center gap-4 px-4 h-[400px] md:h-[500px]">

              {/* Left Arrow - Login Style */}
              <button
                onClick={prevMode}
                className="absolute left-2 md:left-20 z-40 bg-primary hover:bg-yellow-400 text-wood-dark size-14 md:size-20 rounded-full shadow-[0_6px_0_0_var(--color-shadow-yellow)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center group border-2 border-wood-dark/20"
              >
                <ChevronLeft className="size-8 md:size-12 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* Game Cards Carousel Container */}
              <div className="relative flex items-center justify-center w-full max-w-5xl h-full overflow-visible">
                {GAME_MODES.map((mode, index) => {
                  // Calculate shortest distance in a circular array
                  let offset = index - currentIndex;
                  if (offset > GAME_MODES.length / 2) offset -= GAME_MODES.length;
                  if (offset < -GAME_MODES.length / 2) offset += GAME_MODES.length;

                  const isActive = offset === 0;
                  const absOffset = Math.abs(offset);

                  // Show cards that are transitioning in/out
                  const isVisible = absOffset <= 2;

                  let xPos = offset * 320; // Default spacing
                  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                    xPos = offset * 450;
                  }

                  const scale = isActive ? 1 : 0.7;
                  const opacity = Math.max(0, 1 - absOffset * 0.6); // Linear fade
                  const blur = isActive ? 0 : 4 * absOffset;
                  const grayscale = (isActive && !mode.isAvailable) || !isActive ? 100 : 0;
                  const zIndex = Math.round(20 - absOffset * 10);

                  return (
                    <div
                      key={mode.id}
                      className="absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer"
                      style={{
                        transform: `translateX(${xPos}px) scale(${scale})`,
                        opacity: opacity,
                        filter: `blur(${blur}px) grayscale(${grayscale}%)`,
                        zIndex: zIndex,
                        pointerEvents: isActive ? 'auto' : (isVisible ? 'auto' : 'none')
                      }}
                      onClick={() => {
                        if (isActive && mode.isAvailable) {
                          setPlayingMode(mode);
                        } else if (!isActive) {
                          setCurrentIndex(index);
                        }
                      }}
                    >
                      <div className={`relative group flex flex-col items-center ${isActive ? 'w-80 h-80 md:w-[400px] md:h-[400px]' : 'w-64 h-64 md:w-80 md:h-80'}`}>
                        {isActive && mode.isAvailable && (
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse scale-125"></div>
                        )}

                        <button 
                          disabled={!mode.isAvailable}
                          onClick={(e) => {
                            if (isActive && mode.isAvailable) {
                              e.stopPropagation();
                              setPlayingMode(mode);
                            }
                          }}
                          className={`relative w-full h-full wooden-texture rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-8 md:p-12 border-t-12 border-b-12 border-wood-dark transform transition-all duration-700 ${isActive && mode.isAvailable ? 'hover:scale-105 hover:rotate-1' : ''} ${!mode.isAvailable ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent pointer-events-none rounded-[3.5rem]"></div>

                          <span className={`material-symbols-outlined transition-all duration-700 ${isActive ? 'text-[12rem] md:text-[18rem]' : 'text-[8rem] md:text-[12rem]'} ${mode.isAvailable ? 'text-primary' : 'text-slate-400'} drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] leading-none ${isActive && mode.isAvailable ? 'group-hover:rotate-3' : ''}`}>
                            {mode.isAvailable ? mode.icon : 'lock'}
                          </span>

                          {isActive ? (
                            <div className="flex flex-col items-center mt-2">
                              {mode.isAvailable ? (
                                <>
                                  <span className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter text-3d py-2">
                                    PLAY NOW
                                  </span>
                                  <div className="mt-4 flex items-center gap-2 px-6 py-2 bg-leaf-dark/30 rounded-full border-2 border-white/5 backdrop-blur-xl">
                                    <div className="size-2.5 rounded-full bg-primary animate-ping"></div>
                                    <span className="text-xs font-black text-primary tracking-[0.2em] uppercase">{mode.status}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/10 mb-4">
                                    <p className="text-sm font-black text-white uppercase tracking-widest text-center">NOT AVAILABLE YET</p>
                                  </div>
                                  <button disabled className="bg-slate-700 text-slate-500 font-black px-10 py-3 rounded-full border-b-4 border-slate-900 cursor-not-allowed uppercase italic tracking-tighter shadow-lg grayscale">
                                    LOCKED
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="mt-4 text-center">
                              <p className="text-xs md:text-sm font-black text-white/40 uppercase italic tracking-widest">{mode.title}</p>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow - Login Style */}
              <button
                onClick={nextMode}
                className="absolute right-2 md:right-20 z-40 bg-primary hover:bg-yellow-400 text-wood-dark size-14 md:size-20 rounded-full shadow-[0_6px_0_0_var(--color-shadow-yellow)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center group border-2 border-wood-dark/20"
              >
                <ChevronRight className="size-8 md:size-12 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Current Mode Info - Title RESTORED below card */}
            <div className="mt-12 text-center px-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-black text-wood-dark dark:text-white mb-4 italic tracking-tighter text-3d uppercase">
                {GAME_MODES[currentIndex].title}
              </h1>
              <p className="text-slate-400 font-bold mb-8 max-w-xl mx-auto italic text-sm md:text-base">
                "{GAME_MODES[currentIndex].description}"
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-leaf-dark font-black uppercase text-base italic">
                <span className="flex items-center gap-2 bg-wood-dark/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-wood-dark/10 dark:border-white/5 shadow-md">
                  <ShieldCheck className="size-5" /> DIFFICULTY: {GAME_MODES[currentIndex].difficulty}
                </span>
                <span className="text-wood-dark/20 dark:text-white/20 hidden sm:block">•</span>
                <span className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 shadow-md">
                  <img src="/banana.svg" alt="" className="size-5" /> REWARD: {GAME_MODES[currentIndex].reward}
                </span>
              </div>
            </div>

          </div>
        </main>

        <footer className="flex flex-col md:flex-row items-center justify-between px-6 py-8 lg:px-20 border-t-2 border-wood-dark/10 dark:border-white/5 bg-background-light/40 dark:bg-background-dark/40 backdrop-blur-md animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <div className="flex items-center gap-8 mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="size-3 rounded-full bg-leaf-dark shadow-[0_0_10px_#166534] animate-pulse"></div>
              <p className="text-xs font-black uppercase tracking-wider text-leaf-dark">
                API STATUS: <span className="underline italic">BLOOMING</span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-slate-500/60 font-bold uppercase tracking-widest text-[10px]">
              <Wifi className="size-3" />
              <span>LATENCY: 24MS</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" href="#">Privacy Jungle</Link>
            <Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" href="#">Tribe Rules</Link>
            <span className="text-slate-500/30">© 2024 Banana Puzzle</span>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-10 left-10 rotate-12 text-7xl opacity-10 pointer-events-none select-none z-0">🍃</div>
      <div className="fixed bottom-20 right-20 -rotate-45 text-8xl opacity-10 pointer-events-none select-none z-0">🌿</div>
    </div>
  );
}
