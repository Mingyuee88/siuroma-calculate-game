'use client';

import { useTranslation } from 'react-i18next';

interface NumberLineProps {
  firstNumber: number;
  secondNumber: number;
  gameMode: 'addition' | 'subtraction';
  showExplanation?: boolean;
}

export function NumberLine({ firstNumber, secondNumber, gameMode, showExplanation = true }: NumberLineProps) {
  const { t } = useTranslation();
  const result = gameMode === 'addition' ? firstNumber + secondNumber : firstNumber - secondNumber;
  const maxValue = Math.max(firstNumber + secondNumber, 20);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-20 relative mb-8">
        {/* Draw the number line */}
        <div className="absolute left-0 right-0 top-10 h-1 bg-gray-800"></div>
        
        {/* Draw tick marks and numbers */}
        {Array.from({ length: maxValue + 1 }).map((_, i) => (
          <div key={`tick-${i}`} className="absolute" style={{ left: `${(i/maxValue) * 100}%` }}>
            <div className="h-3 w-1 bg-gray-800"></div>
            <div className="text-xs text-center mt-1 text-black font-gensen">{i}</div>
          </div>
        ))}

        {/* Draw starting point */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-blue-600 border-2 border-white"
          style={{ 
            left: `${(0/maxValue) * 100}%`, 
            top: '6px',
            transform: 'translateX(-50%)'
          }}
        ></div>

        {/* Draw first number point */}
        <div 
          className="absolute w-6 h-6 rounded-full bg-green-600 border-2 border-white"
          style={{ 
            left: `${(firstNumber/maxValue) * 100}%`, 
            top: '6px',
            transform: 'translateX(-50%)'
          }}
        ></div>

        {/* Draw result point for addition or subtraction */}
        <div 
          className="absolute w-8 h-8 rounded-full bg-purple-600 border-2 border-white animate-pulse"
          style={{ 
            left: `${(result/maxValue) * 100}%`, 
            top: '5px',
            transform: 'translateX(-50%)'
          }}
        ></div>
        
        {/* Draw arrows */}
        {gameMode === 'addition' ? (
          <>
            {/* First arrow from 0 to first number */}
            <svg className="absolute top-8 left-0 right-0 h-6 pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                  <polygon points="0 0, 5 1.75, 0 3.5" fill="#4299e1" />
                </marker>
              </defs>
              <line 
                x1={`${(0/maxValue) * 100}%`} 
                y1="2" 
                x2={`${(firstNumber/maxValue) * 100}%`} 
                y2="2" 
                stroke="#4299e1" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)" 
              />
            </svg>
            
            {/* Second arrow from first number to result */}
            <svg className="absolute top-8 left-0 right-0 h-6 pointer-events-none">
              <defs>
                <marker id="arrowhead2" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                  <polygon points="0 0, 5 1.75, 0 3.5" fill="#48bb78" />
                </marker>
              </defs>
              <line 
                x1={`${(firstNumber/maxValue) * 100}%`} 
                y1="2" 
                x2={`${(result/maxValue) * 100}%`} 
                y2="2" 
                stroke="#48bb78" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead2)" 
              />
            </svg>
          </>
        ) : (
          <>
            {/* For subtraction, one arrow from first number to result */}
            <svg className="absolute top-8 left-0 right-0 h-6 pointer-events-none">
              <defs>
                <marker id="arrowhead3" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto">
                  <polygon points="0 0, 5 1.75, 0 3.5" fill="#f56565" />
                </marker>
              </defs>
              <line 
                x1={`${(firstNumber/maxValue) * 100}%`} 
                y1="2" 
                x2={`${(result/maxValue) * 100}%`} 
                y2="2" 
                stroke="#f56565" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead3)" 
              />
            </svg>
          </>
        )}
      </div>
      
      {showExplanation && (
        <div className="text-center text-gray-600 mb-4 font-gensen">
          {gameMode === 'addition' ? (
            <>
              {t('game.visualAid.numberLineAddition', { firstCount: firstNumber, secondCount: secondNumber })}<br />
              {t('game.visualAid.whereDoYouLand')}
            </>
          ) : (
            <>
              {t('game.visualAid.numberLineSubtraction', { firstCount: firstNumber, secondCount: secondNumber })}<br />
              {t('game.visualAid.whereDoYouLand')}
            </>
          )}
        </div>
      )}
    </div>
  );
} 