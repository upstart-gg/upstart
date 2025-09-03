import { Type, type Static } from "@sinclair/typebox";

export const googleSheetsOptions = Type.Object({
  spreadsheetId: Type.String(),
  spreadsheetUrl: Type.Optional(Type.String()),
  spreadsheetName: Type.Optional(Type.String()),
  externalUrl: Type.Optional(Type.String()),
});

export type GoogleSheetsOptions = Static<typeof googleSheetsOptions>;
