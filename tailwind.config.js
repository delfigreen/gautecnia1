module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A202C',
          light: '#EDF2F7',
          dark: '#2D3748',
        },
        green: {
          DEFAULT: '#38A169',
          light: '#68D391',
          dark: '#2F855A',
        },
        blue: {
          DEFAULT: '#3182CE',
          light: '#63B3ED',
          dark: '#2B6CB0',
        },
      },
    },
  },
  plugins: [],
};
