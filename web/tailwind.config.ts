import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#131313",
        charcoal: "#222222",
        steel: "#6a6a6a",
        fog: "#acacac",
        bone: "#f2f2f2",
        canvas: "#f8f7fb",
        card: "#ffffff",
        magenta: {
          DEFAULT: "#ff37c7",
          deep: "#f50db4",
          tint: "#fdecf8",
          ring: "#ffd3ef",
        },
        positive: {
          DEFAULT: "#0c8911",
          tint: "#dcf3dd",
        },
        negative: {
          DEFAULT: "#e0294f",
          tint: "#fbe3e8",
        },
        violet: "#8251fb",
        cyan: "#2abdff",
        teal: "#00c3a0",
        warning: {
          DEFAULT: "#c9670a",
          tint: "#fff5e8",
          ring: "#f6d6ae",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        caption: ["12px", { lineHeight: "1.33", letterSpacing: "-0.24px" }],
        "body-sm": ["14px", { lineHeight: "1.25", letterSpacing: "-0.28px" }],
        body: ["16px", { lineHeight: "1.49", letterSpacing: "-0.32px" }],
        subheading: ["18px", { lineHeight: "1.33", letterSpacing: "-0.36px" }],
        "heading-sm": ["24px", { lineHeight: "1.2", letterSpacing: "-0.48px" }],
        heading: ["36px", { lineHeight: "1.15", letterSpacing: "-0.72px" }],
        "heading-lg": ["52px", { lineHeight: "1", letterSpacing: "-1.04px" }],
        display: ["64px", { lineHeight: "0.96", letterSpacing: "-1.28px" }],
      },
      borderRadius: {
        card: "20px",
        btn: "14px",
        pill: "999999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(19,19,19,0.04)",
        elevated: "0 10px 30px rgba(19,19,19,0.06)",
        widget: "0 0 0 1px rgba(19,19,19,0.03), 0 8px 24px rgba(19,19,19,0.05)",
      },
      spacing: {
        4.5: "18px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        spin800: {
          to: { transform: "rotate(360deg)" },
        },
        slideDownFade: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "60%": { opacity: "1", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        overlayIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        growUp: {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        priceFlashGreen: {
          "0%": { backgroundColor: "rgba(12,137,17,0.16)" },
          "100%": { backgroundColor: "rgba(12,137,17,0)" },
        },
        priceFlashRed: {
          "0%": { backgroundColor: "rgba(224,41,79,0.14)" },
          "100%": { backgroundColor: "rgba(224,41,79,0)" },
        },
        profileDrop: {
          "0%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(10px)" },
          "65%": { transform: "translateY(-5px)" },
          "85%": { transform: "translateY(2px)" },
          "100%": { transform: "translateY(0)" },
        },
        profileLift: {
          "0%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-9px)" },
          "65%": { transform: "translateY(4px)" },
          "85%": { transform: "translateY(-2px)" },
          "100%": { transform: "translateY(0)" },
        },
        sidebarExpand: {
          "0%": { transform: "scaleY(0.97) translateY(-4px)" },
          "45%": { transform: "scaleY(1.02) translateY(2px)" },
          "70%": { transform: "scaleY(0.995) translateY(-1px)" },
          "100%": { transform: "scaleY(1) translateY(0)" },
        },
        sidebarCollapse: {
          "0%": { transform: "scaleY(1.015) translateY(2px)" },
          "45%": { transform: "scaleY(0.99) translateY(-1px)" },
          "100%": { transform: "scaleY(1) translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s linear infinite",
        spin800: "spin800 800ms linear infinite",
        "slide-down-fade": "slideDownFade 220ms cubic-bezier(0.22,1,0.36,1)",
        "fade-in": "fadeIn 120ms ease-out",
        "scale-in": "scaleIn 200ms cubic-bezier(0.22,1,0.36,1)",
        "overlay-in": "overlayIn 150ms ease-out",
        "grow-up": "growUp 250ms cubic-bezier(0.22,1,0.36,1)",
        "flash-green": "priceFlashGreen 300ms ease-out",
        "flash-red": "priceFlashRed 300ms ease-out",
        "profile-drop": "profileDrop 450ms cubic-bezier(0.22,1,0.36,1)",
        "profile-lift": "profileLift 450ms cubic-bezier(0.22,1,0.36,1)",
        "sidebar-expand": "sidebarExpand 380ms cubic-bezier(0.22,1,0.36,1)",
        "sidebar-collapse": "sidebarCollapse 300ms cubic-bezier(0.22,1,0.36,1)",
      },
      transitionDuration: {
        120: "120ms",
        80: "80ms",
        150: "150ms",
        180: "180ms",
        200: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
