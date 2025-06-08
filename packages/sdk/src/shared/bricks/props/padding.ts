import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function padding() {
  return prop({
    title: "Padding",
    schema: Type.String({
      $id: "styles:padding",
      description: "Space between the content and the border",
      "ai:instructions": "Can be a tailwind class like `p-4` or a custom value like `p-[16px]`.",
      "ui:field": "enum",
      "ui:responsive": true,
      "ui:styleId": "#styles:padding",
    }),
  });
}

export const paddingRef = Type.Ref("styles:padding");

export type PaddingSettings = Static<ReturnType<typeof padding>>;
