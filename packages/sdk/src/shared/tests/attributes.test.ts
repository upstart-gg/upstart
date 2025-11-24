import { describe, it, expect } from "vitest";
import {
  type PageAttributes,
  resolvePageAttributes,
  resolveSiteAttributes,
  type SiteAttributes,
} from "../site/attributes";

describe("Attributes test suite", () => {
  describe("resolvePageAttributes", () => {
    it("should resolve attributes with default values", () => {
      const attributes = {};
      expect(resolvePageAttributes(attributes)).toMatchObject<PageAttributes>({
        robotsIndexing: true,
        path: "/",
        title: "Untitled",
        description: "",
        keywords: "",
        tags: [],
        layout: "default",
      });
    });
  });
  describe("resolveSiteAttributes", () => {
    it("should resolve site attributes with default values", () => {
      const attributes = {};
      expect(resolveSiteAttributes(attributes)).toMatchObject<SiteAttributes>({
        language: "en",
        themeId: "default-theme",
      });
    });
  });
});
