'use client';

import { useState, useEffect, useCallback } from 'react';
import { NumberPad } from './UI/NumberPad';
import { Score } from './UI/Score';
import { SideMenu } from './UI/SideMenu';
import { VisualAid } from './UI/VisualAid';
import { getRandomNumber, calculateResult } from '@/lib/utils';

interface MathGameProps {
  initialDifficulty?: number;
}

export function MathGame({ initialDifficulty = 1 }: MathGameProps) {
  const [gameMode, setGameMode] = useState<'addition' | 'subtraction'>('addition');
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [firstNumber, setFirstNumber] = useState(0);
  const [secondNumber, setSecondNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [visualStyle, setVisualStyle] = useState<'blocks' | 'animals' | 'shapes' | 'numberLine'>('blocks');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const generateProblem = useCallback(() => {
    const maxNumber = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 50;
    const minNumber = 1;
    
    const first = getRandomNumber(minNumber, maxNumber);
    let second;
    
    if (gameMode === 'addition') {
      second = getRandomNumber(minNumber, maxNumber);
    } else {
      // For subtraction, ensure first number is larger
      second = getRandomNumber(minNumber, first);
    }
    
    setFirstNumber(first);
    setSecondNumber(second);
    setUserAnswer('');
    setFeedback('');
  }, [difficulty, gameMode]);

  // Initialize the game
  useEffect(() => {
    if (!isInitialized) {
      generateProblem();
      setIsInitialized(true);
    }
  }, [isInitialized, generateProblem]);

  // Generate new problem when game mode or difficulty changes
  useEffect(() => {
    if (isInitialized) {
      generateProblem();
    }
  }, [gameMode, difficulty, generateProblem, isInitialized]);

  const handleNumberClick = (num: string) => {
    if (userAnswer.length < 2) {
      setUserAnswer(prev => prev + num);
    }
  };

  const handleClear = () => {
    setUserAnswer('');
  };

  const checkAnswer = () => {
    const correctAnswer = calculateResult(firstNumber, secondNumber, gameMode);
    const userNum = parseInt(userAnswer || '0');

    if (userNum === correctAnswer) {
      setFeedback('Correct! Great job!');
      setScore(prev => prev + 1);
      setConsecutiveCorrect(prev => prev + 1);
      
      // Increase difficulty after 5 consecutive correct answers
      if (consecutiveCorrect === 4 && difficulty < 3) {
        setTimeout(() => {
          setDifficulty(difficulty + 1);
          setConsecutiveCorrect(0);
          setFeedback(`You're doing great! Let's try some harder numbers!`);
        }, 1500);
      } else {
        setTimeout(generateProblem, 1500);
      }
    } else {
      setFeedback('Not quite right. Try again!');
      setConsecutiveCorrect(0);
    }
  };

  const switchGameMode = (mode: 'addition' | 'subtraction') => {
    setGameMode(mode);
    setDifficulty(1);
    setConsecutiveCorrect(0);
    setScore(0);
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
        setDifficulty={setDifficulty}
        gameMode={gameMode}
        switchGameMode={switchGameMode}
        visualStyle={visualStyle}
        setVisualStyle={setVisualStyle}
        generateProblem={generateProblem}
        setConsecutiveCorrect={setConsecutiveCorrect}
      />

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${isMenuOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <Score score={score} showAnimation={feedback.includes('Correct')} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="text-2xl font-bold text-center mb-6 text-black">
              {firstNumber} <span className="text-black">{gameMode === 'addition' ? '+' : '-'}</span> {secondNumber} = ?
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

            <div className="mt-6 flex flex-col items-center">
              <NumberPad
                onNumberClick={handleNumberClick}
                onClear={handleClear}
                disabled={false}
              />

              <div className="mt-2 text-center">
                <div className="text-2xl font-bold mb-4 text-black">
                  Your answer: {userAnswer || '___'}
                </div>
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                  className={`px-6 py-3 rounded-lg font-bold text-lg ${
                    !userAnswer
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Check Answer
                </button>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="block w-full mt-4 text-blue-500 underline"
                >
                  {showExplanation ? 'Hide' : 'Show'} Explanation
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-bold ${
                  feedback.includes('Correct')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {feedback}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateProblem}
              className="text-purple-600 font-semibold"
            >
              New Problem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 