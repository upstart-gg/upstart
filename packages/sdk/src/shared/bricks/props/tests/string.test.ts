import { describe, it, expect } from "vitest";
import { string, url, urlOrPageId } from "../string";

describe("String prop test suite", () => {
  describe("string", () => {
    it("should have the correct title", () => {
      const stringProp = string("Test String");
      expect(stringProp.title).toBe("Test String");
    });

    it("should have the correct default value when provided", () => {
      const stringProp = string("Test String", "Default value");
      expect(stringProp.default).toBe("Default value");
    });

    it("should apply additional options when provided", () => {
      const stringProp = string("Test String", undefined, { minLength: 5, maxLength: 10 });
      expect(stringProp.minLength).toBe(5);
      expect(stringProp.maxLength).toBe(10);
    });

    it("should apply UI field options when provided", () => {
      const stringProp = string("Test String", undefined, { "ui:field": "textarea" });
      expect(stringProp["ui:field"]).toBe("textarea");
    });
  });

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
      expect(urlProp.format).toBe("uri");
    });

    it("should use the correct UI field", () => {
      const urlProp = url();
      expect(urlProp["ui:field"]).toBe("url");
    });
  });

  describe("urlOrPageId", () => {
    it("should have the correct title", () => {
      const prop = urlOrPageId();
      expect(prop.title).toBe("URL or Page ID");
    });

    it("should have custom title when provided", () => {
      const prop = urlOrPageId("Custom Link");
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
      expect(urlOption?.format).toBe("uri");
      expect(urlOption?.["ui:field"]).toBe("url");

      // Second option should be page-id
      const pageIdOption = prop.anyOf?.[1];
      expect(pageIdOption?.["ui:field"]).toBe("page-id");
    });
  });
});
