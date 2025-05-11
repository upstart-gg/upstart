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
  ignorelist: [/^btn-*/],
  presets: [
    presetAutoprefix(),
    presetTailwind({ disablePreflight: false }),
    presetContainerQueries(),
    presetExt(),
    presetLineClamp(),
    presetForms(),
    presetTypo(),
  ],
  variants: [
    ["hasChildMenudHover", "&:has(.container-menu-wrapper:hover)"],
    ["empty", "&:not(:has(*))"],
  ],
  rules: [
    [
      "brick",
      {
        borderRadius: "inherit",
      },
    ],
    [
      "rounded-auto",
      {
        borderRadius: "inherit",
        "&:first-child": {
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
        },
        "&:last-child": {
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        },
        "&:not(:first-child):not(:last-child)": {
          borderRadius: "0px",
        },
      },
    ],
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
      /^bg-color-\[([\S]+)\]$/,
      ({ 1: $1 }) => ({ "--up-bg-color": `${$1}`, backgroundColor: "var(--up-bg-color)" }),
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

    [
      "preset-bg-solid-primary-1",
      {
        "--up-bg-color": "var(--color-primary-100)",
        backgroundImage: "none",
        backgroundColor: "var(--color-primary-100)",
      },
    ],
    [
      "preset-bg-solid-primary-2",
      {
        "--up-bg-color": "var(--color-primary-200)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-primary-3",
      {
        "--up-bg-color": "var(--color-primary-400)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-primary-4",
      {
        "--up-bg-color": "var(--color-primary-600)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],

    [
      "preset-bg-solid-secondary-1",
      {
        "--up-bg-color": "var(--color-secondary-100)",
        backgroundImage: "none",
        backgroundColor: "var(--color-secondary-100)",
      },
    ],
    [
      "preset-bg-solid-secondary-2",
      {
        "--up-bg-color": "var(--color-secondary-200)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-secondary-3",
      {
        "--up-bg-color": "var(--color-secondary-400)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-secondary-4",
      {
        "--up-bg-color": "var(--color-secondary-600)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-accent-1",
      {
        "--up-bg-color": "var(--color-accent-100)",
        backgroundImage: "none",
        backgroundColor: "var(--color-accent-100)",
      },
    ],
    [
      "preset-bg-solid-accent-2",
      {
        "--up-bg-color": "var(--color-accent-200)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-accent-3",
      {
        "--up-bg-color": "var(--color-accent-400)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-accent-4",
      {
        "--up-bg-color": "var(--color-accent-600)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],

    [
      "preset-bg-solid-neutral-1",
      {
        "--up-bg-color": "var(--color-neutral-100)",
        backgroundImage: "none",
        backgroundColor: "var(--color-neutral-100)",
      },
    ],
    [
      "preset-bg-solid-neutral-2",
      {
        "--up-bg-color": "var(--color-neutral-200)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-neutral-3",
      {
        "--up-bg-color": "var(--color-neutral-400)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],
    [
      "preset-bg-solid-neutral-4",
      {
        "--up-bg-color": "var(--color-neutral-600)",
        backgroundImage: "none",
        backgroundColor: "var(--up-bg-color)",
      },
    ],

    [
      "preset-bg-gradient-primary-1",
      {
        "--up-bg-color": "var(--color-primary-200)",
        backgroundImage: "linear-gradient(to top, var(--color-primary-200), var(--color-primary-100))",
      },
    ],
    [
      "preset-bg-gradient-primary-2",
      {
        "--up-bg-color": "var(--color-primary-400)",
        backgroundImage: "linear-gradient(to top, var(--color-primary-400), var(--color-primary-300))",
      },
    ],
    [
      "preset-bg-gradient-primary-3",
      {
        "--up-bg-color": "var(--color-primary-600)",
        backgroundImage: "linear-gradient(to top, var(--color-primary-600), var(--color-primary-500))",
      },
    ],
    [
      "preset-bg-gradient-primary-4",
      {
        "--up-bg-color": "var(--color-primary-800)",
        backgroundImage: "linear-gradient(to top, var(--color-primary-800), var(--color-primary-700))",
      },
    ],

    [
      "preset-bg-gradient-secondary-1",
      {
        "--up-bg-color": "var(--color-secondary-200)",
        backgroundImage: "linear-gradient(to top, var(--color-secondary-200), var(--color-secondary-100))",
      },
    ],

    [
      "preset-bg-gradient-secondary-2",
      {
        "--up-bg-color": "var(--color-secondary-400)",
        backgroundImage: "linear-gradient(to top, var(--color-secondary-400), var(--color-secondary-300))",
      },
    ],

    [
      "preset-bg-gradient-secondary-3",
      {
        "--up-bg-color": "var(--color-secondary-600)",
        backgroundImage: "linear-gradient(to top, var(--color-secondary-600), var(--color-secondary-500))",
      },
    ],

    [
      "preset-bg-gradient-secondary-4",
      {
        "--up-bg-color": "var(--color-secondary-800)",
        backgroundImage: "linear-gradient(to top, var(--color-secondary-800), var(--color-secondary-700))",
      },
    ],
    [
      "preset-bg-gradient-accent-1",
      {
        "--up-bg-color": "var(--color-accent-200)",
        backgroundImage: "linear-gradient(to top, var(--color-accent-200), var(--color-accent-100))",
      },
    ],

    [
      "preset-bg-gradient-accent-2",
      {
        "--up-bg-color": "var(--color-accent-400)",
        backgroundImage: "linear-gradient(to top, var(--color-accent-400), var(--color-accent-300))",
      },
    ],

    [
      "preset-bg-gradient-accent-3",
      {
        "--up-bg-color": "var(--color-accent-600)",
        backgroundImage: "linear-gradient(to top, var(--color-accent-600), var(--color-accent-500))",
      },
    ],

    [
      "preset-bg-gradient-accent-4",
      {
        "--up-bg-color": "var(--color-accent-800)",
        backgroundImage: "linear-gradient(to top, var(--color-accent-800), var(--color-accent-700))",
      },
    ],

    [
      "preset-bg-gradient-neutral-1",
      {
        "--up-bg-color": "var(--color-neutral-200)",
        backgroundImage: "linear-gradient(to top, var(--color-neutral-200), var(--color-neutral-100))",
      },
    ],

    [
      "preset-bg-gradient-neutral-2",
      {
        "--up-bg-color": "var(--color-neutral-400)",
        backgroundImage: "linear-gradient(to top, var(--color-neutral-400), var(--color-neutral-300))",
      },
    ],

    [
      "preset-bg-gradient-neutral-3",
      {
        "--up-bg-color": "var(--color-neutral-600)",
        backgroundImage: "linear-gradient(to top, var(--color-neutral-600), var(--color-neutral-500))",
      },
    ],

    [
      "preset-bg-gradient-neutral-4",
      {
        "--up-bg-color": "var(--color-neutral-800)",
        backgroundImage: "linear-gradient(to top, var(--color-neutral-800), var(--color-neutral-700))",
      },
    ],

    [
      "preset-border-color-auto",
      {
        borderColor: "hsl(from var(--up-bg-color) h s calc(l - 10))",
      },
    ],

    ["preset-border-primary-1", { borderColor: `var(--color-primary-100)` }],
    ["preset-border-primary-2", { borderColor: `var(--color-primary-300)` }],
    ["preset-border-primary-3", { borderColor: `var(--color-primary-500)` }],
    ["preset-border-primary-4", { borderColor: `var(--color-primary-700)` }],

    ["preset-border-secondary-1", { borderColor: `var(--color-secondary-100)` }],
    ["preset-border-secondary-2", { borderColor: `var(--color-secondary-300)` }],
    ["preset-border-secondary-3", { borderColor: `var(--color-secondary-500)` }],
    ["preset-border-secondary-4", { borderColor: `var(--color-secondary-700)` }],

    ["preset-border-accent-1", { borderColor: `var(--color-accent-100)` }],
    ["preset-border-accent-2", { borderColor: `var(--color-accent-300)` }],
    ["preset-border-accent-3", { borderColor: `var(--color-accent-500)` }],
    ["preset-border-accent-4", { borderColor: `var(--color-accent-700)` }],

    ["preset-border-neutral-1", { borderColor: `var(--color-neutral-100)` }],
    ["preset-border-neutral-2", { borderColor: `var(--color-neutral-300)` }],
    ["preset-border-neutral-3", { borderColor: `var(--color-neutral-500)` }],
    ["preset-border-neutral-4", { borderColor: `var(--color-neutral-700)` }],

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

    ["hero", { "&::first-line": { lineHeight: "1", margin: "0" } }],
    ["hero-size-1", { fontSize: "clamp(2.25rem, 1.467rem + 3.913vw, 4.5rem)", lineHeight: "1.1" }],
    ["hero-size-2", { fontSize: "clamp(3.5rem, 2.717rem + 3.913vw, 5.75rem)", lineHeight: "1.1" }],
    ["hero-size-3", { fontSize: "clamp(4.75rem, 3.967rem + 3.913vw, 7rem)", lineHeight: "1.1" }],
    ["hero-size-4", { fontSize: "clamp(6rem, 5.217rem + 3.913vw, 8.25rem)", lineHeight: "1.1" }],
    ["hero-size-5", { fontSize: "clamp(7.25rem, 6.467rem + 3.913vw, 9.5rem)", lineHeight: "1.1" }],

    ["text-shadow-none", { textShadow: "none" }],
    ["text-shadow-sm", { textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)" }],
    ["text-shadow-md", { textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }],
    ["text-shadow-lg", { textShadow: "0 4px 8px rgba(0, 0, 0, 0.25)" }],
    ["text-shadow-xl", { textShadow: "0 6px 12px rgba(0, 0, 0, 0.3)" }],

    ["text-pretty", { textWrap: "pretty" }],
    ["text-balance", { textWrap: "balance" }],
    ["text-nowrap", { textWrap: "nowrap" }],

    ["scrollbar-thin", { scrollbarWidth: "thin" }],
    ["scrollbar-color-", ({ $$ }) => ({ scrollbarColor: `var(--${$$}-6) var(--${$$}-surface)` })],
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
