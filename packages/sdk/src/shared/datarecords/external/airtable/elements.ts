import { Type, type Static } from "@sinclair/typebox";

export const airtableTable = Type.Object({
  id: Type.String(),
  name: Type.String(),
  primaryFieldId: Type.String(),
  description: Type.Optional(Type.String()),
});
export type AirtableTable = Static<typeof airtableTable>;

export const airtableBase = Type.Object({
  id: Type.String(),
  name: Type.String(),
  permissionLevel: Type.String(),
  tables: Type.Array(airtableTable),
});
export type AirtableBase = Static<typeof airtableBase>;
