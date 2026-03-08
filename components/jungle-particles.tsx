"use client";

import { useEffect, useState } from "react";

export default function JungleParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);

    useEffect(() => {
        const particleCount = 40;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // random x position
            y: Math.random() * 100, // random y position
            size: Math.random() * 4 + 2, // size between 2 and 6
            delay: Math.random() * 5, // random delay
            duration: Math.random() * 10 + 10, // animation duration between 10s and 20s
        }));
        setParticles(newParticles);
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-green-400 animate-float"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(74, 222, 128, 0.8)`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
