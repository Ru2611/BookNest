/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./Index.jsx",
    "./App.jsx",
    "./Books.js",
    "./Components/**/*.{js,jsx,ts,tsx}",
    "./Page/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};
