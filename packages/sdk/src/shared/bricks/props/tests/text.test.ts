import { describe, it, expect } from "vitest";
import { color, fontSize } from "../text";

describe("Text props test suite", () => {
  describe("color", () => {
    it("should have correct title and default values", () => {
      const prop = color();
      expect(prop.title).toBe("Color");
      expect(prop.schema.default).toBe("inherit");
    });

    it("should allow for custom default value and title", () => {
      const prop = color("#000", "Text color");
      expect(prop.schema.default).toBe("#000");
      expect(prop.title).toBe("Text color");
    });

    it("should have correct UI metadata", () => {
      const prop = color();
      expect(prop.schema["ui:field"]).toBe("color");
      expect(prop.schema["ui:color-type"]).toBe("text");
    });
  });

  describe("fontSize", () => {
    it("should have correct title and default values", () => {
      const prop = fontSize();
      expect(prop.title).toBe("Font size");
      expect(prop.schema.default).toBe("inherit");
    });

    it("should have correct UI metadata", () => {
      const prop = fontSize();
      expect(prop.schema["ui:field"]).toBe("text");
      expect(prop.schema["ui:input-type"]).toBe("size");
    });

    it("should allow for custom default value", () => {
      const prop = fontSize("16px");
      expect(prop.schema.default).toBe("16px");
    });
  });
});
