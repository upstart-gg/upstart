import { describe, it, expect } from "vitest";
import { attr, type Attributes, defineAttributes, resolveAttributes } from "../attributes";
import { typeboxSchemaToJSONSchema } from "../utils/schema";

describe("Attributes test suite", () => {
  describe("defineAttributes", () => {
    it("should define custom attributes", () => {
      const attributes = defineAttributes({
        name: attr.string("Name"),
        age: attr.number("Age"),
        isStudent: attr.boolean("Is Student"),
        createdAt: attr.date("Created At"),
      });
      expect(attributes.type).toBe("object");
      expect(attributes.properties).toBeTypeOf("object");
      expect(attributes.properties).toHaveProperty("name");
      expect(attributes.properties).toHaveProperty("age");
      expect(attributes.properties).toHaveProperty("isStudent");
      expect(attributes.properties).toHaveProperty("createdAt");
    });
  });
  describe("resolveAttributes", () => {
    it("should resolve attributes with default values", () => {
      const attributes = defineAttributes({
        mainButtonUrl: attr.url("Main Button URL", "https://facebook.com"),
        testBoolTrue: attr.boolean("Test Bool True", true),
        customerId: attr.string("Customer ID"),
        testUrl: attr.url("Test URL", "https://upstart.gg"),
      });
      expect(resolveAttributes(attributes)).toBeTruthy();
    });
  });
});
