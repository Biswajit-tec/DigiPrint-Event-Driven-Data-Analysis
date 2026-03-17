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
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
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
