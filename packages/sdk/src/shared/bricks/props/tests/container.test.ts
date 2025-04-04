import { describe, it, expect } from "vitest";
import { flex, grid, makeContainerProps } from "../container";

describe("Container props test suite", () => {
  describe("flex", () => {
    it("should have the correct title with default options", () => {
      expect(flex().title).toBe("Layout");
    });

    it("should have the correct title with custom options", () => {
      expect(flex({ title: "Flex Layout" }).title).toBe("Flex Layout");
    });

    it("should have correct UI metadata", () => {
      const schema = flex();
      expect(schema["ui:field"]).toBe("flex");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should have correct default values", () => {
      const schema = flex();
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
      const schema = flex({ defaultValue: customDefault });
      expect(schema.default).toEqual(customDefault);
    });
  });

  describe("grid", () => {
    it("should have the correct title with default options", () => {
      expect(grid().title).toBe("Layout");
    });

    it("should have correct UI metadata", () => {
      const schema = grid();
      expect(schema["ui:field"]).toBe("grid");
      expect(schema["ui:responsive"]).toBe(true);
    });

    it("should have correct default values", () => {
      const schema = grid();
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
      const schema = grid({ defaultValue: customDefault });
      expect(schema.default).toEqual(customDefault);
    });

    describe("grid.columns", () => {
      it("should have correct metadata", () => {
        const columns = grid().properties.columns;
        expect(columns.title).toBe("Columns");
        expect(columns["ui:field"]).toBe("slider");
        expect(columns["ui:group"]).toBe("grid");
        expect(columns.minimum).toBe(1);
        expect(columns.maximum).toBe(12);
        expect(columns.default).toBe(2);
      });
    });
  });

  describe("containerChildren", () => {
    describe("childrenType", () => {
      it("should have correct metadata", () => {
        const childrenType = makeContainerProps().$childrenType;
        expect(childrenType.title).toBe("Dynamic child brick type");
        expect(childrenType["ui:field"]).toBe("brick-type");
      });
    });

    describe("childrenBricks", () => {
      it("should have correct metadata", () => {
        const childrenBricks = makeContainerProps().$children;
        expect(childrenBricks["ui:field"]).toBe("hidden");
        expect(childrenBricks.default).toEqual([]);
      });
    });
  });
});
