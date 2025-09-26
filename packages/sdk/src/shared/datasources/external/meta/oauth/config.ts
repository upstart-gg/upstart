import { Type, type Static, type StaticDecode } from "@sinclair/typebox";
import { StringEnum } from "../../../../utils/string-enum";
import { buildOAuthConfigSchema } from "~/shared/oauth";

const metaOAuthConfig = Type.Object({
  type: StringEnum(["short-lived", "long-lived"]),
  accessToken: Type.String(),
  userId: Type.String(),
  permissions: Type.Array(Type.String()),
  expiresIn: Type.Number(),
  tokenType: Type.String(),
});

export type MetaOAuthConfig = Static<typeof metaOAuthConfig>;

const metaFullOAuthConfig = buildOAuthConfigSchema(metaOAuthConfig);
export type MetaFullOAuthConfig = StaticDecode<typeof metaFullOAuthConfig>;
