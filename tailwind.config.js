/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-green": " #47745f",
        "brand-yellow": "#faea9c",
      },
      backgroundSize: {
        "50%": "50%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
