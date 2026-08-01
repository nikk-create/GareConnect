/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        encre: '#0A1224',
        menthe: '#7FE0D3',
        or: '#F4B942',
        ciel: '#4C82F0',
        papier: '#F3F6F5',
        lime: '#B7E634',
        pin: '#0D5FA6',
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: '#4C82F0', foreground: '#F3F6F5' },
        secondary: { DEFAULT: '#7FE0D3', foreground: '#0A1224' },
        muted: { DEFAULT: '#E7ECEF', foreground: '#5B6472' },
        destructive: { DEFAULT: '#E5484D', foreground: '#FFFFFF' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: { lg: '1rem', md: '0.75rem', sm: '0.5rem' },
    },
  },
  plugins: [],
}
