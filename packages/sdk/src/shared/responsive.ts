import { Type, type Static } from "@sinclair/typebox";

export const responsiveMode = Type.Union([Type.Literal("mobile"), Type.Literal("desktop")]);
export type ResponsiveMode = Static<typeof responsiveMode>;
