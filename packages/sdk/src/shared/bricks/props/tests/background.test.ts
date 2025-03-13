import { describe, it, expect } from "vitest";
import { background, backgroundColor } from "../background";

describe("Background prop test suite", () => {
  describe("background", () => {
    it("should have the correct title", () => {
      expect(background().title).toBe("Background");
    });

    it("should have correct schema structure", () => {
      const schema = background().schema;
      expect(schema.type).toBe("object");
      expect(schema).toHaveProperty("properties.color");
      expect(schema).toHaveProperty("properties.image");
      expect(schema).toHaveProperty("properties.size");
      expect(schema).toHaveProperty("properties.repeat");
    });

    it("should have correct UI metadata", () => {
      const schema = background().schema;
      expect(schema["ui:field"]).toBe("background");
      expect(schema["ui:group"]).toBe("background");
      expect(schema["ui:group:title"]).toBe("Background");
      expect(schema["ui:inspector-tab"]).toBe("style");
      expect(schema["ui:show-img-search"]).toBe(true);
    });

    it("should have correct default values", () => {
      const schema = background().schema;
      expect(schema.default).toEqual({
        color: "transparent",
        size: "auto",
        repeat: "no-repeat",
      });
    });

    it("should accept custom default values", () => {
      const customBg = background({
        defaultValue: {
          color: "#000000",
          size: "cover",
          repeat: "repeat",
        },
      });
      expect(customBg.schema.default).toEqual({
        color: "#000000",
        size: "cover",
        repeat: "repeat",
      });
    });

    it("should accept custom title", () => {
      const customBg = background({ title: "Custom Title" });
      expect(customBg.title).toBe("Custom Title");
    });

    describe("color property", () => {
      it("should have correct metadata", () => {
        const colorProp = background().schema.properties.color;
        expect(colorProp.title).toBe("Color");
        expect(colorProp.type).toBe("string");
        expect(colorProp.default).toBe("transparent");
      });
    });

    describe("image property", () => {
      it("should have correct metadata", () => {
        const imageProp = background().schema.properties.image;
        expect(imageProp.title).toBe("Image");
        expect(imageProp.type).toBe("string");
      });
    });

    describe("size property", () => {
      it("should have correct metadata", () => {
        const sizeProp = background().schema.properties.size;
        expect(sizeProp.type).toBe("string");
        expect(sizeProp.default).toBe("auto");
        expect(sizeProp.enum).toContain("auto");
        expect(sizeProp.enum).toContain("cover");
        expect(sizeProp.enum).toContain("contain");
      });
    });

    describe("repeat property", () => {
      it("should have correct metadata", () => {
        const repeatProp = background().schema.properties.repeat;
        expect(repeatProp.type).toBe("string");
        expect(repeatProp.default).toBe("no-repeat");
        expect(repeatProp.enum).toContain("no-repeat");
        expect(repeatProp.enum).toContain("repeat");
        expect(repeatProp.enum).toContain("repeat-x");
        expect(repeatProp.enum).toContain("repeat-y");
        expect(repeatProp.enum).toContain("space");
        expect(repeatProp.enum).toContain("round");
      });
    });
  });

  describe("backgroundColor", () => {
    it("should have the correct title", () => {
      expect(backgroundColor().title).toBe("Background color");
    });

    it("should accept custom title", () => {
      expect(backgroundColor("red", "Custom Title").title).toBe("Custom Title");
    });

    it("should have correct schema structure", () => {
      const schema = backgroundColor().schema;
      expect(schema.type).toBe("string");
    });

    it("should have correct UI metadata", () => {
      const schema = backgroundColor().schema;
      expect(schema["ui:field"]).toBe("color");
      expect(schema["ui:color-type"]).toBe("background");
    });

    it("should have correct default value", () => {
      expect(backgroundColor().schema.default).toBe("transparent");
      expect(backgroundColor("red").schema.default).toBe("red");
    });
  });
});
