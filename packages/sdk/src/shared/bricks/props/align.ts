import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

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
        horizontal: Type.Union(
          [
            Type.Literal("justify-start", { title: "Left" }),
            Type.Literal("justify-center", { title: "Center" }),
            Type.Literal("justify-end", { title: "Right" }),
          ],
          {
            title: "Horizontal",
          },
        ),
        vertical: Type.Union(
          [
            Type.Literal("items-start", { title: "Top" }),
            Type.Literal("items-center", { title: "Center" }),
            Type.Literal("items-end", { title: "Bottom" }),
          ],
          {
            title: "Vertical",
          },
        ),
      },
      {
        "ui:responsive": true,
        "ui:field": "align-basic",
        default: defaultValue,
      },
    ),
  });
}

export type AlignBasicSettings = Static<ReturnType<typeof basicAlign>>;
