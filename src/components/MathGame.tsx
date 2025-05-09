"use client";

import { useState, useEffect, useCallback } from "react";
import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";

interface MathGameProps {
  initialDifficulty?: number;
}

export function MathGame({ initialDifficulty = 1 }: MathGameProps) {
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
      setFeedback("Correct! Great job!");
      setScore((prev) => prev + 1);
      setSessionScore((prev) => prev + 1);
      setConsecutiveCorrect((prev) => prev + 1);

      // Increase difficulty in adaptive mode after 5 consecutive correct answers
      if (isAdaptiveMode && consecutiveCorrect === 4 && difficulty < 3) {
        setTimeout(() => {
          setDifficulty(difficulty + 1);
          setConsecutiveCorrect(0);
          setFeedback(`You're doing great! Let's try some harder numbers!`);
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
      setFeedback("Not quite right. Try again!");
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
                Math Explorer
              </h1>
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
                    <p className="text-gray-600">Age Level:</p>
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
                    <p className="font-semibold">
                      {questionsPerSession} per session
                    </p>
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
              <p className="text-xl mb-2">
                Your score: {sessionScore}/{questionsPerSession}
              </p>
              <p className="text-lg mb-4">
                Time taken: {formatTime(sessionDuration)}
              </p>
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
                      setUserAnswer("");
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
                <Score
                  score={score}
                  showAnimation={feedback.includes("Correct")}
                />
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

              <div className="bg-white p-15 rounded-lg shadow-md mb-6">
                <div className="text-9xl font-bold text-center mb-6 text-black">
                  {firstNumber}{" "}
                  <span className="text-black">
                    {gameMode === "addition" ? "+" : "-"}
                  </span>{" "}
                  {secondNumber} = {userAnswer || "?"}
                </div>

                <div className="mt-2 text-center">
                  <div className="text-2xl font-bold mb-4 text-black">
                    Your answer: {userAnswer || "___"}
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
                      Check Answer
                    </button>
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="block w-full mt-4 text-blue-500 underline"
                    >
                      {showExplanation ? "Hide" : "Show"} Hints
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
