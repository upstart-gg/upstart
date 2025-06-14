import { Type, type Static } from "@sinclair/typebox";
import { airtableOptions } from "./external/airtable/options";
import { googleSheetsOptions } from "./external/google/sheets/options";
import { genericWebhookOptions } from "./external/generic-webhook/options";

export const connectorSchema = Type.Union([
  Type.Literal("airtable"),
  Type.Literal("google-sheets"),
  // a generic webhook
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

export const datarecordsConnectors = Type.Union([
  Type.Object({
    provider: Type.Literal("airtable"),
    options: airtableOptions,
  }),
  Type.Object({
    provider: Type.Literal("google-sheets"),
    options: googleSheetsOptions,
  }),
  Type.Object({
    provider: Type.Literal("generic-webhook"),
    options: genericWebhookOptions,
  }),
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

export type DatarecordManifest = Static<typeof datarecordManifest>;

export const datarecordsMap = Type.Record(Type.String(), datarecordManifest, {
  title: "Datarecords map",
  description: "The map of Datarecords available",
});

export type DatarecordsMap = Static<typeof datarecordsMap>;

export type DatarecordResolved<T extends DatarecordsMap> = {
  [K in keyof T]: unknown;
};
