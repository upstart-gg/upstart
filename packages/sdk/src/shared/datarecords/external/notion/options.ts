import { Type, type Static } from "@sinclair/typebox";

export const notionOptions = Type.Object({
  url: Type.Optional(Type.String()),
  id: Type.String({
    pattern: "^[A-Za-z0-9\\-]+$",
    description: "Notion Database ID",
  }),
  name: Type.String({
    description: "Notion Database Name",
  }),
  properties: Type.Any(),
});

export type NotionOptions = Static<typeof notionOptions>;
