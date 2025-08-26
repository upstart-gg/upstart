import { Type, type Static } from "@sinclair/typebox";

export const mastodonCommonOptions = Type.Object({
  username: Type.String(),
});
export type MastodonCommonOptions = Static<typeof mastodonCommonOptions>;
