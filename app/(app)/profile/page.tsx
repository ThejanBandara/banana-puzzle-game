"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Map as MapIcon, 
  User, 
  Flame, 
  Award, 
  History, 
  ArrowLeft,
  ChevronRight,
  Target,
  Clock,
  Zap,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import JungleParticles from "@/components/jungle-particles";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState({ totalBananas: 0, puzzlesSolved: 0 });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch User Stats
    const userRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserStats({
          totalBananas: data.stats?.totalBananas || 0,
          puzzlesSolved: data.stats?.puzzlesSolved || 0
        });
      }
    });

    // 2. Fetch Match History
    const q = query(
      collection(db, "matches"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubMatches = onSnapshot(q, (snapshot) => {
      const matchData: any[] = [];
      snapshot.forEach((doc) => {
        matchData.push({ id: doc.id, ...doc.data() });
      });
      setMatches(matchData);
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubMatches();
    };
  }, [user]);

  const explorerLevel = Math.floor(userStats.puzzlesSolved / 5) + 1;
  const progressToNext = (userStats.puzzlesSolved % 5) * 20;

  const getExplorerTitle = (level: number) => {
    if (level >= 20) return "Ancient Jungle Legend";
    if (level >= 15) return "Great Ape Strategist";
    if (level >= 10) return "Forest Guardian";
    if (level >= 5) return "Jade Pathseeker";
    return "Jungle Scout";
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col text-slate-900 dark:text-slate-100">
      
      {/* 1. LAYERED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Jungle background"
          src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-20 grayscale-[0.3]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background-light/50 to-background-light dark:via-background-dark/50 dark:to-background-dark" />
        
        {/* Floating Leaves Decoration */}
        <div className="absolute top-0 right-0 p-10 opacity-30 pointer-events-none animate-pulse">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
            <path d="M50 10 C30 30 10 50 10 70 C10 90 30 90 50 70 C70 90 90 90 90 70 C90 50 70 30 50 10" />
            <path d="M50 10 L50 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <JungleParticles />

      {/* 2. HEADER */}
      <header className="relative z-10 w-full px-6 py-6 lg:px-20 flex items-center justify-between border-b border-wood-dark/10 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/" className="wooden-texture p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform group">
            <ArrowLeft className="size-6 text-white group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-wood-dark dark:text-white uppercase italic tracking-tighter">
              Explorer <span className="text-primary italic">Profile</span>
            </h1>
            <p className="text-xs font-bold text-leaf-dark uppercase tracking-widest">Chronicle of your deeds</p>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl transition-all font-black text-sm uppercase border border-red-500/20"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* IDENTITY SECTION */}
        <section className="flex flex-col md:flex-row gap-8 items-center bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[40px] border-2 border-wood-dark/10 dark:border-white/5 shadow-2xl">
          <div className="relative">
            <div className="size-32 rounded-[32px] border-4 border-primary shadow-2xl overflow-hidden rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-wood-dark size-10 rounded-2xl flex items-center justify-center font-black text-lg border-4 border-white dark:border-slate-900 shadow-xl">
              {explorerLevel}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-1">
              <h2 className="text-4xl font-black text-wood-dark dark:text-white uppercase tracking-tighter">{user?.displayName || "Golden Gorilla"}</h2>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {getExplorerTitle(explorerLevel)}
              </span>
            </div>
            <p className="text-primary/70 font-bold uppercase tracking-widest text-sm mb-4">{user?.email}</p>
            
            <div className="w-full max-w-md bg-wood-dark/10 dark:bg-white/5 h-4 rounded-full overflow-hidden border border-wood-dark/5 dark:border-white/5">
              <div 
                className="h-full bg-linear-to-r from-primary to-emerald-400 transition-all duration-1000 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-black uppercase text-slate-500">
              <span>Level {explorerLevel} Explorer</span>
              <span>{5 - (userStats.puzzlesSolved % 5)} to Level {explorerLevel + 1}</span>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS MINI-GRID */}
        <section>
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center md:text-left">Explorer Badges</h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            {[
              { id: 'scout', icon: MapIcon, label: 'Jungle Scout', active: userStats.puzzlesSolved >= 1, color: 'bg-emerald-500' },
              { id: 'hoard', icon: Trophy, label: 'Banana Hoarder', active: userStats.totalBananas >= 100, color: 'bg-yellow-500' },
              { id: 'survivor', icon: ShieldCheck, label: 'Cave Survivor', active: matches.some(m => m.mode === 'cave' && m.accuracy > 80), color: 'bg-red-500' },
              { id: 'blitz', icon: Zap, label: 'Speed Demon', active: matches.some(m => m.mode === 'river' && m.score > 2000), color: 'bg-blue-500' },
            ].map((badge) => (
              <div 
                key={badge.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
                  badge.active 
                    ? `border-white/20 ${badge.color} text-white shadow-lg` 
                    : 'border-white/5 bg-white/5 text-white/20'
                }`}
                title={badge.active ? `Unlocked: ${badge.label}` : `Locked achievement: ${badge.label}`}
              >
                <badge.icon className="size-4" />
                <span className="text-[10px] font-black uppercase tracking-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="wooden-texture p-6 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="size-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-sm">
              <img src="/banana.svg" alt="Bananas" className="size-8 drop-shadow-md" />
            </div>
            <p className="text-3xl font-black text-white italic">{userStats.totalBananas}</p>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Life Bananas</p>
          </div>

          <div className="wooden-texture-dark p-6 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-inner">
              <Flame className="size-8 text-primary" />
            </div>
            <p className="text-3xl font-black text-white italic">{userStats.puzzlesSolved}</p>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Puzzles Solved</p>
          </div>

          <div className="wooden-texture-dark p-6 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="size-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-inner">
              <Award className="size-8 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-white italic">#{Math.max(1, 10 - Math.floor(userStats.puzzlesSolved / 10))}</p>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Est. Global Rank</p>
          </div>

          <div className="wooden-texture-dark p-6 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-transform">
            <div className="size-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
              <Target className="size-8 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white italic">Elite</p>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Tribe Status</p>
          </div>
        </section>

        {/* MATCH HISTORY */}
        <section className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-wood-dark dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
              <History className="size-7 text-primary" />
              The Scroll of <span className="text-primary italic">Deeds</span>
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Last 20 Expedition Records</span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="size-12 text-primary animate-spin mb-4" />
                <p className="text-primary font-black uppercase italic">Unrolling the parchment...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-[40px] border-4 border-dashed border-wood-dark/10">
                <p className="text-xl font-bold text-slate-500 uppercase italic">No deeds found in your scroll yet.</p>
                <Link href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-wood-dark font-black uppercase rounded-xl hover:scale-105 transition-transform">Start an Expedition</Link>
              </div>
            ) : (
              matches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-wood-dark/10 dark:border-white/5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all animate-fade-in"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className={`size-14 wooden-texture rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${match.accuracy >= 100 ? 'ring-2 ring-yellow-500/50' : ''}`}>
                      {match.mode === 'river' && <Zap className="size-7 text-yellow-400 fill-yellow-400" />}
                      {match.mode === 'temple' && <MapIcon className="size-7 text-emerald-400" />}
                      {match.mode === 'cave' && <Target className="size-7 text-red-400" />}
                      {match.mode === 'canopy' && <Award className="size-7 text-blue-400" />}
                      {match.mode === 'blitz' && <Flame className="size-7 text-orange-400 fill-orange-400" />}
                    </div>
                    <div>
                      <h4 className="font-black text-wood-dark dark:text-white uppercase tracking-tight text-lg">
                        {match.mode === 'river' && 'Amazon River Run'}
                        {match.mode === 'temple' && 'Temple of the Golden Peel'}
                        {match.mode === 'cave' && 'Hidden Echo Cave'}
                        {match.mode === 'canopy' && 'Canopy Glider'}
                        {match.mode === 'blitz' && 'Banana Blitz'}
                      </h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {match.timestamp?.toDate ? new Date(match.timestamp.toDate()).toLocaleDateString() : 'Recent Expedition'}
                        </p>
                        {match.accuracy !== undefined && (
                          <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${match.accuracy >= 80 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'}`}>
                            {match.accuracy.toFixed(0)}% Accuracy
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-wood-dark/5">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score</p>
                      <p className="text-xl font-black text-wood-dark dark:text-primary italic leading-none">{match.score.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Earned</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <img src="/banana.svg" alt="Bananas" className="size-4" />
                        <p className="text-xl font-black text-yellow-500 italic leading-none">+{match.bananasEarned}</p>
                      </div>
                    </div>

                    <div className="hidden lg:block p-2 hover:bg-white/20 rounded-xl group-hover:rotate-12 transition-all">
                      <ChevronRight className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full px-6 py-10 text-center">
        <p className="text-[10px] font-black text-wood-dark/30 dark:text-white/10 uppercase tracking-[0.4em]">
          Banana Puzzle Game &copy; 2026 Explorer Guild
        </p>
      </footer>
    </div>
  );
}

const Loader2 = ({ className, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-loader-2 ${className}`}
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
