import { describe, it, expect } from "vitest";
import { border } from "../border";

describe("Border prop test suite", () => {
  const borderSchema = border();

  describe("propBorder", () => {
    it("should have the correct title", () => {
      expect(border().title).toBe("Border");
    });
  });
});
