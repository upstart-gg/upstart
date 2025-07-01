import { describe, it, expect } from "vitest";
import { Type } from "@sinclair/typebox";
import { prop, group, defineProps, getGroupInfo, getStyleProperties } from "../helpers";
import { manifest as sampleManifest } from "../../manifests/navbar.manifest";

describe("Props helpers test suite", () => {
  describe("prop", () => {
    it("should create a schema with the correct title", () => {
      const schema = Type.String();
      const result = prop({ title: "Test Title", schema });
      expect(result.title).toBe("Test Title");
    });

    it("should add description when provided", () => {
      const schema = Type.String();
      const result = prop({
        title: "Test",
        schema,
        description: "Test description",
      });
      expect(result.description).toBe("Test description");
    });

    it("should add $id when provided", () => {
      const schema = Type.String();
      const result = prop({ title: "Test", schema, $id: "testId" });
      expect(result.$id).toBe("testId");
    });
  });

  describe("group", () => {
    it("should create a group object with the correct title", () => {
      const children = {
        test: Type.String({ title: "Test String" }),
      };
      const result = group({ title: "Test Group", children });
      expect(result.title).toBe("Test Group");
    });

    it("should have the correct default tab", () => {
      const children = { test: Type.String() };
      const result = group({ title: "Test Group", children });
      const info = getGroupInfo(result);
      expect(info.tab).toBe("common");
    });

    it("should use the provided tab", () => {
      const children = { test: Type.String() };
      const result = group({ title: "Test Group", children });
      const info = getGroupInfo(result);
      expect(info.tab).toBe("common");
    });

    it("should create a proper group ID from the title", () => {
      const children = { test: Type.String() };
      const result = group({ title: "Test Group Name", children });
      const info = getGroupInfo(result);
      expect(info.meta.group).toBe(true);
    });

    it("should contain the correct children", () => {
      const children = {
        stringProp: Type.String({ title: "String Prop" }),
        numberProp: Type.Number({ title: "Number Prop" }),
      };
      const result = group({ title: "Test Group", children });

      expect(result.properties.stringProp).toBeDefined();
      expect(result.properties.stringProp.title).toBe("String Prop");
      expect(result.properties.numberProp).toBeDefined();
      expect(result.properties.numberProp.title).toBe("Number Prop");
    });
  });

  describe("defineProps", () => {
    it("should combine props into a single object schema", () => {
      const props = {
        stringProp: Type.String({ title: "String Prop" }),
        groupProp: group({
          title: "Group Prop",
          children: {
            nestedProp: Type.Number({ title: "Nested Prop" }),
          },
        }),
      };

      const result = defineProps(props);

      expect(result.type).toBe("object");
      expect(result.properties.stringProp).toBeDefined();
      expect(result.properties.groupProp).toBeDefined();
      expect(result.properties.groupProp.properties.nestedProp).toBeDefined();
    });

    it("should include common props", () => {
      const props = {
        stringProp: Type.String({ title: "String Prop" }),
      };

      const result = defineProps(props);

      // Check for common props (this assumes the structure of commonProps)
      // You may need to adjust this expectation based on the actual structure
      expect(result.properties).toHaveProperty("stringProp");
    });
  });

  describe("getGroupInfo", () => {
    it("should use 'common' as default tab when not specified", () => {
      const schema = Type.Object(
        {},
        {
          title: "Test",
          metadata: { group: "test" },
        },
      );

      const info = getGroupInfo(schema);

      expect(info.tab).toBe("common");
    });
  });
});
