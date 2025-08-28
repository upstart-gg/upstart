import { Type, type Static } from "@sinclair/typebox";

export const metaOptions = Type.Object({
  limit: Type.Optional(Type.Number()),
});

export type MetaOptions = Static<typeof metaOptions>;
