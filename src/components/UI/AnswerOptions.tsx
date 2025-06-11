'use client';

import { useState, useEffect } from 'react';

interface AnswerOption {
  label: string;
  value: number;
}

interface AnswerOptionsProps {
  options: AnswerOption[];
  correctAnswer: number;
  onAnswerSelect: (value: number) => void;
  hasTriedThisQuestion: boolean;
  disabled?: boolean;
}

export function AnswerOptions({
  options,
  correctAnswer,
  onAnswerSelect,
  hasTriedThisQuestion,
  disabled = false
}: AnswerOptionsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  // 当题目变化时重置状态
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResults(false);
  }, [correctAnswer, options]);

  const handleOptionClick = (option: AnswerOption) => {
    if (disabled || showResults) return;

    setSelectedAnswer(option.value);
    setShowResults(true);
    onAnswerSelect(option.value);

    // Reset after a delay if incorrect
    if (option.value !== correctAnswer) {
      setTimeout(() => {
        setShowResults(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  const getOptionStyle = (option: AnswerOption) => {
    let baseStyle = "w-full p-4 text-xl font-bold rounded-lg border-2 transition-all duration-200 ";
    
    if (disabled || !showResults) {
      // Normal state or disabled
      if (disabled) {
        baseStyle += "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300";
      } else {
        baseStyle += "bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer";
      }
    } else {
      // Show results
      if (option.value === correctAnswer) {
        baseStyle += "bg-green-500 text-white border-green-600 animate-pulse";
      } else if (option.value === selectedAnswer) {
        baseStyle += "bg-red-500 text-white border-red-600";
      } else {
        baseStyle += "bg-gray-200 text-gray-500 border-gray-300";
      }
    }

    return baseStyle;
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      {options.map((option, index) => (
        <button
          key={`${option.label}-${option.value}`}
          onClick={() => handleOptionClick(option)}
          disabled={disabled}
          className={getOptionStyle(option)}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-600">
              {option.label}
            </span>
            <span className="text-2xl">
              {option.value}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}