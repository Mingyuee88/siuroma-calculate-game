'use client';

interface AnimalsProps {
  firstNumber: number;
  secondNumber: number;
  gameMode: 'addition' | 'subtraction';
  showExplanation?: boolean;
}

const animals = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐨', '🐯'];

export function Animals({ firstNumber, secondNumber, gameMode, showExplanation = true }: AnimalsProps) {
  const result = gameMode === 'addition' ? firstNumber + secondNumber : firstNumber - secondNumber;

  if (gameMode === 'addition') {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: firstNumber }).map((_, i) => (
            <div
              key={`first-${i}`}
              className="w-12 h-12 bg-yellow-100 m-1 rounded-full flex items-center justify-center text-2xl"
            >
              {animals[i % animals.length]}
            </div>
          ))}
        </div>
        <div className="text-2xl font-bold mb-2 text-black">+</div>
        <div className="flex flex-wrap justify-center mb-4">
          {Array.from({ length: secondNumber }).map((_, i) => (
            <div
              key={`second-${i}`}
              className="w-12 h-12 bg-blue-100 m-1 rounded-full flex items-center justify-center text-2xl"
            >
              {animals[(i + 3) % animals.length]}
            </div>
          ))}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4">
            Count all the animals to find the total!
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
                key={`animal-${i}`}
                className={`w-12 h-12 m-1 rounded-full flex items-center justify-center text-2xl relative ${
                  isRemoved ? 'bg-red-100 opacity-40' : 'bg-yellow-100'
                }`}
              >
                {animals[i % animals.length]}
                {isRemoved && <div className="absolute text-3xl text-red-600">↗️</div>}
              </div>
            );
          })}
        </div>
        {showExplanation && (
          <div className="text-center text-gray-600 mb-4">
            {firstNumber} animals were playing. {secondNumber} animals went home.<br />
            How many animals are still playing?
          </div>
        )}
      </div>
    );
  }
} 