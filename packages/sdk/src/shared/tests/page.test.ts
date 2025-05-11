import { describe, it, expect } from "vitest";
import testConfig from "./site-config.test";
import { getNewSiteConfig } from "../site";

describe("Page test suite", () => {
  describe("getNewSiteConfig", () => {
    it("should return a new site config", () => {
      const testConfigJson = { ...testConfig };
      const siteConfig = getNewSiteConfig(testConfigJson, "test-xyz.upstart.gg");
      expect(siteConfig).toBeTruthy();
    });
  });
});
