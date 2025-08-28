import { Type, type Static } from "@sinclair/typebox";

export const tiktokVideoOptions = Type.Object({
  maxCount: Type.Optional(Type.Number()),
  refreshInterval: Type.Optional(Type.Number()),
});

export type TiktokVideoOptions = Static<typeof tiktokVideoOptions>;
