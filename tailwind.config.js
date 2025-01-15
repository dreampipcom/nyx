/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', 'node_modules/@dreampipcom/oneiros/dist/*.{js,ts,jsx,tsx,mdx}'],
  safelist: ['block', 'hidden', 'bg-inverse-light', 'bg-inverse-dark', 'min-h-screen'],
  darkMode: ['variant', '.dark &:not(.dark .light *, .light .light *)', ''],
  presets: [require('@dreampipcom/oneiros/dist/tailwind.config.js')],
  theme: {
    extend: {},
  },
  plugins: [],
};
