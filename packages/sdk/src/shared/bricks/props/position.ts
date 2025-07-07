import { Type, type Static } from "@sinclair/typebox";

export function position(defaultValue = "flowing", title = "Position") {
  return Type.Union(
    [
      Type.Literal("flowing", { title: "Flowing" }),
      Type.Literal("fixed", { title: "Fixed" }),
      Type.Literal("sticky", { title: "Sticky" }),
    ],
    { title, default: defaultValue, "ui:styleId": "styles:position" },
  );
}

export type PositionSettings = Static<ReturnType<typeof position>>;

export function fixedPositioned(defaultValue = false, title = "Fixed position") {
  return Type.Boolean({
    title,
    default: defaultValue,
    "ui:styleId": "styles:fixedPositioned",
  });
}

export type FixedPositionedSettings = Static<ReturnType<typeof fixedPositioned>>;
