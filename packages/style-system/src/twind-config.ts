import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetTailwind from "@twind/preset-tailwind";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetForms from "@twind/preset-tailwind-forms";
import presetTypo from "@twind/preset-typography";
import presetContainerQueries from "@twind/preset-container-queries";
import { colorPalette } from "./colors";

export default defineConfig({
  darkMode: "media",
  ignorelist: [/^btn-*/],
  presets: [
    presetAutoprefix(),
    presetTailwind({ disablePreflight: true }),
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
      "bg-primary",
      {
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-primary)`,
      },
    ],
    [
      "bg-secondary",
      {
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-secondary)`,
      },
    ],
    [
      "bg-accent",
      {
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-accent)`,
      },
    ],
    [
      "bg-neutral",
      {
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-neutral)`,
      },
    ],
    [
      "bg-base-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-base-${$$})`,
      }),
    ],
    [
      "bg-neutral-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-neutral-${$$})`,
      }),
    ],
    [
      "bg-accent-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-accent-${$$})`,
      }),
    ],
    [
      "bg-primary-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-primary-${$$})`,
      }),
    ],
    [
      "bg-secondary-",
      ({ $$ }) => ({
        backgroundColor: `var(--up-bg-color)`,
        "--up-bg-color": `var(--color-secondary-${$$})`,
      }),
    ],

    ["border-base-", ({ $$ }) => ({ borderColor: `color-mix(in lab, var(--color-base-${$$}), black 10%)` })],
    ["border-neutral-", ({ $$ }) => ({ borderColor: `var(--color-neutral-${$$})` })],
    ["border-accent-", ({ $$ }) => ({ borderColor: `var(--color-accent-${$$})` })],
    ["border-primary-", ({ $$ }) => ({ borderColor: `var(--color-primary-${$$})` })],
    ["border-secondary-", ({ $$ }) => ({ borderColor: `var(--color-secondary-${$$})` })],
    ["border-primary", { borderColor: `var(--color-primary)` }],
    ["border-secondary", { borderColor: `var(--color-secondary)` }],
    ["border-accent", { borderColor: `var(--color-accent)` }],
    ["border-neutral", { borderColor: `var(--color-neutral)` }],

    /**
     * Can be used with text-neutral-500, but also text-neutral-500-subtle, text-neutral-500-tonal-subtle, text-neutral-500-strong, etc.
     */
    ["text-primary", "@(text-primary-content)"],
    ["text-secondary", "@(text-secondary-content)"],
    ["text-accent", "@(text-accent-content)"],
    ["text-neutral", "@(text-neutral-content)"],
    ["text-base-content", { color: "var(--color-base-content)" }],
    ["text-neutral-", ({ $$ }) => ({ color: `var(--color-neutral-${$$})` })],
    ["text-accent-", ({ $$ }) => ({ color: `var(--color-accent-${$$})` })],
    ["text-primary-", ({ $$ }) => ({ color: `var(--color-primary-${$$})` })],
    ["text-secondary-", ({ $$ }) => ({ color: `var(--color-secondary-${$$})` })],

    ["outline-primary-", ({ $$ }) => ({ outlineColor: `var(--color-primary-${$$})` })],
    ["outline-secondary-", ({ $$ }) => ({ outlineColor: `var(--color-secondary-${$$})` })],
    ["outline-accent-", ({ $$ }) => ({ outlineColor: `var(--color-accent-${$$})` })],
    ["outline-neutral-", ({ $$ }) => ({ outlineColor: `var(--color-neutral-${$$})` })],

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

    [
      "striped-bg",
      {
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          rgba(0,0,0,.1) 0px,
          rgba(0,0,0,.1) 4px,
          transparent 4px,
          transparent 12px
        )`,
      },
    ],

    // missing object-position presets
    ["object-bottom-left", { objectPosition: "bottom left" }],
    ["object-bottom-right", { objectPosition: "bottom right" }],
    ["object-top-left", { objectPosition: "top left" }],
    ["object-top-right", { objectPosition: "top right" }],

    ["hero", { "&::first-line": { lineHeight: "1", margin: "0" } }],
    ["hero-size-1", { fontSize: "clamp(2.25rem, 1.467rem + 3.913cqw, 4.5rem)", lineHeight: "1.1" }],
    ["hero-size-2", { fontSize: "clamp(3.5rem, 2.717rem + 3.913cqw, 5.75rem)", lineHeight: "1.1" }],
    ["hero-size-3", { fontSize: "clamp(4.75rem, 3.967rem + 3.913cqw, 7rem)", lineHeight: "1.1" }],
    ["hero-size-4", { fontSize: "clamp(6rem, 5.217rem + 3.913cqw, 8.25rem)", lineHeight: "1.1" }],
    ["hero-size-5", { fontSize: "clamp(7.25rem, 6.467rem + 3.913cqw, 9.5rem)", lineHeight: "1.1" }],

    ["text-shadow-none", { textShadow: "none" }],
    ["text-shadow-sm", { textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)" }],
    ["text-shadow-md", { textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }],
    ["text-shadow-lg", { textShadow: "0 3px 6px rgba(0, 0, 0, 0.2)" }],
    ["text-shadow-xl", { textShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }],

    ["text-pretty", { textWrap: "pretty" }],
    ["text-balance", { textWrap: "balance" }],
    ["text-nowrap", { textWrap: "nowrap" }],

    ["scrollbar-thin", { scrollbarWidth: "thin" }],
    ["scrollbar-none", { scrollbarWidth: "none" }],
    ["scrollbar-gutter-stable", { scrollbarGutter: "stable" }],
    ["scrollbar-gutter-stable-both", { scrollbarGutter: "stable both-edges" }],
    ["scrollbar-color-", ({ $$ }) => ({ scrollbarColor: `var(--${$$}-8) var(--${$$}-surface)` })],

    // presets preview
    // ["primary", `@(bg-primary text-primary)`],
    // ["secondary", `@(bg-secondary text-secondary)`],
    // ["accent", `@(bg-accent text-accent)`],
    // ["neutral", `@(bg-neutral text-neutral-content)`],

    // ["surface-", ({ $$ }) => `@(bg-base-${$$}00 text-base-content)`],
    // ["prominent-", ({ $$ }) => `@(bg-${$$}-700 text-${$$})`],
    // ["medium-", ({ $$ }) => `@(bg-${$$}-200 text-${$$}-800)`],
    // ["subtle-", ({ $$ }) => `@(bg-${$$}-50 text-${$$}-800)`],

    // ["light", `@(bg-white text-base-content border-base-300)`],
  ],

  theme: {
    extend: {
      colors: {
        ...colorPalette,
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
        base: {
          default: "var(--color-base-100)",
          100: "var(--color-base-100)",
          200: "var(--color-base-200)",
          300: "var(--color-base-300)",
        },
        primary: {
          default: "var(--color-primary)",
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
          default: "var(--color-secondary)",
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
          default: "var(--color-accent)",
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
          default: "var(--color-neutral)",
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
        border: "border 4s linear infinite",
        "spin-blob": "spin-blob 20s linear infinite",
        background: "background 15s ease infinite",
      },
      keyframes: {
        background: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "spin-blob": {
          "0%": { transform: "rotate(0deg) scale(2)" },
          "25%": { transform: "rotate(.5turn) scale(6)" },
          "50%": { transform: "rotate(0turn) scale(6)" },
          "100%": { transform: "rotate(0deg) scale(2)" },
        },
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
        border: {
          from: { "--border-angle": "0deg" },
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
});
