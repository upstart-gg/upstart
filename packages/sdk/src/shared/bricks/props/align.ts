import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { optional, prop } from "./helpers";
import { typedRef } from "~/shared/utils/typed-ref";

type AlignBasicOptions = {
  title?: string;
  defaultValue?: {
    horizontal: string;
    vertical: string;
  };
};

export function basicAlign(opts: AlignBasicOptions = {}) {
  const { title = "Align", defaultValue = { horizontal: "justify-start", vertical: "items-center" } } = opts;
  return prop({
    title,
    schema: Type.Object(
      {
        horizontal: optional(
          Type.Union(
            [
              Type.Literal("justify-start", { title: "Left" }),
              Type.Literal("justify-center", { title: "Center" }),
              Type.Literal("justify-end", { title: "Right" }),
            ],
            {
              title: "Horizontal",
            },
          ),
        ),
        vertical: optional(
          Type.Union(
            [
              Type.Literal("items-start", { title: "Top" }),
              Type.Literal("items-center", { title: "Center" }),
              Type.Literal("items-end", { title: "Bottom" }),
            ],
            {
              title: "Vertical",
            },
          ),
        ),
      },
      {
        $id: "styles:basicAlign",
        "ui:responsive": true,
        "ui:field": "align-basic",
        "ui:styleId": "#styles:basicAlign",
        default: defaultValue,
      },
    ),
  });
}

export type AlignBasicSettings = Static<ReturnType<typeof basicAlign>>;

export function basicAlignRef(options: SchemaOptions = {}) {
  return typedRef("styles:basicAlign", options);
}
