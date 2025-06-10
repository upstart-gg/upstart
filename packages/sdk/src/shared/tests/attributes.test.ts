import { describe, it, expect } from "vitest";
import { defineAttributes, resolveAttributes } from "../attributes";
import { string, url } from "../bricks/props/string";
import { number } from "../bricks/props/number";
import { boolean } from "../bricks/props/boolean";
import { date } from "../bricks/props/date";
import { Type } from "@sinclair/typebox";

describe("Attributes test suite", () => {
  describe("defineAttributes", () => {
    it("should define custom attributes", () => {
      const attributes = defineAttributes({
        name: string("Name"),
        age: number("Age"),
        isStudent: boolean("Is Student"),
        createdAt: date("Created At"),
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
      const attributes = Type.Object({
        mainButtonUrl: url("Main Button URL", "https://facebook.com"),
        testBoolTrue: boolean("Test Bool True", true),
        customerId: string("Customer ID"),
        testUrl: url("Test URL", "https://upstart.gg"),
      });
      expect(resolveAttributes(attributes)).toBeTruthy();
    });
  });
});
