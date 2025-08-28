import { Type, type Static } from "@sinclair/typebox";

export const notionOAuthTokenSchema = Type.Object({
  access_token: Type.String(),
  refresh_token: Type.String(),
});
export type NotionOAuthToken = Static<typeof notionOAuthTokenSchema>;
