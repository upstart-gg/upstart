import { describe, it, expect } from "vitest";
import { flex, grid, layoutType, containerChildren } from "../container";

describe("Container props test suite", () => {
  describe("flex", () => {
    it("should have the correct title with default options", () => {
      expect(flex().title).toBe("Layout");
    });

    it("should have the correct title with custom options", () => {
      expect(flex({ title: "Flex Layout" }).title).toBe("Flex Layout");
    });

    it("should have correct UI metadata", () => {
      const schema = flex().schema;
      expect(schema["ui:field"]).toBe("flex");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should have correct default values", () => {
      const schema = flex().schema;
      expect(schema.default).toEqual({
        direction: "flex-row",
        gap: "gap-1",
        wrap: "flex-wrap",
        justifyContent: "justify-stretch",
        alignItems: "items-stretch",
      });
    });

    it("should accept custom default values", () => {
      const customDefault = {
        direction: "flex-col",
        gap: "gap-4",
        wrap: "flex-nowrap",
        justifyContent: "justify-center",
        alignItems: "items-center",
      };
      const schema = flex({ defaultValue: customDefault }).schema;
      expect(schema.default).toEqual(customDefault);
    });
  });

  describe("grid", () => {
    it("should have the correct title with default options", () => {
      expect(grid().title).toBe("Layout");
    });

    it("should have correct UI metadata", () => {
      const schema = grid().schema;
      expect(schema["ui:field"]).toBe("grid");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should have correct default values", () => {
      const schema = grid().schema;
      expect(schema.default).toEqual({
        gap: "gap-1",
        columns: 2,
      });
    });

    it("should accept custom default values", () => {
      const customDefault = {
        gap: "gap-4",
        columns: 4,
      };
      const schema = grid({ defaultValue: customDefault }).schema;
      expect(schema.default).toEqual(customDefault);
    });

    describe("grid.columns", () => {
      it("should have correct metadata", () => {
        const columns = grid().schema.properties.columns;
        expect(columns.title).toBe("Columns");
        expect(columns["ui:field"]).toBe("slider");
        expect(columns["ui:group"]).toBe("grid");
        expect(columns.minimum).toBe(1);
        expect(columns.maximum).toBe(12);
        expect(columns.default).toBe(2);
      });
    });
  });

  describe("layoutType", () => {
    it("should have the correct title", () => {
      expect(layoutType().title).toBe("Layout type");
    });

    it("should have correct UI metadata", () => {
      const schema = layoutType().schema;
      expect(schema["ui:field"]).toBe("enum");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should have correct default value", () => {
      expect(layoutType().schema.default).toBe("flex");
      expect(layoutType({ defaultValue: "grid" }).schema.default).toBe("grid");
    });
  });

  describe("containerChildren", () => {
    it("should have the correct title", () => {
      expect(containerChildren().title).toBe("Children");
    });

    it("should have correct schema structure", () => {
      const schema = containerChildren().schema;
      expect(schema.type).toBe("object");
      expect(schema).toHaveProperty("properties.childrenType");
      expect(schema).toHaveProperty("properties.childrenBricks");
    });

    describe("childrenType", () => {
      it("should have correct metadata", () => {
        const childrenType = containerChildren().schema.properties.childrenType;
        expect(childrenType.title).toBe("Dynamic child brick type");
        expect(childrenType["ui:field"]).toBe("brick-type");
      });
    });

    describe("childrenBricks", () => {
      it("should have correct metadata", () => {
        const childrenBricks = containerChildren().schema.properties.childrenBricks;
        expect(childrenBricks["ui:field"]).toBe("hidden");
        expect(childrenBricks.default).toEqual([]);
      });
    });
  });
});
