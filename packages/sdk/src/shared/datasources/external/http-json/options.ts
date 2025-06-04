import { Type, type Static } from "@sinclair/typebox";
import { providerOptions } from "../../provider-options";

export const httpJsonOptions = Type.Composite([
  providerOptions,
  Type.Object({
    url: Type.String({ format: "uri" }),
    headers: Type.Optional(Type.Record(Type.String(), Type.String())),
  }),
]);

export type HttpJsonOptions = Static<typeof httpJsonOptions>;
