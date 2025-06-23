import type { Static } from "@sinclair/typebox";
import { StringEnum } from "./utils/string-enum";

export const resolution = StringEnum(["mobile", "desktop"]);
export type Resolution = Static<typeof resolution>;
