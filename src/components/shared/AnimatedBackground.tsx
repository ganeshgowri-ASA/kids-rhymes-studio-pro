"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "note" | "star";
  symbol: string;
}

const NOTE_SYMBOLS = ["\u266A", "\u266B", "\u2669", "\u266C"];
const STAR_SYMBOLS = ["\u2726", "\u2728", "\u2605"];

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: 18 }, (_, i) => {
      const isNote = i < 10;
      const symbols = isNote ? NOTE_SYMBOLS : STAR_SYMBOLS;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 14 + Math.random() * 18,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 8,
        type: isNote ? "note" : "star",
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      };
    });
    setParticles(items);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={p.type === "note" ? "text-pink-200" : "text-yellow-200"}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: 0.4,
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.symbol}
        </span>
      ))}
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.2; }
          25% { transform: translate(15px, -30px) rotate(90deg); opacity: 0.5; }
          50% { transform: translate(-10px, -50px) rotate(180deg); opacity: 0.3; }
          75% { transform: translate(20px, -20px) rotate(270deg); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
