import { describe, it, expect } from "vitest";
import { propBorder, border } from "../border";

describe("Border prop test suite", () => {
  describe("propBorder", () => {
    it("should have the correct title", () => {
      expect(propBorder().title).toBe("Border");
    });
  });

  describe("border schema", () => {
    it("should have correct UI metadata", () => {
      expect(border["ui:field"]).toBe("border");
      expect(border["ui:group"]).toBe("border");
      expect(border["ui:group:title"]).toBe("Border");
      expect(border["ui:inspector-tab"]).toBe("style");
    });

    it("should have correct default values", () => {
      expect(border.default).toEqual({
        radius: "rounded-none",
        style: "border-solid",
        color: "#000000",
        width: "border-0",
      });
    });

    describe("border.radius", () => {
      it("should have correct metadata", () => {
        const radiusProp = border.properties.radius;
        expect(radiusProp.$id).toBe("borderRadius");
        expect(radiusProp.title).toBe("Rounding");
        expect(radiusProp.description).toBe("Corners rounding");
        expect(radiusProp["ui:field"]).toBe("enum");
        expect(radiusProp["ui:display"]).toBe("button-group");
        expect(radiusProp.default).toBe("rounded-none");
      });

      it("should have correct enum options", () => {
        const radiusOptions = border.properties.radius.anyOf.map((opt) => opt.const);
        expect(radiusOptions).toContain("rounded-none");
        expect(radiusOptions).toContain("rounded-sm");
        expect(radiusOptions).toContain("rounded-md");
        expect(radiusOptions).toContain("rounded-lg");
        expect(radiusOptions).toContain("rounded-xl");
        expect(radiusOptions).toContain("rounded-full");
      });

      it("should have titles for all enum options", () => {
        const options = border.properties.radius.anyOf;
        expect(options.find((opt) => opt.const === "rounded-none")?.title).toBe("None");
        expect(options.find((opt) => opt.const === "rounded-sm")?.title).toBe("Small");
        expect(options.find((opt) => opt.const === "rounded-md")?.title).toBe("Medium");
        expect(options.find((opt) => opt.const === "rounded-lg")?.title).toBe("Large");
        expect(options.find((opt) => opt.const === "rounded-xl")?.title).toBe("Extra large");
        expect(options.find((opt) => opt.const === "rounded-full")?.title).toBe("Full");
      });
    });

    describe("border.style", () => {
      it("should have correct metadata", () => {
        const styleProp = border.properties.style;
        expect(styleProp.$id).toBe("borderStyle");
        expect(styleProp.title).toBe("Border style");
        expect(styleProp.description).toBe("The brick border style");
        expect(styleProp["ui:field"]).toBe("enum");
        expect(styleProp["ui:display"]).toBe("button-group");
        expect(styleProp.default).toBe("border-solid");
      });

      it("should have correct enum options", () => {
        const styleOptions = border.properties.style.anyOf.map((opt) => opt.const);
        expect(styleOptions).toContain("border-solid");
        expect(styleOptions).toContain("border-dashed");
        expect(styleOptions).toContain("border-dotted");
      });
    });

    describe("border.color", () => {
      it("should have correct metadata", () => {
        const colorProp = border.properties.color;
        expect(colorProp.$id).toBe("borderColor");
        expect(colorProp.title).toBe("Border color");
        expect(colorProp["ui:field"]).toBe("color");
        expect(colorProp["ui:color-type"]).toBe("border");
        expect(colorProp.default).toBe("transparent");
      });
    });

    describe("border.width", () => {
      it("should have correct metadata", () => {
        const widthProp = border.properties.width;
        expect(widthProp.$id).toBe("borderWidth");
        expect(widthProp.title).toBe("Border width");
        expect(widthProp["ui:field"]).toBe("enum");
        expect(widthProp["ui:display"]).toBe("button-group");
        expect(widthProp.default).toBe("border-0");
      });

      it("should have correct enum options", () => {
        const widthOptions = border.properties.width.anyOf.map((opt) => opt.const);
        expect(widthOptions).toContain("border-0");
        expect(widthOptions).toContain("border");
        expect(widthOptions).toContain("border-2");
        expect(widthOptions).toContain("border-4");
        expect(widthOptions).toContain("border-8");
      });

      it("should have titles for all enum options", () => {
        const options = border.properties.width.anyOf;
        expect(options.find((opt) => opt.const === "border-0")?.title).toBe("None");
        expect(options.find((opt) => opt.const === "border")?.title).toBe("Small");
        expect(options.find((opt) => opt.const === "border-2")?.title).toBe("Medium");
        expect(options.find((opt) => opt.const === "border-4")?.title).toBe("Large");
        expect(options.find((opt) => opt.const === "border-8")?.title).toBe("Extra large");
      });
    });
  });
});
