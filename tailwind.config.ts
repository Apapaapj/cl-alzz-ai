import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'alzz-red': '#8B0000',
        'alzz-red-mid': '#6B0000',
        'alzz-red-bright': '#CC0000',
        'alzz-red-glow': '#FF1A1A',
        'alzz-black': '#0A0A0A',
        'alzz-dark': '#111111',
        'alzz-surface': '#1A0A0A',
        'alzz-border': '#3D0000',
        'alzz-text': '#E8E8E8',
        'alzz-muted': '#888888',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'flicker': 'flicker 3s infinite',
        'scan': 'scan 4s linear infinite',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'thinking': 'thinkingPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-3px, 2px)' },
          '40%': { transform: 'translate(3px, -2px)' },
          '60%': { transform: 'translate(-2px, -1px)' },
          '80%': { transform: 'translate(2px, 1px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 5px #8B0000, 0 0 10px #8B0000' },
          '50%': { boxShadow: '0 0 20px #CC0000, 0 0 40px #8B0000' },
        },
        thinkingPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        }
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(139,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,0,0,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    },
  },
  plugins: [],
}

export default config
