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
    describe("border.width", () => {
      it("should have correct metadata", () => {
        const widthProp = borderSchema.properties.width;
        expect(widthProp["ui:field"]).toBe("enum");
      });
    });
  });
});
