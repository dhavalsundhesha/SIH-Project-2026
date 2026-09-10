/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dharo: {
          bg: "#0c1220",
          panel: "#141c30",
          panelLight: "#1a2440",
          border: "#2a3654",
          gold: "#d4af37",
          goldLight: "#e8c766",
          text: "#e6e9f0",
          muted: "#8b94ab",
        },
      },
      fontFamily: {
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
