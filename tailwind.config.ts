// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      colors: {
        // رنگ سبز اصلی (دکمه‌ها و هدر)
        primary: {
          DEFAULT: '#1e5d3f',   // سبز تیره اصلی
          dark: '#153f2b',      // سبز خیلی تیره
          light: '#2a7d57',     // سبز روشن‌تر
          soft: '#e8f3ed',      // سبز خیلی روشن (پس‌زمینه)
        },
        // رنگ‌های مکمل
        cream: '#f8faf5',       // پس‌زمینه کرم
        border: '#e5e9e2',      // رنگ بردر ملایم
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(30, 93, 63, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;