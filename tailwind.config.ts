import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1600px",
      "4xl": "1920px",
      // Custom breakpoints
      mobile: { max: "767px" },
      tablet: { min: "768px", max: "1023px" },
      desktop: { min: "1024px" },
      wide: { min: "1600px" },
      ultrawide: { min: "1920px" },
      // Orientation breakpoints
      portrait: { raw: "(orientation: portrait)" },
      landscape: { raw: "(orientation: landscape)" },
      // Height breakpoints
      "h-sm": { raw: "(max-height: 600px)" },
      "h-md": { raw: "(min-height: 601px) and (max-height: 900px)" },
      "h-lg": { raw: "(min-height: 901px)" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "fluid-sm": "clamp(0.25rem, 0.5vw, 0.375rem)",
        "fluid-md": "clamp(0.375rem, 0.75vw, 0.5rem)",
        "fluid-lg": "clamp(0.5rem, 1vw, 0.75rem)",
        "fluid-xl": "clamp(0.75rem, 1.5vw, 1rem)",
      },
      spacing: {
        "fluid-xs": "clamp(0.25rem, 0.5vw, 0.5rem)",
        "fluid-sm": "clamp(0.5rem, 1vw, 1rem)",
        "fluid-md": "clamp(1rem, 2vw, 2rem)",
        "fluid-lg": "clamp(1.5rem, 3vw, 3rem)",
        "fluid-xl": "clamp(2rem, 4vw, 4rem)",
        "fluid-2xl": "clamp(3rem, 6vw, 6rem)",
      },
      fontSize: {
        "fluid-xs": "clamp(0.75rem, 0.8vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 0.9vw, 1rem)",
        "fluid-base": "clamp(1rem, 1vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1.2vw, 1.25rem)",
        "fluid-xl": "clamp(1.25rem, 1.4vw, 1.5rem)",
        "fluid-2xl": "clamp(1.5rem, 2vw, 2rem)",
        "fluid-3xl": "clamp(1.875rem, 2.5vw, 2.5rem)",
        "fluid-4xl": "clamp(2.25rem, 3vw, 3rem)",
        "fluid-5xl": "clamp(3rem, 4vw, 4rem)",
        "fluid-6xl": "clamp(3.75rem, 5vw, 5rem)",
        "fluid-7xl": "clamp(4.5rem, 6vw, 6rem)",
      },
      maxWidth: {
        container: "min(100% - 2rem, 1600px)",
        "container-sm": "min(100% - 2rem, 640px)",
        "container-md": "min(100% - 2rem, 768px)",
        "container-lg": "min(100% - 2rem, 1024px)",
        "container-xl": "min(100% - 2rem, 1280px)",
        "container-2xl": "min(100% - 2rem, 1536px)",
      },
      gridTemplateColumns: {
        "auto-fit-xs": "repeat(auto-fit, minmax(200px, 1fr))",
        "auto-fit-sm": "repeat(auto-fit, minmax(240px, 1fr))",
        "auto-fit": "repeat(auto-fit, minmax(280px, 1fr))",
        "auto-fit-lg": "repeat(auto-fit, minmax(320px, 1fr))",
        "auto-fit-xl": "repeat(auto-fit, minmax(360px, 1fr))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-in": {
          from: {
            transform: "translateX(-100%)",
          },
          to: {
            transform: "translateX(0)",
          },
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "mobile-slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "mobile-slide-up": "mobile-slide-up 0.3s ease-out",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        strong: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        colored: "0 10px 25px -5px hsl(var(--primary) / 0.1), 0 10px 10px -5px hsl(var(--primary) / 0.04)",
        "mobile-bottom": "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
        portrait: "3 / 4",
        landscape: "4 / 3",
        ultrawide: "21 / 9",
      },
      zIndex: {
        modal: "1000",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        offcanvas: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin pour les utilitaires responsive personnalisés
    ({ addUtilities, theme }: any) => {
      const newUtilities = {
        ".container-fluid": {
          width: "100%",
          maxWidth: "min(100% - 2rem, 1600px)",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "clamp(1rem, 4vw, 4rem)",
          paddingRight: "clamp(1rem, 4vw, 4rem)",
        },
        ".grid-responsive": {
          display: "grid",
          gap: "clamp(1rem, 2vw, 2rem)",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        },
        ".text-responsive": {
          fontSize: "clamp(1rem, 1vw, 1.125rem)",
          lineHeight: "1.6",
        },
        ".touch-target": {
          minHeight: "44px",
          minWidth: "44px",
        },
        ".safe-area-inset": {
          paddingTop: "env(safe-area-inset-top)",
          paddingRight: "env(safe-area-inset-right)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config
