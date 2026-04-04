"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerUpRightIcon, Leaf, Lock, Loader2 } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import JungleParticles from "@/components/jungle-particles";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("The jungle spirits reject your credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          stats: {
            totalBananas: 0,
            highStreak: 0,
            puzzlesSolved: 0,
          }
        });
      }

      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("The golden fruit was snatched away! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-start text-slate-900 dark:text-slate-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale-[0.2]">
        <img
          alt="Jungle background"
          className="w-full h-full object-cover"
          src="/bg1.jpg"
        />
      </div>

      <JungleParticles />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 w-full">
        {/* Decorative Vines */}
        <div className="absolute top-0 left-1/4 w-1 h-32 vines opacity-80 z-0 hidden md:block"></div>
        <div className="absolute top-0 right-1/4 w-1 h-32 vines opacity-80 z-0 hidden md:block"></div>

        {/* Main Card */}
        <div className="w-full max-w-md wooden-texture rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col gap-6 relative border-t-8 border-b-8 z-10 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 1 }}>
          {/* Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary px-6 py-2 rounded-full shadow-lg border-2 border-wood-dark">
            <div className="flex items-center gap-2">
              <span className="size-6 text-wood-dark flex items-center justify-center">
                <img src='/banana.svg' alt="Banana" className="w-full h-full" />
              </span>
              <span className="text-wood-dark font-bold tracking-wider text-sm whitespace-nowrap">
                BANANA PUZZLE
              </span>
            </div>
          </div>

          <div className="text-center mt-4">
            <h1 className="text-5xl font-black text-white text-3d mb-2 italic">
              Enter the Jungle
            </h1>
            <p className="text-primary/90 font-medium">Log in to your account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 p-3 rounded-2xl text-red-200 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-stone-200 text-sm font-bold flex items-center gap-2 uppercase">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-14 px-6 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
                  placeholder="Explorer email"
                  type="email"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-dark flex items-center">
                  <Leaf />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-stone-200 text-sm font-bold flex items-center gap-2 uppercase">
                SECRET CODE
              </label>
              <div className="relative">
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-14 px-6 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
                  placeholder="Bamboo encryption key"
                  type="password"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-dark flex items-center">
                  <Lock />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-400 text-wood-dark font-black text-lg py-4 rounded-full shadow-[0_6px_0_0_caaf2e] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-50"
              type="submit"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  START THE ADVENTURE
                  <CornerUpRightIcon />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[2px] grow bg-stone-500/50"></div>
            <span className="text-stone-300 text-xs font-bold whitespace-nowrap">OR USE THE FRUIT</span>
            <div className="h-[2px] grow bg-stone-500/50"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-[#FDE047] hover:bg-yellow-300 text-stone-900 font-bold py-4 px-6 rounded-[2rem_5rem_2rem_5rem] shadow-lg flex items-center justify-center gap-3 border-b-4 border-yellow-600 transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="currentColor"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="currentColor"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="currentColor"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-lg">Login with Google</span>
          </button>

          <div className="text-center pt-2">
            <p className="text-stone-300 text-sm">
              Lost in the canopy?
              <Link className="text-primary hover:underline font-bold ml-1" href="/register">
                Join the Tribe
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
