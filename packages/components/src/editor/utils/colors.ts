import { chroma } from "@upstart.gg/sdk/themes/color-system";

export type RelationshipType = "same-hue" | "analogous" | "temperature" | "complementary";

/**
 * Generates a related neutral color from an OKLCH primary color
 * @param oklchColor - OKLCH color string like "oklch(70% 0.15 200)"
 * @param relationship - Type of relationship to create
 * @returns OKLCH string for the neutral color
 */
export function generateRelatedNeutral(
  oklchColor: string,
  relationship: RelationshipType = "same-hue",
): string {
  try {
    // Convert OKLCH to a format chroma.js can handle better
    // First convert to hex, then work with that
    const primaryColor = chroma(oklchColor);

    // Get HSL for easier hue manipulation
    const hsl = primaryColor.hsl();
    const [h, s, l] = hsl;

    let neutralHue: number;
    let neutralSaturation: number;
    const neutralLightness = 45; // 45% lightness for neutral

    switch (relationship) {
      case "same-hue":
        // Keep the exact same hue, but very desaturated
        neutralHue = h;
        neutralSaturation = 0.05; // Fixed low saturation
        break;

      case "analogous":
        // Shift hue by 60 degrees for clear distinction
        neutralHue = (h + 60) % 360;
        neutralSaturation = 0.08; // Slightly more saturated for visibility
        break;

      case "temperature": {
        // Create distinctly warm or cool neutral regardless of primary
        const isWarmPrimary = h >= 30 && h <= 150; // Narrower warm range
        if (isWarmPrimary) {
          // For warm primary, use distinctly cool neutral
          neutralHue = 210; // Cool blue
          neutralSaturation = 0.12;
        } else {
          // For cool primary, use distinctly warm neutral
          neutralHue = 30; // Warm orange-brown
          neutralSaturation = 0.12;
        }
        break;
      }

      case "complementary":
        // Use true complementary hue with moderate saturation
        neutralHue = (h + 180) % 360;
        neutralSaturation = 0.1; // More saturated to show the complementary relationship
        break;

      default:
        console.warn("Unknown relationship type, defaulting to same-hue");
        neutralHue = h;
        neutralSaturation = 0.05;
    }

    // Create the neutral color using chroma.js HSL
    const neutralColor = chroma.hsl(neutralHue, neutralSaturation, neutralLightness / 100);

    // Return as OKLCH string
    // @ts-ignore oklch is a valid color format
    return neutralColor.css("oklch");
  } catch (error) {
    console.warn("Error generating related neutral:", error);
    // Fallback to a safe neutral gray
    return "oklch(45% 0.02 240)";
  }
}
