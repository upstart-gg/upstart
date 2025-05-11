import { Type, type Static } from "@sinclair/typebox";

export const resolution = Type.Union([Type.Literal("mobile"), Type.Literal("desktop")]);
export type Resolution = Static<typeof resolution>;
