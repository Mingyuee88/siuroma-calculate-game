/**
 * Generates a random number between min and max (inclusive)
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculates the result of a mathematical operation
 */
export function calculateResult(
  firstNumber: number,
  secondNumber: number,
  operation: 'addition' | 'subtraction'
): number {
  return operation === 'addition'
    ? firstNumber + secondNumber
    : firstNumber - secondNumber;
}

/**
 * Formats a number with commas for better readability
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Returns a color based on a number, ensuring consistent coloring for blocks and shapes
 */
export function getColorFromNumber(num: number): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  return colors[num % colors.length];
} 