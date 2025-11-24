import { Type, type Static } from "@sinclair/typebox";
import { buildOAuthConfigSchema } from "~/shared/datasources/oauth";

const youtubeOAuthConfig = Type.Object({
  accessToken: Type.String(),
  expiresIn: Type.Number(),
  openId: Type.String(),
  refreshExpiresIn: Type.Number(),
  refreshToken: Type.String(),
  scope: Type.String(),
  tokenType: Type.String(),
});

const youtubeFullOAuthConfig = buildOAuthConfigSchema(youtubeOAuthConfig);
export type YoutubeFullOAuthConfig = Static<typeof youtubeFullOAuthConfig>;
