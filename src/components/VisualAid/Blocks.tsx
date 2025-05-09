'use client';

interface BlocksProps {
  firstNumber: number;
  secondNumber: number;
  gameMode: 'addition' | 'subtraction';
  showExplanation?: boolean;
}

export function Blocks({ firstNumber, secondNumber, gameMode, showExplanation = true }: BlocksProps) {
  if (gameMode === 'addition') {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: firstNumber }).map((_, i) => (
            <div
              key={`first-${i}`}
              className="w-12 h-12 bg-blue-500 m-1 rounded-lg flex items-center justify-center text-white font-bold"
            >
              1
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mb-2 text-black">+</div>
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: secondNumber }).map((_, i) => (
            <div
              key={`second-${i}`}
              className="w-12 h-12 bg-green-500 m-1 rounded-lg flex items-center justify-center text-white font-bold"
            >
              1
            </div>
          ))}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4">
            Count all the blocks to find the total!
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: firstNumber }).map((_, i) => {
            const isRemoved = i >= firstNumber - secondNumber;
            return (
              <div
                key={`block-${i}`}
                className={`w-12 h-12 m-1 rounded-lg flex items-center justify-center text-white font-bold relative ${
                  isRemoved ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                1
                {isRemoved && <div className="absolute text-3xl text-red-600">✗</div>}
              </div>
            );
          })}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4">
            Start with {firstNumber} blocks, take away {secondNumber} red blocks.<br />
            Count the blue blocks that remain!
          </div>
        )}
      </div>
    );
  }
} 