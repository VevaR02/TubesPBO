/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors: {
        "sevspo-dark": "#1a1a1a",
        "sevspo-light": "#f5f5f5",
        "sevspo-primary": "#007bff",
      },
    },
  },
  plugins: [],
};
