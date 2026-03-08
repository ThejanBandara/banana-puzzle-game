import JungleParticles from "@/components/jungle-particles";
import { Leaf } from "lucide-react";

export default function ComingSoon() {
    return (
        <div className="bg-background-dark font-display min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-center">
            {/* Background Image with slight darkening for readability */}
            <div className="absolute inset-0 z-0">
                <img
                    alt="Jungle background"
                    className="w-full h-full object-cover"
                    src="/bg1.jpg"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            <JungleParticles />

            {/* Extended Decorative Vines */}
            <div className="absolute top-0 left-4 md:left-1/4 w-2 h-64 md:h-96 vines opacity-80 z-0"></div>
            <div className="absolute top-0 right-4 md:right-1/4 w-2 h-48 md:h-72 vines opacity-80 z-0"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 w-full animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                {/* Floating Badge */}
                <div className="bg-primary px-8 py-3 rounded-full shadow-[0_10px_30px_rgba(253,223,73,0.3)] border-4 border-wood-dark mb-10 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-3">
                        <img src="/banana.svg" alt="" className="size-8 md:size-10" />
                        <span className="text-wood-dark font-black tracking-widest text-lg md:text-2xl whitespace-nowrap">
                            BANANA PUZZLE
                        </span>
                    </div>
                </div>

                <div className="text-center max-w-6xl mx-auto px-4 flex flex-col items-center">
                    <div className="relative flex justify-center w-full">
                        <h1 className="text-6xl sm:text-7xl md:text-[10rem] leading-none font-black text-white text-3d mb-8 italic tracking-tighter mix-blend-overlay opacity-90 pb-4">
                            COMING SOON
                        </h1>

                        <h1 className="absolute top-0 text-6xl sm:text-7xl md:text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#fddf49] text-3d mb-8 italic tracking-tighter pb-4">
                            COMING SOON
                        </h1>
                    </div>

                    <p className="text-primary font-bold text-2xl md:text-5xl mb-16 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] mt-8 md:mt-24 text-center max-w-4xl leading-tight">
                        The jungle is preparing for the ultimate adventure...
                    </p>

                    <div className="flex items-center justify-center gap-4 text-white text-lg md:text-3xl font-bold bg-black/40 px-6 md:px-8 py-4 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
                        <Leaf className="animate-pulse text-primary size-6 md:size-10 drop-shadow-[0_0_15px_rgba(253,223,73,0.8)]" />
                        <span className="tracking-widest uppercase text-center inline-block">Stay tuned for updates</span>
                        <Leaf className="animate-pulse text-primary size-6 md:size-10 drop-shadow-[0_0_15px_rgba(253,223,73,0.8)]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
