"use client";

import React, { useState } from "react";
import { CornerUpRight, Leaf, Lock, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import JungleParticles from "@/components/jungle-particles";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Secret codes do not match!");
      return;
    }

    setLoading(false);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Profile
      await updateProfile(user, {
        displayName: name,
      });

      // Initialize Firestore Document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        photoURL: null,
        createdAt: new Date().toISOString(),
        stats: {
          totalBananas: 0,
          highStreak: 0,
          puzzlesSolved: 0,
        }
      });

      router.push("/");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This carrier pigeon address is already taken!");
      } else if (err.code === "auth/weak-password") {
        setError("Secret code must be at least 6 characters!");
      } else {
        setError("The jungle is thick today. Try again shortly.");
      }
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
              <img src="/banana.svg" alt="" className="size-6" />
              <span className="text-wood-dark font-bold tracking-wider text-sm whitespace-nowrap">
                BANANA PUZZLE
              </span>
            </div>
          </div>

          <div className="text-center mt-2">
            <h1 className="text-4xl font-black text-white text-3d mb-2 italic">
              Join the Tribe
            </h1>
            <p className="text-primary/90 font-medium">Create New Account</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 p-3 rounded-2xl text-red-200 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2 uppercase">
                EXPLORER NAME
              </label>
              <div className="relative">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-12 px-5 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
                  placeholder="Choose your bamboo ID"
                  type="text"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-dark flex items-center">
                  <Leaf />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2 uppercase">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-12 px-5 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
                  placeholder="Carrier pigeon address"
                  type="email"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-dark flex items-center">
                  <Send />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2 uppercase">
                SECRET CODE
              </label>
              <div className="relative">
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-12 px-5 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
                  placeholder="Bamboo encryption key"
                  type="password"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-leaf-dark flex items-center">
                  <Lock />
                </div>
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2 uppercase">
                CONFIRM SECRET CODE
              </label>
              <div className="relative">
                <input
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-form-bg border-4 border-leaf-dark rounded-full h-12 px-5 focus:ring-4 focus:ring-primary/50 focus:outline-none text-stone-800 placeholder:text-stone-400 font-medium bamboo-shadow"
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
              className="w-full bg-primary hover:bg-yellow-400 text-wood-dark font-black text-lg py-4 rounded-full shadow-[0_6px_0_0_caaf2e] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
              type="submit"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  FORGE NEW PATH
                  <CornerUpRight />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-stone-300 text-sm">
              Already have a path?
              <Link className="text-primary hover:underline font-bold ml-1" href="/login">
                Enter the Jungle
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
