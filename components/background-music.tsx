"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Audio URLs: Primary (Jungle Ambiance) and a solid Fallback (Stable Instrumentals)
  const PRIMARY_URL = "https://cdn.pixabay.com/audio/2022/03/24/audio_b2d8a50b7d.mp3";
  const FALLBACK_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    const initAudio = (url: string) => {
      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = 0.4;

      const handleError = () => {
        console.warn(`Audio loading failed for: ${url}. Attempting fallback...`);
        if (url === PRIMARY_URL) {
          audio.pause();
          initAudio(FALLBACK_URL);
        } else {
          setHasError(true);
        }
      };

      audio.addEventListener("error", handleError);
      audioRef.current = audio;

      // Load muted state from localStorage
      const savedMute = localStorage.getItem("bg-music-muted");
      if (savedMute !== null) {
        const muted = savedMute === "true";
        setIsMuted(muted);
        audio.muted = muted;
      }

      // Try initial play
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => console.log("Autoplay blocked. Waiting for interaction."));

      return audio;
    };

    const currentAudio = initAudio(PRIMARY_URL);

    return () => {
      currentAudio.pause();
      currentAudio.removeEventListener("error", () => {});
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      localStorage.setItem("bg-music-muted", String(isMuted));
    }
  }, [isMuted]);

  // Handle first interaction to start music if blocked
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current && !hasError) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(err => console.error("Play failed:", err));
      }
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted, hasError]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasError) return;
    
    setIsMuted(!isMuted);
    
    if (audioRef.current?.paused) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Visual Indicator of playing */}
      {isPlaying && !isMuted && !hasError && (
        <div className="flex gap-1 items-end h-4 mb-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1 bg-yellow-400 animate-bounce"
              style={{
                animationDuration: `${0.5 + i * 0.2}s`,
                height: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={toggleMute}
        disabled={hasError}
        className={`group p-3 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center 
          ${hasError
            ? "bg-red-900/40 text-red-300 border-red-500/30 cursor-not-allowed opacity-50"
            : isMuted 
              ? "bg-slate-800/80 text-slate-400 hover:bg-slate-700" 
              : "bg-yellow-500 text-wood-dark hover:bg-yellow-400 scale-110 shadow-yellow-500/20"
          } border-2 border-white/10 backdrop-blur-sm`}
        title={hasError ? "Audio Unavailable" : isMuted ? "Unmute Jungle Ambiance" : "Mute Music"}
      >
        {hasError ? (
          <VolumeX className="size-6 text-red-400" />
        ) : isMuted ? (
          <VolumeX className="size-6" />
        ) : (
          <Volume2 className="size-6 animate-pulse" />
        )}
        
        {/* Label on hover */}
        <span className="absolute right-full mr-3 whitespace-nowrap bg-black/80 px-3 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {hasError ? "Ambience Unavailable" : isMuted ? "Music Off" : "Jungle Ambiance"}
        </span>
      </button>

      {!hasInteracted && isMuted && !hasError && (
        <div className="absolute bottom-full right-0 mb-4 bg-yellow-400 text-wood-dark px-4 py-2 rounded-xl text-sm font-bold animate-bounce shadow-xl whitespace-nowrap">
          Click anywhere for Jungle Beats! 🌴
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-yellow-400"></div>
        </div>
      )}
    </div>
  );
}
