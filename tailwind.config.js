/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(103, 232, 249, 0.25), 0 20px 60px rgba(6, 182, 212, 0.18)",
      },
      colors: {
        ink: "#050816",
        panel: "#0b1228",
        cyanGlow: "#67e8f9",
        violetGlow: "#8b5cf6",
        roseGlow: "#f472b6",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(34,211,238,0.16), transparent 28%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.18), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "auto, auto, 64px 64px, 64px 64px",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSlow: "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
