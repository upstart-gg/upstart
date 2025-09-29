import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "../../../../utils/string-enum";
import { mastodonAccountSchema } from "../account/schema";

const mastodonMediaAttachmentSchema = Type.Object({
  id: Type.String(),
  type: StringEnum(["audio", "image", "video", "gifv", "unknown"]),
  url: Type.String(),
  preview_url: Type.Optional(Type.String()),
  remote_url: Type.Optional(Type.String()),
  meta: Type.Record(Type.String(), Type.Any()),
  description: Type.Optional(Type.String()),
  blurhash: Type.Optional(Type.String()),
});

const mastodonEmojiSchema = Type.Object({
  shortcode: Type.String(),
  url: Type.String(),
  static_url: Type.String(),
  visible_in_picker: Type.Boolean(),
  category: Type.Optional(Type.String()),
});

const mastodonPreviewCardSchema = Type.Object({
  url: Type.String(),
  title: Type.String(),
  description: Type.String(),
  type: StringEnum(["link", "photo", "video", "rich"]),
  author_name: Type.String(),
  author_url: Type.String(),
  provider_name: Type.String(),
  provider_url: Type.String(),
  html: Type.String(),
  width: Type.Number(),
  height: Type.Number(),
  image: Type.Optional(Type.String()),
  embed_url: Type.String(),
  blurhash: Type.Optional(Type.String()),
});

const mastodonPollSchema = Type.Object({
  id: Type.String(),
  expires_at: Type.String(),
  expired: Type.Boolean(),
  multiple: Type.Boolean(),
  votes_count: Type.Number(),
  options: Type.Array(
    Type.Object({
      title: Type.String(),
      votes_count: Type.Number(),
    }),
  ),
  voted: Type.Optional(Type.Boolean()),
  own_votes: Type.Optional(Type.Array(Type.Number())),
  emojis: Type.Array(mastodonEmojiSchema),
});

export const mastodonStatusSchema = Type.Object({
  id: Type.String(),
  uri: Type.String(),
  created_at: Type.String(),
  account: mastodonAccountSchema,
  content: Type.String(),
  visibility: StringEnum(["public", "unlisted", "private", "direct"]),
  sensitive: Type.Boolean(),
  media_attachments: Type.Array(mastodonMediaAttachmentSchema),
  application: Type.Optional(
    Type.Object({
      name: Type.String(),
      website: Type.Optional(Type.String()),
    }),
  ),
  mentions: Type.Array(
    Type.Object({
      id: Type.String(),
      username: Type.String(),
      acct: Type.String(),
      url: Type.String(),
    }),
  ),
  tags: Type.Array(
    Type.Object({
      name: Type.String(),
      url: Type.String(),
    }),
  ),
  emojis: Type.Array(mastodonEmojiSchema),
  reblogs_count: Type.Number(),
  favourites_count: Type.Number(),
  replies_count: Type.Number(),
  url: Type.String(),
  in_reply_to_id: Type.Optional(Type.String()),
  in_reply_to_account_id: Type.Optional(Type.String()),
  reblog: Type.Optional(Type.Ref("mastodonStatus")),
  poll: Type.Optional(mastodonPollSchema),
  card: Type.Optional(mastodonPreviewCardSchema),
  language: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
  edited_at: Type.Optional(Type.String()),
  favourited: Type.Optional(Type.Boolean()),
  reblogged: Type.Optional(Type.Boolean()),
  muted: Type.Optional(Type.Boolean()),
  bookmarked: Type.Optional(Type.Boolean()),
  pinned: Type.Optional(Type.Boolean()),
});

export type MastodonStatusSchema = Static<typeof mastodonStatusSchema>;

export const mastodonStatusArraySchema = Type.Array(mastodonStatusSchema);
export type MastodonStatusArraySchema = Static<typeof mastodonStatusArraySchema>;
