module.exports = {
  content: [
    './src/pages//.{js,ts,jsx,tsx,mdx}',
    './src/components/**/.{js,ts,jsx,tsx,mdx}',
    './src/app/*/.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          100: '#f4f4f5',
          500: '#71717a',
          800: '#27272a',
          900: '#18181b',
        }
      },
    },
  },
  plugins: [],
};