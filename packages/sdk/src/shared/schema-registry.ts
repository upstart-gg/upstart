import type { TSchema } from "@sinclair/typebox";
import { alignItems, alignSelf, justifyContent } from "./bricks/props/align";
import { background, backgroundColor } from "./bricks/props/background";
import { border, rounding } from "./bricks/props/border";
import { borderColor, color } from "./bricks/props/color";
import { hidden } from "./bricks/props/common";
import { cssLength } from "./bricks/props/css-length";
import { shadow, textShadow } from "./bricks/props/effects";
import { fontSize, textContent } from "./bricks/props/text";
import { icon, urlOrPageId } from "./bricks/props/string";
import { colorPreset } from "./bricks/props/color-preset";
import { image } from "./bricks/props/image";
import { direction } from "./bricks/props/direction";
import { loop, queryUse } from "./bricks/props/dynamic";
import { tags } from "./bricks/props/tags";

export const schemaRegistry = new Map<string, TSchema>();

export function registerSchema(id: string, schema: TSchema) {
  schemaRegistry.set(id, schema);
}

export function unregisterSchema(id: string) {
  schemaRegistry.delete(id);
}

registerSchema("styles:background", background());
registerSchema("styles:backgroundColor", backgroundColor());
registerSchema("styles:justifyContent", justifyContent());
registerSchema("styles:alignItems", alignItems());
registerSchema("styles:alignSelf", alignSelf());
registerSchema("styles:rounding", rounding());
registerSchema("styles:fontSize", fontSize());
registerSchema("styles:hidden", hidden());
registerSchema("styles:direction", direction());
registerSchema("styles:border", border());
registerSchema("styles:color", color());
registerSchema("styles:borderColor", borderColor());
registerSchema("styles:shadow", shadow());
registerSchema("styles:textShadow", textShadow());
registerSchema("styles:cssLength", cssLength());
registerSchema("assets:image", image());
registerSchema("assets:icon", icon());
registerSchema("content:text", textContent());
registerSchema("content:urlOrPageId", urlOrPageId());
registerSchema("content:loop", loop());
registerSchema("content:queryUse", queryUse());
registerSchema("presets:color", colorPreset());
registerSchema("content:tags", tags());

/**
 */
function consolidateRefs() {
  // Helper to recursively resolve $refs in a schema
  function resolveRefs(schema: TSchema, visited: Set<TSchema> = new Set()) {
    if (!schema || typeof schema !== "object" || visited.has(schema)) return schema;
    visited.add(schema);
    if ("$ref" in schema && typeof (schema as any).$ref === "string") {
      const refSchema = schemaRegistry.get((schema as any).$ref);
      if (refSchema) {
        // Recursively resolve refs in the referenced schema
        return resolveRefs(refSchema, visited);
      }
    }
    for (const key of Object.keys(schema)) {
      const value = (schema as any)[key];
      if (Array.isArray(value)) {
        (schema as any)[key] = value.map((item: TSchema) => resolveRefs(item, visited));
      } else if (typeof value === "object" && value !== null) {
        (schema as any)[key] = resolveRefs(value as TSchema, visited);
      }
    }
    return schema;
  }

  // Rewrite all schemas in the registry to resolve $refs
  for (const [id, schema] of schemaRegistry.entries()) {
    schemaRegistry.set(id, resolveRefs(schema));
  }
}

consolidateRefs();
