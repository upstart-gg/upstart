import { describe, it, expect } from "vitest";
import { manifest } from "../navbar.manifest";

describe("Header manifest test suite", () => {
  describe("manifest", () => {
    it("should  be valid", () => {
      expect(manifest).toBeTruthy();
    });
  });
});
