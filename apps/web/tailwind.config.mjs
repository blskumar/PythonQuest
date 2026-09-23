/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--page-bg)",
        ink: "var(--page-text)",
        muted: "var(--muted-text)",
        surface: "var(--surface)",
        "surface-subtle": "var(--surface-subtle)",
        "surface-border": "var(--surface-border)",
        primary: { DEFAULT: "var(--accent)", strong: "var(--accent-strong)" },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },
      boxShadow: { sm: "var(--shadow-sm)", md: "var(--shadow-md)" },
      fontFamily: { sans: ["Inter", "Segoe UI", "sans-serif"] },
    },
  },
};

export default config;