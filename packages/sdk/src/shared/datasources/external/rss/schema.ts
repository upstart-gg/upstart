import { Type, type Static } from "@sinclair/typebox";

export const rssSchema = Type.Array(
  Type.Object({
    title: Type.Optional(
      Type.String({
        title: "Title",
        description: "The title of the RSS feed item",
      }),
    ),
    link: Type.Optional(
      Type.String({
        title: "Link",
        description: "The link to the RSS feed item",
      }),
    ),
    creator: Type.Optional(
      Type.String({
        title: "Creator",
        description: "The creator of the RSS feed item",
      }),
    ),
    content: Type.Optional(
      Type.String({
        title: "Content",
        description: "The content of the RSS feed item",
      }),
    ),
    pubDate: Type.Optional(
      Type.String({
        title: "Pub Date",
        description: "The publication date of the RSS feed item",
      }),
    ),
  }),
  {
    title: "RSS Feed",
    description: "RSS feed items",
  },
);

export type RssSchema = Static<typeof rssSchema>;
