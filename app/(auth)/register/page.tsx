import { CornerUpRight, Leaf, Lock, Send } from "lucide-react";
import Link from "next/link";
import JungleParticles from "@/components/jungle-particles";

export default function RegisterPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-start">
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
        <div className="w-full max-w-md wooden-texture rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col gap-6 relative border-t-8 border-b-8 z-10 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
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

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2">
                EXPLORER NAME
              </label>
              <div className="relative">
                <input
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
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
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
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2">
                SECRET CODE
              </label>
              <div className="relative">
                <input
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
              <label className="text-stone-200 text-xs font-bold flex items-center gap-2">
                CONFIRM SECRET CODE
              </label>
              <div className="relative">
                <input
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
              className="w-full bg-primary hover:bg-yellow-400 text-wood-dark font-black text-lg py-4 rounded-full shadow-[0_6px_0_0_var(--color-shadow-yellow)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-4"
              type="submit"
            >
              FORGE NEW PATH
              <CornerUpRight />
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

          {/* Decorative leaves */}

        </div>
      </div>


    </div>
  );
}
