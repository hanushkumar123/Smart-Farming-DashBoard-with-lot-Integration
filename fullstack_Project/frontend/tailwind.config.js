/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enabled manual dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict Palette
                primary: {
                    DEFAULT: "var(--primary)", // Primary Accent
                    dark: "var(--primary-dark)",
                    hover: "var(--primary-hover)",
                    light: "#ECFEFF", // Keep static or make var if needed
                },
                // Backgrounds
                bg: {
                    body: "var(--bg-body)",
                    card: "var(--bg-card)",
                    sidebar: "var(--bg-card)",
                },
                // Borders
                border: {
                    light: "var(--border-light)",
                    soft: "var(--border-soft)",
                },
                // Text
                text: {
                    primary: "var(--text-main)",
                    secondary: "var(--text-secondary)",
                    muted: "var(--text-muted)",
                },
                // Status
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                info: "var(--info)",
            },
            fontFamily: {
                sans: ['Inter', 'Source Sans 3', 'Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
