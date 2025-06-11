'use client';

import { Menu, X } from 'lucide-react';
import { VisualAid } from './VisualAid';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
  const { t, language, setLanguage } = useLanguage();

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
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-4">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-purple-700 mb-2">{t('title')}</h1>
              <p className="text-sm text-gray-600">{t('subtitle')}</p>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4">{t('language')}</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    language === 'en'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('english')}
                </button>
                <button
                  onClick={() => setLanguage('zh-TW')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    language === 'zh-TW'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('traditionalChinese')}
                </button>
                <button
                  onClick={() => setLanguage('zh-CN')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    language === 'zh-CN'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('simplifiedChinese')}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4">{t('difficultyMode')}</h2>
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
                  {t('adaptiveMode')}
                </button>
                <div className="text-xs text-gray-500 px-2">
                  {t('adaptiveModeDesc')}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4">{t('fixedDifficulty')}</h2>
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
                  {t('age3to4')}
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
                  {t('age4to5')}
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
                  {t('age5to6')}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4">{t('questionsPerSession')}</h2>
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
                  {t('questions10')}
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
                  {t('questions20')}
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
                  {t('questions30')}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameMode')}</h2>
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
                  {t('addition')}
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
                  {t('subtraction')}
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
      </div>
    </>
  );
} 