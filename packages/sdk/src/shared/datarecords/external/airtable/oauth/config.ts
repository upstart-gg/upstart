import { Type, type Static } from "@sinclair/typebox";

export const airtableOAuthTokenSchema = Type.Object({
  scope: Type.String(),
  token_type: Type.String(),
  expires_in: Type.Number(),
  access_token: Type.String(),
  refresh_token: Type.String(),
  refresh_expires_in: Type.Number(),
});
export type AirtableOAuthToken = Static<typeof airtableOAuthTokenSchema>;
