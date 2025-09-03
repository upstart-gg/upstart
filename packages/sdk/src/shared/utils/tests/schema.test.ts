import { describe, expect, test, beforeEach, vi } from "vitest";
import { Type } from "@sinclair/typebox";
import { resolveSchema, toLLMSchema, inlineSchemaRefs } from "../schema";
import { ajv } from "../../ajv";
import { sitemapSchema, sitemapSchemaLLM } from "~/shared/sitemap";

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

  test("should throw error for non-existent $ref", () => {
    const schemaWithRef = Type.Ref("test:nonexistent");

    expect(() => resolveSchema(schemaWithRef)).toThrow("Schema not found for reference: test:nonexistent");
  });

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
    console.log(JSON.stringify(sitemapSchemaLLM, null, 2));
    expect(transformed.items.properties.id.type).toEqual(sitemapSchema.items.properties.id.type);
  });
});

describe("inlineSchemaRefs tests suite", () => {
  beforeEach(() => {
    // Clear any test schemas before each test
    ajv.removeSchema("test:user");
    ajv.removeSchema("test:address");
    ajv.removeSchema("test:profile");
    ajv.removeSchema("test:company");
    ajv.removeSchema("test:person");
    ajv.removeSchema("test:contact");
    ajv.removeSchema("test:nested");
    ajv.removeSchema("test:simple");
    ajv.removeSchema("test:base");
    ajv.removeSchema("test:extended");
    ajv.removeSchema("test:string");
    ajv.removeSchema("test:number");
    ajv.removeSchema("https://example.com/schemas/user");
    ajv.removeSchema("https://example.com/schemas/address");
  });

  test("should handle schema without references", () => {
    const schema = Type.Object({
      name: Type.String(),
      age: Type.Number(),
    });

    const result = inlineSchemaRefs(schema);

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        ...schema,
        $defs: {},
      }),
    );
  });

  test("should inline simple external reference", () => {
    const userSchema = Type.Object({
      name: Type.String(),
      email: Type.String({ format: "email" }),
    });

    ajv.addSchema(userSchema, "test:user");

    const schema = Type.Object({
      owner: Type.Ref("test:user"),
      createdAt: Type.String({ format: "date-time" }),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(1);
    const defKey = Object.keys(result.$defs)[0];
    expect(result.$defs[defKey].type).toEqual(userSchema.type);
    expect(result.properties.owner.$ref).toBe(`#/$defs/${defKey}`);
    expect(result.properties.createdAt.type).toEqual(schema.properties.createdAt.type);
  });

  test("should inline multiple different references", () => {
    const userSchema = Type.Object({
      name: Type.String(),
      email: Type.String(),
    });

    const addressSchema = Type.Object({
      street: Type.String(),
      city: Type.String(),
      country: Type.String(),
    });

    ajv.addSchema(userSchema, "test:user");
    ajv.addSchema(addressSchema, "test:address");

    const schema = Type.Object({
      user: Type.Ref("test:user"),
      address: Type.Ref("test:address"),
      metadata: Type.Object({
        created: Type.String(),
      }),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(2);

    // Find the keys for each reference
    const userDefKey = Object.keys(result.$defs).find(
      (key) => JSON.stringify(result.$defs[key]) === JSON.stringify(userSchema),
    );
    const addressDefKey = Object.keys(result.$defs).find(
      (key) => JSON.stringify(result.$defs[key]) === JSON.stringify(addressSchema),
    );

    expect(userDefKey).toBeDefined();
    expect(addressDefKey).toBeDefined();
    expect(result.properties.user.$ref).toBe(`#/$defs/${userDefKey}`);
    expect(result.properties.address.$ref).toBe(`#/$defs/${addressDefKey}`);
    expect(result.properties.metadata.type).toEqual(schema.properties.metadata.type);
  });

  test("should handle same reference used multiple times", () => {
    const personSchema = Type.Object({
      name: Type.String(),
      age: Type.Number(),
    });

    ajv.addSchema(personSchema, "test:person");

    const schema = Type.Object({
      owner: Type.Ref("test:person"),
      manager: Type.Ref("test:person"),
      employees: Type.Array(Type.Ref("test:person")),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(1);
    const defKey = Object.keys(result.$defs)[0];
    expect(result.$defs[defKey].type).toEqual(personSchema.type);

    // All references should point to the same $defs entry
    expect(result.properties.owner.$ref).toBe(`#/$defs/${defKey}`);
    expect(result.properties.manager.$ref).toBe(`#/$defs/${defKey}`);
    expect(result.properties.employees.items.$ref).toBe(`#/$defs/${defKey}`);
  });

  test("should handle nested references", () => {
    const addressSchema = Type.Object({
      street: Type.String(),
      city: Type.String(),
    });

    const userSchema = Type.Object({
      name: Type.String(),
      address: Type.Ref("test:address"),
    });

    ajv.addSchema(addressSchema, "test:address");
    ajv.addSchema(userSchema, "test:user");

    const schema = Type.Object({
      user: Type.Ref("test:user"),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(2);

    // Find the inlined schemas
    const addressDefKey = Object.keys(result.$defs).find(
      (key) => result.$defs[key].properties?.street && result.$defs[key].properties?.city,
    );
    const userDefKey = Object.keys(result.$defs).find(
      (key) => result.$defs[key].properties?.name && result.$defs[key].properties?.address,
    );

    expect(addressDefKey).toBeDefined();
    expect(userDefKey).toBeDefined();
    expect(JSON.stringify(result.$defs[addressDefKey!])).toEqual(JSON.stringify(addressSchema));
    expect(result.$defs[userDefKey!].properties.address.$ref).toBe(`#/$defs/${addressDefKey}`);
    expect(result.properties.user.$ref).toBe(`#/$defs/${userDefKey}`);
  });

  test("should handle references in arrays", () => {
    const itemSchema = Type.Object({
      id: Type.Number(),
      name: Type.String(),
    });

    ajv.addSchema(itemSchema, "test:item");

    const schema = Type.Object({
      items: Type.Array(Type.Ref("test:item")),
      featured: Type.Ref("test:item"),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(1);
    const defKey = Object.keys(result.$defs)[0];
    expect(result.$defs[defKey].type).toEqual(itemSchema.type);
    expect(result.properties.items.items.$ref).toBe(`#/$defs/${defKey}`);
    expect(result.properties.featured.$ref).toBe(`#/$defs/${defKey}`);
  });

  test("should handle references in union types (anyOf)", () => {
    const stringSchema = Type.String();
    const numberSchema = Type.Number();

    ajv.addSchema(stringSchema, "test:string");
    ajv.addSchema(numberSchema, "test:number");

    const schema = Type.Object({
      value: Type.Union([Type.Ref("test:string"), Type.Ref("test:number")]),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(2);

    const stringDefKey = Object.keys(result.$defs).find((key) => result.$defs[key].type === "string");
    const numberDefKey = Object.keys(result.$defs).find((key) => result.$defs[key].type === "number");

    expect(stringDefKey).toBeDefined();
    expect(numberDefKey).toBeDefined();
    expect(result.properties.value.anyOf[0].$ref).toBe(`#/$defs/${stringDefKey}`);
    expect(result.properties.value.anyOf[1].$ref).toBe(`#/$defs/${numberDefKey}`);
  });

  test("should handle references in conditional schemas", () => {
    const userSchema = Type.Object({
      name: Type.String(),
      type: Type.Literal("user"),
    });

    const adminSchema = Type.Object({
      name: Type.String(),
      permissions: Type.Array(Type.String()),
      type: Type.Literal("admin"),
    });

    ajv.addSchema(userSchema, "test:user");
    ajv.addSchema(adminSchema, "test:admin");

    const schema = {
      type: "object",
      properties: {
        account: {
          if: { properties: { type: { const: "admin" } } },
          // biome-ignore lint/suspicious/noThenProperty: Required for JSON schema conditional validation
          then: { $ref: "test:admin" },
          else: { $ref: "test:user" },
        },
      },
    } as any;

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(2);

    const userDefKey = Object.keys(result.$defs).find(
      (key) => result.$defs[key].properties?.type?.const === "user",
    );
    const adminDefKey = Object.keys(result.$defs).find((key) => result.$defs[key].properties?.permissions);

    expect(userDefKey).toBeDefined();
    expect(adminDefKey).toBeDefined();
    expect(result.properties.account.then.$ref).toBe(`#/$defs/${adminDefKey}`);
    expect(result.properties.account.else.$ref).toBe(`#/$defs/${userDefKey}`);
  });

  test("should handle schemas with existing $defs", () => {
    const externalSchema = Type.Object({
      id: Type.String(),
      name: Type.String(),
    });

    ajv.addSchema(externalSchema, "test:external");

    const schema = {
      type: "object",
      properties: {
        internal: { $ref: "#/$defs/Internal" },
        external: { $ref: "test:external" },
      },
      $defs: {
        Internal: {
          type: "object",
          properties: {
            value: { type: "string" },
          },
        },
      },
    } as any;

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(result.$defs.Internal).toEqual(schema.$defs.Internal); // Original $defs preserved

    // External reference should be inlined
    const externalDefKey = Object.keys(result.$defs).find(
      (key) => key !== "Internal" && result.$defs[key].properties?.id && result.$defs[key].properties?.name,
    );
    expect(externalDefKey).toBeDefined();
    expect(result.$defs[externalDefKey!].type).toEqual(externalSchema.type);
    expect(result.properties.external.$ref).toBe(`#/$defs/${externalDefKey}`);
    expect(result.properties.internal.$ref).toBe("#/$defs/Internal"); // Internal ref unchanged
  });

  test("should handle URI-style references", () => {
    const userSchema = Type.Object({
      name: Type.String(),
      email: Type.String(),
    });

    const addressSchema = Type.Object({
      street: Type.String(),
      country: Type.String(),
    });

    ajv.addSchema(userSchema, "https://example.com/schemas/user");
    ajv.addSchema(addressSchema, "https://example.com/schemas/address");

    const schema = Type.Object({
      user: Type.Ref("https://example.com/schemas/user"),
      address: Type.Ref("https://example.com/schemas/address"),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(2);

    // Check that schemas are properly inlined with clean keys
    const defKeys = Object.keys(result.$defs);
    expect(defKeys.some((key) => key.includes("user") || key.includes("schemas"))).toBe(true);
    expect(defKeys.some((key) => key.includes("address") || key.includes("schemas"))).toBe(true);

    // Verify references are updated
    expect(result.properties.user.$ref).toMatch(/^#\/\$defs\/.+/);
    expect(result.properties.address.$ref).toMatch(/^#\/\$defs\/.+/);
  });

  test("should handle non-existent references gracefully", () => {
    const existingSchema = Type.Object({
      name: Type.String(),
    });

    ajv.addSchema(existingSchema, "test:existing");

    const schema = Type.Object({
      valid: Type.Ref("test:existing"),
      invalid: Type.Ref("test:nonexistent"),
    });

    // Should not throw but should log a warning (we can't easily test console.warn in this context)
    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(1); // Only the existing schema should be inlined

    const defKey = Object.keys(result.$defs)[0];
    expect(result.$defs[defKey].type).toEqual(existingSchema.type);
    expect(result.properties.valid.$ref).toBe(`#/$defs/${defKey}`);
    expect(result.properties.invalid.$ref).toBe("test:nonexistent"); // Should remain unchanged
  });

  test("should handle empty schema", () => {
    const schema = Type.Object({});

    const result = inlineSchemaRefs(schema);

    expect(JSON.stringify(result)).toEqual(
      JSON.stringify({
        ...schema,
        $defs: {},
      }),
    );
  });

  test("should handle schema with only local references", () => {
    const schema = {
      type: "object",
      properties: {
        user: { $ref: "#/$defs/User" },
        address: { $ref: "#/definitions/Address" },
      },
      $defs: {
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
      },
      definitions: {
        Address: {
          type: "object",
          properties: {
            street: { type: "string" },
          },
        },
      },
    } as any;

    const result = inlineSchemaRefs(schema);

    // Should preserve the original structure since all refs are local
    expect(result.$defs).toEqual(schema.$defs);
    expect(result.definitions).toEqual(schema.definitions);
    expect(result.properties.user.$ref).toBe("#/$defs/User");
    expect(result.properties.address.$ref).toBe("#/definitions/Address");
  });

  test("should handle complex nested structure with mixed references", () => {
    const profileSchema = Type.Object({
      bio: Type.String(),
      website: Type.Optional(Type.String({ format: "uri" })),
    });

    const companySchema = Type.Object({
      name: Type.String(),
      employees: Type.Array(Type.Ref("test:user")),
    });

    const userSchema = Type.Object({
      name: Type.String(),
      profile: Type.Ref("test:profile"),
      company: Type.Optional(Type.Ref("test:company")),
    });

    ajv.addSchema(profileSchema, "test:profile");
    ajv.addSchema(companySchema, "test:company");
    ajv.addSchema(userSchema, "test:user");

    const schema = Type.Object({
      users: Type.Array(Type.Ref("test:user")),
      totalCount: Type.Number(),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(3);

    // Verify all schemas are inlined
    const profileDefKey = Object.keys(result.$defs).find((key) => result.$defs[key].properties?.bio);
    const companyDefKey = Object.keys(result.$defs).find((key) => result.$defs[key].properties?.employees);
    const userDefKey = Object.keys(result.$defs).find(
      (key) => result.$defs[key].properties?.name && result.$defs[key].properties?.profile,
    );

    expect(profileDefKey).toBeDefined();
    expect(companyDefKey).toBeDefined();
    expect(userDefKey).toBeDefined();

    // Verify cross-references are properly updated
    expect(result.$defs[userDefKey!].properties.profile.$ref).toBe(`#/$defs/${profileDefKey}`);
    expect(result.$defs[userDefKey!].properties.company.$ref).toBe(`#/$defs/${companyDefKey}`);
    expect(result.$defs[companyDefKey!].properties.employees.items.$ref).toBe(`#/$defs/${userDefKey}`);
    expect(result.properties.users.items.$ref).toBe(`#/$defs/${userDefKey}`);
  });

  test("should handle unique key generation for similar reference names", () => {
    const schema1 = Type.Object({ value: Type.String() });
    const schema2 = Type.Object({ value: Type.Number() });
    const schema3 = Type.Object({ value: Type.Boolean() });

    ajv.addSchema(schema1, "test:data");
    ajv.addSchema(schema2, "test:data_1"); // Similar name
    ajv.addSchema(schema3, "test:data_2"); // Similar name

    const schema = Type.Object({
      first: Type.Ref("test:data"),
      second: Type.Ref("test:data_1"),
      third: Type.Ref("test:data_2"),
    });

    const result = inlineSchemaRefs(schema);

    expect(result.$defs).toBeDefined();
    expect(Object.keys(result.$defs)).toHaveLength(3);

    // All references should be properly inlined with unique keys
    const defKeys = Object.keys(result.$defs);
    expect(defKeys).toHaveLength(3);
    expect(new Set(defKeys)).toHaveLength(3); // All keys should be unique

    // Verify each reference points to correct schema
    const firstDefKey = result.properties.first.$ref.replace("#/$defs/", "");
    const secondDefKey = result.properties.second.$ref.replace("#/$defs/", "");
    const thirdDefKey = result.properties.third.$ref.replace("#/$defs/", "");

    expect(result.$defs[firstDefKey].properties.value.type).toBe("string");
    expect(result.$defs[secondDefKey].properties.value.type).toBe("number");
    expect(result.$defs[thirdDefKey].properties.value.type).toBe("boolean");
  });
});
