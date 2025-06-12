"use client";

import { useState, useEffect, useCallback } from "react";
//import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";
import { AnswerOptions } from "./UI/AnswerOptions";

interface MathGameProps {
  initialDifficulty?: number;
  userId?: string;
  isAdmin?: boolean;
}

interface UserStats {
  userId: string;
  username: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  currentRank: number;
}




export function MathGame({ 
  initialDifficulty = 1, 
  userId = 'user123',
  isAdmin = false 
}: MathGameProps) {
  const [gameMode, setGameMode] = useState<"addition" | "subtraction">("addition");
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  // const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [visualStyle, setVisualStyle] = useState<"blocks" | "animals" | "shapes" | "numberLine">("blocks");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Session related state
  const [questionKey, setQuestionKey] = useState(0);
  const [questionsPerSession, setQuestionsPerSession] = useState(10);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);

  // Answer options for ABCD format
  const [options, setOptions] = useState<{ label: string; value: number }[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [hasTriedThisQuestion, setHasTriedThisQuestion] = useState(false);

  // User statistics
  const [userStats, setUserStats] = useState<UserStats>({
    userId: userId,
    username: 'Current User',
    correctAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    currentRank: 0
  });

  // Mock leaderboard data - in real app, this would come from a database
  const [allUsers] = useState<UserStats[]>([
    { userId: '1', username: 'Alice', correctAnswers: 28, totalQuestions: 35, accuracy: 80, currentRank: 1 },
    { userId: '2', username: 'Bob', correctAnswers: 25, totalQuestions: 30, accuracy: 83.3, currentRank: 2 },
    { userId: '3', username: 'Charlie', correctAnswers: 22, totalQuestions: 28, accuracy: 78.6, currentRank: 3 },
    { userId: '4', username: 'Daisy', correctAnswers: 20, totalQuestions: 25, accuracy: 80, currentRank: 4 },
    { userId: '5', username: 'Eve', correctAnswers: 19, totalQuestions: 24, accuracy: 79.2, currentRank: 5 },
    { userId: '6', username: 'Frank', correctAnswers: 18, totalQuestions: 23, accuracy: 78.3, currentRank: 6 },
    { userId: '7', username: 'Grace', correctAnswers: 17, totalQuestions: 22, accuracy: 77.3, currentRank: 7 },
    { userId: '8', username: 'Heidi', correctAnswers: 16, totalQuestions: 21, accuracy: 76.2, currentRank: 8 },
    { userId: '9', username: 'Ivan', correctAnswers: 15, totalQuestions: 20, accuracy: 75, currentRank: 9 },
    { userId: '10', username: 'Judy', correctAnswers: 14, totalQuestions: 19, accuracy: 73.7, currentRank: 10 },
  ]);

  const generateProblem = useCallback(() => {
    const minNumber = 1;
    let maxSum;
    if (difficulty === 1) {
      maxSum = 10;
    } else if (difficulty === 2) {
      maxSum = 20;
    } else {
      maxSum = 100;
    }
    
    let first, second;
    if (gameMode === "addition") {
      first = getRandomNumber(minNumber, maxSum - 1);
      const maxSecond = maxSum - first;
      second = getRandomNumber(minNumber, maxSecond);
    } else {
      first = getRandomNumber(minNumber, maxSum);
      second = getRandomNumber(minNumber, first);
    }
    
    setFirstNumber(first);
    setSecondNumber(second);
    
    // Generate ABCD options
    const correct = calculateResult(first, second, gameMode);
    const optionSet = new Set<number>([correct]);
    
    // Generate 3 wrong answers
    while (optionSet.size < 4) {
      let distractor = correct + getRandomNumber(-5, 5);
      if (distractor !== correct && distractor >= 0) {
        optionSet.add(distractor);
      }
    }
    
    // Convert to labeled options and shuffle
    const optionArray = Array.from(optionSet);
    const shuffledOptions = optionArray.sort(() => Math.random() - 0.5);
    const labeledOptions = shuffledOptions.map((value, index) => ({
      label: String.fromCharCode(65 + index), // A, B, C, D
      value: value
    }));
    
    setCorrectAnswer(correct);
    setOptions(labeledOptions);
    setHasTriedThisQuestion(false);
    setFeedback("");
  }, [difficulty, gameMode]);

  const startNewSession = () => {
    setQuestionsAnswered(0);
    setSessionScore(0);
    setIsSessionComplete(false);
    // setUserAnswer("");
    setFeedback("");
    setConsecutiveCorrect(0);
    setIsSessionStarted(true);
    setSessionStartTime(Date.now());
    generateProblem();
  };

  // Initialize the game
  useEffect(() => {
    if (!isInitialized) {
      generateProblem();
      setIsInitialized(true);
    }
  }, [isInitialized, generateProblem]);

  // Generate new problem when game mode or difficulty changes
  useEffect(() => {
    if (isInitialized && !isSessionComplete) {
      generateProblem();
    }
  }, [gameMode, difficulty, generateProblem, isInitialized, isSessionComplete]);

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
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 移动端默认关闭侧边栏，桌面端保持原有逻辑
      if (mobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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

  const handleAnswerSelect = (selectedValue: number) => {
    const isCorrect = selectedValue === correctAnswer;
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
          setFeedback(`You're doing great! Let's try some harder numbers!`);
        }, 1500);
      } else {
        setTimeout(() => {
          setQuestionsAnswered(prev => {
            const newCount = prev + 1;
            if (newCount >= questionsPerSession) {
              setIsSessionComplete(true);
            } else {
              generateProblem();
            }
            setQuestionKey(prev => prev + 1);
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

  const switchGameMode = (mode: "addition" | "subtraction") => {
    setGameMode(mode);
    setDifficulty(1);
    setScore(0);
  };

  const setDifficultyLevel = (level: number) => {
    setDifficulty(level);
    setIsAdaptiveMode(false);
    setConsecutiveCorrect(0);
    generateProblem();
  };

  const enableAdaptiveMode = () => {
    setDifficulty(1);
    setIsAdaptiveMode(true);
    setConsecutiveCorrect(0);
    generateProblem();
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return null;
  }

  // 修改 return 语句中的主要布局部分：
return (
  <div className="flex min-h-screen bg-gray-100">
    {/* 移动端遮罩层 */}
    {isMobile && isMenuOpen && (
      <div 
        className="mobile-overlay"
        onClick={() => setIsMenuOpen(false)}
      />
    )}
    
    <SideMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      difficulty={difficulty}
      setDifficulty={setDifficultyLevel}
      gameMode={gameMode}
      switchGameMode={switchGameMode}
      visualStyle={visualStyle}
      setVisualStyle={setVisualStyle}
      questionsPerSession={questionsPerSession}
      setQuestionsPerSession={setQuestionsPerSession}
      isSessionActive={isSessionStarted && !isSessionComplete}
      isAdaptiveMode={isAdaptiveMode}
      enableAdaptiveMode={enableAdaptiveMode}
      userStats={userStats}
      currentRank={getCurrentUserRank()}
      isAdmin={isAdmin}
      allUsers={allUsers}
      currentUser={userStats}
      onUserLogin={() => {}}
      onUserLogout={() => {}}
      setCurrentUser={() => {}}
    />

    {/* 汉堡菜单按钮 - 始终显示在移动端 */}
    {isMobile && (
      <>
        {/* 打开按钮 - 显示在左上角 */}
        {!isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="hamburger-btn"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* 关闭按钮 - 显示在右上角 */}
        {isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(false)}
            className="hamburger-btn-close"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </>
    )}

    {/* Main Content */}
    <div className={`flex-1 p-6 transition-all duration-300 ${
      isMobile 
        ? "main-content-mobile" 
        : isMenuOpen 
          ? "ml-64" 
          : "ml-0"
    }`}>
      <div className="max-w-3xl mx-auto">
        {/* 现有的所有内容保持不变 */}
        {!isSessionStarted ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Math Explorer</h1>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Session Settings</h2>
              <div className="grid grid-cols-2 gap-4 text-left mb-6">
                <div>
                  <p className="text-gray-600">Game Mode:</p>
                  <p className="font-semibold">
                    {gameMode === "addition" ? "Addition" : "Subtraction"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Age Level(Difficulty):</p>
                  <p className="font-semibold">
                    {isAdaptiveMode
                      ? "Adaptive (Auto-adjusts)"
                      : difficulty === 1
                      ? "3-4 Years (1-10)"
                      : difficulty === 2
                      ? "4-5 Years (1-20)"
                      : "5-6 Years (1-50)"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Questions:</p>
                  <p className="font-semibold">{questionsPerSession} per session</p>
                </div>
                <div>
                  <p className="text-gray-600">Visual Aid:</p>
                  <p className="font-semibold capitalize">{visualStyle}</p>
                </div>
              </div>
            </div>
            <button
              onClick={startNewSession}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
            >
              Start Session
            </button>
          </div>
        ) : isSessionComplete ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Session Complete!</h2>
            <p className="text-xl mb-2">Your score: {sessionScore}/{questionsPerSession}</p>
            <p className="text-lg mb-4">Time taken: {formatTime(sessionDuration)}</p>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">Your Statistics:</p>
              <p>Total Correct: {userStats.correctAnswers}</p>
              <p>Total Attempts: {userStats.totalQuestions}</p>
              <p>Accuracy: {userStats.accuracy}%</p>
              <p>Current Rank: #{getCurrentUserRank()}</p>
            </div>
            <button
              onClick={() => {
                setIsSessionStarted(false);
                setSessionDuration(0);
                startNewSession();
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
            >
              Start New Session
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
                  End Session
                </button>
                <button
                  onClick={() => {
                    setQuestionsAnswered(0);
                    setSessionScore(0);
                    setFeedback("");
                    setConsecutiveCorrect(0);
                    generateProblem();
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                >
                  Restart
                </button>
              </div>
            </div>

            <div className="text-center mb-6">
              <Score score={score} showAnimation={feedback.includes("Correct")} />
              <div className="text-lg text-gray-600 mt-2">
                Session Progress: {questionsAnswered}/{questionsPerSession} questions
              </div>
              <div className="w-full max-w-md mx-auto mt-2 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(questionsAnswered / questionsPerSession) * 100}%` }}
                />
              </div>
              <div className="text-lg text-gray-600 mt-1">
                Time: {formatTime(sessionDuration)}
              </div>
              {isAdaptiveMode && (
                <div className="text-sm text-purple-600 mt-1">
                  Current Level: {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="text-6xl font-bold text-center mb-8 text-black">
                {firstNumber}{" "}
                <span className="text-black">
                  {gameMode === "addition" ? "+" : "-"}
                </span>{" "}
                {secondNumber} = ?
              </div>

              <div className="mb-6">
                <AnswerOptions
                  key={questionKey}
                  options={options}
                  correctAnswer={correctAnswer}
                  onAnswerSelect={handleAnswerSelect}
                  hasTriedThisQuestion={hasTriedThisQuestion}
                  disabled={!!feedback && feedback.includes("Correct")}
                />
              </div>

              <div className="text-center mb-4">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {showExplanation ? "Hide" : "Show"} Hints
                </button>
              </div>

              <VisualAid
                visualStyle={visualStyle}
                setVisualStyle={setVisualStyle}
                firstNumber={firstNumber}
                secondNumber={secondNumber}
                gameMode={gameMode}
                showExplanation={showExplanation}
                showSelector={false}
              />

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
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}