import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7ef',
          500: '#2f8a34',
          700: '#1f6a27'
        }
      }
    }
  },
  plugins: []
};

export default config;
