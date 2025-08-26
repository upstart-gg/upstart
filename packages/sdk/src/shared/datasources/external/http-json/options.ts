import { Type, type Static } from "@sinclair/typebox";

export const httpJsonOptions = Type.Object({
  url: Type.String({ format: "uri" }),
  headers: Type.Optional(Type.Record(Type.String(), Type.String())),
});

export type HttpJsonOptions = Static<typeof httpJsonOptions>;
