import { describe, expect, test, beforeEach, vi } from "vitest";
import { Type } from "@sinclair/typebox";
import { resolveSchema } from "../schema";
import { toLLMSchema } from "../llm";
import { ajv } from "../../ajv";
import { sitemapSchema, sitemapSchemaLLM } from "~/shared/sitemap";
import { pageSchema, pageOutputObjectLLM } from "~/shared/page";
import { colorPresetRef } from "~/shared/bricks/props/color-preset";
import { pageAttributesSchemaLLM, siteAttributesSchemaLLM } from "~/shared/attributes";

describe("resolveSchema tests suite", () => {
  beforeEach(() => {
    // Clear any test schemas before each test
    ajv.removeSchema("test:simple");
    ajv.removeSchema("test:user");
    ajv.removeSchema("test:address");
    ajv.removeSchema("test:circular1");
    ajv.removeSchema("test:circular2");
    ajv.removeSchema("test:string");
    ajv.removeSchema("test:number");
    ajv.removeSchema("test:boolean");
    ajv.removeSchema("test:base");
    ajv.removeSchema("test:extended");
  });

  test("should return primitive types unchanged", () => {
    expect(resolveSchema(null as any)).toBe(null);
    expect(resolveSchema(undefined as any)).toBe(undefined);
    expect(resolveSchema("string" as any)).toBe("string");
    expect(resolveSchema(42 as any)).toBe(42);
    expect(resolveSchema(true as any)).toBe(true);
  });

  test("should return schema without references unchanged", () => {
    const schema = Type.Object({
      name: Type.String(),
      age: Type.Number(),
    });

    const result = resolveSchema(schema);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(schema));
  });

  test("should resolve simple $ref", () => {
    const userSchema = Type.Object({
      name: Type.String(),
      email: Type.String({ format: "email" }),
    });

    ajv.addSchema(userSchema, "test:user");

    const schemaWithRef = Type.Ref("test:user");

    const result = resolveSchema(schemaWithRef);
    expect(result.type).toEqual(userSchema.type);
  });

  // test("should throw error for non-existent $ref", () => {
  //   const schemaWithRef = Type.Ref("test:nonexistent");

  //   expect(() => resolveSchema(schemaWithRef)).toThrow("Schema not found for reference: test:nonexistent");
  // });

  test("should resolve nested object properties", () => {
    const addressSchema = Type.Object({
      street: Type.String(),
      city: Type.String(),
    });

    ajv.addSchema(addressSchema, "test:address");

    const schema = Type.Object({
      name: Type.String(),
      address: Type.Ref("test:address"),
    });

    const result = resolveSchema(schema);
    expect(result.properties.name.type).toEqual("string");
    expect(result.properties.address.type).toEqual(addressSchema.type);
  });

  test("should resolve array items", () => {
    const itemSchema = Type.Object({
      id: Type.Number(),
    });

    ajv.addSchema(itemSchema, "test:simple");

    const schema = Type.Array(Type.Ref("test:simple"));

    const result = resolveSchema(schema);
    expect(result.items.type).toEqual(itemSchema.type);
  });

  test("should resolve array items as array", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");

    const schema = Type.Tuple([Type.Ref("test:string"), Type.Ref("test:number")]);

    const result = resolveSchema(schema);
    expect(result.items).toHaveLength(2);
  });

  test("should resolve anyOf schemas", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");

    const schema = Type.Union([Type.Ref("test:string"), Type.Ref("test:number")]);

    const result = resolveSchema(schema);
    expect(result.anyOf[0].type).toEqual(stringSchema.type);
    expect(result.anyOf[1].type).toEqual(numberSchema.type);
  });

  test("should resolve oneOf schemas", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");

    const schema = {
      oneOf: [Type.Ref("test:string"), Type.Ref("test:number")],
    } as any;

    const result = resolveSchema(schema);
    expect(result.oneOf[0].type).toEqual(stringSchema.type);
    expect(result.oneOf[1].type).toEqual(numberSchema.type);
  });

  test("should resolve allOf schemas", () => {
    const baseSchema = Type.Object({
      id: Type.Number(),
    });

    const extendedSchema = Type.Object({
      name: Type.String(),
    });

    ajv.addSchema(baseSchema, "test:base");
    ajv.addSchema(extendedSchema, "test:extended");

    const schema = Type.Intersect([Type.Ref("test:base"), Type.Ref("test:extended")]);

    const result = resolveSchema(schema);

    expect(result.allOf[0].type).toEqual(baseSchema.type);
    expect(result.allOf[1].type).toEqual(extendedSchema.type);
  });

  test("should resolve not schemas", () => {
    const stringSchema = Type.String();

    ajv.addSchema(stringSchema, "test:string");

    const schema = Type.Not(Type.Ref("test:string"));

    const result = resolveSchema(schema);
    expect(result.not.type).toEqual(stringSchema.type);
  });

  test("should resolve conditional schemas (if/then/else)", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();
    const booleanSchema = Type.Boolean();

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");
    ajv.addSchema(booleanSchema, "test:boolean");

    const schema = {
      if: Type.Ref("test:string"),
      // biome-ignore lint/suspicious/noThenProperty: Required for JSON schema conditional validation
      then: Type.Ref("test:number"),
      else: Type.Ref("test:boolean"),
    } as any;

    const result = resolveSchema(schema);
    expect(result.if.type).toEqual(stringSchema.type);
    expect(result.then.type).toEqual(numberSchema.type);
    expect(result.else.type).toEqual(booleanSchema.type);
  });

  test("should handle deeply nested schema structures", () => {
    const nestedSchema = Type.Object({
      level1: Type.Object({
        level2: Type.Array(Type.Union([Type.String(), Type.Number()])),
      }),
    });

    const result = resolveSchema(nestedSchema);
    expect(result).toEqual(nestedSchema);
  });

  test("should handle empty objects and arrays", () => {
    const schema = Type.Object({});

    const result = resolveSchema(schema);
    expect(result).toEqual(schema);
  });

  test("should handle schema with no properties", () => {
    const schema = Type.Object({});

    const result = resolveSchema(schema);
    expect(result).toEqual(schema);
  });

  test("should handle complex nested refs", () => {
    const addressSchema = Type.Object({
      street: Type.String(),
      city: Type.String(),
      country: Type.String(),
    });

    const personSchema = Type.Object({
      name: Type.String(),
      address: Type.Ref("test:address"),
      friends: Type.Array(Type.Ref("test:user")),
    });

    ajv.addSchema(personSchema, "test:user");
    ajv.addSchema(addressSchema, "test:address");

    const schema = Type.Object({
      users: Type.Array(Type.Ref("test:user")),
    });

    const result = resolveSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.users.type).toBe("array");
    expect(result.properties.users.items.type).toBe("object");
    expect(result.properties.users.items.properties.name.type).toBe("string");
    expect(result.properties.users.items.properties.address.type).toBe("object");
    expect(result.properties.users.items.properties.address.properties.street.type).toBe("string");
  });

  test("should handle refs in conditionals properly", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number({ minimum: 0 });

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");

    const schema = Type.Object({
      type: Type.String({ enum: ["string", "number"] }),
      value: {
        if: Type.Object({ type: Type.Const("string") }),
        // biome-ignore lint/suspicious/noThenProperty: Required for JSON schema conditional validation
        then: Type.Ref("test:string"),
        else: Type.Ref("test:number"),
      } as any,
    });

    const result = resolveSchema(schema);

    expect(result.properties.value.then.type).toEqual(stringSchema.type);
    expect(result.properties.value.else.type).toEqual(numberSchema.type);
    expect(result.properties.value.else.minimum).toBe(0);
  });
});

describe("toLLMSchema tests suite", () => {
  test("should remove metadata properties", () => {
    const schema = {
      type: "object",
      properties: {
        name: Type.String(),
        age: Type.Number(),
      },
      metadata: {
        description: "User schema",
        source: "api",
      },
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties).toBeDefined();
    expect(result.metadata).toBeUndefined();
  });

  test("should remove ui: properties", () => {
    const schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
          "ui:widget": "text",
          "ui:placeholder": "Enter name",
          "ui:help": "Your full name",
        },
        age: Type.Number(),
      },
      "ui:order": ["name", "age"],
      "ui:title": "User Form",
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.name.type).toBe("string");
    expect(result.properties.name["ui:widget"]).toBeUndefined();
    expect(result.properties.name["ui:placeholder"]).toBeUndefined();
    expect(result.properties.name["ui:help"]).toBeUndefined();
    expect(result["ui:order"]).toBeUndefined();
    expect(result["ui:title"]).toBeUndefined();
  });

  test("should preserve standard JSON schema properties", () => {
    const schema = Type.Object({
      name: Type.String({
        minLength: 1,
        maxLength: 50,
        description: "User's name",
      }),
      age: Type.Number({
        minimum: 0,
        maximum: 120,
      }),
      email: Type.String({
        format: "email",
      }),
    });

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.name.type).toBe("string");
    expect(result.properties.name.minLength).toBe(1);
    expect(result.properties.name.maxLength).toBe(50);
    expect(result.properties.name.description).toBe("User's name");
    expect(result.properties.age.minimum).toBe(0);
    expect(result.properties.age.maximum).toBe(120);
    expect(result.properties.email.format).toBe("email");
  });

  test("should handle nested objects recursively", () => {
    const schema = {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            name: {
              type: "string",
              "ui:widget": "text",
            },
            profile: {
              type: "object",
              properties: {
                bio: {
                  type: "string",
                  "ui:widget": "textarea",
                },
              },
              "ui:collapsible": true,
            },
          },
          metadata: {
            version: "1.0",
          },
        },
      },
      "ui:layout": "vertical",
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result["ui:layout"]).toBeUndefined();
    expect(result.properties.user.type).toBe("object");
    expect(result.properties.user.metadata).toBeUndefined();
    expect(result.properties.user.properties.name.type).toBe("string");
    expect(result.properties.user.properties.name["ui:widget"]).toBeUndefined();
    expect(result.properties.user.properties.profile.type).toBe("object");
    expect(result.properties.user.properties.profile["ui:collapsible"]).toBeUndefined();
    expect(result.properties.user.properties.profile.properties.bio.type).toBe("string");
    expect(result.properties.user.properties.profile.properties.bio["ui:widget"]).toBeUndefined();
  });

  test("should handle arrays with schema items", () => {
    const schema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            "ui:widget": "text",
          },
        },
        metadata: {
          itemType: "user",
        },
      },
      "ui:addable": true,
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("array");
    expect(result["ui:addable"]).toBeUndefined();
    expect(result.items.type).toBe("object");
    expect(result.items.metadata).toBeUndefined();
    expect(result.items.properties.name.type).toBe("string");
    expect(result.items.properties.name["ui:widget"]).toBeUndefined();
  });

  test("should handle anyOf/oneOf/allOf schemas", () => {
    const schema = {
      anyOf: [
        {
          type: "string",
          "ui:widget": "text",
        },
        {
          type: "number",
          "ui:widget": "number",
        },
      ],
      oneOf: [
        {
          type: "object",
          properties: {
            name: {
              type: "string",
              "ui:placeholder": "Name",
            },
          },
          metadata: {
            variant: "name",
          },
        },
      ],
      "ui:discriminator": "type",
    } as any;

    const result = toLLMSchema(schema);

    expect(result["ui:discriminator"]).toBeUndefined();
    expect(result.anyOf[0].type).toBe("string");
    expect(result.anyOf[0]["ui:widget"]).toBeUndefined();
    expect(result.anyOf[1].type).toBe("number");
    expect(result.anyOf[1]["ui:widget"]).toBeUndefined();
    expect(result.oneOf[0].type).toBe("object");
    expect(result.oneOf[0].metadata).toBeUndefined();
    expect(result.oneOf[0].properties.name.type).toBe("string");
    expect(result.oneOf[0].properties.name["ui:placeholder"]).toBeUndefined();
  });

  test("should handle conditional schemas (if/then/else)", () => {
    const schema = {
      if: {
        properties: {
          type: { const: "user" },
        },
        "ui:condition": "showUserFields",
      },
      // biome-ignore lint/suspicious/noThenProperty: Required for JSON schema conditional validation
      then: {
        properties: {
          name: {
            type: "string",
            "ui:required": true,
          },
        },
        metadata: {
          context: "user",
        },
      },
      else: {
        properties: {
          id: {
            type: "number",
            "ui:readonly": true,
          },
        },
      },
    } as any;

    const result = toLLMSchema(schema);

    expect(result.if.properties.type.const).toBe("user");
    expect(result.if["ui:condition"]).toBeUndefined();
    expect(result.then.properties.name.type).toBe("string");
    expect(result.then.properties.name["ui:required"]).toBeUndefined();
    expect(result.then.metadata).toBeUndefined();
    expect(result.else.properties.id.type).toBe("number");
    expect(result.else.properties.id["ui:readonly"]).toBeUndefined();
  });

  test("should handle definitions and $defs", () => {
    const schema = {
      type: "object",
      properties: {
        user: { $ref: "#/definitions/User" },
      },
      definitions: {
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
              "ui:widget": "text",
            },
          },
          metadata: {
            table: "users",
          },
        },
      },
      $defs: {
        Address: {
          type: "object",
          properties: {
            street: {
              type: "string",
              "ui:autocomplete": "street-address",
            },
          },
          "ui:fieldset": "address",
        },
      },
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.user.$ref).toBe("#/definitions/User");
    expect(result.definitions.User.type).toBe("object");
    expect(result.definitions.User.metadata).toBeUndefined();
    expect(result.definitions.User.properties.name.type).toBe("string");
    expect(result.definitions.User.properties.name["ui:widget"]).toBeUndefined();
    expect(result.$defs.Address.type).toBe("object");
    expect(result.$defs.Address["ui:fieldset"]).toBeUndefined();
    expect(result.$defs.Address.properties.street.type).toBe("string");
    expect(result.$defs.Address.properties.street["ui:autocomplete"]).toBeUndefined();
  });

  test("should handle primitive schemas without changes", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();
    const booleanSchema = Type.Boolean();

    expect(toLLMSchema(stringSchema).type).toEqual(stringSchema.type);
    expect(toLLMSchema(numberSchema).type).toEqual(numberSchema.type);
    expect(toLLMSchema(booleanSchema).type).toEqual(booleanSchema.type);
  });

  test("should handle empty object schema", () => {
    const schema = Type.Object({});
    const result = toLLMSchema(schema);
    expect(result.type).toEqual(schema.type);
  });

  test("should handle patternProperties", () => {
    const schema = {
      type: "object",
      patternProperties: {
        "^ui_": {
          type: "string",
          "ui:widget": "text",
        },
        "^data_": {
          type: "object",
          properties: {
            value: {
              type: "string",
              "ui:placeholder": "Enter value",
            },
          },
          metadata: {
            source: "user",
          },
        },
      },
      "ui:pattern": "flexible",
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result["ui:pattern"]).toBeUndefined();
    expect(result.patternProperties["^ui_"].type).toBe("string");
    expect(result.patternProperties["^ui_"]["ui:widget"]).toBeUndefined();
    expect(result.patternProperties["^data_"].type).toBe("object");
    expect(result.patternProperties["^data_"].metadata).toBeUndefined();
    expect(result.patternProperties["^data_"].properties.value.type).toBe("string");
    expect(result.patternProperties["^data_"].properties.value["ui:placeholder"]).toBeUndefined();
  });

  test("should remove properties with ai:hidden set to true", () => {
    const schema = {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "User's name",
        },
        secretField: {
          type: "string",
          "ai:hidden": true,
          description: "This should be hidden from AI",
        },
        age: {
          type: "number",
          "ai:hidden": false, // Explicitly false, should be kept
        },
        profile: {
          type: "object",
          properties: {
            bio: {
              type: "string",
              description: "User bio",
            },
            internalId: {
              type: "string",
              "ai:hidden": true,
              description: "Internal ID, hidden from AI",
            },
          },
        },
        visibleField: {
          type: "string",
          // No ai:hidden property, should be kept
        },
      },
    } as any;

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.name).toBeDefined();
    expect(result.properties.name.type).toBe("string");
    expect(result.properties.secretField).toBeUndefined(); // Should be removed
    expect(result.properties.age).toBeDefined(); // Should be kept (ai:hidden = false)
    expect(result.properties.age.type).toBe("number");
    expect(result.properties.visibleField).toBeDefined(); // Should be kept (no ai:hidden)
    expect(result.properties.profile).toBeDefined();
    expect(result.properties.profile.properties.bio).toBeDefined();
    expect(result.properties.profile.properties.internalId).toBeUndefined(); // Should be removed
  });

  test("should handle ai:hidden in nested schemas", () => {
    const schema = {
      definitions: {
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            password: {
              type: "string",
              "ai:hidden": true,
            },
          },
        },
      },
      $defs: {
        Settings: {
          type: "object",
          properties: {
            theme: {
              type: "string",
            },
            apiKey: {
              type: "string",
              "ai:hidden": true,
            },
          },
        },
      },
      patternProperties: {
        "^config_": {
          type: "object",
          properties: {
            value: {
              type: "string",
            },
            secret: {
              type: "string",
              "ai:hidden": true,
            },
          },
        },
      },
    } as any;

    const result = toLLMSchema(schema);

    expect(result.definitions.User.properties.name).toBeDefined();
    expect(result.definitions.User.properties.password).toBeUndefined();
    expect(result.$defs.Settings.properties.theme).toBeDefined();
    expect(result.$defs.Settings.properties.apiKey).toBeUndefined();
    expect(result.patternProperties["^config_"].properties.value).toBeDefined();
    expect(result.patternProperties["^config_"].properties.secret).toBeUndefined();
  });

  test("test with existing Upstart schema", () => {
    const transformed = toLLMSchema(sitemapSchema);

    console.log("My schema: ", JSON.stringify(pageOutputObjectLLM));
    expect(transformed.items.properties.id.type).toEqual(sitemapSchema.items.properties.id.type);
  });
});
