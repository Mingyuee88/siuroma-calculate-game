'use client';

import { Menu, X } from 'lucide-react';
import { VisualAid } from './VisualAid';

interface SideMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  difficulty: number;
  setDifficulty: (difficulty: number) => void;
  gameMode: 'addition' | 'subtraction';
  switchGameMode: (mode: 'addition' | 'subtraction') => void;
  visualStyle: 'blocks' | 'animals' | 'shapes' | 'numberLine';
  setVisualStyle: (style: 'blocks' | 'animals' | 'shapes' | 'numberLine') => void;
  generateProblem: () => void;
  setConsecutiveCorrect: (count: number) => void;
}

export function SideMenu({
  isMenuOpen,
  setIsMenuOpen,
  difficulty,
  setDifficulty,
  gameMode,
  switchGameMode,
  visualStyle,
  setVisualStyle,
  generateProblem,
  setConsecutiveCorrect,
}: SideMenuProps) {
  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
      >
        {isMenuOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
      </button>

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 pt-16">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-purple-700 mb-2">Math Explorer</h1>
            <p className="text-sm text-gray-600">Math Game for Young Learners</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Age Level</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setDifficulty(1);
                  setConsecutiveCorrect(0);
                  generateProblem();
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  difficulty === 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3-4 Years (1-10)
              </button>
              <button
                onClick={() => {
                  setDifficulty(2);
                  setConsecutiveCorrect(0);
                  generateProblem();
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  difficulty === 2
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                4-5 Years (1-20)
              </button>
              <button
                onClick={() => {
                  setDifficulty(3);
                  setConsecutiveCorrect(0);
                  generateProblem();
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  difficulty === 3
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                5-6 Years (1-50)
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Game Mode</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => switchGameMode('addition')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  gameMode === 'addition'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Addition
              </button>
              <button
                onClick={() => switchGameMode('subtraction')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  gameMode === 'subtraction'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Subtraction
              </button>
            </div>
          </div>

          <VisualAid
            visualStyle={visualStyle}
            setVisualStyle={setVisualStyle}
            firstNumber={0}
            secondNumber={0}
            gameMode="addition"
            showExplanation={false}
            showSelector={true}
          />
        </div>
      </div>
    </>
  );
} 