import { describe, it, expect } from "vitest";
import { padding } from "../layout";

describe("Layout props test suite", () => {
  describe("padding", () => {
    it("should have correct title and group metadata", () => {
      const prop = padding();
      expect(prop.title).toBe("Padding");
      expect(prop.schema["ui:group"]).toBe("spacing");
      expect(prop.schema["ui:inspector-tab"]).toBe("style");
    });
  });
});
