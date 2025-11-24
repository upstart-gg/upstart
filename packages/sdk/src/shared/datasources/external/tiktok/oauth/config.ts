import { Type, type StaticDecode, type Static } from "@sinclair/typebox";
import { buildOAuthConfigSchema } from "~/shared/datasources/oauth";

const tiktokOAuthConfig = Type.Object({
  accessToken: Type.String(),
  expiresIn: Type.Number(),
  openId: Type.String(),
  refreshExpiresIn: Type.Number(),
  refreshToken: Type.String(),
  scope: Type.String(),
  tokenType: Type.String(),
});

export type TiktokOAuthConfig = Static<typeof tiktokOAuthConfig>;

const tiktokFullOAuthConfig = buildOAuthConfigSchema(tiktokOAuthConfig);
export type TiktokFullOAuthConfig = StaticDecode<typeof tiktokFullOAuthConfig>;
