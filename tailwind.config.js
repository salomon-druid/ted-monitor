/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3e7339',
        dark: '#1F2933',
        background: '#F5F4F1',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
};
