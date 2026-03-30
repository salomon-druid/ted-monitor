/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3e7339',
          dark: '#2d5a29',
          light: '#4d8e45',
        },
        dark: {
          DEFAULT: '#1F2933',
          light: '#2D3A42',
        },
        background: '#F5F4F1',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E5C359',
        },
      },
    },
  },
  plugins: [],
};
