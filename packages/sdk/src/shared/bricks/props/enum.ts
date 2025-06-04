import { type SchemaOptions, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

type EnumOption = {
  title?: string;
  description?: string;
  value: string;
  icon?: string;
};

export function enumProp(
  title: string,
  defaultValue: string,
  opts: Omit<SchemaOptions, "title" | "default"> & {
    options: EnumOption[] | string[];
    displayAs?: "radio" | "select" | "button-group" | "icon-group";
  },
) {
  const defaultOpts = {
    "ui:field": "enum",
    "ui:display": opts.displayAs || "select",
  };
  const { options, displayAs, ...commonOpts } = opts;

  return prop({
    title,
    schema: Type.Union(
      options.map((opt) =>
        Type.Literal(typeof opt === "string" ? opt : opt.value, {
          title: typeof opt === "string" ? opt : opt.title,
          "ui:icon": typeof opt === "string" ? undefined : opt.icon,
        }),
      ),
      {
        title,
        default: defaultValue,
        ...defaultOpts,
        ...commonOpts,
      },
    ),
  });
}
