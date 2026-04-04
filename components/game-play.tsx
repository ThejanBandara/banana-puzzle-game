"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  RefreshCw, 
  Trophy, 
  Flame, 
  ChevronRight,
  Heart,
  Timer,
  Loader2
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';

interface GamePlayProps {
  mode: {
    id: string;
    title: string;
    difficulty: string;
    reward: string;
    icon: string;
  };
  onClose: () => void;
}

interface Puzzle {
  question: string;
  solution: number;
}

export default function GamePlay({ mode, onClose }: GamePlayProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bananasEarned, setBananasEarned] = useState(0);
  const [currentCount, setCurrentCount] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode.id === 'river' ? 60 : 0);
  const [lives, setLives] = useState(mode.id === 'cave' ? 3 : 0);

  const isSpeedMode = mode.id === 'river';
  const isHardcoreMode = mode.id === 'cave';
  const isZenMode = mode.id === 'canopy';
  const TOTAL_PUZZLES = 10;

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/puzzle");
      if (!response.ok) throw new Error("Jungle spirits are uncooperative");
      const data = await response.json();
      setPuzzle(data);
    } catch (err) {
      console.error("Failed to fetch puzzle:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  // Timer Logic for Speed Mode
  useEffect(() => {
    if (!isSpeedMode || isFinished || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          // Trigger save results when timer ends
          saveMatchResult(bananasEarned, correctCount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSpeedMode, isFinished, loading, bananasEarned, correctCount]);

  const saveMatchResult = async (finalBananas: number, finalCorrect: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1. Save match record
      await addDoc(collection(db, "matches"), {
        uid: user.uid,
        mode: mode.id,
        score: finalCorrect * 100,
        accuracy: (finalCorrect / currentCount) * 100,
        bananasEarned: finalBananas,
        timestamp: serverTimestamp()
      });

      // 2. Update user stats
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        "stats.totalBananas": increment(finalBananas),
        "stats.puzzlesSolved": increment(finalCorrect),
      });

      console.log("Jungle progress saved to the Great Totem!");
    } catch (err) {
      console.error("Failed to save to the Great Totem:", err);
    }
  };

  const handleAnswer = (answer: number) => {
    if (!puzzle || feedback || isFinished) return;

    const isCorrect = answer === puzzle.solution;
    
    let newBananas = bananasEarned;
    let newCorrect = correctCount;

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 100);
      setStreak(prev => prev + 1);
      newBananas += 5;
      newCorrect += 1;
      setBananasEarned(newBananas);
      setCorrectCount(newCorrect);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      if (isHardcoreMode) {
        setLives(prev => prev - 1);
      }
    }

    // Auto-advance after a delay
    setTimeout(() => {
      // 1. Check for Game Over (Lives)
      if (isHardcoreMode && lives <= 1 && !isCorrect) {
        setIsFinished(true);
        saveMatchResult(newBananas, newCorrect);
        return;
      }

      // 2. Regular Advancement
      if (isSpeedMode) {
        // Speed mode is infinite until time runs out
        if (isCorrect) setTimeLeft(prev => prev + 2);
        setCurrentCount(prev => prev + 1);
        fetchPuzzle();
      } else {
        // Classic mode ends at TOTAL_PUZZLES
        if (currentCount < TOTAL_PUZZLES) {
          setCurrentCount(prev => prev + 1);
          fetchPuzzle();
        } else {
          setIsFinished(true);
          saveMatchResult(newBananas, newCorrect);
        }
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background-dark/80 backdrop-blur-2xl animate-fade-in">
      
      {/* BACKGROUND PARTICLES (Reusing aesthetic) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary animate-pulse"
            style={{
              width: Math.random() * 20 + 10 + 'px',
              height: Math.random() * 20 + 10 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              filter: 'blur(10px)'
            }}
          />
        ))}
      </div>

      {/* GAME CONTAINER */}
      <div className="relative w-full max-w-5xl h-full max-h-[900px] flex flex-col gap-6 animate-fade-in-up">
        
        {/* HEADER */}
        <div className="flex items-center justify-between bg-wood-dark/40 backdrop-blur-md p-4 md:p-6 rounded-4xl border-2 border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all border border-white/10 group"
            >
              <X className="size-6 text-white group-hover:rotate-90 transition-transform" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
                {mode.title}
              </h2>
              <p className="text-[10px] md:text-xs font-bold text-primary tracking-[0.2em] uppercase mt-1">
                {isSpeedMode ? 'Adrenaline Speed Mode' : isHardcoreMode ? 'Survival Hardcore Mode' : isZenMode ? 'Relaxed Zen Mode' : 'Classic Progression Mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {isHardcoreMode && (
              <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`size-5 transition-all duration-500 ${i < lives ? 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-white/10'}`} 
                  />
                ))}
              </div>
            )}

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <Flame className={`size-5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-bounce' : 'text-white/20'}`} />
                <span className="text-xl font-black text-white">{streak}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Streak</p>
            </div>
            
            <div className="h-10 w-0.5 bg-white/10"></div>
            
            <div className="flex flex-col items-end min-w-[100px]">
              <div className="flex items-center gap-2">
                {isSpeedMode ? (
                  <>
                    <Timer className={`size-5 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                    <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-red-500 underline' : 'text-white'}`}>
                      {timeLeft}s
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-black text-white">
                    {currentCount}<span className="text-primary/40">/{TOTAL_PUZZLES}</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {isSpeedMode ? 'Time Left' : 'Mission Progress'}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN GAME AREA */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* PUZZLE DISPLAY */}
          <div className="flex-1 wooden-texture p-4 md:p-8 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border-t-12 border-b-12 border-wood-dark relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            {isFinished ? (
              <div className="text-center animate-fade-in-up">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-x-0 -bottom-2 h-4 bg-primary/20 blur-xl"></div>
                  {isHardcoreMode && lives === 0 ? (
                    <X className="size-32 text-red-500 mx-auto drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]" />
                  ) : (
                    <Trophy className="size-32 text-primary mx-auto drop-shadow-[0_0_30px_rgba(253,223,73,0.4)]" />
                  )}
                </div>
                
                <h2 className="text-5xl font-black text-white italic tracking-tighter text-3d mb-2">
                  {isHardcoreMode && lives === 0 ? 'MISSION FAILED!' : 'MISSION COMPLETE!'}
                </h2>
                <div className="h-1.5 w-40 bg-linear-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
                
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                    <p className="text-xl font-black text-primary italic leading-none">
                      {isSpeedMode ? correctCount : `${(correctCount / TOTAL_PUZZLES) * 100}%`}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {isSpeedMode ? 'Puzzles Solved' : 'Accuracy'}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                    <p className="text-xl font-black text-primary italic leading-none">+{bananasEarned}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bananas</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={onClose}
                    className="w-full sm:w-auto px-12 py-5 bg-primary text-wood-dark font-black rounded-3xl shadow-[0_8px_0_0_#caaf2e] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all text-xl italic tracking-tighter"
                  >
                    BACK TO HUB
                  </button>
                  <button 
                    onClick={() => {
                        setIsFinished(false);
                        setCurrentCount(1);
                        setCorrectCount(0);
                        setBananasEarned(0);
                        setStreak(0);
                        if (isSpeedMode) setTimeLeft(60);
                        if (isHardcoreMode) setLives(3);
                        fetchPuzzle();
                    }}
                    className="w-full sm:w-auto px-12 py-5 bg-white/10 hover:bg-white/20 text-white font-black rounded-3xl border-2 border-white/10 transition-all text-xl italic tracking-tighter"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="size-16 text-primary animate-spin" />
                <p className="font-black text-white uppercase italic tracking-widest animate-pulse">Summoning Puzzle...</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <p className="text-red-400 font-bold mb-4 uppercase">Lost Connection to the Jungle</p>
                <button 
                  onClick={fetchPuzzle}
                  className="bg-primary text-wood-dark font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  RETRY
                </button>
              </div>
            ) : (
              <div className={`relative transition-all duration-500 ${feedback === 'correct' ? 'scale-110' : feedback === 'incorrect' ? 'animate-shake' : 'animate-fade-in'}`}>
                <img 
                  src={puzzle?.question} 
                  alt="Banana Puzzle" 
                  className="max-w-full max-h-[400px] md:max-h-[500px] rounded-2xl shadow-2xl border-4 border-white/10"
                />
                
                {feedback === 'correct' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-2xl animate-fade-in">
                    <div className="text-center scale-125">
                      <Trophy className="size-24 text-primary drop-shadow-[0_0_20px_rgba(253,223,73,0.5)] mb-2" />
                      <p className="text-4xl font-black text-white italic text-3d">MAGNIFICENT!</p>
                    </div>
                  </div>
                )}
                
                {feedback === 'incorrect' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-2xl animate-fade-in">
                    <div className="text-center scale-125">
                      <span className="material-symbols-outlined text-6xl text-white drop-shadow-lg mb-2">close</span>
                      <p className="text-4xl font-black text-white italic text-3d">INCORRECT!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            
            {/* INSTRUCTIONS */}
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border-2 border-white/5">
              <h3 className="font-black text-white uppercase italic tracking-tighter mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Solver's Task
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed">
                Find the missing number in the logic sequence. Every correct answer grants you <span className="text-primary italic">5 Bananas</span> and fuels your streak.
              </p>
            </div>

            {/* KEYPAD */}
            <div className="flex-1 grid grid-cols-5 lg:grid-cols-2 gap-3 md:gap-4 p-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  disabled={loading || !!feedback}
                  onClick={() => handleAnswer(num)}
                  className={`
                    relative h-16 md:h-20 wooden-texture rounded-2xl md:rounded-3xl border-b-4 border-wood-dark 
                    flex items-center justify-center group transition-all
                    ${loading || !!feedback ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-4px] active:translate-y-[2px] active:border-b-0'}
                  `}
                >
                  <span className="text-2xl md:text-4xl font-black text-white italic group-hover:scale-110 transition-transform">
                    {num}
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-2xl md:rounded-3xl lg:opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                  if (loading || !!feedback || isFinished) return;
                  if (currentCount < TOTAL_PUZZLES) {
                    setCurrentCount(prev => prev + 1);
                    fetchPuzzle();
                  } else {
                    setIsFinished(true);
                  }
                }}
                disabled={loading || !!feedback || isFinished}
                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border-2 border-white/5 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
                SKIP PUZZLE
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="flex items-center justify-center gap-8 py-4 opacity-60">
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-yellow-500" />
            <p className="text-[10px] font-black uppercase text-white tracking-widest">Score: {score}</p>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="size-4 text-primary" />
            <p className="text-[10px] font-black uppercase text-white tracking-widest">Time spent: 02:45</p>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px) rotate(-1deg); }
          75% { transform: translateX(10px) rotate(1deg); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
