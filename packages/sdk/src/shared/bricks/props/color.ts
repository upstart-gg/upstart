import { type Static, type StringOptions, Type } from "@sinclair/typebox";

export function color(options: StringOptions = {}) {
  return Type.String({
    title: "Text color",
    "ai:instructions":
      "Format is `text-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
    pattern:
      "^text-(primary|secondary|accent|neutral|base|inherit)-?(50|100|200|300|400|500|600|700|800|900)?$",
    "ui:styleId": "styles:color",
    "ui:field": "color",
    "ui:color-type": "text",
    ...options,
  });
}

export type ColorSettings = Static<ReturnType<typeof color>>;

export function borderColor(options: StringOptions = {}) {
  return Type.String({
    title: "Border color",
    "ai:instructions":
      "Format is `border-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
    pattern: "^border-(primary|secondary|accent|neutral|base)-?(50|100|200|300|400|500|600|700|800|900)?$",
    "ui:styleId": "styles:borderColor",
    "ui:field": "color",
    "ui:color-type": "border",
    ...options,
  });
}

export type BorderColorSettings = Static<ReturnType<typeof borderColor>>;
