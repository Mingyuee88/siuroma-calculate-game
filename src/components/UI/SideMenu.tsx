'use client';

import { Menu, X, User, Trophy, Target, Percent, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect, TouchEvent } from 'react';
import { VisualAid } from './VisualAid';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';

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
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  difficulty: number;
  setDifficulty: (level: number) => void;
  gameMode: 'addition' | 'subtraction' | 'Multiple Choice' | 'True/False Question';
  switchGameMode: (mode: 'addition' | 'subtraction' | 'Multiple Choice' | 'True/False Question') => void;
  visualStyle: 'blocks' | 'animals' | 'shapes' | 'numberLine';
  setVisualStyle: (style: 'blocks' | 'animals' | 'shapes' | 'numberLine') => void;
  questionsPerSession: number;
  setQuestionsPerSession: (count: number) => void;
  isSessionActive: boolean;
  isAdaptiveMode: boolean;
  enableAdaptiveMode: () => void;
  currentUser: UserStats;
  isAdmin: boolean;
  onUserLogin: (username: string) => void;
  onUserLogout: () => void;
  currentRank: number;
  allUsers: UserStats[];
  setCurrentUser: React.Dispatch<React.SetStateAction<UserStats>>;
  currentGame: 'math' | 'english';
  switchGame: (game: 'math' | 'english') => void;
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
  setCurrentUser,
  currentGame,
  switchGame
}: SideMenuProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

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
    { id: 'settings', title: t('menu.settings'), icon: <Menu size={20} /> },
    { id: 'stats', title: t('menu.stats'), icon: <Target size={20} /> },
    { id: 'ranking', title: isAdmin ? t('menu.adminRanking') : t('menu.ranking'), icon: <Trophy size={20} /> }
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
    <div className="p-4 pt-16 h-full flex flex-col justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-2 font-gensen">{t('title')}</h1>
        <p className="text-sm text-gray-600 font-gensen">{t('login.title')}</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-gensen">
            {t('login.email')}
          </label>
          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-gensen"
            placeholder={t('login.email')}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-gensen"
        >
          {t('login.emailLogin')}
        </button>
      </form>
    </div>
  );

  const renderLanguageSwitcher = () => (
    <div>
      <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('language')}</h2>
      <div className="flex flex-col gap-2">
        {[
          { code: 'en', label: 'English' },
          { code: 'zh', label: '简体中文' },
          { code: 'zh-TW', label: '繁體中文' }
        ].map(({ code, label }) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${
              i18n.language === code
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSettingsPanel = () => (
    <div className="space-y-8">
      {renderLanguageSwitcher()}
      {/* 科目选择 */}
      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.gameMode')}</h2>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => switchGame('math')}
            className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${currentGame === 'math' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t('game.welcome.title')}
          </button>
          <button
            onClick={() => switchGame('english')}
            className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${currentGame === 'english' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t('game.welcome.Etitle')}
          </button>
        </div>
      </div>
      {/* 题目数量设置 */}
      <div>
        <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.questionsPerSession')}</h2>
        <div className="flex flex-col gap-2">
          {[10, 20, 30].map(count => (
            <button
              key={count}
              onClick={() => setQuestionsPerSession(count)}
              disabled={isSessionActive}
              className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${questionsPerSession === count ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {count} {t('game.questions')}
            </button>
          ))}
        </div>
      </div>
      {/* 动态内容：数学 or 英语 */}
      {currentGame === 'math' ? (
        <>
          {/* 难度设置 */}
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.difficulty')}</h2>
            <div className="flex flex-col gap-2">
              {[{ level: 1, text: t('game.welcome.level1'), color: 'green' }, { level: 2, text: t('game.welcome.level2'), color: 'yellow' }, { level: 3, text: t('game.welcome.level3'), color: 'red' }].map(({ level, text, color }) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  disabled={isSessionActive}
                  className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${!isAdaptiveMode && difficulty === level ? `bg-${color}-500 text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          {/* 难度模式 */}
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.difficulty')}</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={enableAdaptiveMode}
                disabled={isSessionActive}
                className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${isAdaptiveMode ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t('game.settings.adaptiveMode')}
              </button>
            </div>
          </div>
          {/* 游戏模式 */}
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.gameMode')}</h2>
            <div className="flex flex-col gap-2">
              {[{ mode: 'addition', text: t('game.settings.addition') }, { mode: 'subtraction', text: t('game.settings.subtraction') }].map(({ mode, text }) => (
                <button
                  key={mode}
                  onClick={() => switchGameMode(mode as any)}
                  disabled={isSessionActive}
                  className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${gameMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
          {/* 视觉辅助 */}
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.visualStyle')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {[{ style: 'blocks', text: t('game.settings.blocks') }, { style: 'animals', text: t('game.settings.animals') }, { style: 'shapes', text: t('game.settings.shapes') }, { style: 'numberLine', text: t('game.settings.numberLine') }].map(({ style, text }) => (
                <button
                  key={style}
                  onClick={() => setVisualStyle(style as any)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${visualStyle === style ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 英语题型设置 */}
          <div>
            <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">{t('game.settings.gameMode')}</h2>
            <div className="flex flex-col gap-2">
              {[{ mode: 'Multiple Choice', text: t('game.settings.mcQuestion') }, { mode: 'True/False Question', text: t('game.settings.tfQuestion') }].map(({ mode, text }) => (
                <button
                  key={mode}
                  onClick={() => switchGameMode(mode as any)}
                  disabled={isSessionActive}
                  className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${gameMode === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${isSessionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStatsPanel = () => (
    <div className="space-y-6">
      <div className="text-center">
        <User size={48} className="mx-auto mb-2 text-purple-700" />
        <h2 className="text-xl font-bold text-purple-700 font-gensen">{currentUser?.username}</h2>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-700 mb-4 font-gensen">{t('game.stats.performance')}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600 font-gensen">{currentUser?.correctAnswers}</div>
            <div className="text-sm text-gray-600 font-gensen">{t('game.stats.correctAnswers')}</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 font-gensen">{currentUser?.totalQuestions}</div>
            <div className="text-sm text-gray-600 font-gensen">{t('game.stats.totalQuestions')}</div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 font-gensen">{t('game.stats.accuracy')}</span>
            <span className="text-sm font-bold text-purple-600 font-gensen">{currentUser?.accuracy}%</span>
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
    <div className="space-y-6">
      <div className="text-center">
        <Trophy size={48} className="mx-auto mb-2 text-yellow-500" />
        <h2 className="text-xl font-bold text-purple-700 font-gensen">
          {isAdmin ? t('game.ranking.allRankings') : t('game.ranking.myRanking')}
        </h2>
      </div>

      {!isAdmin && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2 font-gensen">#{currentUser?.currentRank}</div>
            <div className="text-sm text-gray-600 font-gensen">{t('game.ranking.yourCurrentRank')}</div>
            <div className="mt-2 text-xs text-gray-500 font-gensen">
              {t('game.ranking.basedOnCorrectAnswers')}: {currentUser?.correctAnswers}
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="space-y-2">
          <h3 className="font-semibold text-purple-700 mb-3 font-gensen">{t('game.ranking.topPlayers')}</h3>
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-gensen ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium font-gensen">{player.username}</span>
              </div>
              <span className="text-sm font-semibold text-purple-600 font-gensen">{player.correctAnswers}</span>
            </div>
          ))}
        </div>
      )}
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
      className={`
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        fixed left-0 top-0 h-screen w-80 bg-white shadow-lg z-50

        md:relative md:translate-x-0 md:shadow-none md:w-64
ev
      `}
      ref={panelRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {showLoginForm ? renderLoginForm() : (
        <div className="h-full flex flex-col">
          {/* Panel Navigation */}
          <div className="flex border-b border-gray-200 bg-purple-50 flex-shrink-0">
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
                  <span>{panel.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Panel Content - 可滚动区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 pb-20">
              {renderCurrentPanel()}
            </div>
          </div>

          {/* Logout Button - 固定在底部 */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-gensen"
            >
              {t("menu.logout")}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}