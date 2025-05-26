'use client';

import { Menu, X } from 'lucide-react';
import { VisualAid } from './VisualAid';
// 在顶部添加这些 import
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// 同时导入 auth 对象
import { auth } from '../../firebase';
interface SideMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  difficulty: number;
  setDifficulty: (level: number) => void;
  gameMode: 'addition' | 'subtraction';
  switchGameMode: (mode: 'addition' | 'subtraction') => void;
  visualStyle: 'blocks' | 'animals' | 'shapes' | 'numberLine';
  setVisualStyle: (style: 'blocks' | 'animals' | 'shapes' | 'numberLine') => void;
  questionsPerSession: number;
  setQuestionsPerSession: (count: number) => void;
  isSessionActive: boolean;
  isAdaptiveMode: boolean;
  enableAdaptiveMode: () => void;
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
  questionsPerSession,
  setQuestionsPerSession,
  isSessionActive,
  isAdaptiveMode,
  enableAdaptiveMode,
}: SideMenuProps) {
  const router = useRouter();

const handleLogout = async () => {
  try {
    await signOut(auth);
    // 注销成功，跳转到登录页
    router.push('/');
  } catch (error) {
    console.error('登出失败:', error);
    alert('登出失败，请重试');
  }
};
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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 pt-16">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-purple-700 mb-2">Math Explorer</h1>
            <p className="text-sm text-gray-600">Math Game for Young Learners</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Difficulty Mode</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={enableAdaptiveMode}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isAdaptiveMode
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Adaptive Mode
              </button>
              <div className="text-xs text-gray-500 px-2">
                Automatically adjusts difficulty based on performance
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Fixed Difficulty</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setDifficulty(1)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  !isAdaptiveMode && difficulty === 1
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                3-4 Years
              </button>
              <button
                onClick={() => setDifficulty(2)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  !isAdaptiveMode && difficulty === 2
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                4-5 Years
              </button>
              <button
                onClick={() => setDifficulty(3)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  !isAdaptiveMode && difficulty === 3
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                5-6 Years
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Questions per Session</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setQuestionsPerSession(10)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  questionsPerSession === 10
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                10 Questions
              </button>
              <button
                onClick={() => setQuestionsPerSession(20)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  questionsPerSession === 20
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                20 Questions
              </button>
              <button
                onClick={() => setQuestionsPerSession(30)}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  questionsPerSession === 30
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                30 Questions
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-700 mb-4">Game Mode</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => switchGameMode('addition')}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  gameMode === 'addition'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Addition
              </button>
              <button
                onClick={() => switchGameMode('subtraction')}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  gameMode === 'subtraction'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          <button
  onClick={handleLogout}
  className="w-full mt-6 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  Logout
</button>
        </div>
      </div>
    </>
  );
} 