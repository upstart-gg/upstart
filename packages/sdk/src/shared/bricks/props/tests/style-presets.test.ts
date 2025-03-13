import { describe, it, expect } from "vitest";
import { stylePreset, getPresetStyles } from "../_style-presets";

describe("Style presets test suite", () => {
  describe("stylePreset schema", () => {
    it("should have correct type", () => {
      expect(stylePreset.type).toBe("object");
    });

    it("should have style and variant properties", () => {
      expect(stylePreset.properties).toHaveProperty("style");
      expect(stylePreset.properties).toHaveProperty("variant");
    });

    it("should have ui:field metadata", () => {
      expect(stylePreset["ui:field"]).toBe("hidden");
    });

    describe("style property", () => {
      it("should have correct enum values", () => {
        const styleProp = stylePreset.properties.style;
        expect(styleProp.enum).toContain("ghost");
        expect(styleProp.enum).toContain("plain");
        expect(styleProp.enum).toContain("modern");
        expect(styleProp.enum).toContain("soft");
        expect(styleProp.enum).toContain("glass");
        expect(styleProp.enum).toContain("elevated");
        expect(styleProp.enum).toContain("outlined");
        expect(styleProp.enum).toContain("paper");
        expect(styleProp.enum).toContain("gradient");
        expect(styleProp.enum).toContain("callout");
      });
    });

    describe("variant property", () => {
      it("should have correct enum values", () => {
        const variantProp = stylePreset.properties.variant;
        expect(variantProp.enum).toContain("primary");
        expect(variantProp.enum).toContain("secondary");
        expect(variantProp.enum).toContain("accent");
        expect(variantProp.enum).toContain("neutral");
      });
    });
  });

  describe("getPresetStyles function", () => {
    it("should return correct styles for ghost preset", () => {
      const styles = getPresetStyles({ style: "ghost", variant: "primary" });

      expect(styles.background).toEqual({
        color: "transparent",
      });
      expect(styles.border).toEqual({
        width: "border-0",
      });
      expect(styles.color).toBe("text-primary-900");
    });

    it("should return correct styles for plain preset", () => {
      const styles = getPresetStyles({ style: "plain", variant: "secondary" });

      expect(styles.background).toEqual({
        color: "bg-secondary-600",
      });
      expect(styles.border).toEqual({
        color: "border-secondary-900",
        style: "border-solid",
        width: "border",
        radius: "rounded-sm",
      });
      expect(styles.shadow).toBe("shadow-sm");
      expect(styles.color).toBe("text-secondary-50");
    });

    it("should return correct styles for elevated preset", () => {
      const styles = getPresetStyles({ style: "elevated", variant: "accent" });

      expect(styles.background).toEqual({
        color: "bg-accent-100",
      });
      expect(styles.shadow).toBe("shadow-lg");
      expect(styles.color).toBe("text-accent-900");
    });

    it("should return correct styles for gradient preset", () => {
      const styles = getPresetStyles({ style: "gradient", variant: "neutral" });

      expect(styles.background).toEqual({
        color: "bg-gradient-to-tr from-neutral-200 to-neutral-50",
      });
      expect(styles.border).toEqual({
        color: "border-neutral-200",
        style: "border-solid",
        width: "border",
        radius: "rounded-md",
      });
      expect(styles.color).toBe("text-neutral-900");
    });

    it("should handle neutral variant text color differently for plain preset", () => {
      const styles = getPresetStyles({ style: "plain", variant: "neutral" });
      expect(styles.color).toBe("text-neutral-800");
    });
  });
});
