import { Type } from "@sinclair/typebox";
import { defaultAttributesSchema, type Attributes } from "../src/shared/attributes";
import { manifests } from "../src/shared/bricks/manifests/all-manifests";
import { themeSchema } from "../src/shared/theme";
import { templatePageSchema } from "../src/shared/page";
import testConfig from "../src/shared/tests/test-config";

import fs from "node:fs";
import path from "node:path";

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

// Build bricks descriptions

let brickDescriptions = "";
for (const [name, manifest] of Object.entries(manifests)) {
  const { name, type } = manifest;
  const schemaString = JSON.stringify(manifest.props);

  brickDescriptions += `
### ${name} (type=${type})

${manifest.description}

#### Props JSON Schema

\`\`\`json
${schemaString}
\`\`\`

`;
}

template = template.replace("{{THEME_JSON_SCHEMA}}", JSON.stringify(refinedThemeSchema));
template = template.replace("{{ATTRIBUTES_JSON_SCHEMA}}", JSON.stringify(refinedAttributesSchema));
template = template.replace("{{PAGE_JSON_SCHEMA}}", JSON.stringify(templatePageSchema));
template = template.replace("{{AVAILABLE_BRICKS}}", brickDescriptions);
template = template.replace("{{TEMPLATE_EXAMPLE}}", JSON.stringify(testConfig));

console.log(template);
