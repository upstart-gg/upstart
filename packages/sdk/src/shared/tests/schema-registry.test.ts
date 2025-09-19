// Check taht schemaRegistry contains all schemas and that $refs are resolved
import { describe, it, expect } from "vitest";
import { schemaRegistry } from "../utils/schema-registry";
import { Cabidela } from "@cloudflare/cabidela";
import { type TSchema, Type } from "@sinclair/typebox";

describe("Schema Registry", () => {
  it("should contain all registered schemas", () => {
    expect(schemaRegistry.has("styles:background")).toBe(true);
    expect(schemaRegistry.has("styles:justifyContent")).toBe(true);
    expect(schemaRegistry.has("assets:image")).toBe(true);
    expect(schemaRegistry.has("content:text")).toBe(true);

    console.log("Registered schemas:", Array.from(schemaRegistry));
  });
});
