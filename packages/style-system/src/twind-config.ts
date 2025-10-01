import { defineConfig } from "@twind/core";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetContainerQueries from "@twind/preset-container-queries";
import presetExt from "@twind/preset-ext";
import presetLineClamp from "@twind/preset-line-clamp";
import presetTailwind from "@twind/preset-tailwind";
import presetForms from "@twind/preset-tailwind-forms";
import presetTypo from "@twind/preset-typography";
import { colorPalette } from "./colors";

export default defineConfig({
  darkMode: "media",
  // ignorelist: [/^btn-*/],
  presets: [
    presetAutoprefix(),
    presetTailwind({ disablePreflight: false }),
    presetContainerQueries(),
    presetExt(),
    presetLineClamp(),
    presetForms({
      // strategy: "class",
      // We use the `btn` class for buttons, so we don't want to apply the default button styles
      // to avoid conflicts with our custom button styles.
      //
    }),
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
      "dynamic-field",
      "bg-upstart-200/50 text-black/80 text-[90%] py-0.5 inline-block outline outline-upstart-50 px-1.5 rounded mx-0.5",
    ],
    [
      "btn",
      "text-nowrap font-semibold min-h-fit max-h-fit flex items-center text-center justify-center flex-wrap text-ellipsis py-[0.55em] px-[1em]",
    ],
    [
      "btn-",
      ({ $$ }) => ({
        backgroundColor: `var(--color-${$$})`,
        color: `var(--color-${$$}-content)`,
      }),
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
      "bg-primary-gradient-",
      ({ $$ }) => `@(from-primary-${$$} to-primary-${parseInt($$) + 100})`, // e.g. from-primary-100 to-primary-200,
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
    ["text-base", { color: "var(--color-base-content)" }],
    ["text-base-content", { color: "var(--color-base-content)" }],
    ["text-neutral-", ({ $$ }) => ({ color: `var(--color-neutral-${$$})` })],
    ["text-accent-", ({ $$ }) => ({ color: `var(--color-accent-${$$})` })],
    ["text-primary-", ({ $$ }) => ({ color: `var(--color-primary-${$$})` })],
    ["text-secondary-", ({ $$ }) => ({ color: `var(--color-secondary-${$$})` })],
    ["text-base-", ({ $$ }) => ({ color: `var(--color-base-${$$})` })],

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
    [
      "hero-size-1",
      { fontSize: "clamp(2.5rem, 1.5rem + 3.913cqw, 4rem)", lineHeight: "1.05", fontWeight: "800" },
    ],
    [
      "hero-size-2",
      { fontSize: "clamp(3rem, 2rem + 3.913cqw, 4.5rem)", lineHeight: "1.05", fontWeight: "bold" },
    ],
    [
      "hero-size-3",
      { fontSize: "clamp(3.5rem, 2.5rem + 3.913cqw, 5rem)", lineHeight: "1.05", fontWeight: "bold" },
    ],
    [
      "hero-size-4",
      { fontSize: "clamp(4rem, 3rem + 3.913cqw, 5.5rem)", lineHeight: "1.05", fontWeight: "bold" },
    ],
    [
      "hero-size-5",
      { fontSize: "clamp(4.5rem, 3.5rem + 3.913cqw, 6rem)", lineHeight: "1.05", fontWeight: "bold" },
    ],

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
      fontSize: {
        "fluid-xs": "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)",
        "fluid-base": "clamp(1rem, 0.9rem + 0.5vw, 1.25rem)",
        "fluid-lg": "clamp(1.125rem, 1rem + 0.625vw, 1.5rem)",
        "fluid-xl": "clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)",
        "fluid-2xl": "clamp(1.5rem, 1.3rem + 1vw, 2.25rem)",
        "fluid-3xl": "clamp(1.875rem, 1.6rem + 1.375vw, 2.75rem)",
        "fluid-4xl": "clamp(2.25rem, 1.9rem + 1.75vw, 3.5rem)",
        "fluid-5xl": "clamp(3rem, 2.5rem + 2.5vw, 4.5rem)",
        "fluid-6xl": "clamp(3.75rem, 3rem + 3.75vw, 6rem)",
      },
      containers: {
        mobile: "1px",
        desktop: "1024px",
      },
      animation: {
        "fade-in": "fade-in 0.5s",
        "elastic-pop": "elastic-pop 1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "reveal-brick": "reveal-brick 1.5s ease forwards",
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
        "reveal-brick": {
          "0%": { transform: "scale(0)", opacity: "0", filter: "blur(20px)" },
          "50%": { transform: "scale(1)", opacity: "0.7", filter: "blur(10px)" },
          "100%": { transform: "scale(1)", opacity: "1", filter: "blur(0)" },
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

function em(px: number, base: number) {
  return `${(px / base).toFixed(3).replace(/^0|\.?0+$/g, "")}em`;
}
