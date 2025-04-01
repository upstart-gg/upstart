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
    it("should have correct default values", () => {
      expect(borderSchema.default).toEqual({
        style: "border-solid",
        sides: [],
        width: "border-0",
        rounding: "rounded-auto",
      });
    });

    describe("border.style", () => {
      it("should have correct metadata", () => {
        const styleProp = borderSchema.properties.style;
        expect(styleProp.description).toBe("The brick border style");
        expect(styleProp["ui:field"]).toBe("enum");
        expect(styleProp["ui:display"]).toBe("button-group");
        expect(styleProp.default).toBe("border-solid");
      });
    });

    describe("border.color", () => {
      it("should have correct metadata", () => {
        const colorProp = borderSchema.properties.color;
        expect(colorProp["ui:field"]).toBe("color");
        expect(colorProp["ui:color-type"]).toBe("border");
      });
    });

    describe("border.width", () => {
      it("should have correct metadata", () => {
        const widthProp = borderSchema.properties.width;
        expect(widthProp["ui:field"]).toBe("enum");
        expect(widthProp.default).toBe("border-0");
      });
    });
  });
});
