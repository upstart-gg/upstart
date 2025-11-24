import { Type, type Static } from "@sinclair/typebox";
import { airtableOptions } from "./external/airtable/types";
import { googleSheetsOptions } from "./external/google/sheets/types";
import { notionOptions } from "./external/notion/types";
import { StringEnum } from "../utils/string-enum";

export const connectorSchema = StringEnum(["airtable", "google-sheets", "notion", "internal"]);

export type DatarecordConnector = Static<typeof connectorSchema>;

export const internalDatarecord = Type.Object(
  {
    provider: Type.Literal("internal"),
    // options: Type.Optional(Type.Any()),
    schema: Type.Object(
      {},
      {
        title: "Schema",
        additionalProperties: true,
        description:
          "JSON Schema. Always of type 'object' and representing a row that will be saved in the database.",
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
  schema: Type.Object(
    {},
    {
      additionalProperties: true,
      title: "Schema",
      description: "JSON Schema. Always of type 'object' and representing a row that will be saved.",
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
    },
  ),
});

const commonDatarecordMetadata = Type.Object({
  id: Type.String({
    title: "ID",
    description: "A unique identifier, e.g., 'newsletter_subscriptions'",
    comment: "A unique identifier, e.g., 'newsletter_subscriptions'",
  }),
  label: Type.String({
    title: "Name",
    description: "Human-friendly name",
    comment: "For example, 'Newsletter Subscriptions'",
  }),
  description: Type.Optional(Type.String({ title: "Description" })),
});

export const genericDatarecord = Type.Composite([
  Type.Union([
    Type.Object({
      provider: Type.Literal("airtable"),
      options: airtableOptions,
    }),
    Type.Object({
      provider: Type.Literal("google-sheets"),
      options: googleSheetsOptions,
    }),
    Type.Object({
      provider: Type.Literal("notion"),
      options: notionOptions,
    }),
    internalDatarecord,
  ]),
  commonDatarecordMetadata,
  commonDatarecordSchema,
]);

export type Datarecord = Static<typeof genericDatarecord>;

export type InternalDatarecord = Omit<Static<typeof genericDatarecord>, "provider"> & {
  provider: "internal";
};

export const datarecordsList = Type.Array(genericDatarecord);
export type DatarecordsList = Static<typeof datarecordsList>;
