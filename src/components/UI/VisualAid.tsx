'use client';

import { Blocks } from '../VisualAid/Blocks';
import { Animals } from '../VisualAid/Animals';
import { Shapes } from '../VisualAid/Shapes';
import { NumberLine } from '../VisualAid/NumberLine';

// Types
export type VisualStyle = 'blocks' | 'animals' | 'shapes' | 'numberLine';

interface VisualAidProps {
  // Selection props
  visualStyle: VisualStyle;
  setVisualStyle: (style: VisualStyle) => void;
  // Renderer props
  firstNumber: number;
  secondNumber: number;
  gameMode: 'addition' | 'subtraction';
  showExplanation: boolean;
  // Optional props for controlling where to show the selector
  showSelector?: boolean;
}

export function VisualAid({
  visualStyle,
  setVisualStyle,
  firstNumber,
  secondNumber,
  gameMode,
  showExplanation,
  showSelector = false,
}: VisualAidProps) {
  return (
    <>
      {/* Selector */}
      {showSelector && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-purple-700 mb-4 font-gensen">Visual Aid</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setVisualStyle('blocks')}
              className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${
                visualStyle === 'blocks'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Blocks
            </button>
            <button
              onClick={() => setVisualStyle('animals')}
              className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${
                visualStyle === 'animals'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Animals
            </button>
            <button
              onClick={() => setVisualStyle('shapes')}
              className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${
                visualStyle === 'shapes'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shapes
            </button>
            <button
              onClick={() => setVisualStyle('numberLine')}
              className={`px-3 py-2 rounded-lg text-sm font-medium font-gensen ${
                visualStyle === 'numberLine'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Number Line
            </button>
          </div>
        </div>
      )}

      {/* Renderer */}
      <div className="mb-8">
        {visualStyle === 'blocks' && showExplanation && (
          <Blocks
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            gameMode={gameMode}
            showExplanation={showExplanation}
          />
        )}
        {visualStyle === 'animals' && showExplanation && (
          <Animals
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            gameMode={gameMode}
            showExplanation={showExplanation}
          />
        )}
        {visualStyle === 'shapes' && showExplanation && (
          <Shapes
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            gameMode={gameMode}
            showExplanation={showExplanation}
          />
        )}
        {visualStyle === 'numberLine' && showExplanation && (
          <NumberLine
            firstNumber={firstNumber}
            secondNumber={secondNumber}
            gameMode={gameMode}
            showExplanation={showExplanation}
          />
        )}
      </div>
    </>
  );
} 