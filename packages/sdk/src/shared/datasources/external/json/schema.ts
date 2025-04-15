import { Type, type Static } from "@sinclair/typebox";

export const jsonObjectSchema = Type.Object({}, { additionalProperties: true });
export const jsonArraySchema = Type.Array(jsonObjectSchema);

export type JSONObjectSchema = Static<typeof jsonObjectSchema>;
export type JSONArraySchema = Static<typeof jsonArraySchema>;
