import { type TArray, Type, type TObject } from "@sinclair/typebox";
import { siteAttributesSchemaForLLM } from "../src/shared/attributes";
import { manifests } from "../src/shared/bricks/manifests/all-manifests";
import { schemasMap as providersSchemasMap } from "../src/shared/datasources/schemas";
import { themeSchema } from "../src/shared/theme";
import { templatePageSchema } from "../src/shared/page";
import {
  commonStyleForDocsOnly,
  shortDocumentedForDocsOnly,
} from "../src/shared/bricks/props/_docs-common-styles";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { preset } from "../src/shared/bricks/props/preset";
import { sitemapSchema } from "../src/shared/sitemap";

const __dirname = import.meta.dirname;

let template = fs.readFileSync(path.join(__dirname, "ia-docs", "template.md"), "utf-8");

const {
  values: { outfile },
} = parseArgs({
  options: {
    outfile: {
      type: "string",
      short: "o",
      default: path.join(process.cwd(), "generated-docs.md"),
      description: "Output file for the generated documentation",
    },
  },
});

if (!outfile) {
  console.error("Please provide an output file with --outfile or -o");
  process.exit(1);
}

// Only keep name and tags for IA generated themes
const refinedThemeSchema = Type.Omit(themeSchema, ["description"]);

const commonStyleKeys = Object.keys(commonStyleForDocsOnly.properties);
const shortDocsKeys = Object.keys(shortDocumentedForDocsOnly.properties);

function getDatasourcesProviders() {
  let result = "";
  for (const [provider, schema] of Object.entries(providersSchemasMap)) {
    result += `#### \`${provider}\`\n${schema.description}\n`;
    if ("type" in schema) {
      result += `Schema:\n${schemaToString(schema)}\n`;
    } else {
      result += `This provider needs you to declare your schema.\n`;
    }
  }
  return result;
}

/**
 * Generate a markdown list for documentation from a TypeBox schema for props.
 * The generated doc should include the title, description, type, as well as possible values.
 * It should call itself recursively for nested objects.
 */
function schemaToString(
  objSchema: TObject | TArray,
  mode: "common-styles" | "default" = "default",
  level = 0,
) {
  if (!objSchema.properties && !objSchema.items) {
    console.warn("No properties or items in schema", objSchema);
    return "";
  }

  // if (level === 0) {
  //   objSchema.properties.variant = Type.String({
  //     title: "Variant",
  //     description: "The variant of the component",
  //   });
  // }

  let result = "";
  const indent = "  ".repeat(level);
  const ignoredProps = ["id", "className", "editable", "lastTouched"];

  for (const [propName, propSchema] of Object.entries(
    objSchema.properties ?? objSchema.items.properties ?? {},
  )) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const schema = propSchema as any;

    if (ignoredProps.includes(propName)) {
      console.log(`Ignoring ${propName} prop`);
      continue;
    }

    // test
    if (commonStyleKeys.includes(propName)) {
      console.log(`Ignoring ${propName} prop`);
      continue;
    }

    // if (propName === "variants") {
    //   console.log(`variants`, schema);
    // }

    const required = objSchema.required?.includes(propName) ? "required " : "optional ";
    const description = schema.description ? `${schema.description}.` : "";
    const typeStr = schema.items
      ? schema.items.type
        ? `\`${schema.items.type}[]\``
        : schema.type === "array"
          ? "`array`"
          : "`enum`"
      : schema.anyOf
        ? `\`enum\``
        : `\`${schema.type}\``;

    if (mode === "default" && shortDocsKeys.includes(propName)) {
      result += `${indent}- \`${propName}\`: ${required}${typeStr} (see docs)\n`;
      continue;
    }

    result += `${indent}- \`${propName}\`: ${required}${typeStr}. ${description} `;

    if (schema.default !== undefined && schema.default !== "{}") {
      result += `Default: \`${JSON.stringify(schema.default)}\`. `;
    }

    if (schema.anyOf) {
      result += `Values: ${schema.anyOf
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((v: any) => `\`${v.const}\`${v.description ? ` (${v.description})` : ""}`)
        .join(", ")} `;
    } else if (schema.enum) {
      result += `Values: ${schema.enum
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((v: any) => `\`${v}\``)
        .join(", ")} `;
    } else if (schema.items) {
      if (schema.items.type === "object") {
        result += `\n${schemaToString(schema.items, mode, level + 1)}`;
      } else if (schema.items.anyOf) {
        result += `Values: ${schema.items.anyOf
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          .map((v: any) => `\`${v.const}\`${v.description ? ` (${v.description})` : ""}`)
          .join(", ")} `;
      }
    }

    result += "\n";

    if (schema.type === "object" && schema.properties) {
      result += schemaToString(schema as TObject, mode, level + 1);
    }
  }

  return result;
}

// Build bricks descriptions

let brickDescriptions = "";
for (const [name, manifest] of Object.entries(manifests)) {
  const { name, type } = manifest;
  brickDescriptions += `### ${name} (\`${type}\`)
${manifest.description}${manifest.aiInstructions ? `\n${manifest.aiInstructions}` : ""}

Props:
${schemaToString(manifest.props)}
`;
}

/*
\`\`\`json
${JSON.stringify(manifest.props)}
\`\`\`
*/

const bricksSummary = Object.entries(manifests)
  .map(([, manifest]) => {
    const { name, type } = manifest;
    return `- ${name} (\`${type}\`): ${manifest.description}`;
  })
  .join("\n");

function getPresetsDescriptions() {
  const presets = preset();
  let result = "";
  for (const value of presets.anyOf) {
    result += `- \`${value.const}\`: ${value.title}. ${value.description}\n`;
  }
  return result;
}

template = template.replace("{{PRESETS}}", getPresetsDescriptions());
template = template.replace("{{THEME_JSON_SCHEMA}}", JSON.stringify(refinedThemeSchema));
template = template.replace("{{SITE_ATTRIBUTES_JSON_SCHEMA}}", JSON.stringify(siteAttributesSchemaForLLM));
template = template.replace("{{PAGES_MAP_JSON_SCHEMA}}", JSON.stringify(sitemapSchema));
template = template.replace("{{PAGE_JSON_SCHEMA}}", JSON.stringify(templatePageSchema));
template = template.replace("{{AVAILABLE_BRICKS}}", brickDescriptions.trim());
template = template.replace("{{AVAILABLE_BRICKS_SUMMARY}}", bricksSummary.trim());
// template = template.replace("{{DATASOURCES_PROVIDERS}}", getDatasourcesProviders().trim());
// template = template.replace(
//   "{{BRICK_POSITION_JSON_SCHEMA}}",
//   JSON.stringify(brickSchema.properties.position),
// );

console.log("Writing to %s", outfile);
fs.writeFileSync(outfile, template, "utf-8");
console.log("Done.");
process.exit(0);
