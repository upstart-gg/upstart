import type { TArray, TObject } from "@sinclair/typebox";

type Options = {
  ignoreProps?: string[];
  debugLabel?: string;
};

/**
 * Generate a markdown list for documentation from a TypeBox schema for props.
 * The generated doc should include the title, description, type, as well as possible values.
 * It should call itself recursively for nested objects.
 */
export function jsonSchemaToMarkdown(objSchema: TObject | TArray, options: Options = {}, level = 0) {
  if (!objSchema.properties && !objSchema.items) {
    console.error("No properties or items in schema", objSchema);
    return "";
  }

  let result = "";
  const indent = "   ".repeat(level);

  for (const [propName, propSchema] of Object.entries(
    objSchema.properties ?? objSchema.items.properties ?? {},
  )) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const schema = propSchema as any;

    if (options?.ignoreProps?.includes(propName)) {
      continue;
    }

    if (!schema.description && !schema.title) {
      console.warn(
        `Property ${propName} is missing a description in schema ${options.debugLabel ?? "unknown-schema"}`,
      );
    }

    const suffixRequired = objSchema.required?.includes(propName) ? "" : "?";
    const description = schema.description ? `${schema.description}` : `${schema.title ?? ""}`;
    const typeStr = schema.items
      ? schema.items.type
        ? `\`${schema.items.type}[]${suffixRequired}\``
        : schema.type === "array"
          ? `\`array${suffixRequired}\``
          : `\`enum${suffixRequired}\``
      : schema.anyOf
        ? `\`enum${suffixRequired}\``
        : schema.$ref
          ? `@see $ref \`${schema.$ref}\``
          : `\`${schema.type}${suffixRequired}\``;

    result += `${indent}${level > 0 ? "*" : "-"} \`${propName}\`: ${typeStr} - ${description} `;

    if (schema.default !== undefined && schema.default !== "{}") {
      result += `(default: \`${JSON.stringify(schema.default)}\`) `;
    }

    if (schema.anyOf) {
      result += `- Enum: ${schema.anyOf
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((v: any) => `\`${v.const}\`${v.description ? ` (${v.description})` : ""}`)
        .join(", ")}. `;
    } else if (schema.enum) {
      result += `- Enum: ${schema.enum
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((v: any) => `\`${v}\``)
        .join(", ")}. `;
    } else if (schema.items) {
      if (schema.items.type === "object") {
        result += `\n${jsonSchemaToMarkdown(schema.items, options, level + 1)}`;
      } else if (schema.items.anyOf) {
        result += `- Enum: ${schema.items.anyOf
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          .map((v: any) => `\`${v.const}\`${v.description ? ` (${v.description})` : ""}`)
          .join(", ")}. `;
      }
    } else if (schema.pattern) {
      result += `- Pattern: \`${schema.pattern}\`. `;
    } else if (schema.format) {
      result += `- Format: \`${schema.format}\`. `;
    }

    result += "\n";

    if (schema.type === "object" && schema.properties) {
      result += jsonSchemaToMarkdown(schema as TObject, options, level + 1);
    }
  }

  return result;
}
