import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "../../../../utils/string-enum";

export const instagramFeedSchema = Type.Object({
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      caption: Type.String(),
      timestamp: Type.String(),
      media_url: Type.String(),
      permalink: Type.String(),
      media_type: StringEnum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
    }),
  ),
  paging: Type.Object({
    cursors: Type.Object({
      before: Type.Optional(Type.String()),
      after: Type.Optional(Type.String()),
    }),
    next: Type.Optional(Type.String()),
  }),
});

export type InstagramFeedSchema = Static<typeof instagramFeedSchema>;
