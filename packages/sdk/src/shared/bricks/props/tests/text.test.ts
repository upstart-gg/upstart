import { describe, it, expect } from "vitest";
import { color, fontSize } from "../text";

describe("Text props test suite", () => {
  describe("color", () => {
    it("should have correct title and default values", () => {
      const schema = color();
      expect(schema.title).toBe("Text color");
      expect(schema.default).toBe("auto");
    });

    it("should allow for custom default value and title", () => {
      const schema = color("#000", "Text color");
      expect(schema.default).toBe("#000");
      expect(schema.title).toBe("Text color");
    });

    it("should have correct UI metadata", () => {
      const schema = color();
      expect(schema["ui:field"]).toBe("color");
      expect(schema["ui:color-type"]).toBe("text");
    });
  });

  describe("fontSize", () => {
    it("should have correct title and default values", () => {
      const schema = fontSize();
      expect(schema.title).toBe("Font size");
      expect(schema.default).toBe("inherit");
    });

    it("should have correct UI metadata", () => {
      const schema = fontSize();
      expect(schema["ui:field"]).toBe("enum");
    });

    it("should allow for custom default value", () => {
      const schema = fontSize("16px");
      expect(schema.default).toBe("16px");
    });
  });
});
