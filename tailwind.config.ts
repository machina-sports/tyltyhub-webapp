import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
        'sans': ['Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        bwin: {
          'brand-primary': '#FFCB00',
          'brand-secondary': '#FDBA12',
          'neutral-100': '#FFFFFF',
          'neutral-90': '#E6E6E6',
          'neutral-80': '#B3B3B3',
          'neutral-70': '#8C8C8C',
          'neutral-60': '#666666',
          'neutral-50': '#4A4A4A',
          'neutral-40': '#3E3E3E',
          'neutral-30': '#2F2F2F',
          'neutral-20': '#1E1E1E',
          'neutral-10': '#121212',
          'neutral-0': '#000000',
          'success': '#2ECC71',
          'warning': '#FDBA12',
          'danger': '#FF3B30',
          'info': '#209CEE',
        }
      },
      boxShadow: {
        'bwin-xs': '0 1px 2px rgba(0,0,0,0.40)',
        'bwin-sm': '0 2px 4px rgba(0,0,0,0.45)',
        'bwin-md': '0 4px 8px rgba(0,0,0,0.60)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
