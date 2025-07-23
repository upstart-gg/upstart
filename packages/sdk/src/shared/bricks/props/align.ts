import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

type AlignBasicOptions = SchemaOptions & {
  "ui:no-horizontal-align"?: boolean;
  "ui:no-vertical-align"?: boolean;
  "ui:horizontal-align-label"?: string;
  "ui:vertical-align-label"?: string;
  "ui:flex-mode"?: "row" | "column";
};

export function basicAlign(opts: AlignBasicOptions = {}) {
  return Type.Object(
    {
      horizontal: Type.Optional(
        Type.Union(
          [
            Type.Literal("start", { title: "Left" }),
            Type.Literal("center", { title: "Center" }),
            Type.Literal("end", { title: "Right" }),
          ],
          {
            title: "Horizontal",
          },
        ),
      ),
      vertical: Type.Optional(
        Type.Union(
          [
            Type.Literal("start", { title: "Top" }),
            Type.Literal("center", { title: "Center" }),
            Type.Literal("end", { title: "Bottom" }),
          ],
          {
            title: "Vertical",
          },
        ),
      ),
    },
    {
      $id: "styles:basicAlign",
      title: "Align",
      "ui:responsive": true,
      "ui:field": "align-basic",
      "ui:styleId": "styles:basicAlign",
      ...opts,
    },
  );
}

export type AlignBasicSettings = Static<ReturnType<typeof basicAlign>>;

export function basicAlignRef(options: AlignBasicOptions = {}) {
  return typedRef("styles:basicAlign", options);
}
