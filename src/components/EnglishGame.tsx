"use client";

import { useState, useEffect, useCallback } from "react";
import { NumberPad } from "./UI/NumberPad";
import { Score } from "./UI/Score";
import { SideMenu } from "./UI/SideMenu";
import { VisualAid } from "./UI/VisualAid";
import { getRandomNumber, calculateResult } from "@/lib/utils";

import { useTranslation } from "react-i18next";

import { AnswerOptions } from "./UI/AnswerOptions";
import { LanguageSwitcher } from './UI/LanguageSwitcher';


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
  username: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  currentRank: number;
}




export function EnglishGame({ 
  initialDifficulty = 1, 
  userId = 'user123',
  isAdmin = false,
  currentGame,
  switchGame
}: EnglishGameProps) {
  const { t } = useTranslation();
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

  // Mock questions database
  const questionsDatabase = {
    "Multiple Choice": [
      { question: "Which animal says 'moo'?", options: ["Cow", "Cat", "Dog", "Duck"], correctAnswer: "Cow"},
      { question: "What color is a banana?", options: ["Red", "Blue", "Yellow", "Green"], correctAnswer: "Yellow"},
      { question: "How many eyes do you have?", options: ["One", "Two", "Three", "Four"], correctAnswer: "Two"},
      { question: "Which shape has three sides?", options: ["Circle", "Square", "Triangle", "Rectangle"], correctAnswer: "Triangle"},
      { question: "What do you wear on your feet?", options: ["Hat", "Gloves", "Socks", "Shirt"], correctAnswer: "Socks"},
      { question: "What is the opposite of 'big'?", options: ["small", "tall", "wide", "long"], correctAnswer: "small"},
      { question: "Which fruit is red and round?", options: ["Banana", "Grape", "Apple", "Orange"], correctAnswer: "Apple"},
      { question: "How many fingers are on one hand?", options: ["Two", "Three", "Four", "Five"], correctAnswer: "Five"},
      { question: "What sound does a dog make?", options: ["Meow", "Quack", "Woof", "Oink"], correctAnswer: "Woof"},
      { question: "Which vehicle has wings?", options: ["Car", "Train", "Airplane", "Boat"], correctAnswer: "Airplane"},
      { question: "What color is the sky on a sunny day?", options: ["Green", "Blue", "Red", "Yellow"], correctAnswer: "Blue"},
      { question: "Which meal do you eat in the morning?", options: ["Dinner", "Lunch", "Breakfast", "Snack"], correctAnswer: "Breakfast"},
      { question: "What do bees make?", options: ["Milk", "Honey", "Bread", "Cheese"], correctAnswer: "Honey"},
      { question: "Which of these is a vegetable?", options: ["Apple", "Carrot", "Banana", "Grape"], correctAnswer: "Carrot"},
      { question: "What do you use to write on paper?", options: ["Spoon", "Pen", "Fork", "Cup"], correctAnswer: "Pen"},
      { question: "Which animal lays eggs?", options: ["Cow", "Chicken", "Dog", "Cat"], correctAnswer: "Chicken"},
      { question: "How many wheels does a bicycle have?", options: ["One", "Two", "Three", "Four"], correctAnswer: "Two"},
      { question: "What is a baby cat called?", options: ["Puppy", "Kitten", "Cub", "Chick"], correctAnswer: "Kitten"},
      { question: "Which season is hot?", options: ["Winter", "Spring", "Summer", "Autumn"], correctAnswer: "Summer"},
      { question: "What do you wear when it rains?", options: ["Sunglasses", "Scarf", "Raincoat", "Gloves"], correctAnswer: "Raincoat"},
      { question: "Which hand do you usually use for writing?", options: ["Left", "Right", "Both", "Neither"], correctAnswer: "Right"},
      { question: "What is the name of our planet?", options: ["Mars", "Venus", "Earth", "Jupiter"], correctAnswer: "Earth"},
      { question: "Which sense do you use to smell?", options: ["Taste", "Touch", "Sight", "Smell"], correctAnswer: "Smell"},
      { question: "What is the sound a pig makes?", options: ["Moo", "Bark", "Oink", "Roar"], correctAnswer: "Oink"},
      { question: "Which number comes after nine?", options: ["Seven", "Eight", "Ten", "Eleven"], correctAnswer: "Ten"},
      { question: "What color is a stop sign?", options: ["Green", "Blue", "Red", "Yellow"], correctAnswer: "Red"},
      { question: "What do you use to brush your teeth?", options: ["Comb", "Spoon", "Toothbrush", "Scissors"], correctAnswer: "Toothbrush"},
      { question: "Which part of a tree is underground?", options: ["Leaves", "Trunk", "Branches", "Roots"], correctAnswer: "Roots"},
      { question: "What do birds have to fly?", options: ["Legs", "Fins", "Wings", "Antennas"], correctAnswer: "Wings"},
      { question: "Which is a pet: lion, tiger, cat, bear?", options: ["Lion", "Tiger", "Cat", "Bear"], correctAnswer: "Cat"},
    ],

    "True/False Question": [
      { question: "A dog can fly.", options: ["True", "False"], correctAnswer: "False"},
      { question: "The sun is cold.", options: ["True", "False"], correctAnswer: "False"},
      { question: "You use your ears to see.", options: ["True", "False"], correctAnswer: "False"},
      { question: "A cat is a bird.", options: ["True", "False"], correctAnswer: "False" },
      { question: "Grass is green.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Birds live in the water.", options: ["True", "False"], correctAnswer: "False"},
      { question: "A car has two wheels.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Ice cream is hot.", options: ["True", "False"], correctAnswer: "False"},
      { question: "You wear a hat on your feet.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Fish can walk on land.", options: ["True", "False"], correctAnswer: "False"},
      { question: "The sky is purple.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Trees have leaves.", options: ["True", "False"], correctAnswer: "True"},
      { question: "A square has four equal sides.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Milk comes from chickens.", options: ["True", "False"], correctAnswer: "False"},
      { question: "You can eat a chair.", options: ["True", "False"], correctAnswer: "False"},
      { question: "A lion is a small animal.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Butterflies can fly.", options: ["True", "False"], correctAnswer: "True"},
      { question: "The moon is a star.", options: ["True", "False"], correctAnswer: "False"},
      { question: "You use your nose to smell.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Elephants are very small.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Water is wet.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Spiders have eight legs.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Pigs can fly.", options: ["True", "False"], correctAnswer: "False"},
      { question: "A circle has no corners.", options: ["True", "False"], correctAnswer: "True" },
      { question: "A book is for reading.", options: ["True", "False"], correctAnswer: "True"},
      { question: "Rain falls from the sky.", options: ["True", "False"], correctAnswer: "True"},
      { question: "A mouse is bigger than an elephant.", options: ["True", "False"], correctAnswer: "False"},
      { question: "You sleep at night.", options: ["True", "False"], correctAnswer: "True" },
      { question: "Birds have teeth.", options: ["True", "False"], correctAnswer: "False"},
      { question: "Chocolate is healthy food.", options: ["True", "False"], correctAnswer: "False"},
    ]
  };

  // 选项高亮状态
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

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
    
    if (isFirstTry) {
      updateUserStats(isCorrect, true);
    }
    setSelectedAnswer(selectedAnswer);
    setShowResults(true);
    
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
          setShowResults(false);
          setSelectedAnswer(null);
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
            setShowResults(false);
            setSelectedAnswer(null);
            return newCount;
          });
        }, 1500);
      }
    } else {
      setFeedback("Not quite right. Try again!");
      setHasTriedThisQuestion(true);
      setConsecutiveCorrect(0);
      setTimeout(() => {
        setShowResults(false);
        setSelectedAnswer(null);
      }, 1500);
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

  // 动态更新用户名翻译
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      username: t('menu.currentUser')
    }));
  }, [t]);

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
        currentUser={userStats}
        setCurrentUser={setUserStats}
        currentRank={getCurrentUserRank()}
        isAdmin={isAdmin}
        allUsers={allUsers}
        currentGame={currentGame}
        switchGame={switchGame}
        onUserLogin={() => {}}
        onUserLogout={() => {}}
      />

      {/* Main Content */}
      <div className={
        "flex-1 flex justify-center items-start min-h-screen transition-all duration-300 pt-8"
      }>
        <div className="max-w-3xl w-full">
          <div className="max-w-3xl mx-auto relative">
            {!isSessionStarted ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-purple-700 mb-6 font-gensen">{t('game.welcome.Etitle')}</h1>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 font-gensen">{t('game.welcome.Edescription')}</h2>
                  <div className="grid grid-cols-2 gap-4 text-left mb-6">
                    <div>
                      <p className="text-gray-600 font-gensen">{t('game.session.gameModeLabel')}</p>
                      <p className="font-semibold font-gensen">
                        {gameMode === "Multiple Choice" ? t('game.settings.mcQuestion') : t('game.settings.tfQuestion')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-gensen">{t('game.session.ageLevel')}</p>
                      <p className="font-semibold font-gensen">
                        {isAdaptiveMode
                          ? t('game.session.adaptiveModeLabel')
                          : difficulty === 1
                          ? t('game.session.levels.easy')
                          : difficulty === 2
                          ? t('game.session.levels.medium')
                          : t('game.session.levels.hard')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-gensen">{t('game.session.questionsLabel')}</p>
                      <p className="font-semibold font-gensen">
                        {questionsPerSession} {t('game.session.perSession')}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={startNewSession}
                  className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors font-gensen"
                >
                  {t('game.session.start')}
                </button>
              </div>
            ) : isSessionComplete ? (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
                <h2 className="text-2xl font-bold mb-4 font-gensen">{t('game.session.complete')}</h2>
                <p className="text-xl mb-2 font-gensen">{t('game.session.score')} {sessionScore}/{questionsPerSession}</p>
                <p className="text-lg mb-4 font-gensen">{t('game.session.timeTaken')} {formatTime(sessionDuration)}</p>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold font-gensen">{t('game.stats.performance')}</p>
                  <p className="font-gensen">{t('game.stats.totalCorrect')} {userStats.correctAnswers}</p>
                  <p className="font-gensen">{t('game.stats.totalAttempts')} {userStats.totalQuestions}</p>
                  <p className="font-gensen">{t('game.stats.accuracy')} {userStats.accuracy}%</p>
                  <p className="font-gensen">{t('game.stats.currentRank')} #{getCurrentUserRank()}</p>
                </div>
                <button
                  onClick={() => {
                    setIsSessionStarted(false);
                    setSessionDuration(0);
                    startNewSession();
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 font-gensen"
                >
                  {t('game.session.startNew')}
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
                      {t('game.session.end')}
                    </button>
                    <button
                      onClick={() => {
                        setQuestionsAnswered(0);
                        setSessionScore(0);
                        setFeedback("");
                        setConsecutiveCorrect(0);
                        generateQuestion();
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
                    >
                      {t('game.session.restart')}
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <Score
                    score={sessionScore}
                    total={questionsAnswered}
                    time={formatTime(sessionDuration)}
                    showAnimation={feedback.includes("Correct")}
                  />
                  <div className="text-lg text-gray-600 mt-2 font-gensen">
                    {t('game.session.progress')} {questionsAnswered}/{questionsPerSession} {t('game.session.questions')}
                  </div>
                  <div className="w-full max-w-md mx-auto mt-2 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(questionsAnswered / questionsPerSession) * 100}%` }}
                    />
                  </div>
                  <div className="text-lg text-gray-600 mt-1 font-gensen">
                    {t('game.session.time')} {formatTime(sessionDuration)}
                  </div>
                  {isAdaptiveMode && (
                    <div className="text-sm text-purple-600 mt-1 font-gensen">
                      {t('game.session.currentLevel')} {difficulty === 1 ? t('game.session.levels.easy') : difficulty === 2 ? t('game.session.levels.medium') : t('game.session.levels.hard')}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  {currentQuestion && (
                    <>
                      <div className="text-2xl font-bold text-center mb-8 text-black font-gensen">
                        {currentQuestion.question}
                      </div>
                      <div className="mb-6">
                        <div className="grid grid-cols-1 gap-4">
                          {currentQuestion.options.map((option, index) => {
                            let btnClass = "p-4 rounded-lg text-lg font-medium transition-colors ";
                            if (showResults) {
                              if (option === currentQuestion.correctAnswer) {
                                btnClass += "bg-green-500 text-white border-green-600 animate-pulse";
                              } else if (option === selectedAnswer) {
                                btnClass += "bg-red-500 text-white border-red-600";
                              } else {
                                btnClass += "bg-gray-200 text-gray-500 border-gray-300";
                              }
                            } else {
                              btnClass += "bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer";
                            }
                            return (
                              <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showResults}
                                className={btnClass}
                              >
                                {option}
                              </button>
                            );
                          })}
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
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}