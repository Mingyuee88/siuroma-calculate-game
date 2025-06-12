'use client';

import { useTranslation } from 'react-i18next';

interface ShapesProps {
  firstNumber: number;
  secondNumber: number;
  gameMode: 'addition' | 'subtraction';
  showExplanation?: boolean;
}

const shapes = [
  '●', // circle
  '■', // square
  '▲', // triangle
  '★', // star
  '◆', // diamond
  '○', // hollow circle
  '□', // hollow square
  '△', // hollow triangle
];

export function Shapes({ firstNumber, secondNumber, gameMode, showExplanation = true }: ShapesProps) {
  const { t } = useTranslation();
  const result = gameMode === 'addition' ? firstNumber + secondNumber : firstNumber - secondNumber;

  if (gameMode === 'addition') {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: firstNumber }).map((_, i) => (
            <div
              key={`first-shape-${i}`}
              className="w-12 h-12 bg-gray-100 m-1 rounded-lg flex items-center justify-center text-4xl text-red-500"
            >
              {shapes[0]}
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mb-2 text-black">{t('game.symbols.plus')}</div>
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: secondNumber }).map((_, i) => (
            <div
              key={`second-shape-${i}`}
              className="w-12 h-12 bg-gray-100 m-1 rounded-lg flex items-center justify-center text-4xl text-green-500"
            >
              {shapes[1]}
            </div>
          ))}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4 font-gensen">
            {t('game.visualAid.countShapesTotal')}<br />
            {t('game.visualAid.circlesAndSquares', {
              firstCount: firstNumber,
              firstShape: t(`game.visualAid.${firstNumber === 1 ? 'circle' : 'circles'}`),
              secondCount: secondNumber,
              secondShape: t(`game.visualAid.${secondNumber === 1 ? 'square' : 'squares'}`)
            })}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center mb-4 relative">
          {Array.from({ length: firstNumber }).map((_, i) => (
            <div
              key={`all-shape-${i}`}
              className="w-12 h-12 bg-gray-100 m-1 rounded-lg flex items-center justify-center text-4xl text-red-500"
            >
              {shapes[0]}
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mb-2">{t('game.symbols.minus')}</div>
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: secondNumber }).map((_, i) => (
            <div
              key={`remove-shape-${i}`}
              className="w-12 h-12 bg-red-100 m-1 rounded-lg flex items-center justify-center text-4xl text-red-500 relative"
            >
              {shapes[0]}
              <div className="absolute text-3xl text-red-600">−</div>
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mb-2">=</div>
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: firstNumber - secondNumber }).map((_, i) => (
            <div
              key={`result-shape-${i}`}
              className="w-12 h-12 bg-green-100 m-1 rounded-lg flex items-center justify-center text-4xl text-red-500"
            >
              {shapes[0]}
            </div>
          ))}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4 font-gensen">
            {t('game.visualAid.startWithCircles', {
              count: firstNumber,
              shape: t(`game.visualAid.${firstNumber === 1 ? 'circle' : 'circles'}`)
            })}<br />
            {t('game.visualAid.takeAwayCircles', {
              count: secondNumber,
              shape: t(`game.visualAid.${secondNumber === 1 ? 'circle' : 'circles'}`)
            })}<br />
            {t('game.visualAid.howManyCirclesLeft')}
          </div>
        )}
      </div>
    );
  }
} 