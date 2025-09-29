import { describe, it, expect } from "vitest";
import { url, urlOrPageId } from "../string";

describe("String prop test suite", () => {
  describe("url", () => {
    it("should have the correct title", () => {
      const urlProp = url();
      expect(urlProp.title).toBe("URL");
    });

    it("should have custom title when provided", () => {
      const urlProp = url("Custom URL");
      expect(urlProp.title).toBe("Custom URL");
    });

    it("should have the correct format", () => {
      const urlProp = url();
      expect(urlProp.format).toBe("url");
    });

    it("should use the correct UI field", () => {
      const urlProp = url();
      expect(urlProp["ui:field"]).toBe("url");
    });
  });

  describe("urlOrPageId", () => {
    it("should have the correct title", () => {
      const prop = urlOrPageId();
      expect(prop.title).toBe("URL");
    });

    it("should have custom title when provided", () => {
      const prop = urlOrPageId({ title: "Custom Link" });
      expect(prop.title).toBe("Custom Link");
    });

    it("should be a union type", () => {
      const prop = urlOrPageId();
      expect(prop.anyOf).toBeDefined();
      expect(prop.anyOf?.length).toBe(2);
    });

    it("should contain URL and page-id options", () => {
      const prop = urlOrPageId();

      // First option should be URL
      const urlOption = prop.anyOf?.[0];
      expect(urlOption?.format).toBe("url");

      // Second option should be page-id
      const pageIdOption = prop.anyOf?.[1];
      expect(pageIdOption?.["ui:field"]).toBe("page-id");
    });
  });
});
