import { describe, it, expect } from "vitest";
import { border } from "../border";

describe("Border prop test suite", () => {
  const borderSchema = border();

  describe("propBorder", () => {
    it("should have the correct title", () => {
      expect(border().title).toBe("Border");
    });
  });

  describe("border schema", () => {
    it("should have correct UI metadata", () => {
      expect(borderSchema["ui:field"]).toBe("border");
      expect(borderSchema["ui:inspector-tab"]).toBe("style");
    });

    it("should have correct default values", () => {
      expect(borderSchema.default).toEqual({
        radius: "rounded-none",
        style: "border-solid",
        color: "#000",
        width: "border-0",
      });
    });

    describe("border.style", () => {
      it("should have correct metadata", () => {
        const styleProp = borderSchema.properties.style;
        expect(styleProp.$id).toBe("borderStyle");
        expect(styleProp.title).toBe("Border style");
        expect(styleProp.description).toBe("The brick border style");
        expect(styleProp["ui:field"]).toBe("enum");
        expect(styleProp["ui:display"]).toBe("button-group");
        expect(styleProp.default).toBe("border-solid");
      });
    });

    describe("border.color", () => {
      it("should have correct metadata", () => {
        const colorProp = borderSchema.properties.color;
        expect(colorProp.$id).toBe("borderColor");
        expect(colorProp.title).toBe("Border color");
        expect(colorProp["ui:field"]).toBe("color");
        expect(colorProp["ui:color-type"]).toBe("border");
        expect(colorProp.default).toBe("transparent");
      });
    });

    describe("border.width", () => {
      it("should have correct metadata", () => {
        const widthProp = borderSchema.properties.width;
        expect(widthProp.$id).toBe("borderWidth");
        expect(widthProp.title).toBe("Border width");
        expect(widthProp["ui:field"]).toBe("enum");
        expect(widthProp["ui:display"]).toBe("button-group");
        expect(widthProp.default).toBe("border-0");
      });
    });
  });
});
