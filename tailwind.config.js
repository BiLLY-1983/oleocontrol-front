export default {
  darkMode: "class", // Habilita el modo oscuro basado en la clase 'dark'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f8f9f3",
          100: "#eef0e5",
          200: "#dde2cc",
          300: "#c3cda6",
          400: "#a5b47c",
          500: "#8a9c5d",
          600: "#6b7c46",
          700: "#556339",
          800: "#475231",
          900: "#3d462c",
          950: "#1f2615",
        },
        dark: {
          50: "#f0f6fc",
          100: "#c9d1d9",
          200: "#b1bac4",
          300: "#8b949e",
          400: "#6e7681",
          500: "#484f58",
          600: "#30363d",
          700: "#21262d",
          800: "#161b22",
          900: "#0d1117",
          950: "#010409",
        },
      },
    },
  },
  plugins: [],
};
