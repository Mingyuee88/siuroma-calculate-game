import { MathGame } from '@/components/MathGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
      <MathGame initialDifficulty={1} />
    </main>
  );
}
