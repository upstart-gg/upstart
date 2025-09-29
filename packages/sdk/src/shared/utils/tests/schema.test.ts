import { describe, expect, test, beforeEach } from "vitest";
import { type Static, Type } from "@sinclair/typebox";
import { resolveSchema, validate } from "../schema";
import { toLLMSchema } from "../llm";
import { sitemapSchema } from "~/shared/sitemap";
import type { Manifest } from "~/shared/bricks/manifests/text.manifest";
import { makeFullBrickSchemaForLLM, type Section, sectionSchema } from "~/shared/bricks";
import type { BrickProps } from "~/shared/bricks/props/types";
import { type Datarecord, genericDatarecord } from "~/shared/datarecords/types";

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
    const schema = Type.Object(
      {
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
      },
      {
        examples: [
          { name: "John Doe", age: 30, email: "john.doe@example.com" },
          {
            name: "Jane Smith",
            age: 25,
            email: "jane.smith@example.com",
          },
        ],
      },
    );

    const result = toLLMSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties.name.type).toBe("string");
    expect(result.properties.name.minLength).toBe(1);
    expect(result.properties.name.maxLength).toBe(50);
    expect(result.properties.name.description).toBe("User's name");
    expect(result.properties.age.minimum).toBe(0);
    expect(result.properties.age.maximum).toBe(120);
    expect(result.properties.email.format).toBe("email");
    expect(result.examples).toBeDefined();
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

  test("test with existing Upstart schema", () => {
    const transformed = toLLMSchema(sitemapSchema);
    expect(transformed.items.properties.id.type).toEqual(sitemapSchema.items.properties.id.type);
  });

  test("test with existing sectionSchema", () => {
    const transformed = toLLMSchema(sectionSchema);
    // console.dir({ transformed }, { depth: null });
    expect(transformed.properties.props.type).toEqual(sectionSchema.properties.props.type);
  });
});

describe("toLLMSchema consistency", () => {
  test("toLLMSchema(sectionSchema) should equal sectionSchemaLLM", () => {
    const transformed = toLLMSchema(sectionSchema);
    expect(transformed.properties.props.properties.colorPreset).toBeDefined();
    expect(transformed.properties.props.properties.variant).not.toBeDefined();
  });
});

describe("validation with validate()", () => {
  test("should validate correct schema with @sinclair/typebox", () => {
    const sectionSchemaLLM = toLLMSchema(sectionSchema);
    const validSectionExample: Section = {
      id: "section1",
      label: "Hero Section",
      order: 1,
      props: {
        colorPreset: {
          color: "primary-100",
        },
        maxWidth: "max-w-full",
        verticalMargin: "28px",
        direction: "flex-col",
      },
      bricks: [],
    };
    expect(() => validate(sectionSchema, validSectionExample), "Section schema").not.toThrow();
    expect(() => validate(sectionSchemaLLM, validSectionExample), "Section schema LLM").not.toThrow();
  });

  test("should validate correct schema", () => {
    const sectionSchemaLLM = toLLMSchema(sectionSchema);
    const validSectionExample: Section = {
      id: "section1",
      label: "Hero Section",
      order: 1,
      props: {
        colorPreset: {
          color: "primary-100",
        },
        maxWidth: "max-w-full",
        verticalMargin: "28px",
        direction: "flex-col",
      },
      bricks: [],
    };
    expect(() => validate(sectionSchemaLLM, validSectionExample)).not.toThrow();
  });

  test("should validate a brick without mobileProps", () => {
    const schema = makeFullBrickSchemaForLLM("text");
    const example: BrickProps<Manifest>["brick"] = {
      id: "test-brick-1",
      type: "text",
      props: {
        content: "Hello, world!",
      },
    };
    expect(() => validate(schema, example), `Brick without mobileProps`).not.toThrow();
  });

  test("should validate unions of literals", () => {
    const schema = genericDatarecord;
    const example: Datarecord = {
      id: "newsletter_subscriptions",
      provider: "internal",
      label: "Newsletter Subscriptions",
      description: "Stores newsletter subscription entries",
      schema: {
        type: "object",
        properties: {
          firstname: { type: "string", title: "Firstname" },
        },
        required: ["email"],
        title: "Newsletter Subscription",
      },
    };
    expect(() => validate(schema, example)).not.toThrow();
    expect(() => validate(toLLMSchema(schema), example)).not.toThrow();

    const arrayOfDatarecords: Datarecord[] = [
      example,
      {
        id: "user_profiles",
        provider: "airtable",
        label: "User Profiles",
        schema: {
          type: "object",
          properties: {
            username: { type: "string", title: "Username" },
            bio: { type: "string", title: "Bio" },
          },
          required: ["username"],
          title: "User Profile",
        },
      },
    ];
    expect(() => validate(Type.Array(schema), arrayOfDatarecords)).not.toThrow();
    expect(() => validate(toLLMSchema(Type.Array(schema)), arrayOfDatarecords)).not.toThrow();
  });

  test("should validate a brick with partial mobileProps", () => {
    const schema = makeFullBrickSchemaForLLM("text");
    const example: BrickProps<Manifest>["brick"] = {
      id: "test-brick-1",
      type: "text",
      props: {
        content: "Hello, world!",
      },
      mobileProps: {},
    };
    expect(() => validate(schema, example)).not.toThrow();

    const example2: BrickProps<Manifest>["brick"] = {
      id: "test-brick-1",
      type: "text",
      props: {
        content: "Hello, world!",
      },
      mobileProps: {
        colorPreset: {
          color: "primary-100",
        },
      },
    };
    expect(() => validate(schema, example2)).not.toThrow();
  });
});
