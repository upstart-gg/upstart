import { Type, type SchemaOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";

export function makeContainerProps() {
  return {
    $childrenType: Type.Optional(
      Type.String({
        title: "Dynamic child brick type",
        description: "Type of the child bricks that will be created when container is dynamic",
        "ui:field": "brick-type",
        metadata: {
          category: "content",
        },
      }),
    ),
    $children: Type.Array(Type.Any(), {
      "ui:field": "hidden",
      description: "List of nested bricks",
      default: [],
    }),
  };
}

export function sectionLayout(options: SchemaOptions = {}) {
  return Type.Object(
    {
      wrap: Type.Optional(
        Type.Boolean({
          title: "Wrap",
          description: "Wrap bricks.",
          default: true,
        }),
      ),
      fillSpace: Type.Optional(
        Type.Boolean({
          title: "Fill available space",
          description: "Makes bricks fill the available space",
        }),
      ),
      justifyContent: Type.Optional(
        StringEnum(
          [
            "justify-start",
            "justify-center",
            "justify-end",
            "justify-between",
            "justify-around",
            "justify-evenly",
            "justify-stretch",
          ],
          {
            enumNames: [
              "Start",
              "Center",
              "End",
              "Space between",
              "Space around",
              "Evenly distributed",
              "Stretch",
            ],
            title: "Justify bricks",
            description: "Justify bricks horizontally",
            "ui:placeholder": "Not specified",
          },
        ),
      ),
      alignItems: Type.Optional(
        StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
          enumNames: ["Start", "Center", "End", "Stretch"],
          title: "Align bricks",
          description: "Align bricks vertically",
          "ui:placeholder": "Not specified",
        }),
      ),
    },
    { $id: "styles:sectionLayout" },
  );
}
