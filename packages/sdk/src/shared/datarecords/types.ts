import { Type, type Static } from "@sinclair/typebox";
import { airtableOptions } from "./external/airtable/options";
import { genericWebhookOptions } from "./external/generic-webhook/options";
import { googleSheetsOptions } from "./external/google/sheets/options";
import { notionOptions } from "./external/notion/options";

export const connectorSchema = Type.Union([
  Type.Literal("airtable"),
  Type.Literal("google-sheets"),
  Type.Literal("notion"),
  Type.Literal("generic-webhook"),
  // saved to Upstart platform
  Type.Literal("internal"),
]);

export type DatarecordConnector = Static<typeof connectorSchema>;

const internalDatarecord = Type.Object(
  {
    provider: Type.Literal("internal"),
    // options: Type.Optional(Type.Any()),
    schema: Type.Any({
      title: "Schema",
      description:
        "JSON Schema of the datarecord. Always of type 'object' and representing a row that will be saved.",
      examples: [
        {
          type: "object",
          properties: {
            firstname: { type: "string", title: "Firstname" },
            lastname: { type: "string", title: "Lastname" },
            email: { type: "string", format: "email", title: "Email" },
          },
          required: ["email"],
          title: "Newsletter Subscription",
        },
      ],
    }),
    indexes: Type.Array(
      Type.Object({
        name: Type.String({ title: "Index name" }),
        fields: Type.Array(Type.String(), { title: "Fields to index" }),
        unique: Type.Optional(Type.Boolean({ title: "Unique index", default: false })),
      }),
      {
        title: "Indexes",
        description:
          "IMPORTANT: Indexes to create on the datarecord. use it to enforce uniqueness or improve query performance.",
      },
    ),
  },
  {
    examples: [
      {
        provider: "internal",
        schema: {
          type: "object",
          properties: {
            firstname: { type: "string", title: "Firstname" },
            lastname: { type: "string", title: "Lastname" },
            email: { type: "string", format: "email", title: "Email" },
          },
          required: ["email"],
          title: "Newsletter Subscription",
        },
        indexes: [
          {
            name: "email_index",
            fields: ["email"],
            unique: true,
          },
        ],
      },
    ],
  },
);

// Schema commun à tous les datarecords
const commonDatarecordSchema = Type.Object({
  schema: Type.Any({
    title: "Schema",
    description:
      "JSON Schema of the datarecord. Always of type 'object' and representing a row that will be saved.",
    examples: [
      {
        type: "object",
        properties: {
          firstname: { type: "string", title: "Firstname" },
          lastname: { type: "string", title: "Lastname" },
          email: { type: "string", format: "email", title: "Email" },
        },
        required: ["email"],
        title: "Newsletter Subscription",
      },
    ],
  }),
});

export const datarecordsConnectors = Type.Union([
  Type.Composite([
    Type.Object({
      provider: Type.Literal("airtable"),
      options: airtableOptions,
    }),
    commonDatarecordSchema,
  ]),
  Type.Composite([
    Type.Object({
      provider: Type.Literal("google-sheets"),
      options: googleSheetsOptions,
    }),
    commonDatarecordSchema,
  ]),
  Type.Composite([
    Type.Object({
      provider: Type.Literal("notion"),
      options: notionOptions,
    }),
    commonDatarecordSchema,
  ]),
  Type.Composite([
    Type.Object({
      provider: Type.Literal("generic-webhook"),
      options: genericWebhookOptions,
    }),
    commonDatarecordSchema,
  ]),
  internalDatarecord,
]);

const datarecordMetadata = Type.Object({
  id: Type.String({
    title: "Datarecord ID",
    comment: "A unique identifier for the datarecord, e.g., 'newsletter_subscriptions'",
  }),
  label: Type.String({
    title: "Name of the datarecord",
    comment: "For example, 'Newsletter Subscriptions'",
  }),
  description: Type.Optional(Type.String({ title: "Description of the datarecord" })),
});

const datarecordManifest = Type.Composite([datarecordsConnectors, datarecordMetadata]);

export const internalDatarecordManifest = Type.Composite([datarecordMetadata, internalDatarecord]);
export type Datarecord = Static<typeof datarecordManifest>;

export const datarecordsList = Type.Array(datarecordManifest);
export type DatarecordsList = Static<typeof datarecordsList>;

export const table = Type.Object({
  id: Type.String(),
  name: Type.String(),
  data: Type.Any(),
  base: Type.Optional(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      data: Type.Any(),
    }),
  ),
});
export type Table = Static<typeof table>;

export const tablesList = Type.Array(table);
export type TablesList = Static<typeof tablesList>;

// Schema field types - each field type as a separate schema

export const stringProperty = Type.Object({
  type: Type.Literal("string"),
  title: Type.String({ description: "String field. May be single-line or multi-line, enum, email or url" }),
  format: Type.Optional(
    Type.Union([Type.Literal("email"), Type.Literal("url"), Type.Literal("date"), Type.Literal("date-time")]),
  ),
  "ui:placeholder": Type.Optional(Type.String()),
  minLength: Type.Optional(Type.Number()),
  maxLength: Type.Optional(Type.Number()),
  enum: Type.Optional(Type.Array(Type.String(), { minItems: 1 })),
  metadata: Type.Optional(
    Type.Object({
      order: Type.Optional(Type.Number()),
      "ui:multiline": Type.Literal(true),
    }),
  ),
});
export type StringProperty = Static<typeof stringProperty>;

export const booleanProperty = Type.Object({
  type: Type.Literal("boolean"),
  title: Type.String(),
  metadata: Type.Optional(
    Type.Object({
      order: Type.Optional(Type.Number()),
    }),
  ),
});
export type BooleanProperty = Static<typeof booleanProperty>;

export const numberProperty = Type.Object({
  type: Type.Literal("number"),
  title: Type.String(),
  min: Type.Optional(Type.Number()),
  max: Type.Optional(Type.Number()),
  default: Type.Optional(Type.Number()),
  metadata: Type.Optional(
    Type.Object({
      order: Type.Optional(Type.Number()),
    }),
  ),
});
export type NumberProperty = Static<typeof numberProperty>;

// Union of all field types
export const schemaProperty = Type.Union([stringProperty, booleanProperty, numberProperty]);

export type SchemaProperty = Static<typeof schemaProperty>;

export const schemaProperties = Type.Record(Type.String(), schemaProperty);
export type SchemaProperties = Static<typeof schemaProperties>;

export const schema = Type.Object({
  id: Type.Optional(Type.String()),
  type: Type.Literal("object"),
  properties: schemaProperties,
  required: Type.Optional(Type.Array(Type.String())),
});
export type Schema = Static<typeof schema>;
