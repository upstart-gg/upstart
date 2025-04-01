import { Type, type TObject, type TSchema } from "@sinclair/typebox";
import { defaultAttributesSchema, type Attributes } from "../src/shared/attributes";
import { manifests } from "../src/shared/bricks/manifests/all-manifests";
import { themeSchema } from "../src/shared/theme";
import { definedTemplatePage, templatePageSchema } from "../src/shared/page";
import { commonStyleForDocsOnly } from "../src/shared/bricks/props/_docs-common-styles";
import testConfig from "../src/shared/tests/test-config";
import fs from "node:fs";
import path from "node:path";
import { definedBrickSchema, definedSectionSchema } from "../src/shared/bricks";

const __dirname = import.meta.dirname;

let template = fs.readFileSync(path.join(__dirname, "ia-docs", "template.md"), "utf-8");

// Only keep name and tags for IA generated themes
const refinedThemeSchema = Type.Omit(themeSchema, ["description"]);
const refinedAttributesSchema = Type.Omit(defaultAttributesSchema, [
  "$siteHeadTags",
  "siteBodyTags",
  "$pageLastUpdated",
  "$pageKeywords",
  "$pageDescription",
  "$siteOgImage",
  "$robotsIndexing",
  "$pageOgImage",
  "$pageLanguage",
  "$pageTitle",
]);

/**
 * Generate a markdown list for documentation from a TypeBox schema for props.
 * The generated doc should include the title, description, type, as well as possible values.
 * It should call itself recursively for nested objects.
 */
function objectSchemaToString(objSchema: TObject, mode: "common-styles" | "default" = "default", level = 0) {
  if (!objSchema.properties && !objSchema.items) {
    return "";
  }

  const props = objSchema.properties ?? objSchema.items?.properties;
  let result = "";
  const indent = "  ".repeat(level);

  for (const [propName, propSchema] of Object.entries(objSchema.properties)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const schema = propSchema as any;

    if (schema["ui:field"] === "hidden") {
      continue;
    }

    const required = objSchema.required?.includes(propName) ? "Required" : "Optional";
    const description = schema.description ? `${schema.description}.` : "";
    const typeStr = schema["doc:type"]
      ? schema["doc:type"]
      : schema.type
        ? schema.items
          ? `\`${schema.items.type}[]\``
          : `\`${schema.type}\``
        : schema.anyOf
          ? `\`enum\``
          : `\`unknown\``;

    result += `${indent}- **\`${mode === "common-styles" && schema.$id ? `${schema.$id}` : propName}\`**: ${required} ${typeStr}. ${description} `;

    if (mode === "default" && schema.$id?.startsWith("#styles:")) {
      result += `See common style \`${schema.$id}\`\n`;
      continue;
    }

    if (schema["doc:type"]) {
    } else if (schema.anyOf) {
      result += `Possible values: ${schema.anyOf.map((v: any) => `\`${v.const}\``).join(", ")}. `;
    } else if (schema.items) {
      if (schema.items.type === "object") {
        result += objectSchemaToString(schema.items, mode, level + 1);
      } else {
        // result += `Items type: \`${schema.items.type}\`[]`;
      }
    }

    if (schema.default !== undefined) {
      result += `Default: \`${JSON.stringify(schema.default)}\``;
    }

    result += "\n";

    if (schema.type === "object" && schema.properties) {
      result += objectSchemaToString(schema as TObject, mode, level + 1);
    }
  }

  return result;
}

// Build bricks descriptions

let brickDescriptions = "";
for (const [name, manifest] of Object.entries(manifests)) {
  const { name, type } = manifest;

  brickDescriptions += `
### ${name} (\`${type}\`)

${manifest.description}

#### Props
${objectSchemaToString(manifest.props)}

`;
}

template = template.replace("{{THEME_JSON_SCHEMA}}", objectSchemaToString(refinedThemeSchema));
template = template.replace("{{ATTRIBUTES_JSON_SCHEMA}}", objectSchemaToString(refinedAttributesSchema));
template = template.replace("{{PAGE_JSON_SCHEMA}}", objectSchemaToString(definedTemplatePage));
template = template.replace("{{SECTION_JSON_SCHEMA}}", objectSchemaToString(definedSectionSchema));
template = template.replace("{{AVAILABLE_BRICKS}}", brickDescriptions);
template = template.replace(
  "{{BRICK_POSITION_JSON_SCHEMA}}",
  objectSchemaToString(definedBrickSchema.properties.position),
);
// template = template.replace("{{COMMON_BRICK_STYLES}}", commonBrickStyles);

template = template.replace("{{TEMPLATE_EXAMPLE}}", JSON.stringify(testConfig));
template = template.replace(
  "{{COMMON_STYLES}}",
  objectSchemaToString(commonStyleForDocsOnly, "common-styles"),
);

console.log(template);
