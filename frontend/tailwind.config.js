/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fde5c0',
          200: '#fbd39a',
          300: '#f9c174',
          400: '#f7b456',
          500: '#f5a738',
          600: '#f39f32',
          700: '#f1962b',
          800: '#ef8c24',
          900: '#eb7c17',
        },
      },
    },
  },
  plugins: [],
}
