import { describe, it, expect } from "vitest";
import { opacity, textShadow } from "../effects";

describe("Effects props test suite", () => {
  describe("opacity", () => {
    it("should have correct title and default value", () => {
      const prop = opacity();
      expect(prop.title).toBe("Opacity");
      expect(prop.default).toBe(1);
    });

    it("should allow for custom default value", () => {
      const prop = opacity({ defaultValue: 0.5 });
      expect(prop.default).toBe(0.5);
    });

    it("should have correct UI metadata", () => {
      const prop = opacity();
      expect(prop["ui:field"]).toBe("slider");
      expect(prop.minimum).toBe(0.1);
      expect(prop.maximum).toBe(1);
      expect(prop.multipleOf).toBe(0.1);
    });
  });

  describe("textShadow", () => {
    it("should have correct title", () => {
      const prop = textShadow();
      expect(prop.title).toBe("Text shadow");
    });

    it("should have correct UI metadata", () => {
      const schema = textShadow();
      expect(schema["ui:field"]).toBe("enum");
    });
  });
});
