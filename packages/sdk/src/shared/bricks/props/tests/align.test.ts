import { describe, it, expect } from "vitest";
import { basicAlign } from "../align";

describe("Align prop test suite", () => {
  describe("basicAlign", () => {
    it("should have the correct title with default options", () => {
      expect(basicAlign().title).toBe("Align");
    });

    it("should have the correct title with custom options", () => {
      expect(basicAlign({ title: "Custom Align" }).title).toBe("Custom Align");
    });

    it("should have correct UI metadata", () => {
      const schema = basicAlign();
      expect(schema["ui:field"]).toBe("align-basic");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should accept custom default values", () => {
      const customDefault = {
        horizontal: "center",
        vertical: "start",
      };
      const schema = basicAlign({ default: customDefault });
      expect(schema.default).toEqual(customDefault);
    });
  });
});
