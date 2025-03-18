import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetForms from "@twind/preset-tailwind-forms";
import presetTypo from "@twind/preset-typography";
import presetContainerQueries from "@twind/preset-container-queries";
import { modularScale } from "polished";

export default defineConfig({
  darkMode: "media",
  hash: false,
  presets: [
    presetAutoprefix(),
    presetTailwind({ disablePreflight: false }),
    presetContainerQueries(),
    presetExt(),
    presetLineClamp(),
    presetForms(),
    presetTypo(),
  ],
  variants: [["hasChildMenudHover", "&:has(.container-menu-wrapper:hover)"]],
  rules: [
    [
      "brick-container",
      {
        display: "grid",
        gridTemplateColumns: "subgrid",
        gridTemplateRows: "subgrid",
        gridColumn: "1 / span 12",
      },
    ],
    [
      // specific padding classes for bricks
      "brick-p-",
      ({ $$ }) => ({ padding: `${$$ === "1" ? "1px" : $$ === "0" ? "0" : `${modularScale(+$$, "1rem")}`}` }),
    ],
    // ["family-", ({ $$ }) => ({ fontFamily: `var(--font-${$$})` })],

    [
      "h-dvh",
      {
        height: "100dvh",
      },
    ],
    [
      "w-dvw",
      {
        width: "100dvw",
      },
    ],
    ["bg-neutral-", ({ $$ }) => ({ backgroundColor: `var(--color-neutral-${$$})` })],
    ["bg-accent-", ({ $$ }) => ({ backgroundColor: `var(--color-accent-${$$})` })],
    ["bg-primary-", ({ $$ }) => ({ backgroundColor: `var(--color-primary-${$$})` })],
    ["bg-secondary-", ({ $$ }) => ({ backgroundColor: `var(--color-secondary-${$$})` })],

    ["border-neutral-", ({ $$ }) => ({ borderColor: `var(--color-neutral-${$$})` })],
    ["border-accent-", ({ $$ }) => ({ borderColor: `var(--color-accent-${$$})` })],
    ["border-primary-", ({ $$ }) => ({ borderColor: `var(--color-primary-${$$})` })],
    ["border-secondary-", ({ $$ }) => ({ borderColor: `var(--color-secondary-${$$})` })],

    /**
     * Can be used with text-neutral-500, but also text-neutral-500-subtle, text-neutral-500-tonal-subtle, text-neutral-500-strong, etc.
     */
    ["text-neutral-", ({ $$ }) => ({ color: `var(--color-neutral-${$$})` })],
    ["text-accent-", ({ $$ }) => ({ color: `var(--color-accent-${$$})` })],
    ["text-primary-", ({ $$ }) => ({ color: `var(--color-primary-${$$})` })],
    ["text-secondary-", ({ $$ }) => ({ color: `var(--color-secondary-${$$})` })],

    ["outline-primary-", ({ $$ }) => ({ outlineColor: `var(--color-primary-${$$})` })],
    ["outline-secondary-", ({ $$ }) => ({ outlineColor: `var(--color-secondary-${$$})` })],
    ["outline-accent-", ({ $$ }) => ({ outlineColor: `var(--color-accent-${$$})` })],
    ["outline-neutral-", ({ $$ }) => ({ outlineColor: `var(--color-neutral-${$$})` })],

    // ["color-", ({ $$ }) => ({ color: `var(--color-${$$})` })],
    [
      "neutral-",
      ({ $$ }) => ({ backgroundColor: `var(--color-neutral-${$$})`, color: `var(--text-neutral-${$$})` }),
    ],
    [
      "accent-",
      ({ $$ }) => ({ backgroundColor: `var(--color-accent-${$$})`, color: `var(--text-accent-${$$})` }),
    ],

    [
      "primary-",
      ({ $$ }) => ({ backgroundColor: `var(--color-primary-${$$})`, color: `var(--text-primary-${$$})` }),
    ],
    [
      "secondary-",
      ({ $$ }) => ({ backgroundColor: `var(--color-secondary-${$$})`, color: `var(--text-secondary-${$$})` }),
    ],

    ["w-fill", { width: ["fill-available", "-webkit-fill-available", "-moz-available"] }],
    ["h-fill", { height: ["fill-available", "-webkit-fill-available", "-moz-available"] }],
    ["color-auto", { color: "var(--color-auto, #111)" }],

    ["brick-light-", ({ $$ }) => `bg-${$$}-300 text-${$$}-50`],
    ["brick-normal-", ({ $$ }) => `bg-${$$}-500 text-${$$}-100`],
    ["brick-dark-", ({ $$ }) => `bg-${$$}-800 text-${$$}-200`],

    ["hero-size-md", { fontSize: "clamp(3rem, 2.5vw + 2.5rem, 4.75rem)", lineHeight: "1.1" }],
    ["hero-size-lg", { fontSize: "clamp(3.75rem, 3vw + 3rem, 5.75rem)", lineHeight: "1.1" }],
    ["hero-size-xl", { fontSize: "clamp(4.5rem, 3.5vw + 3.5rem, 6.75rem)", lineHeight: "1.1" }],
    ["hero-size-2xl", { fontSize: "clamp(5.25rem, 4vw + 4rem, 7.75rem)", lineHeight: "1.1" }],
    ["hero-size-3xl", { fontSize: "clamp(6rem, 4.5vw + 4.5rem, 8.75rem)", lineHeight: "1.1" }],

    ["text-shadow-none", { textShadow: "none" }],
    ["text-shadow-sm", { textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)" }],
    ["text-shadow-md", { textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }],
    ["text-shadow-lg", { textShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }],
    ["text-shadow-xl", { textShadow: "0 6px 12px rgba(0, 0, 0, 0.3)" }],

    ["scrollbar-thin", { scrollbarWidth: "thin" }],
    ["scrollbar-color-", ({ $$ }) => ({ scrollbarColor: `var(--${$$}-6) var(--${$$}-surface)` })],
    [
      "button",
      {
        color: "var(--color-button-text)",
        backgroundColor: "var(--color-button-bg)",
        padding: "0.5rem 1rem",
        borderRadius: "0.25rem",
        fontSize: "1rem",
        cursor: "pointer",
      },
    ],
    [
      "button-sm",
      {
        padding: "0.25rem 0.5rem",
        fontSize: "0.875rem",
      },
    ],
    [
      "button-lg",
      {
        padding: "0.75rem 1.5rem",
        fontSize: "1.25rem",
      },
    ],
    [
      "button-xl",
      {
        padding: "1rem 2rem",
        fontSize: "1.5rem",
      },
    ],
  ],
  theme: {
    extend: {
      colors: {
        upstart: {
          50: "#f2f4fb",
          100: "#e7ecf8",
          200: "#d3daf2",
          300: "#b8c2e9",
          400: "#9ba3de",
          500: "#8186d3",
          600: "#7270c6",
          700: "#5b57ab",
          800: "#4b498a",
          900: "#40406f",
          950: "#262541",
        },
        dark: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#333333",
          950: "#262626",
        },
        primary: {
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
        },
        accent: {
          50: "var(--color-accent-50)",
          100: "var(--color-accent-100)",
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },
      },

      containers: {
        mobile: "1px",
        desktop: "1024px",
      },

      animation: {
        "fade-in": "fade-in 0.5s",
        "elastic-pop": "elastic-pop 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in": "slide-in 0.15s ease-out",
        "slide-back": "slide-back 0.15s ease-out",
      },
      keyframes: {
        "elastic-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
          "70%": { transform: "scale(0.98)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-back": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
    },
  },
});
