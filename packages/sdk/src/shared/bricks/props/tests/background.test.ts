import { describe, it, expect } from "vitest";
import { background, backgroundColor } from "../background";

describe("Background prop test suite", () => {
  describe("background", () => {
    it("should have the correct title", () => {
      expect(background().title).toBe("Background image");
    });

    it("should have correct schema structure", () => {
      const schema = background();
      expect(schema.type).toBe("object");
      expect(schema).toHaveProperty("properties.image");
      expect(schema).toHaveProperty("properties.size");
      expect(schema).toHaveProperty("properties.repeat");
    });

    it("should have correct UI metadata", () => {
      const schema = background();
      expect(schema["ui:field"]).toBe("background");
    });

    it("should accept custom default values", () => {
      const customBg = background({
        default: {
          size: "cover",
          repeat: "repeat",
          image: "https://example.com/image.jpg",
        },
      });
      expect(customBg.default).toEqual({
        size: "cover",
        repeat: "repeat",
        image: "https://example.com/image.jpg",
      });
    });

    it("should accept custom title", () => {
      const customBg = background({ title: "Custom Title" });
      expect(customBg.title).toBe("Custom Title");
    });

    describe("image property", () => {
      it("should have correct metadata", () => {
        const imageProp = background().properties.image;
        expect(imageProp.title).toBe("Image");
        expect(imageProp.type).toBe("string");
      });
    });

    describe("size property", () => {
      it("should have correct metadata", () => {
        const sizeProp = background().properties.size;
        expect(sizeProp.default).toBe("auto");
      });
    });

    describe("repeat property", () => {
      it("should have correct metadata", () => {
        const repeatProp = background().properties.repeat;
        expect(repeatProp.default).toBe("no-repeat");
      });
    });
  });

  describe("backgroundColor", () => {
    it("should have the correct title", () => {
      expect(backgroundColor().title).toBe("Background color");
    });

    it("should accept custom title", () => {
      expect(backgroundColor({ title: "Custom Title" }).title).toBe("Custom Title");
    });

    it("should have correct schema structure", () => {
      const schema = backgroundColor();
      expect(schema.type).toBe("string");
    });

    it("should have correct UI metadata", () => {
      const schema = backgroundColor();
      expect(schema["ui:field"]).toBe("color");
      expect(schema["ui:color-type"]).toBe("background");
    });

    it("should have correct default value", () => {
      expect(backgroundColor().default).toBeUndefined();
    });
  });
});
