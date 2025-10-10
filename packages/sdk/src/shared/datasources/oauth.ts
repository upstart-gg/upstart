import { Type, type TSchema, type StaticDecode } from "@sinclair/typebox";
import { jsonDate } from "../utils/json-date";

export const buildOAuthConfigSchema = <T extends TSchema>(T: T) =>
  Type.Object({
    siteId: Type.String(),
    siteDatasourceId: Type.String(),
    config: T,
    oauthTokenExpireAt: jsonDate,
    oauthRefreshTokenExpireAt: Type.Optional(jsonDate),
    nextRefreshTokenAt: Type.Optional(jsonDate),
  });

export type OAuthConfig<T extends TSchema = TSchema> = StaticDecode<
  ReturnType<typeof buildOAuthConfigSchema<T>>
>;
