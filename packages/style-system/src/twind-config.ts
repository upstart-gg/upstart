import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetForms from "@twind/preset-tailwind-forms";
import presetTypo from "@twind/preset-typography";
import presetContainerQueries from "@twind/preset-container-queries";

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
    // [
    //   "brick-p-",
    //   ({ $$ }) => ({ padding: `${$$ === "1" ? "1px" : $$ === "0" ? "0" : `${modularScale(+$$, "1rem")}`}` }),
    // ],
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
    [
      "bg-neutral-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-neutral-${$$})`,
        "--up-color-auto": `color-contrast(var(--up-bg-color) vs white, black)`,
      }),
    ],
    [
      "bg-accent-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-accent-${$$})`,
        "--up-color-auto": `color-contrast(var(--up-bg-color) vs white, black)`,
      }),
    ],
    [
      "bg-primary-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-primary-${$$})`,
        "--up-color-auto": `color-contrast(var(--up-bg-color) vs white, black)`,
      }),
    ],
    [
      "bg-secondary-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-secondary-${$$})`,
        "--up-color-auto": `color-contrast(var(--up-bg-color) vs white, black)`,
      }),
    ],

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

    ["preset-bg-gradient-primary-1", "bg-gradient-to-t from-primary-100 to-primary-50"],
    ["preset-bg-gradient-primary-2", "bg-gradient-to-t from-primary-300 to-primary-100"],
    ["preset-bg-gradient-primary-3", "bg-gradient-to-t from-primary-500 to-primary-300"],
    ["preset-bg-gradient-primary-4", "bg-gradient-to-t from-primary-700 to-primary-500"],
    ["preset-bg-gradient-primary-5", "bg-gradient-to-t from-primary-900 to-primary-700"],

    ["preset-bg-gradient-secondary-1", "bg-gradient-to-t from-secondary-100 to-secondary-50"],
    ["preset-bg-gradient-secondary-2", "bg-gradient-to-t from-secondary-300 to-secondary-100"],
    ["preset-bg-gradient-secondary-3", "bg-gradient-to-t from-secondary-500 to-secondary-300"],
    ["preset-bg-gradient-secondary-4", "bg-gradient-to-t from-secondary-700 to-secondary-500"],
    ["preset-bg-gradient-secondary-5", "bg-gradient-to-t from-secondary-900 to-secondary-700"],

    ["preset-bg-gradient-neutral-1", "bg-gradient-to-t from-neutral-100 to-neutral-50"],
    ["preset-bg-gradient-neutral-2", "bg-gradient-to-t from-neutral-300 to-neutral-100"],
    ["preset-bg-gradient-neutral-3", "bg-gradient-to-t from-neutral-500 to-neutral-300"],
    ["preset-bg-gradient-neutral-4", "bg-gradient-to-t from-neutral-700 to-neutral-500"],
    ["preset-bg-gradient-neutral-5", "bg-gradient-to-t from-neutral-900 to-neutral-700"],

    ["preset-border-primary-1", { borderColor: `var(--color-primary-300)` }],
    ["preset-border-primary-2", { borderColor: `var(--color-primary-500)` }],
    ["preset-border-primary-3", { borderColor: `var(--color-primary-700)` }],
    ["preset-border-primary-4", { borderColor: `var(--color-primary-900)` }],
    ["preset-border-primary-5", { borderColor: `var(--color-primary-400)` }],

    ["preset-border-secondary-1", { borderColor: `var(--color-secondary-300)` }],
    ["preset-border-secondary-2", { borderColor: `var(--color-secondary-500)` }],
    ["preset-border-secondary-3", { borderColor: `var(--color-secondary-700)` }],
    ["preset-border-secondary-4", { borderColor: `var(--color-secondary-900)` }],
    ["preset-border-secondary-5", { borderColor: `var(--color-secondary-400)` }],

    ["preset-border-accent-1", { borderColor: `var(--color-accent-300)` }],
    ["preset-border-accent-2", { borderColor: `var(--color-accent-500)` }],
    ["preset-border-accent-3", { borderColor: `var(--color-accent-700)` }],
    ["preset-border-accent-4", { borderColor: `var(--color-accent-900)` }],
    ["preset-border-accent-5", { borderColor: `var(--color-accent-400)` }],

    ["preset-border-neutral-1", { borderColor: `var(--color-neutral-300)` }],
    ["preset-border-neutral-2", { borderColor: `var(--color-neutral-500)` }],
    ["preset-border-neutral-3", { borderColor: `var(--color-neutral-700)` }],
    ["preset-border-neutral-4", { borderColor: `var(--color-neutral-900)` }],
    ["preset-border-neutral-5", { borderColor: `var(--color-neutral-400)` }],

    ["preset-color-neutral-1", "bg-neutral-50 color-auto"],
    ["preset-color-neutral-2", "bg-neutral-100 color-auto"],
    ["preset-color-neutral-3", "bg-neutral-200 color-auto"],
    ["preset-color-neutral-4", "bg-neutral-300 color-auto"],
    ["preset-color-neutral-5", "bg-neutral-400 color-auto"],
    ["preset-color-neutral-6", "bg-neutral-500 color-auto"],
    ["preset-color-neutral-7", "bg-neutral-600 color-auto"],
    ["preset-color-neutral-8", "bg-neutral-700 color-auto"],
    ["preset-color-neutral-9", "bg-neutral-900 color-auto"],

    ["preset-color-accent-1", "bg-accent-50 color-auto"],
    ["preset-color-accent-2", "bg-accent-100 color-auto"],
    ["preset-color-accent-3", "bg-accent-200 color-auto"],
    ["preset-color-accent-4", "bg-accent-300 color-auto"],
    ["preset-color-accent-5", "bg-accent-400 color-auto"],
    ["preset-color-accent-6", "bg-accent-500 color-auto"],
    ["preset-color-accent-7", "bg-accent-600 color-auto"],
    ["preset-color-accent-8", "bg-accent-700 color-auto"],
    ["preset-color-accent-9", "bg-accent-900 color-auto"],

    ["preset-color-primary-1", "bg-primary-50 color-auto"],
    ["preset-color-primary-2", "bg-primary-100 color-auto"],
    ["preset-color-primary-3", "bg-primary-200 color-auto"],
    ["preset-color-primary-4", "bg-primary-300 color-auto"],
    ["preset-color-primary-5", "bg-primary-400 color-auto"],
    ["preset-color-primary-6", "bg-primary-500 color-auto"],
    ["preset-color-primary-7", "bg-primary-600 color-auto"],
    ["preset-color-primary-8", "bg-primary-700 color-auto"],
    ["preset-color-primary-9", "bg-primary-900 color-auto"],

    ["preset-color-secondary-1", "bg-secondary-50 color-auto"],
    ["preset-color-secondary-2", "bg-secondary-100 color-auto"],
    ["preset-color-secondary-3", "bg-secondary-200 color-auto"],
    ["preset-color-secondary-4", "bg-secondary-300 color-auto"],
    ["preset-color-secondary-5", "bg-secondary-400 color-auto"],
    ["preset-color-secondary-6", "bg-secondary-500 color-auto"],
    ["preset-color-secondary-7", "bg-secondary-600 color-auto"],
    ["preset-color-secondary-8", "bg-secondary-700 color-auto"],
    ["preset-color-secondary-9", "bg-secondary-900 color-auto"],

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
    // ["color-auto", { color: "light-dark(white, black)" }],
    ["color-auto", { color: "var(--up-color-auto)" }],

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
