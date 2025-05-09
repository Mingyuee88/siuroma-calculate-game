'use client';

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
        <div className="text-2xl font-bold mb-2 text-black">+</div>
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
          <div className="text-center text-gray-600 mb-4">
            Count all the shapes to find the total!<br />
            {firstNumber} {firstNumber === 1 ? 'circle' : 'circles'} + {secondNumber} {secondNumber === 1 ? 'square' : 'squares'} = ?
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
        <div className="text-2xl font-bold mb-2">−</div>
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
          <div className="text-center text-gray-600 mb-4">
            Start with {firstNumber} {firstNumber === 1 ? 'circle' : 'circles'}.<br />
            Take away {secondNumber} {secondNumber === 1 ? 'circle' : 'circles'}.<br />
            How many circles are left?
          </div>
        )}
      </div>
    );
  }
} 