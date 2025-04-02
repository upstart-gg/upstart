import { Type, type Static } from "@sinclair/typebox";

export const tiktokVideoListSchema = Type.Object({
  data: Type.Object({
    has_more: Type.Boolean(),
    cursor: Type.Number(),
    videos: Type.Array(
      Type.Object({
        title: Type.String(),
        video_description: Type.String(),
        cover_image_url: Type.String(),
        duration: Type.Number(),
        embed_link: Type.String(),
        id: Type.String(),
      }),
    ),
  }),
  error: Type.Optional(
    Type.Object({
      code: Type.String(),
      message: Type.String(),
      log_id: Type.String(),
    }),
  ),
});

export type TiktokVideoListSchema = Static<typeof tiktokVideoListSchema>;
