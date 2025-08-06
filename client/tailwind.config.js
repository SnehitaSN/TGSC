// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // Scan all JS/JSX files in src/
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Add Inter font
      },
      colors: {
        // Define your custom brand colors
        'green-50': '#f8fafc',
        'green-100': '#f0fdf4',
        'green-600': '#22c55e',
        'green-700': '#16a34a',
        'green-800': '#15803d',
        'green-900': '#14532d',
        'green-950': '#052e16',
        'amber-50': '#fffbeb',
        'amber-100': '#fef3c7',
        'amber-200': '#fde68a',
        'amber-700': '#b45309',
        'amber-800': '#92400e',
        'amber-900': '#78350f',
        'amber-950': '#451a03',
        // Example primary/secondary for general use - adapt as needed
        primary: 'var(--color-green-700)',
        'primary-foreground': 'var(--color-white)',
        secondary: 'var(--color-amber-200)',
        'secondary-foreground': 'var(--color-amber-900)',
        // Standard Shadcn/ui-like colors (you can add these or define as CSS vars)
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(215.4 16.3% 46.9%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
        destructive: {
          DEFAULT: 'hsl(0 100% 50%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: `calc(0.5rem - 4px)`,
      },
    },
  },
  plugins: [],
};
