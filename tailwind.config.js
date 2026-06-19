/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- এই লাইনটি না থাকলে কোনোভাবেই ডার্ক মোড কাজ করবে না!
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};