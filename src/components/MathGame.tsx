"use client";

import { useState, useEffect, useCallback } from "react";
import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface MathGameProps {
  initialDifficulty?: number;
}

export function MathGame({ initialDifficulty = 1 }: MathGameProps) {
  const { t } = useLanguage();
  const [gameMode, setGameMode] = useState<"addition" | "subtraction">(
    "addition"
  );
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [visualStyle, setVisualStyle] = useState<
    "blocks" | "animals" | "shapes" | "numberLine"
  >("blocks");
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

  const generateProblem = useCallback(() => {
    const minNumber = 1;
    let maxSum;

    // Set maximum sum based on difficulty level
    if (difficulty === 1) {
      // 3-4 years: answers within 10
      maxSum = 10;
    } else if (difficulty === 2) {
      // 4-5 years: answers within 20
      maxSum = 20;
    } else {
      // 5-6 years: answers within 100
      maxSum = 100;
    }

    if (gameMode === "addition") {
      // For addition, ensure sum doesn't exceed the target range
      const first = getRandomNumber(minNumber, maxSum - 1);
      const maxSecond = maxSum - first;
      const second = getRandomNumber(minNumber, maxSecond);

      setFirstNumber(first);
      setSecondNumber(second);
    } else {
      // For subtraction, ensure result is within range
      const first = getRandomNumber(minNumber, maxSum);
      const second = getRandomNumber(minNumber, first);

      setFirstNumber(first);
      setSecondNumber(second);
    }

    setUserAnswer("");
    setFeedback("");
  }, [difficulty, gameMode]);

  const startNewSession = () => {
    setQuestionsAnswered(0);
    setSessionScore(0);
    setIsSessionComplete(false);
    setUserAnswer("");
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

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNumberClick = (num: string) => {
    if (userAnswer.length < 2) {
      setUserAnswer((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setUserAnswer("");
  };

  const checkAnswer = () => {
    const correctAnswer = calculateResult(firstNumber, secondNumber, gameMode);
    const userNum = parseInt(userAnswer || "0");

    if (userNum === correctAnswer) {
      setFeedback(t('correct'));
      setScore((prev) => prev + 1);
      setSessionScore((prev) => prev + 1);
      setConsecutiveCorrect((prev) => prev + 1);

      // Increase difficulty in adaptive mode after 5 consecutive correct answers
      if (isAdaptiveMode && consecutiveCorrect === 4 && difficulty < 3) {
        setTimeout(() => {
          setDifficulty(difficulty + 1);
          setConsecutiveCorrect(0);
          setFeedback(t('harderNumbers'));
        }, 1500);
      } else {
        setTimeout(() => {
          setQuestionsAnswered((prev) => {
            const newCount = prev + 1;
            if (newCount >= questionsPerSession) {
              setIsSessionComplete(true);
            } else {
              generateProblem();
            }
            return newCount;
          });
        }, 1500);
      }
    } else {
      setFeedback(t('notCorrect'));
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

  return (
    <div className="flex min-h-screen bg-gray-100">
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
      />

      {/* Main Content */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isMenuOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          {!isSessionStarted ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">
                {t('title')}
              </h1>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('sessionSettings')}</h2>
                <div className="grid grid-cols-2 gap-4 text-left mb-6">
                  <div>
                    <p className="text-gray-600">{t('gameModeLabel')}</p>
                    <p className="font-semibold">
                      {gameMode === "addition" ? t('addition') : t('subtraction')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('ageLevel')}</p>
                    <p className="font-semibold">
                      {isAdaptiveMode
                        ? t('adaptiveModeLabel')
                        : difficulty === 1
                        ? t('age3to4')
                        : difficulty === 2
                        ? t('age4to5')
                        : t('age5to6')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('questionsLabel')}</p>
                    <p className="font-semibold">
                      {questionsPerSession} {t('perSession')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('visualAidLabel')}</p>
                    <p className="font-semibold capitalize">{t(visualStyle)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={startNewSession}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors"
              >
                {t('startSession')}
              </button>
            </div>
          ) : isSessionComplete ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('sessionComplete')}</h2>
              <p className="text-xl mb-2">
                {t('yourScore')} {sessionScore}/{questionsPerSession}
              </p>
              <p className="text-lg mb-4">
                {t('timeTaken')} {formatTime(sessionDuration)}
              </p>
              <button
                onClick={() => {
                  setIsSessionStarted(false);
                  setSessionDuration(0);
                  startNewSession();
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                {t('startNewSession')}
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
                    {t('endSession')}
                  </button>
                  <button
                    onClick={() => {
                      setQuestionsAnswered(0);
                      setSessionScore(0);
                      setUserAnswer("");
                      setFeedback("");
                      setConsecutiveCorrect(0);
                      generateProblem();
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                  >
                    {t('restart')}
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <Score
                  score={score}
                  showAnimation={feedback.includes("Correct")}
                />
                <div className="text-lg text-gray-600 mt-2">
                  {t('sessionProgress')} {questionsAnswered}/{questionsPerSession} {t('questions')}
                </div>
                <div className="w-full max-w-md mx-auto mt-2 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(questionsAnswered / questionsPerSession) * 100}%` }}
                  />
                </div>
                <div className="text-lg text-gray-600 mt-1">
                  {t('time')} {formatTime(sessionDuration)}
                </div>
                {isAdaptiveMode && (
                  <div className="text-sm text-purple-600 mt-1">
                    {t('currentLevel')} {difficulty === 1 ? t('easy') : difficulty === 2 ? t('medium') : t('hard')}
                  </div>
                )}
              </div>

              <div className="text-center">
                <div className="text-9xl font-bold text-center mb-6 text-black">
                  {firstNumber}{" "}
                  <span className="text-black">
                    {gameMode === "addition" ? "+" : "-"}
                  </span>{" "}
                  {secondNumber} = {userAnswer || "?"}
                </div>

                <div className="mt-2 text-center">
                  <div className="text-2xl font-bold mb-4 text-black">
                    {t('yourAnswer')} {userAnswer || "___"}
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  <NumberPad
                    onNumberClick={handleNumberClick}
                    onClear={handleClear}
                    disabled={isSessionComplete}
                  />

                  <div className="mt-2 text-center">
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer || isSessionComplete}
                      className={`px-6 py-3 rounded-lg font-bold text-lg ${
                        !userAnswer || isSessionComplete
                          ? "bg-gray-300 text-gray-500"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {t('checkAnswer')}
                    </button>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="block w-full mt-4 text-blue-500 underline"
                    >
                      {showExplanation ? t('hideHints') : t('showHints')}
                    </button>
                  </div>
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
