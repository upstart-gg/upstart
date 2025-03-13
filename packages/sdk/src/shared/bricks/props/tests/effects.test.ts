import { describe, it, expect } from "vitest";
import { opacity, shadow, textShadow } from "../effects";

describe("Effects props test suite", () => {
  describe("opacity", () => {
    it("should have correct title and default value", () => {
      const prop = opacity();
      expect(prop.title).toBe("Opacity");
      expect(prop.schema.default).toBe(1);
    });

    it("should allow for custom default value", () => {
      const prop = opacity({ defaultValue: 0.5 });
      expect(prop.schema.default).toBe(0.5);
    });

    it("should have correct UI metadata", () => {
      const prop = opacity();
      expect(prop.schema["ui:field"]).toBe("range");
      expect(prop.schema.minimum).toBe(0);
      expect(prop.schema.maximum).toBe(1);
      expect(prop.schema.multipleOf).toBe(0.01);
    });
  });

  describe("textShadow", () => {
    it("should have correct title", () => {
      const prop = textShadow();
      expect(prop.title).toBe("Text shadow");
    });

    it("should have correct schema structure", () => {
      const schema = textShadow().schema;
      expect(schema.type).toBe("object");
      expect(schema).toHaveProperty("properties.type");
      expect(schema).toHaveProperty("properties.color");
      expect(schema).toHaveProperty("properties.blur");
      expect(schema).toHaveProperty("properties.x");
      expect(schema).toHaveProperty("properties.y");
    });

    it("should have correct UI metadata", () => {
      const schema = textShadow().schema;
      expect(schema["ui:field"]).toBe("shadow");
      expect(schema["ui:shadow-type"]).toBe("text");
      expect(schema["ui:group"]).toBe("text-shadow");
      expect(schema["ui:group:title"]).toBe("Text shadow");
      expect(schema["ui:inspector-tab"]).toBe("style");
    });

    it("should have correct default values", () => {
      const schema = textShadow().schema;
      expect(schema.default).toEqual({
        type: "none",
        color: "rgba(0,0,0,0.5)",
        x: "0px",
        y: "0px",
        blur: "0px",
      });
    });
  });
});
