/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        backgroundColor: {
          'dark-primary': '#121212',
          'dark-secondary': '#1e1e1e',
        },
        textColor: {
          'dark-primary': '#ffffff',
          'dark-secondary': '#e0e0e0',
        },
      },
    },
    plugins: [],
  };
  