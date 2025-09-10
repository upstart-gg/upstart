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

export type NotionPage = {
  id: string;
  name: string;
};

export type NotionPages = NotionPage[];
export type listPageStatus = "success" | "error" | "max_call_reached" | "max_pages_reached";

export type ListPagesResponse = {
  status: listPageStatus;
  pages: NotionPages;
};
