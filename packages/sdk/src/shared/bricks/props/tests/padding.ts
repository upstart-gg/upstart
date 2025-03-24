import { describe, it, expect } from "vitest";
import { padding } from "../padding";

describe("Padding props test suite", () => {
  describe("padding", () => {
    it("should have correct title and group metadata", () => {
      const prop = padding();
      expect(prop.title).toBe("Padding");
      expect(prop["ui:group"]).toBe("spacing");
      expect(prop["ui:inspector-tab"]).toBe("style");
    });
  });
});
