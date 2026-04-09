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
  ShieldCheck,
  LayoutGrid
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
  limit,
  getCountFromServer
} from 'firebase/firestore';
import JungleParticles from "@/components/jungle-particles";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [userStats, setUserStats] = useState({ totalBananas: 0, puzzlesSolved: 0 });
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalRank, setGlobalRank] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'badges'>('history');

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

  // 3. Calculate Global Rank
  useEffect(() => {
    if (!user || userStats.puzzlesSolved === 0) return;

    const calculateRank = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("stats.puzzlesSolved", ">", userStats.puzzlesSolved)
        );
        const snapshot = await getCountFromServer(q);
        setGlobalRank(snapshot.data().count + 1);
      } catch (err) {
        console.error("Error calculating rank:", err);
      }
    };

    calculateRank();
  }, [user, userStats.puzzlesSolved]);

  const explorerLevel = Math.floor(userStats.puzzlesSolved / 5) + 1;
  const progressToNext = (userStats.puzzlesSolved % 5) * 20;

  const getExplorerTitle = (level: number) => {
    if (level >= 20) return "Ancient Jungle Legend";
    if (level >= 15) return "Great Ape Strategist";
    if (level >= 10) return "Forest Guardian";
    if (level >= 5) return "Jade Pathseeker";
    return "Jungle Scout";
  };

  const allBadges = [
    {
      id: 'scout',
      icon: MapIcon,
      label: 'Jungle Scout',
      description: 'Complete your first puzzle expedition into the unknown.',
      active: userStats.puzzlesSolved >= 1,
      color: 'bg-emerald-500'
    },
    {
      id: 'hoard',
      icon: Trophy,
      label: 'Banana Hoarder',
      description: 'A true collector. Gather over 100 precious bananas.',
      active: userStats.totalBananas >= 100,
      color: 'bg-yellow-500'
    },
    {
      id: 'survivor',
      icon: ShieldCheck,
      label: 'Cave Survivor',
      description: 'Master of shadows. Achieve >80% accuracy in the Echo Cave.',
      active: matches.some(m => m.mode === 'cave' && m.accuracy > 80),
      color: 'bg-red-500'
    },
    {
      id: 'blitz',
      icon: Zap,
      label: 'Speed Demon',
      description: 'Fastest hands in the forest. Score >2000 points in River Run.',
      active: matches.some(m => m.mode === 'river' && m.score > 2000),
      color: 'bg-blue-500'
    },
    {
      id: 'master',
      icon: Flame,
      label: 'Puzzle Master',
      description: 'Legacy of logic. Solve 50 total puzzles across all modes.',
      active: userStats.puzzlesSolved >= 50,
      color: 'bg-orange-500'
    },
    {
      id: 'legend',
      icon: Award,
      label: 'Tribe Legend',
      description: 'Recognized by the Jungle Elders. Reach level 10 Explorer.',
      active: explorerLevel >= 10,
      color: 'bg-purple-500'
    },
  ];

  const StatCard = ({ icon, value, label, description, color, isWooden = false, isText = false, wideTooltip = false }: any) => (
    <div className={`${isWooden ? 'wooden-texture' : 'wooden-texture-dark'} p-4 rounded-3xl shadow-xl flex flex-col items-center text-center group hover:scale-[1.02] transition-all relative cursor-help`}>
      <div className={`size-10 bg-${color}-500/20 rounded-2xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform shadow-sm`}>
        {icon}
      </div>
      <p className={`${isText ? 'text-sm' : 'text-xl'} font-black text-white italic uppercase leading-tight drop-shadow-md`}>{value}</p>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${isWooden ? 'text-yellow-200' : 'text-primary'}`}>{label}</p>

      {/* Tooltip */}
      <div className={`absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 ${wideTooltip ? 'w-64 px-4' : 'w-48'} opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 scale-95 group-hover:scale-100 z-50`}>
        <div className="bg-amber-50 dark:bg-slate-800 border-2 border-wood-dark/20 dark:border-white/10 p-4 rounded-3xl shadow-2xl relative">
          <div className="text-[10px] font-bold text-wood-dark dark:text-amber-200 leading-tight">
            {description}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-4 bg-amber-50 dark:bg-slate-800 border-r-2 border-b-2 border-wood-dark/20 dark:border-white/10 rotate-45" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col text-slate-900 dark:text-slate-100">

      {/* 1. LAYERED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Jungle background"
          src="https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background-light/50 to-background-light dark:via-background-dark/50 dark:to-background-dark" />
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
        <section className="flex flex-col md:flex-row gap-8 items-center bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-4xl border-2 border-wood-dark/20 dark:border-white/10 shadow-2xl">
          <div className="relative">
            <div className="size-24 rounded-[28px] border-4 border-primary shadow-2xl overflow-hidden rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <img
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`}
                alt="Avatar"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-wood-dark size-8 rounded-xl flex items-center justify-center font-black text-sm border-4 border-white dark:border-slate-900 shadow-xl">
              {explorerLevel}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-1">
              <h2 className="text-3xl font-black text-wood-dark dark:text-white uppercase tracking-tighter">{user?.displayName || "Golden Gorilla"}</h2>
              <span className="bg-primary/20 text-wood-dark dark:text-primary px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-primary/20">
                Lvl {explorerLevel} {getExplorerTitle(explorerLevel)}
              </span>
            </div>
            <p className="text-leaf-dark dark:text-primary/70 font-black uppercase tracking-widest text-[10px] mb-4">{user?.email}</p>

            <div className="w-full max-w-md bg-wood-dark/10 dark:bg-white/5 h-3 rounded-full overflow-hidden border border-wood-dark/5 dark:border-white/5 relative">
              <div
                className="h-full bg-linear-to-r from-primary to-emerald-400 transition-all duration-1000 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                style={{ width: `${Math.max(2, progressToNext)}%` }}
              />
            </div>
            <p className="text-[10px] font-black text-wood-dark dark:text-leaf-dark uppercase tracking-widest mt-2">
              Exp: <span className="text-primary dark:text-primary">{userStats.puzzlesSolved % 5}</span> / 5 puzzles to Level {explorerLevel + 1}
            </p>
          </div>
        </section>


        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<img src="/banana.svg" alt="Bananas" className="size-6 drop-shadow-md" />}
            value={userStats.totalBananas}
            label="Life Bananas"
            description="Your total wealth gathered across all expeditions."
            color="yellow"
            isWooden
          />
          <StatCard
            icon={<Flame className="size-6 text-primary" />}
            value={userStats.puzzlesSolved}
            label="Puzzles Solved"
            description="The number of ancient trials you have successfully overcome."
            color="primary"
          />
          <StatCard
            icon={<Award className="size-6 text-emerald-400" />}
            value={globalRank ? `#${globalRank}` : (userStats.puzzlesSolved > 0 ? "..." : "N/A")}
            label="Guild Standing"
            description="Your official rank among all explorers in the world."
            color="emerald"
          />
          <StatCard
            icon={<Target className="size-6 text-blue-400" />}
            value={getExplorerTitle(explorerLevel)}
            label="Status"
            description={
              <div className="space-y-2 pt-1 min-w-[200px]">
                <p className="mb-3 pb-1.5 border-b border-wood-dark/10 dark:border-white/10 opacity-70 flex items-center gap-2 uppercase tracking-widest text-[9px]">
                  <ShieldCheck className="size-3 text-primary shrink-0" />
                  Guild Ranking Progress
                </p>
                <div className={`flex justify-between items-center gap-4 px-3 py-2 rounded-2xl transition-all ${explorerLevel >= 20 ? "bg-primary/20 border-2 border-primary/30 shadow-sm" : "opacity-40"}`}>
                  <div className="flex items-center gap-2.5">
                    <Trophy className={`size-4 shrink-0 ${explorerLevel >= 20 ? "text-yellow-500" : ""}`} />
                    <span className={explorerLevel >= 20 ? "text-primary font-black" : "font-bold text-slate-500 dark:text-slate-400"}>Ancient Legend</span>
                  </div>
                  <span className="text-[8px] font-black italic opacity-60">Lvl 20+</span>
                </div>
                <div className={`flex justify-between items-center gap-4 px-3 py-2 rounded-2xl transition-all ${explorerLevel >= 15 && explorerLevel < 20 ? "bg-primary/20 border-2 border-primary/30 shadow-sm" : "opacity-40"}`}>
                  <div className="flex items-center gap-2.5">
                    <Zap className={`size-4 shrink-0 ${explorerLevel >= 15 && explorerLevel < 20 ? "text-primary" : ""}`} />
                    <span className={explorerLevel >= 15 && explorerLevel < 20 ? "text-primary font-black" : "font-bold text-slate-500 dark:text-slate-400"}>Great Strategist</span>
                  </div>
                  <span className="text-[8px] font-black italic opacity-60">Lvl 15+</span>
                </div>
                <div className={`flex justify-between items-center gap-4 px-3 py-2 rounded-2xl transition-all ${explorerLevel >= 10 && explorerLevel < 15 ? "bg-primary/20 border-2 border-primary/30 shadow-sm" : "opacity-40"}`}>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className={`size-4 shrink-0 ${explorerLevel >= 10 && explorerLevel < 15 ? "text-emerald-400" : ""}`} />
                    <span className={explorerLevel >= 10 && explorerLevel < 15 ? "text-primary font-black" : "font-bold text-slate-500 dark:text-slate-400"}>Forest Guardian</span>
                  </div>
                  <span className="text-[8px] font-black italic opacity-60">Lvl 10+</span>
                </div>
                <div className={`flex justify-between items-center gap-4 px-3 py-2 rounded-2xl transition-all ${explorerLevel >= 5 && explorerLevel < 10 ? "bg-primary/20 border-2 border-primary/30 shadow-sm" : "opacity-40"}`}>
                  <div className="flex items-center gap-2.5">
                    <MapIcon className={`size-4 shrink-0 ${explorerLevel >= 5 && explorerLevel < 10 ? "text-blue-400" : ""}`} />
                    <span className={explorerLevel >= 5 && explorerLevel < 10 ? "text-primary font-black" : "font-bold text-slate-500 dark:text-slate-400"}>Jade Pathseeker</span>
                  </div>
                  <span className="text-[8px] font-black italic opacity-60">Lvl 5+</span>
                </div>
                <div className={`flex justify-between items-center gap-4 px-3 py-2 rounded-2xl transition-all ${explorerLevel < 5 ? "bg-primary/20 border-2 border-primary/30 shadow-sm" : "opacity-40"}`}>
                  <div className="flex items-center gap-2.5">
                    <User className={`size-4 shrink-0 ${explorerLevel < 5 ? "text-amber-600" : ""}`} />
                    <span className={explorerLevel < 5 ? "text-primary font-black" : "font-bold text-slate-500 dark:text-slate-400"}>Jungle Scout</span>
                  </div>
                  <span className="text-[8px] font-black italic opacity-60">Lvl 1+</span>
                </div>
              </div>
            }
            color="blue"
            isText
            wideTooltip
          />
        </section>

        {/* TABS NAVIGATION */}
        <section className="flex justify-center p-1.5 bg-wood-dark/5 dark:bg-white/5 backdrop-blur-md rounded-[32px] border border-wood-dark/10 dark:border-white/10 max-w-md mx-auto w-full">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'history'
                ? 'wooden-texture text-white shadow-xl scale-105'
                : 'text-slate-500 hover:text-leaf-dark hover:bg-white/10 dark:hover:bg-slate-900/50'
              }`}
          >
            <History className="size-4" />
            Scroll of Deeds
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'badges'
                ? 'wooden-texture text-white shadow-xl scale-105'
                : 'text-slate-500 hover:text-leaf-dark hover:bg-white/10 dark:hover:bg-slate-900/50'
              }`}
          >
            <LayoutGrid className="size-4" />
            Explorer Badges
          </button>
        </section>

        {/* DYNAMIC CONTENT AREA */}
        <section className={`transition-all duration-500 ${activeTab === 'history' ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-wood-dark dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
              <History className="size-7 text-primary" />
              The Scroll of <span className="text-primary italic">Deeds</span>
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Recent Expedition Records</span>
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
                <Link href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-wood-dark font-black uppercase rounded-xl hover:scale-105 transition-transform shadow-xl">Start an Expedition</Link>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-[#fdf6e3] dark:bg-[#1a1410] p-6 rounded-4xl border-2 border-[#e3d0a5] dark:border-[#3d2b1f] shadow-[4px_4px_0px_rgba(74,55,40,0.1)] dark:shadow-[4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4 group hover:scale-[1.01] transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/papyurus-dark.png')]" />

                  <div className="flex items-center gap-5 w-full sm:w-auto relative z-10">
                    <div className={`size-14 wooden-texture rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform ${match.accuracy >= 100 ? 'ring-2 ring-yellow-500/50' : ''}`}>
                      {match.mode === 'river' && <Zap className="size-7 text-yellow-400 fill-yellow-400" />}
                      {match.mode === 'temple' && <MapIcon className="size-7 text-emerald-400" />}
                      {match.mode === 'cave' && <Target className="size-7 text-red-400" />}
                      {match.mode === 'canopy' && <Award className="size-7 text-blue-400" />}
                      {match.mode === 'blitz' && <Flame className="size-7 text-orange-400 fill-orange-400" />}
                    </div>
                    <div>
                      <h4 className="font-black text-[#4a3728] dark:text-[#d4c5a1] uppercase tracking-tight text-lg">
                        {match.mode === 'river' && 'Amazon River Run'}
                        {match.mode === 'temple' && 'Temple of the Golden Peel'}
                        {match.mode === 'cave' && 'Hidden Echo Cave'}
                        {match.mode === 'canopy' && 'Canopy Glider'}
                        {match.mode === 'blitz' && 'Banana Blitz'}
                      </h4>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-[#8b7355] dark:text-[#8b7355] uppercase flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {match.timestamp?.toDate ? new Date(match.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(match.timestamp.toDate()).toLocaleDateString() : 'Recent'}
                        </p>
                        {match.accuracy !== undefined && (
                          <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${match.accuracy >= 80 ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-orange-500/20 text-orange-700 dark:text-orange-400'}`}>
                            {match.accuracy.toFixed(0)}% Accuracy
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-[#e3d0a5]/30 relative z-10">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest mb-1">Score</p>
                      <p className="text-xl font-black text-[#4a3728] dark:text-primary italic leading-none">{match.score.toLocaleString()}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#8b7355] uppercase tracking-widest mb-1">Earned</p>
                      <div className="flex items-center justify-end gap-1.5">
                        <img src="/banana.svg" alt="Bananas" className="size-4" />
                        <p className="text-xl font-black text-yellow-600 dark:text-yellow-500 italic leading-none">+{match.bananasEarned}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={`transition-all duration-500 ${activeTab === 'badges' ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-wood-dark dark:text-white flex items-center gap-3 uppercase italic tracking-tighter">
              <LayoutGrid className="size-7 text-primary" />
              Explorer <span className="text-primary italic">Badges</span>
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{allBadges.filter(b => b.active).length} Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-6 rounded-4xl border-2 transition-all duration-300 group overflow-hidden bg-rose-950/10 ${badge.active
                    ? 'wooden-texture-dark border-[#4a3728] dark:border-[#3d2b1f] shadow-xl hover:scale-[1.05]'
                    : 'bg-slate-900/60 dark:bg-stone-900/50 border-stone-800/30 grayscale opacity-80 shadow-none'
                  }`}
              >
                {/* Inner Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`size-16 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-12 ${badge.active
                      ? `${badge.color} shadow-xl shadow-${badge.color.split('-')[1]}-500/30 ring-4 ring-white/10`
                      : 'bg-slate-800/50 border border-white/5'
                    }`}>
                    <badge.icon className={`size-8 ${badge.active ? 'text-white' : 'text-slate-600'}`} />
                  </div>

                  <h4 className={`font-black text-lg mb-1 italic uppercase tracking-tight ${badge.active ? 'text-white' : 'text-slate-500'
                    }`}>
                    {badge.label}
                  </h4>

                  <p className={`text-[10px] leading-tight font-bold px-2 ${badge.active ? 'text-amber-100/60' : 'text-slate-600'
                    }`}>
                    {badge.description}
                  </p>

                  {!badge.active ? (
                    <div className="mt-4 px-3 py-1 bg-black/20 rounded-full border border-white/5 flex items-center justify-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 italic leading-none">Locked</span>
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 px-3 py-1 bg-green-500/20 rounded-full border border-white/5 flex items-center justify-center">
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-600 italic leading-none">Unlocked</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Gloss Effect for active badges */}
                {badge.active && (
                  <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-green-500/30 to-transparent skew-x-[-25deg] group-hover:animate-shine pointer-events-none" >
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
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
