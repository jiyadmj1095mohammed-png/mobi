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
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "Sora", "system-ui", "-apple-system", "sans-serif"],
        display: ["Sora", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        '4xl': '36px',
        '5xl': '44px',
      },
      boxShadow: {
        canvas: "0 25px 60px -15px rgba(18, 20, 23, 0.15)",
        card: "0 4px 20px -2px rgba(18, 20, 23, 0.05)",
      },
    },
  },
  plugins: [],
};
