/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        gensen: ['GenSenRounded', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif']
      },
    },
  },
  plugins: [],
} 