/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fifa: {
          blue: '#00529B',
          gold: '#D4AF37',
          dark: '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}
