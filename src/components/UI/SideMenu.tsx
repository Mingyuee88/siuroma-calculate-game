'use client';

import { Menu, X, User, Trophy, Target, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, TouchEvent } from 'react';
import { VisualAid } from './VisualAid';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';

// User and Statistics interfaces
interface UserStats {
  userId: string;
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  currentRank: number;
  accuracy: number;
}


interface SideMenuProps {
  userStats: UserStats;
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
  currentUser: UserStats | null;
  isAdmin: boolean;
  onUserLogin: (username: string) => void;
  onUserLogout: () => void;
  currentRank: number;
  allUsers: UserStats[];
  setCurrentUser: React.Dispatch<React.SetStateAction<UserStats | null>>;
}

const mockUserStats: UserStats = {
  userId: '1',
  username: 'Player1',
  totalQuestions: 150,
  correctAnswers: 120,
  currentRank: 5,
  accuracy: 80
};

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
  currentUser = mockUserStats,
  isAdmin = false,
  onUserLogin = () => {},
  onUserLogout = () => {},
  currentRank: _currentRank,
  allUsers,
  setCurrentUser
}: SideMenuProps) {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  // Swipe functionality states
  const [currentPanel, setCurrentPanel] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Login form state
  const [showLoginForm, setShowLoginForm] = useState(!currentUser);
  const [loginUsername, setLoginUsername] = useState('');

  // Panel definitions
  const panels = [
    { id: 'settings', title: 'Game Settings', icon: <Menu size={20} /> },
    { id: 'stats', title: 'My Stats', icon: <Target size={20} /> },
    { id: 'ranking', title: isAdmin ? 'All Rankings' : 'My Ranking', icon: <Trophy size={20} /> }
  ];

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentPanel < panels.length - 1) {
      setCurrentPanel(currentPanel + 1);
    }
    if (isRightSwipe && currentPanel > 0) {
      setCurrentPanel(currentPanel - 1);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim()) {
      onUserLogin(loginUsername.trim());
      setShowLoginForm(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
      alert('登出失败，请重试');
    }
  };

  const renderLoginForm = () => (
    <div className="p-4 pt-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-2">Math Explorer</h1>
        <p className="text-sm text-gray-600">Please login to continue</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your username"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );

  const renderSettingsPanel = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameSettings.gameSelection')}</h2>
        <div className="flex flex-col gap-2">
          {[
            { id: 'math', text: t('gameSettings.selection.MathGame')},
            { id: 'english', text: t('gameSettings.selection.EnglishGame')}
          ].map(({ id, text }) => (
            <button
              key={id}
              onClick={() => router.push(`/game?type=${id}`)}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selection */}
      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('language')}</h2>
        <div className="flex flex-col gap-2">
          {[
            { code: 'en', label: t('english') },
            { code: 'zh-TW', label: t('traditionalChinese') },
            { code: 'zh-CN', label: t('simplifiedChinese') }
          ].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLanguage(code as 'en' | 'zh-TW' | 'zh-CN')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                language === code
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>


      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameSettings.difficultyMode')}</h2>
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
            {t('gameSettings.adaptiveMode')}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameSettings.fixedDifficulty')}</h2>
        <div className="flex flex-col gap-2">
          {[
            { level: 1, text: t('gameSettings.ageLevels.easy'), color: 'green' },
            { level: 2, text: t('gameSettings.ageLevels.medium'), color: 'yellow' },
            { level: 3, text: t('gameSettings.ageLevels.hard'), color: 'red' }
          ].map(({ level, text, color }) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              disabled={isSessionActive}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                !isAdaptiveMode && difficulty === level
                  ? `bg-${color}-500 text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameSettings.questionsPerSession')}</h2>
        <div className="flex flex-col gap-2">
          {[
            { count: 10, text: t('gameSettings.questionCounts.ten') },
            { count: 20, text: t('gameSettings.questionCounts.twenty') },
            { count: 30, text: t('gameSettings.questionCounts.thirty') }
          ].map(({ count, text }) => (
            <button
              key={count}
              onClick={() => setQuestionsPerSession(count)}
              disabled={isSessionActive}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                questionsPerSession === count
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4">{t('gameSettings.gameMode')}</h2>
        <div className="flex flex-col gap-2">
          {[
            { mode: 'addition' as const, text: t('gameSettings.operations.addition') },
            { mode: 'subtraction' as const, text: t('gameSettings.operations.subtraction') }
          ].map(({ mode, text }) => (
            <button
              key={mode}
              onClick={() => switchGameMode(mode)}
              disabled={isSessionActive}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                gameMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Aid section */}
      <div className="mb-16">
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
  );

  const renderStatsPanel = () => (
    <div className="space-y-6 pb-16">
      <div className="text-center">
        <User size={48} className="mx-auto mb-2 text-purple-700" />
        <h2 className="text-xl font-bold text-purple-700">{currentUser?.username}</h2>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">{t('stats.title')}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{currentUser?.correctAnswers}</div>
            <div className="text-sm text-gray-600">{t('stats.totalCorrect')}</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentUser?.totalQuestions}</div>
            <div className="text-sm text-gray-600">{t('stats.totalAttempts')}</div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{t('stats.accuracy')}</span>
            <span className="text-sm font-bold text-purple-600">{currentUser?.accuracy}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${currentUser?.accuracy}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRankingPanel = () => (
    <div className="space-y-6 pb-16">
      <div className="text-center">
        <Trophy size={48} className="mx-auto mb-2 text-yellow-500" />
        <h2 className="text-xl font-bold text-purple-700">
          {isAdmin ? t('stats.allRankings') : t('stats.myRanking')}
        </h2>
      </div>

      {!isAdmin && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">#{currentUser?.currentRank}</div>
            <div className="text-sm text-gray-600">{t('stats.currentRank')}</div>
            <div className="mt-2 text-xs text-gray-500">
              {t('stats.basedOnCorrectAnswers')}: {currentUser?.correctAnswers}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold text-purple-700 mb-3">{t('stats.topPlayers')}</h3>
        {allUsers.slice(0, 5).map((player, index) => (
          <div 
            key={player.userId}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.userId === currentUser?.userId 
                ? 'bg-purple-100 border-2 border-purple-300' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-yellow-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-orange-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                {index + 1}
              </div>
              <span className="font-medium">{player.username}</span>
            </div>
            <span className="text-sm font-semibold text-purple-600">{player.correctAnswers}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentPanel = () => {
    switch (panels[currentPanel].id) {
      case 'settings':
        return renderSettingsPanel();
      case 'stats':
        return renderStatsPanel();
      case 'ranking':
        return renderRankingPanel();
      default:
        return renderSettingsPanel();
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      ref={panelRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {showLoginForm ? renderLoginForm() : (
        <div className="h-full flex flex-col">
          {/* Panel Navigation */}
          <div className="flex border-b border-gray-200 bg-purple-50">
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                onClick={() => setCurrentPanel(index)}
                className={`flex-1 py-3 px-2 text-xs font-medium transition-colors ${
                  currentPanel === index
                    ? 'text-purple-700 border-b-2 border-purple-700 bg-white'
                    : 'text-gray-500 hover:text-purple-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  {panel.icon}
                  <span>{t(`panels.${panel.id}`)}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderCurrentPanel()}
            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              {t('auth.logout')}
            </button>
          </div>

          {/* Panel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/80 rounded-full px-3 py-2">
            {panels.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPanel === index ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}

          </div>
        </div>
      )}
    </div>
  );
}