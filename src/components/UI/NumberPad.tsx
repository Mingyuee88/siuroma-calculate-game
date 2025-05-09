'use client';

interface NumberPadProps {
  onNumberClick: (num: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function NumberPad({ onNumberClick, onClear, disabled = false }: NumberPadProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
        <button
          key={`num-${num}`}
          onClick={() => onNumberClick(num.toString())}
          disabled={disabled}
          className="w-12 h-12 bg-purple-600 rounded-full text-white text-xl font-bold hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {num}
        </button>
      ))}
      <button
        onClick={onClear}
        disabled={disabled}
        className="w-12 h-12 bg-red-500 rounded-full text-white text-xl font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        C
      </button>
    </div>
  );
} 