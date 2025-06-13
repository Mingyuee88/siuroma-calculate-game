"use client";

import { useState } from 'react';
import { MathGame } from '@/components/MathGame';
import { EnglishGame } from '@/components/EnglishGame';

export default function GamePage() {
  const [currentGame, setCurrentGame] = useState<'math' | 'english'>('math');

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      {currentGame === 'math' ? (
        <MathGame 
          initialDifficulty={1} 
          currentGame={currentGame}
          switchGame={setCurrentGame}
        />
      ) : (
        <EnglishGame 
          initialDifficulty={1}
          currentGame={currentGame}
          switchGame={setCurrentGame}
        />
      )}
    </main>
  );
}
