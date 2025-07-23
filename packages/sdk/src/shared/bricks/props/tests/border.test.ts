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
    describe("border.style", () => {
      it("should have correct metadata", () => {
        const styleProp = borderSchema.properties.style;
        expect(styleProp.description).toBe("The brick border style");
        expect(styleProp["ui:field"]).toBe("enum");
        expect(styleProp["ui:display"]).toBe("button-group");
      });
    });

    // describe("border.color", () => {
    //   it("should have correct metadata", () => {
    //     const colorProp = borderSchema.properties.color;
    //     expect(colorProp["ui:field"]).toBe("color");
    //     expect(colorProp["ui:color-type"]).toBe("border");
    //   });
    // });

    describe("border.width", () => {
      it("should have correct metadata", () => {
        const widthProp = borderSchema.properties.width;
        expect(widthProp["ui:field"]).toBe("enum");
      });
    });
  });
});
