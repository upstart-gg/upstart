import { describe, it, expect } from "vitest";
import { manifest } from "../header.manifest";

describe("Header manifest test suite", () => {
  describe("manifest", () => {
    it("should  be valid", () => {
      console.log(JSON.stringify(manifest, null, 2));
      expect(manifest).toBeTruthy();
    });
  });
});
