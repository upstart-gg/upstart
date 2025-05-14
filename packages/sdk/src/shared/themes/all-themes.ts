import type { Theme } from "../theme";

export const themes: Theme[] = [
  // Theme 1: Midnight Ocean
  {
    id: "midnight-ocean",
    name: "Midnight Ocean",
    description: "Deep blues and aqua accents inspired by ocean depths",
    tags: ["dark", "cool", "professional", "calm", "elegant", "oceanic", "serene"],
    browserColorScheme: "dark",
    colors: {
      // Base colors (dark blue backgrounds)
      base100: "oklch(0.15 0.04 250)", // Deep navy background
      base200: "oklch(0.12 0.05 250)", // Darker navy
      base300: "oklch(0.09 0.06 250)", // Almost black-blue
      // Content colors (light text)
      baseContent: "oklch(0.92 0.02 250)", // Soft blue-white
      // Primary colors (vibrant cyan)
      primary: "oklch(0.65 0.18 195)",
      primaryContent: "oklch(0.10 0.03 240)", // Dark text on primary
      // Secondary colors (subtle lavender)
      secondary: "oklch(0.55 0.12 280)",
      secondaryContent: "oklch(0.99 0.005 280)", // White text on secondary
      // Accent colors (teal highlight)
      accent: "oklch(0.70 0.15 170)",
      accentContent: "oklch(0.12 0.03 170)", // Dark text on accent
      // Neutral colors (slate blue-gray)
      neutral: "oklch(0.30 0.03 260)",
      neutralContent: "oklch(0.92 0.01 260)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
    },
  },

  // Theme 2: Desert Sunset
  {
    id: "desert-sunset",
    name: "Desert Sunset",
    description: "Warm earth tones with fiery accent highlights",
    tags: ["warm", "earthy", "natural", "cozy", "organic", "sunset", "rustic"],
    browserColorScheme: "light",
    colors: {
      // Base colors (sandy backgrounds)
      base100: "oklch(0.95 0.03 80)", // Pale sand background
      base200: "oklch(0.90 0.05 75)", // Deeper sand
      base300: "oklch(0.85 0.07 70)", // Terracotta undertone
      // Content colors (dark brown text)
      baseContent: "oklch(0.25 0.05 50)", // Rich earth brown
      // Primary colors (sunset orange)
      primary: "oklch(0.65 0.22 35)",
      primaryContent: "oklch(0.98 0.01 35)", // Light text on primary
      // Secondary colors (burgundy red)
      secondary: "oklch(0.48 0.18 20)",
      secondaryContent: "oklch(0.98 0.01 20)", // Light text on secondary
      // Accent colors (gold)
      accent: "oklch(0.80 0.15 85)",
      accentContent: "oklch(0.20 0.08 85)", // Dark text on accent
      // Neutral colors (muted olive)
      neutral: "oklch(0.45 0.08 110)",
      neutralContent: "oklch(0.96 0.01 110)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
    },
  },

  // Theme 3: Neon Cyberpunk
  {
    id: "neon-cyberpunk",
    name: "Neon Cyberpunk",
    description: "High contrast dark theme with electric neon accents",
    tags: ["dark", "futuristic", "high-contrast", "neon", "cyberpunk", "edgy", "tech"],
    browserColorScheme: "dark",
    colors: {
      // Base colors (dark backgrounds)
      base100: "oklch(0.12 0.02 270)", // Near-black with slight purple tone
      base200: "oklch(0.15 0.03 270)", // Very dark purple-gray
      base300: "oklch(0.18 0.04 270)", // Dark slate
      // Content colors (bright text)
      baseContent: "oklch(0.95 0.03 270)", // Very light lavender
      // Primary colors (electric green)
      primary: "oklch(0.75 0.30 140)",
      primaryContent: "oklch(0.10 0.02 140)", // Dark text on primary
      // Secondary colors (hot pink)
      secondary: "oklch(0.65 0.30 330)",
      secondaryContent: "oklch(0.10 0.02 330)", // Dark text on secondary
      // Accent colors (bright cyan)
      accent: "oklch(0.80 0.25 195)",
      accentContent: "oklch(0.10 0.02 195)", // Dark text on accent
      // Neutral colors (dark blue-gray)
      neutral: "oklch(0.25 0.05 250)",
      neutralContent: "oklch(0.90 0.03 250)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
    },
  },

  // Theme 4: Forest Haven
  {
    id: "forest-haven",
    name: "Forest Haven",
    description: "Lush greens and woodland colors for a natural, calming feel",
    tags: ["natural", "green", "organic", "calm", "fresh", "woodland", "peaceful"],
    browserColorScheme: "light",
    colors: {
      // Base colors (soft cream backgrounds)
      base100: "oklch(0.98 0.02 105)", // Very light green-cream
      base200: "oklch(0.94 0.03 105)", // Light moss tone
      base300: "oklch(0.90 0.04 105)", // Subtle sage
      // Content colors (deep forest text)
      baseContent: "oklch(0.20 0.07 145)", // Deep forest green
      // Primary colors (emerald green)
      primary: "oklch(0.55 0.18 145)",
      primaryContent: "oklch(0.98 0.01 145)", // Light text on primary
      // Secondary colors (autumn rust)
      secondary: "oklch(0.50 0.15 50)",
      secondaryContent: "oklch(0.98 0.01 50)", // Light text on secondary
      // Accent colors (golden yellow)
      accent: "oklch(0.85 0.15 90)",
      accentContent: "oklch(0.25 0.08 90)", // Dark text on accent
      // Neutral colors (muted blue-green)
      neutral: "oklch(0.40 0.06 180)",
      neutralContent: "oklch(0.95 0.01 180)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
    },
  },

  // Theme 5: Lavender Frost
  {
    id: "lavender-frost",
    name: "Lavender Frost",
    description: "Cool purples and soft pastels with icy accents",
    tags: ["pastel", "cool", "feminine", "gentle", "soothing", "dreamy", "subtle"],
    browserColorScheme: "light",
    colors: {
      // Base colors (soft lavender backgrounds)
      base100: "oklch(0.97 0.02 300)", // Very light lavender
      base200: "oklch(0.94 0.04 300)", // Soft lavender
      base300: "oklch(0.90 0.06 300)", // Medium lavender
      // Content colors (deep purple text)
      baseContent: "oklch(0.25 0.08 285)", // Deep purple
      // Primary colors (periwinkle)
      primary: "oklch(0.65 0.15 280)",
      primaryContent: "oklch(0.98 0.01 280)", // Light text on primary
      // Secondary colors (soft blue)
      secondary: "oklch(0.70 0.12 240)",
      secondaryContent: "oklch(0.20 0.05 240)", // Dark text on secondary
      // Accent colors (pink rose)
      accent: "oklch(0.75 0.14 350)",
      accentContent: "oklch(0.20 0.05 350)", // Dark text on accent
      // Neutral colors (cool gray-purple)
      neutral: "oklch(0.55 0.04 290)",
      neutralContent: "oklch(0.98 0.01 290)", // Light text on neutral
    },
    typography: {
      base: 16,
      heading: { type: "stack", family: "system-ui" },
      body: { type: "stack", family: "system-ui" },
    },
  },
];
