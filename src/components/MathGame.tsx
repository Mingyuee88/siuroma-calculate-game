'use client';

import { useState, useEffect } from 'react';
import { Blocks } from './Visualizations/Blocks';
import { Animals } from './Visualizations/Animals';
import { Shapes } from './Visualizations/Shapes';
import { NumberLine } from './Visualizations/NumberLine';
import { NumberPad } from './UI/NumberPad';
import { Score } from './UI/Score';
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

  const generateProblem = () => {
    const maxNumber = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;
    const minNumber = 1;
    
    let first = getRandomNumber(minNumber, maxNumber);
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
  };

  useEffect(() => {
    generateProblem();
  }, [gameMode, difficulty]);

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

  return (
    <div className="bg-gray-100 p-6 rounded-xl max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">Math Explorer</h1>
        <p className="text-lg text-gray-600">Math Game for Young Learners</p>
        <Score score={score} showAnimation={feedback.includes('Correct')} />
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => switchGameMode('addition')}
          className={`px-4 py-2 rounded-lg font-bold ${
            gameMode === 'addition'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          Addition
        </button>
        <button
          onClick={() => switchGameMode('subtraction')}
          className={`px-4 py-2 rounded-lg font-bold ${
            gameMode === 'subtraction'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          Subtraction
        </button>
      </div>

      <div className="bg-gray-200 p-2 rounded-lg mb-4">
        <div className="text-center mb-2 text-gray-700 font-bold">Visual Style</div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setVisualStyle('blocks')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              visualStyle === 'blocks'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setVisualStyle('animals')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              visualStyle === 'animals'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            Animals
          </button>
          <button
            onClick={() => setVisualStyle('shapes')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              visualStyle === 'shapes'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            Shapes
          </button>
          <button
            onClick={() => setVisualStyle('numberLine')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              visualStyle === 'numberLine'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            Number Line
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-2xl font-bold text-center mb-6 text-black">
          {firstNumber} <span className="text-black">{gameMode === 'addition' ? '+' : '-'}</span> {secondNumber} = ?
        </div>

        <div className="mb-8">
          {visualStyle === 'blocks' && (
            <Blocks
              firstNumber={firstNumber}
              secondNumber={secondNumber}
              gameMode={gameMode}
              showExplanation={showExplanation}
            />
          )}
          {visualStyle === 'animals' && (
            <Animals
              firstNumber={firstNumber}
              secondNumber={secondNumber}
              gameMode={gameMode}
              showExplanation={showExplanation}
            />
          )}
          {visualStyle === 'shapes' && (
            <Shapes
              firstNumber={firstNumber}
              secondNumber={secondNumber}
              gameMode={gameMode}
              showExplanation={showExplanation}
            />
          )}
          {visualStyle === 'numberLine' && (
            <NumberLine
              firstNumber={firstNumber}
              secondNumber={secondNumber}
              gameMode={gameMode}
              showExplanation={showExplanation}
            />
          )}
        </div>

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

      <div className="flex justify-between">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-blue-500 underline"
        >
          {showExplanation ? 'Hide' : 'Show'} Explanation
        </button>
        <button
          onClick={generateProblem}
          className="text-purple-600 font-semibold"
        >
          New Problem
        </button>
      </div>
    </div>
  );
} 