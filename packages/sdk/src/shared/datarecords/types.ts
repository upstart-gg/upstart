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

const connectorsChoices = Type.Union([
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
  Type.Object({
    provider: Type.Literal("internal"),
    options: Type.Any(),
    schema: Type.Union([
      Type.Array(Type.Object({}, { additionalProperties: true })),
      Type.Object({}, { additionalProperties: true }),
    ]),
  }),
]);

const datarecordManifest = Type.Composite([
  connectorsChoices,
  Type.Object({
    label: Type.String({
      title: "Name of the datarecord",
      comment: "For example, 'Newsletter Subscriptions'",
    }),
    description: Type.Optional(Type.String({ title: "Description of the datarecord" })),
  }),
]);

export type DatarecordManifest = Static<typeof datarecordManifest>;

export const datarecordsMap = Type.Record(Type.String(), datarecordManifest, {
  title: "Datarecords map",
  description: "The map of Datarecords available",
});

export type DatarecordsMap = Static<typeof datarecordsMap>;

export type DatarecordResolved<T extends DatarecordsMap> = {
  [K in keyof T]: unknown;
};
