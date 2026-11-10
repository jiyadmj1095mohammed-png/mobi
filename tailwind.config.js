/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#B8C4B8",
        pillDark: "#121417",
        citron: "#E8F876",
        softGray: "#F4F5F2",
        textMain: "#121417",
        textMuted: "#6F767E",
        // Retro Neo-Brutalist Palette (Inspired by Reference)
        retroRust: "#D84F2A",
        retroRustDark: "#BF3E1B",
        retroOchre: "#EEA827",
        retroOchreDark: "#D69319",
        retroTeal: "#1D838F",
        retroTealDark: "#156770",
        retroCream: "#F4EEDC",
        retroCreamDark: "#EADFC4",
        retroDark: "#24201E",
        retroLight: "#FAF6EB",
        retroSage: "#879C74",
        retroCard: "#FAF3E0",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "Sora", "system-ui", "-apple-system", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '44px',
      },
      boxShadow: {
        canvas: "0 25px 60px -15px rgba(18, 20, 23, 0.15)",
        card: "0 4px 20px -2px rgba(18, 20, 23, 0.05)",
        'brutal-sm': "2px 2px 0px #000000",
        'brutal': "4px 4px 0px #000000",
        'brutal-md': "5px 5px 0px #000000",
        'brutal-lg': "6px 6px 0px #000000",
        'brutal-xl': "8px 8px 0px #000000",
      },
    },
  },
  plugins: [],
};
