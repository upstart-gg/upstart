import { describe, it, expect } from "vitest";
import { generateColorsVars } from "../color-system";
import { defaultTheme, type Theme } from "~/shared/theme";

const lightTheme: Theme = {
  id: "light",
  name: "Light Theme",
  tags: ["light"],
  typography: {
    base: 16,
    heading: { type: "stack", family: "system-ui" },
    body: { type: "stack", family: "system-ui" },
    alternatives: [],
  },
  description: "A light theme with oklch colors for better contrast and accessibility.",
  browserColorScheme: "light",
  // oklch colors for better contrast and accessibility
  colors: {
    primary: "oklch(0.5 0.1 240 / 1)",
    secondary: "oklch(0.4 0.1 120 / 1)",
    accent: "oklch(0.3 0.1 60 / 1)",
    neutral: "oklch(0.6 0.1 0 / 1)",
    base100: "oklch(0.95 0.1 0 / 1)",
    base200: "oklch(0.85 0.1 0 / 1)",
    base300: "oklch(0.75 0.1 0 / 1)",
  },
};

const darkTheme: Theme = {
  id: "dark",
  name: "Dark Theme",
  tags: ["dark"],
  typography: {
    base: 16,
    heading: { type: "stack", family: "system-ui" },
    body: { type: "stack", family: "system-ui" },
    alternatives: [],
  },
  description: "A dark theme with oklch colors for better contrast and accessibility.",
  browserColorScheme: "dark",
  // oklch colors for better contrast and accessibility
  colors: {
    primary: "oklch(0.2 0.1 240 / 1)",
    secondary: "oklch(0.3 0.1 120 / 1)",
    accent: "oklch(0.4 0.1 60 / 1)",
    neutral: "oklch(0.5 0.1 0 / 1)",
    base100: "oklch(0.15 0.1 0 / 1)",
    base200: "oklch(0.25 0.1 0 / 1)",
    base300: "oklch(0.35 0.1 0 / 1)",
  },
};

const redTheme: Theme = {
  id: "sunset-coral-glow",
  name: "Sunset Coral Glow",
  tags: ["warm", "coral", "sunset"],
  colors: {
    accent: "oklch(60 0.5 30)",
    base100: "oklch(99 0.05 0)",
    base200: "oklch(97 0.1 0)",
    base300: "oklch(95 0.15 0)",
    neutral: "oklch(95 0.2 5)",
    primary: "oklch(85 0.7 20)",
    secondary: "oklch(75 0.6 25)",
  },
  typography: {
    base: 16,
    body: {
      type: "google",
      family: "Raleway",
    },
    heading: {
      type: "google",
      family: "Pacifico",
    },
    alternatives: [],
  },
  browserColorScheme: "light",
  description: "",
};

describe("Color system test suite", () => {
  describe("generateColorsVars", () => {
    it("Should generate the correct colors for a light theme", () => {
      const colors = generateColorsVars(lightTheme);
      expect(colors["color-primary"]).toBe("oklch(0.5 0.1 240 / 1)");
      expect(colors["color-primary-content"]).toBe("#ffffff"); // White text on primary
      // Aliases
      expect(colors["color-primary-subtle"]).toBe(colors["color-primary-100"]);
      expect(colors["color-primary-light"]).toBe(colors["color-primary-300"]);
      expect(colors["color-primary-dark"]).toBe(colors["color-primary-700"]);

      // Various colors
      expect(colors["color-secondary"]).toBe("oklch(0.4 0.1 120 / 1)");
      expect(colors["color-secondary-content"]).toBe("#ffffff"); // White text on secondary
      expect(colors["color-accent"]).toBe("oklch(0.3 0.1 60 / 1)");
      expect(colors["color-accent-content"]).toBe("#ffffff"); // White text on accent
      expect(colors["color-neutral"]).toBe("oklch(0.6 0.1 0 / 1)");
      expect(colors["color-neutral-content"]).toBe("#ffffff"); // White text on neutral
      expect(colors["color-base-100"]).toBe("oklch(0.95 0.1 0 / 1)");
      expect(colors["color-base-200"]).toBe("oklch(0.85 0.1 0 / 1)");
      expect(colors["color-base-300"]).toBe("oklch(0.75 0.1 0 / 1)");

      // All shades should be present
      expect(Object.keys(colors)).toContain("color-primary-50");
      expect(Object.keys(colors)).toContain("color-primary-100");
      expect(Object.keys(colors)).toContain("color-primary-200");
      expect(Object.keys(colors)).toContain("color-primary-300");
      expect(Object.keys(colors)).toContain("color-primary-400");
      expect(Object.keys(colors)).toContain("color-primary-500");
      expect(Object.keys(colors)).toContain("color-primary-600");
      expect(Object.keys(colors)).toContain("color-primary-700");
      expect(Object.keys(colors)).toContain("color-primary-800");
      expect(Object.keys(colors)).toContain("color-primary-900");
    });
    it("Should generate the correct colors for a dark theme", () => {
      const colors = generateColorsVars(darkTheme);
      expect(colors["color-primary"]).toBe("oklch(0.2 0.1 240 / 1)");
      expect(colors["color-primary-content"]).toBe("#ffffff"); // White text on primary
      // Aliases
      expect(colors["color-primary-subtle"]).toBe(colors["color-primary-100"]);
      expect(colors["color-primary-light"]).toBe(colors["color-primary-300"]);
      expect(colors["color-primary-dark"]).toBe(colors["color-primary-700"]);

      // Various colors
      expect(colors["color-secondary"]).toBe("oklch(0.3 0.1 120 / 1)");
      expect(colors["color-secondary-content"]).toBe("#ffffff"); // White text on secondary
      expect(colors["color-accent"]).toBe("oklch(0.4 0.1 60 / 1)");
      expect(colors["color-accent-content"]).toBe("#ffffff"); // White text on accent
      expect(colors["color-neutral"]).toBe("oklch(0.5 0.1 0 / 1)");
      expect(colors["color-neutral-content"]).toBe("#ffffff"); // White text on neutral
      expect(colors["color-base-100"]).toBe("oklch(0.15 0.1 0 / 1)");
      expect(colors["color-base-200"]).toBe("oklch(0.25 0.1 0 / 1)");
      expect(colors["color-base-300"]).toBe("oklch(0.35 0.1 0 / 1)");

      // All shades should be present
      expect(Object.keys(colors)).toContain("color-primary-50");
      expect(Object.keys(colors)).toContain("color-primary-100");
      expect(Object.keys(colors)).toContain("color-primary-200");
      expect(Object.keys(colors)).toContain("color-primary-300");
      expect(Object.keys(colors)).toContain("color-primary-400");
      expect(Object.keys(colors)).toContain("color-primary-500");
      expect(Object.keys(colors)).toContain("color-primary-600");
      expect(Object.keys(colors)).toContain("color-primary-700");
      expect(Object.keys(colors)).toContain("color-primary-800");
      expect(Object.keys(colors)).toContain("color-primary-900");
    });
    it('should not generate "none" oklch values for the dark theme', () => {
      const colors = generateColorsVars(darkTheme);

      expect(colors["color-primary"], "color primary contains none").not.toContain("none");
      expect(colors["color-primary-500"], "color-primary-500 contains none").not.toContain("none");
      expect(colors["color-primary-200"], "color-primary-200 contains none").not.toContain("none");
      expect(colors["color-primary-content"], "color-primary-content contains none").not.toContain("none");
      expect(colors["color-secondary"], "color-secondary contains none").not.toContain("none");
      expect(colors["color-secondary-500"], "color-secondary-500 contains none").not.toContain("none");
      expect(colors["color-secondary-200"], "color-secondary-200 contains none").not.toContain("none");
      expect(colors["color-secondary-content"], "color-secondary-content contains none").not.toContain(
        "none",
      );
      expect(colors["color-accent"], "color-accent contains none").not.toContain("none");
      expect(colors["color-accent-content"], "color-accent-content contains none").not.toContain("none");
      expect(colors["color-neutral"], "color-neutral contains none").not.toContain("none");
      expect(colors["color-neutral-content"], "color-neutral-content contains none").not.toContain("none");
      expect(colors["color-base-100"], "color-base-100 contains none").not.toContain("none");
      expect(colors["color-base-200"], "color-base-200 contains none").not.toContain("none");
      expect(colors["color-base-300"], "color-base-300 contains none").not.toContain("none");
    });
    it("should generate color vars for defaultTheme", () => {
      const colors = generateColorsVars(defaultTheme);
      expect(colors["color-primary"]).toBe("#FF6F20");
    });
  });
});
