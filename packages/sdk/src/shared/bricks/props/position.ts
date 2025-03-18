import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function position(defaultValue = "flowing", title = "Position") {
  return prop({
    title,
    $id: "#styles:position",
    schema: Type.Optional(
      Type.Union(
        [
          Type.Literal("flowing", { title: "Flowing" }),
          Type.Literal("fixed", { title: "Fixed" }),
          Type.Literal("sticky", { title: "Sticky" }),
        ],
        { default: defaultValue },
      ),
    ),
  });
}

export type PositionSettings = Static<ReturnType<typeof position>>;

export function fixedPositioned(defaultValue = false, title = "Fixed position") {
  return prop({
    title,
    $id: "#styles:fixedPositioned",
    schema: Type.Boolean({ default: defaultValue }),
  });
}

export type FixedPositionedSettings = Static<ReturnType<typeof fixedPositioned>>;
