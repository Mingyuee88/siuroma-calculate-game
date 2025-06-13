"use client";

import { useState, useEffect, useCallback } from "react";
import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";

import { useLanguage } from "@/lib/i18n/LanguageContext";

import { AnswerOptions } from "./UI/AnswerOptions";


interface EnglishGameProps {
  initialDifficulty?: number;
  userId?: string;
  isAdmin?: boolean;
  currentGame: 'math' | 'english';
  switchGame: (game: 'math' | 'english') => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface UserStats {
  userId: string;
  Username: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  currentrank: number;
}




export function EnglishGame({ 
  initialDifficulty = 1, 
  userId = 'user123',
  isAdmin = false,
  currentGame,
  switchGame
}: EnglishGameProps) {
  const { t } = useLanguage();
  const [gameMode, setGameMode] = useState<"Multiple Choice" | "True/False Question" | "addition" | "subtraction">("Multiple Choice");
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);

  // Session related state
  const [questionsPerSession, setQuestionsPerSession] = useState(10);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [hasTriedThisQuestion, setHasTriedThisQuestion] = useState(false);

  // User statistics
  const [userStats, setUserStats] = useState<UserStats>({
    userId: userId,
    Username: 'Current User',
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    currentrank: 0
  });

  // Mock leaderboard data - in real app, this would come from a database
  const [allUsers] = useState<UserStats[]>([
    { userId: '1', Username: 'Alice', correctAnswers: 28, totalQuestions: 35, accuracy: 80, currentrank: 1 },
    { userId: '2', Username: 'Bob', correctAnswers: 25, totalQuestions: 30, accuracy: 83.3, currentrank: 2 },
    { userId: '3', Username: 'Charlie', correctAnswers: 22, totalQuestions: 28, accuracy: 78.6, currentrank: 3 },
    { userId: '4', Username: 'Daisy', correctAnswers: 20, totalQuestions: 25, accuracy: 80, currentrank: 4 },
    { userId: '5', Username: 'Eve', correctAnswers: 19, totalQuestions: 24, accuracy: 79.2, currentrank: 5 },
    { userId: '6', Username: 'Frank', correctAnswers: 18, totalQuestions: 23, accuracy: 78.3, currentrank: 6 },
    { userId: '7', Username: 'Grace', correctAnswers: 17, totalQuestions: 22, accuracy: 77.3, currentrank: 7 },
    { userId: '8', Username: 'Heidi', correctAnswers: 16, totalQuestions: 21, accuracy: 76.2, currentrank: 8 },
    { userId: '9', Username: 'Ivan', correctAnswers: 15, totalQuestions: 20, accuracy: 75, currentrank: 9 },
    { userId: '10', Username: 'Judy', correctAnswers: 14, totalQuestions: 19, accuracy: 73.7, currentrank: 10 },
  ]);

  // Mock questions database
  const questionsDatabase = {
    "Multiple Choice": [
      {
        question: "What is the past tense of 'go'?",
        options: ["went", "gone", "goed", "going"],
        correctAnswer: "went"
      },
      {
        question: "Which word is a synonym for 'happy'?",
        options: ["sad", "joyful", "angry", "tired"],
        correctAnswer: "joyful"
      },
      {
        question: "What is the opposite of 'begin'?",
        options: ["start", "end", "continue", "proceed"],
        correctAnswer: "end"
      },
      // Add more MC questions here
    ],
    "True/False Question": [
      {
        question: "The word 'cat' has three letters.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
      {
        question: "English has more words than any other language.",
        options: ["True", "False"],
        correctAnswer: "True"
      },
      {
        question: "The word 'quickly' is a noun.",
        options: ["True", "False"],
        correctAnswer: "False"
      },
      // Add more T/F questions here
    ]
  };

  const generateQuestion = useCallback(() => {
    if (gameMode === "Multiple Choice" || gameMode === "True/False Question") {
      const questions = questionsDatabase[gameMode];
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
      setHasTriedThisQuestion(false);
      setFeedback("");
    }
  }, [gameMode]);

  const startNewSession = () => {
    setQuestionsAnswered(0);
    setSessionScore(0);
    setIsSessionComplete(false);
    setUserAnswer("");
    setFeedback("");
    setConsecutiveCorrect(0);
    setIsSessionStarted(true);
    setSessionStartTime(Date.now());
    generateQuestion();
  };

  // Initialize the game
  useEffect(() => {
    if (!isInitialized) {
      generateQuestion();
      setIsInitialized(true);
    }
  }, [isInitialized, generateQuestion]);

  // Generate new question when game mode or difficulty changes
  useEffect(() => {
    if (isInitialized && !isSessionComplete) {
      generateQuestion();
    }
  }, [gameMode, difficulty, generateQuestion, isInitialized, isSessionComplete]);

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (isSessionStarted && !isSessionComplete && sessionStartTime) {
      timerInterval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isSessionStarted, isSessionComplete, sessionStartTime]);

  // Update user stats
  const updateUserStats = (isCorrect: boolean, isFirstTry: boolean) => {
    setUserStats(prev => {
      const newtotalQuestions = prev.totalQuestions + 1;
      const newcorrectAnswers = isCorrect && isFirstTry ? prev.correctAnswers + 1 : prev.correctAnswers;
      const newAccuracy = (newcorrectAnswers / newtotalQuestions) * 100;
      
      return {
        ...prev,
        correctAnswers: newcorrectAnswers,
        totalQuestions: newtotalQuestions,
        accuracy: Math.round(newAccuracy * 10) / 10
      };
    });
  };

  // Calculate current user currentrank
  const getCurrentUserRank = () => {
    const sortedUsers = [...allUsers, userStats].sort((a, b) => b.correctAnswers - a.correctAnswers);
    const userIndex = sortedUsers.findIndex(user => user.userId === userId);
    return userIndex + 1;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const isFirstTry = !hasTriedThisQuestion;
    
    updateUserStats(isCorrect, isFirstTry);
    
    if (isCorrect) {
      setFeedback("Correct! Great job!");
      if (isFirstTry) {
        setScore(prev => prev + 1);
        setSessionScore(prev => prev + 1);
      }
      setConsecutiveCorrect(prev => prev + 1);

      // Adaptive mode logic
      if (isAdaptiveMode && consecutiveCorrect === 4 && difficulty < 3) {
        setTimeout(() => {
          setDifficulty(difficulty + 1);
          setConsecutiveCorrect(0);
          setFeedback(t('harderQuestions'));
        }, 1500);
      } else {
        setTimeout(() => {
          setQuestionsAnswered(prev => {
            const newCount = prev + 1;
            if (newCount >= questionsPerSession) {
              setIsSessionComplete(true);
            } else {
              generateQuestion();
            }
            return newCount;
          });
        }, 1500);
      }
    } else {
      setFeedback("Not quite right. Try again!");
      setHasTriedThisQuestion(true);
      setConsecutiveCorrect(0);
    }
  };

  const switchGameMode = (mode: "Multiple Choice" | "True/False Question" | "addition" | "subtraction") => {
    if (mode === "Multiple Choice" || mode === "True/False Question") {
      setGameMode(mode);
      setDifficulty(1);
      setScore(0);
      generateQuestion();
    }
  };

  const setDifficultyLevel = (level: number) => {
    setDifficulty(level);
    setIsAdaptiveMode(false);
    setConsecutiveCorrect(0);
    generateQuestion();
  };

  const enableAdaptiveMode = () => {
    setDifficulty(1);
    setIsAdaptiveMode(true);
    setConsecutiveCorrect(0);
    generateQuestion();
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        difficulty={difficulty}
        setDifficulty={setDifficultyLevel}
        gameMode={gameMode}
        switchGameMode={switchGameMode}
        visualStyle="blocks"
        setVisualStyle={() => {}}
        questionsPerSession={questionsPerSession}
        setQuestionsPerSession={setQuestionsPerSession}
        isSessionActive={isSessionStarted && !isSessionComplete}
        isAdaptiveMode={isAdaptiveMode}
        enableAdaptiveMode={enableAdaptiveMode}
        userStats={userStats}
        currentRank={getCurrentUserRank()}
        isAdmin={isAdmin}
        allUsers={allUsers}
        currentGame={currentGame}
        switchGame={switchGame}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {!isSessionStarted ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">
                {t('englishGame.title')}
              </h1>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('session.settings')}</h2>
                <div className="grid grid-cols-2 gap-4 text-left mb-6">
                  <div>
                    <p className="text-gray-600">{t('session.gameModeLabel')}</p>
                    <p className="font-semibold">
                      {gameMode === "Multiple Choice" ? t('gameSettings.operations.mcQuestion') : t('gameSettings.operations.tfQuestion')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('session.ageLevel')}</p>
                    <p className="font-semibold">
                      {isAdaptiveMode
                        ? t('session.adaptiveModeLabel')
                        : difficulty === 1
                        ? t('gameSettings.ageLevels.easy')
                        : difficulty === 2
                        ? t('gameSettings.ageLevels.medium')
                        : t('gameSettings.ageLevels.hard')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('session.questionsLabel')}</p>
                    <p className="font-semibold">
                      {questionsPerSession} {t('session.perSession')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={startNewSession}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
              >
                {t('session.start')}
              </button>
            </div>
          ) : isSessionComplete ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('session.complete')}</h2>
              <p className="text-xl mb-2">{t('session.score')} {sessionScore}/{questionsPerSession}</p>
              <p className="text-lg mb-4">{t('session.timeTaken')} {formatTime(sessionDuration)}</p>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold">{t('stats.totalCorrect')} {userStats.correctAnswers}</p>
                <p>{t('stats.totalAttempts')} {userStats.totalQuestions}</p>
                <p>{t('stats.accuracy')} {userStats.accuracy}%</p>
                <p>{t('stats.currentRank')} #{getCurrentUserRank()}</p>
              </div>

              <button
                onClick={() => {
                  setIsSessionStarted(false);
                  setSessionDuration(0);
                  startNewSession();
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                {t('session.startNew')}
              </button>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-end mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsSessionComplete(true);
                      setIsSessionStarted(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    {t('session.end')}
                  </button>
                  <button
                    onClick={() => {
                      setQuestionsAnswered(0);
                      setSessionScore(0);
                      setUserAnswer("");
                      setFeedback("");
                      setConsecutiveCorrect(0);
                      generateQuestion();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                  >
                    {t('session.restart')}
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <Score
                  score={score}
                  showAnimation={feedback.includes("Correct")}
                />

                <div className="text-lg text-gray-600 mt-2">
                  {t('session.progress')} {questionsAnswered}/{questionsPerSession} {t('session.questions')}
                </div>
                <div className="w-full max-w-md mx-auto mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(questionsAnswered / questionsPerSession) * 100}%` }}
                  />
                </div>
                <div className="text-lg text-gray-600 mt-1">
                  {t('session.time')} {formatTime(sessionDuration)}
                </div>
                {isAdaptiveMode && (
                  <div className="text-sm text-purple-600 mt-1">
                    {t('session.currentLevel')} {difficulty === 1 ? t('session.levels.easy') : difficulty === 2 ? t('session.levels.medium') : t('session.levels.hard')}
                  </div>
                )}
              </div>

              {currentQuestion && (
                <>
                  <div className="text-2xl font-bold text-center mb-8 text-black">
                    {currentQuestion.question}
                  </div>

                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={!!feedback && feedback.includes("Correct")}
                          className={`p-4 rounded-lg text-lg font-medium transition-colors ${
                            feedback && option === currentQuestion.correctAnswer
                              ? 'bg-green-500 text-white'
                              : feedback && option === userAnswer && option !== currentQuestion.correctAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-white hover:bg-purple-100 text-gray-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {feedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-center font-bold ${
                        feedback.includes("Correct")
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {feedback}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}