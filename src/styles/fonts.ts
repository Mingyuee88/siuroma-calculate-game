import plugin from 'tailwindcss/plugin';

export const fontFamilyPlugin = plugin(
  function ({ addUtilities }) {
    addUtilities({
      '.font-poppins': {
        fontFamily: '"Poppins", sans-serif',
      },
      '.font-gensen': {
        fontFamily: '"GenSenRounded", sans-serif',
      },
      '.font-fredoka': {
        fontFamily: '"Fredoka", sans-serif',
      },
      // 中英文混排优化
      '.font-mixed': {
        fontFamily: '"GenSenRounded", "Poppins", sans-serif',
      },
    });
  }
); 