import { Type, type Static } from "@sinclair/typebox";
import { groupAlign } from "./_groups";

export const alignBasic = Type.Object(
  {
    horizontal: Type.Union(
      [
        Type.Literal("justify-start", { title: "Left" }),
        Type.Literal("justify-center", { title: "Center" }),
        Type.Literal("justify-end", { title: "Right" }),
      ],
      {
        title: "Horizontal",
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "start",
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
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "stretch",
      },
    ),
  },
  {
    "ui:responsive": true,
    "ui:field": "align-basic",
    default: {
      horizontal: "justify-start",
      vertical: "items-center",
    },
    ...groupAlign,
  },
);

export type AlignBasicSettings = Static<typeof alignBasic>;

export const alignBasicProps = Type.Object({
  align: alignBasic,
});

export type AlignBasicProps = Static<typeof alignBasicProps>;
