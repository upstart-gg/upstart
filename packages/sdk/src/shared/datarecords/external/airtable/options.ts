import { Type, type Static } from "@sinclair/typebox";

export const airtableOptions = Type.Object({
  externalUrl: Type.Optional(Type.String()),
  baseId: Type.String({
    pattern: "^app[A-Za-z0-9]+$",
    description: 'Airtable Base ID starting with "app"',
  }),
  baseName: Type.Optional(Type.String({
    description: 'Airtable Base Name',
  })),
  tableId: Type.String({
      pattern: "^tbl[A-Za-z0-9]+$",
      description: 'Airtable Table ID starting with "tbl"',
    }),
  tableName: Type.Optional(Type.String({
    description: "Table name as shown in Airtable interface",
  })),
});

export type AirtableOptions = Static<typeof airtableOptions>;
