import { Type, type Static } from "@sinclair/typebox";

export const airtableFields = Type.Array(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    type: Type.String(),
  }),
);
export type AirtableFields = Static<typeof airtableFields>;

const createAirtableTableResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  primaryFieldId: Type.String(),
  fields: airtableFields,
});

export type CreateAirtableTableResponse = Static<typeof createAirtableTableResponseSchema>;

export const airtableOptions = Type.Object({
  externalUrl: Type.Optional(Type.String()),
  baseId: Type.String({
    pattern: "^app[A-Za-z0-9]+$",
    description: 'Airtable Base ID starting with "app"',
  }),
  baseName: Type.Optional(
    Type.String({
      description: "Airtable Base Name",
    }),
  ),
  tableId: Type.String({
    pattern: "^tbl[A-Za-z0-9]+$",
    description: 'Airtable Table ID starting with "tbl"',
  }),
  tableName: Type.Optional(
    Type.String({
      description: "Table name as shown in Airtable interface",
    }),
  ),
  fields: Type.Optional(airtableFields),
});
export type AirtableOptions = Static<typeof airtableOptions>;

export type AirtableBases = {
  id: string;
  name: string;
}[];

export const AirtableFieldTypes = Type.Union([
  Type.Literal("number"),
  Type.Literal("checkbox"),
  Type.Literal("date"),
  Type.Literal("dateTime"),
  Type.Literal("email"),
  Type.Literal("url"),
  Type.Literal("singleLineText"),
  Type.Literal("multilineText"),
  Type.Literal("singleSelect"),
  Type.Literal("multipleSelects"),
]);
export type AirtableFieldType = Static<typeof AirtableFieldTypes>;
