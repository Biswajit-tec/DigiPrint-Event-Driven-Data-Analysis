/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Cyber-intelligence color palette
                cyber: {
                    50: '#e0f7ff',
                    100: '#b3ebff',
                    200: '#80dfff',
                    300: '#4dd3ff',
                    400: '#26c9ff',
                    500: '#00bfff', // Primary cyan/electric blue
                    600: '#00a3db',
                    700: '#0087b7',
                    800: '#006b93',
                    900: '#004f6f',
                },
                purple: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6', // Secondary muted purple
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                dark: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617', // Primary dark background
                },
                border: '#1e293b', // Default border color matching dark-800
            },
            fontFamily: {
                sans: ['Inter', 'Outfit', 'Manrope', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
            },
            transitionDuration: {
                '150': '150ms',
                '200': '200ms',
                '300': '300ms',
                '400': '400ms',
                '500': '500ms',
                '800': '800ms',
                '1200': '1200ms',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 191, 255, 0.4)',
                'glow-sm': '0 0 10px rgba(0, 191, 255, 0.3)',
                'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'fade-up': 'fadeUp 0.5s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'count-up': 'countUp 1s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 191, 255, 0.6)' },
                },
                countUp: {
                    '0%': { transform: 'scale(1.2)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
