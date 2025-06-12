'use client';

import { MathGame } from '@/components/MathGame';
import { EnglishGame } from '@/components/EnglishGame';
import { useSearchParams } from 'next/navigation';

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameType = searchParams.get('type');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      {gameType === 'english' ? (
        <EnglishGame 
          initialDifficulty={1}
          currentGame="english"
          switchGame={() => {}}
        />
      ) : (
        <MathGame 
          initialDifficulty={1}
          currentGame="math"
          switchGame={() => {}}
        />
      )}
    </main>
  );
}
