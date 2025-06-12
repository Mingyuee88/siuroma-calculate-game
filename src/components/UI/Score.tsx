'use client';

import { Star, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ScoreProps {
  score: number;
  total: number;
  time: string;
  showAnimation?: boolean;
}

export function Score({ score, total, time, showAnimation = false }: ScoreProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center space-x-8">
      <div className="flex items-center text-yellow-500">
        <Star fill="currentColor" size={24} />
        <span className="mx-2 font-bold">{t('game.complete.score', { score, total })}</span>
        <Star fill="currentColor" size={24} />
      </div>
      
      <div className="flex items-center text-blue-500">
        <Clock size={24} />
        <span className="mx-2 font-bold">{t('game.complete.time', { time })}</span>
      </div>

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