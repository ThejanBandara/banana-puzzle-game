"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Map as MapIcon, 
  ArrowLeft,
  Flame,
  Award,
  Crown,
  Medal,
  Loader2,
  Users
} from "lucide-react";
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot
} from 'firebase/firestore';
import JungleParticles from "@/components/jungle-particles";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Top 10 Users by Puzzles Solved
    const q = query(
      collection(db, "users"),
      orderBy("stats.puzzlesSolved", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          name: data.displayName || "Mysterious Explorer",
          puzzlesSolved: data.stats?.puzzlesSolved || 0,
          totalBananas: data.stats?.totalBananas || 0,
          photoURL: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
        });
      });
      setTopUsers(users);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getExplorerTitle = (puzzles: number) => {
    const level = Math.floor(puzzles / 5) + 1;
    if (level >= 20) return "Ancient Legend";
    if (level >= 15) return "Great Ape";
    if (level >= 10) return "Guardian";
    if (level >= 5) return "Pathseeker";
    return "Scout";
  };

  const podiumOrder = [1, 0, 2]; // Silver (2nd), Gold (1st), Bronze (3rd) for visual symmetry
  const winners = topUsers.slice(0, 3);
  const others = topUsers.slice(3);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col text-slate-900 dark:text-slate-100">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Jungle background"
          src="https://images.unsplash.com/photo-1442120108414-42e7ea50d0b5?q=80&w=1549&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-full h-full object-cover opacity-30 grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background-light/50 to-background-light dark:via-background-dark/50 dark:to-background-dark" />
      </div>

      <JungleParticles />

      {/* HEADER */}
      <header className="relative z-10 w-full px-6 py-6 lg:px-20 flex items-center justify-between border-b-4 border-wood-dark/20 bg-white/10 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/" className="wooden-texture p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform group">
            <ArrowLeft className="size-6 text-white group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-wood-dark dark:text-white uppercase italic tracking-tighter">
              Hall of <span className="text-primary italic">Legends</span>
            </h1>
            <p className="text-xs font-bold text-leaf-dark uppercase tracking-widest">The Gilded Ranks of the Guild</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <Loader2 className="size-16 text-primary animate-spin mb-4" />
            <p className="text-primary font-black uppercase italic tracking-widest">Consulting the Ancient Registers...</p>
          </div>
        ) : (
          <>
            {/* PODIUM SECTION */}
            <section className="flex flex-col md:flex-row items-end justify-center gap-6 pt-10 min-h-[400px]">
              {winners.length > 0 && podiumOrder.map((idx) => {
                const player = winners[idx];
                if (!player) return null;
                
                // winners[0] = Gold, winners[1] = Silver, winners[2] = Bronze
                const isGold = idx === 0;
                const isSilver = idx === 1;
                const isBronze = idx === 2;

                return (
                  <div 
                    key={player.id} 
                    className={`flex flex-col items-center transition-all duration-700 animate-fade-in-up ${
                      isGold 
                        ? 'md:order-2 order-1 z-20 scale-110 mb-8 md:mb-8' 
                        : isSilver 
                          ? 'md:order-1 order-2 z-10 opacity-90 mb-4 md:mb-0' 
                          : 'md:order-3 order-3 z-10 opacity-80'
                    }`}
                  >
                    <div className="relative mb-4">
                      <div className={`size-24 md:size-32 rounded-[2rem] border-4 overflow-hidden shadow-2xl transition-transform hover:scale-110 ${isGold ? 'border-yellow-400 rotate-0' : isSilver ? 'border-slate-300 -rotate-3' : 'border-amber-600 rotate-3'}`}>
                        <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${isGold ? 'scale-125' : ''}`}>
                        {isGold && <Crown className="size-12 text-yellow-400 fill-yellow-400 stroke-wood-dark" />}
                        {isSilver && <Trophy className="size-10 text-slate-300 fill-slate-300 stroke-wood-dark" />}
                        {isBronze && <Medal className="size-10 text-amber-600 fill-amber-600 stroke-wood-dark" />}
                      </div>

                      <div className={`absolute -bottom-2 -right-2 size-10 rounded-xl flex items-center justify-center font-black border-2 border-white dark:border-slate-950 shadow-lg ${isGold ? 'bg-yellow-400 text-wood-dark text-lg' : isSilver ? 'bg-slate-300 text-slate-700' : 'bg-amber-600 text-amber-100'}`}>
                        {idx + 1}
                      </div>
                    </div>

                    <div className="text-center z-10 w-full px-2">
                      <h3 className={`font-black uppercase tracking-tight truncate w-full ${isGold ? 'text-2xl text-yellow-500' : 'text-lg text-slate-200'}`}>
                        {player.name}
                      </h3>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-70 mb-2">
                        {getExplorerTitle(player.puzzlesSolved)}
                      </p>
                      
                      <div className={`wooden-texture-dark px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3 shadow-xl ${isGold ? 'scale-110 mt-2' : ''}`}>
                        <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
                          <Flame className="size-4 text-orange-500 fill-orange-500" />
                          <span className="font-black text-white italic">{player.puzzlesSolved}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <img src="/banana.svg" alt="B" className="size-3.5" />
                          <span className="font-black text-yellow-500 italic">{player.totalBananas}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pedestal Component */}
                    <div className={`mt-6 w-52 wooden-texture rounded-t-[2.5rem] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border-x-4 border-t-8 border-wood-dark relative ${
                      isGold ? 'h-24 md:h-40' : isSilver ? 'h-20 md:h-32' : 'h-16 md:h-24'
                    }`}>
                      <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent pointer-events-none rounded-t-[2.5rem]"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-black text-wood-dark/20 text-4xl italic">
                        {isGold ? 'I' : isSilver ? 'II' : 'III'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* SCROLL LIST SECTION */}
            <section className="animate-fade-in-up delay-300 mt-10">
              <div className="flex items-center gap-4 mb-6">
                <Users className="size-6 text-primary" />
                <h3 className="text-xl font-black text-wood-dark dark:text-white uppercase italic tracking-tighter">The Sacred Scroll</h3>
                <div className="flex-1 h-px bg-wood-dark/10 dark:bg-white/10" />
              </div>

              <div className="space-y-4">
                {others.length > 0 ? others.map((player, idx) => {
                  const rank = idx + 4;
                  const isCurrentUser = player.id === user?.uid;

                  return (
                    <div 
                      key={player.id} 
                      className={`relative overflow-hidden bg-[#fdf6e3] dark:bg-[#1a1410] p-4 rounded-3xl border-2 shadow-[4px_4px_0px_rgba(74,55,40,0.1)] dark:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex items-center justify-between transition-all hover:scale-[1.01] ${isCurrentUser ? 'border-primary ring-2 ring-primary/20' : 'border-[#e3d0a5] dark:border-[#3d2b1f]'}`}
                    >
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/papyurus-dark.png')]" />
                      
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-8 text-center font-black text-2xl text-[#8b7355] italic">
                          {rank}
                        </div>
                        
                        <div className="size-14 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-lg bg-white/20">
                          <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <h4 className={`font-black uppercase tracking-tight text-lg ${isCurrentUser ? 'text-primary' : 'text-[#4a3728] dark:text-[#d4c5a1]'}`}>
                            {player.name} {isCurrentUser && "(You)"}
                          </h4>
                          <p className="text-[10px] font-bold text-[#8b7355] uppercase tracking-widest">
                            Level {Math.floor(player.puzzlesSolved / 5) + 1} {getExplorerTitle(player.puzzlesSolved)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 relative z-10">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest mb-1">Solved</p>
                          <div className="flex items-center justify-end gap-1.5">
                            <Flame className="size-4 text-orange-500 fill-orange-500" />
                            <p className="text-xl font-black text-[#4a3728] dark:text-white italic leading-none">{player.puzzlesSolved}</p>
                          </div>
                        </div>
                        
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest mb-1">Fortune</p>
                          <div className="flex items-center justify-end gap-1.5">
                            <img src="/banana.svg" alt="B" className="size-4" />
                            <p className="text-xl font-black text-yellow-600 dark:text-yellow-400 italic leading-none">{player.totalBananas}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-10 text-center bg-white/5 rounded-3xl border-2 border-dashed border-wood-dark/10">
                    <p className="text-slate-500 font-bold uppercase tracking-widest italic">The registers are empty beyond the top three.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

    </div>
  );
}
