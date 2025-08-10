import { describe, it, expect } from "vitest";
import {
  type PageAttributes,
  resolvePageAttributes,
  resolveSiteAttributes,
  type SiteAttributes,
} from "../attributes";

describe("Attributes test suite", () => {
  describe("resolvePageAttributes", () => {
    it("should resolve attributes with default values", () => {
      const attributes = {};
      expect(resolvePageAttributes(attributes)).toMatchObject<PageAttributes>({
        color: "bg-base-100",
        robotsIndexing: true,
        path: "/",
        queries: [],
        title: "Untitled",
        description: "",
        keywords: "",
      });
    });
  });
  describe("resolveSiteAttributes", () => {
    it("should resolve site attributes with default values", () => {
      const attributes = {};
      expect(resolveSiteAttributes(attributes)).toMatchObject<SiteAttributes>({});
    });
  });
});
