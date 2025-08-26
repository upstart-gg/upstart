import { Type, type Static } from "@sinclair/typebox";

export const rssOptions = Type.Object({
  url: Type.String({ format: "uri" }),
});

export type RssOptions = Static<typeof rssOptions>;
