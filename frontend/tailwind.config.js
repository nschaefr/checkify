/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "wave-pattern": "url('/src/assets/left-wave.svg')",
        "wave-pattern-1": "url('/src/assets/top-wave.svg')",
      },
    },
  },
  plugins: [],
};
