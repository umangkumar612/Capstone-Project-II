export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 24px 80px rgba(14, 165, 233, 0.18)",
        glass: "0 24px 80px rgba(15, 23, 42, 0.10)"
      },
      colors: {
        clinical: {
          ink: "#17212b",
          muted: "#657282",
          line: "#d9e1e8",
          bg: "#eef3f6",
          teal: "#0f766e",
          red: "#be123c",
          amber: "#b45309",
          cyan: "#06b6d4",
          blue: "#2563eb"
        }
      }
    }
  },
  plugins: []
};
