'use client';

import { Star } from 'lucide-react';

interface ScoreProps {
  score: number;
  showAnimation?: boolean;
}

export function Score({ score, showAnimation = false }: ScoreProps) {
  return (
    <div className="mt-2 text-yellow-500 flex justify-center">
      <Star fill="currentColor" size={24} />
      <span className="mx-2 font-bold">Score: {score}</span>
      <Star fill="currentColor" size={24} />
      {showAnimation && (
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce mx-1"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <Star fill="gold" color="gold" size={32} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 