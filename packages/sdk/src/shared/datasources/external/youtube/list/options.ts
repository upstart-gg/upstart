import { Type, type Static } from "@sinclair/typebox";

export const youtubeListOptions = Type.Object({
  channelId: Type.String(),
  order: Type.Optional(Type.String()),
  maxResults: Type.Optional(Type.Number()),
  regionCode: Type.Optional(Type.String()),
  relevanceLanguage: Type.Optional(Type.String()),
});

export type YoutubeListOptions = Static<typeof youtubeListOptions>;
