import type { TObject, TSchema } from "@sinclair/typebox";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";

export function useFilteredProperties(
  manifest: BrickManifest,
  filter: (prop: TSchema) => boolean,
): Record<string, TSchema> {
  function extractProperties(schema: TObject): Record<string, TSchema> {
    const contentProps: Record<string, TSchema> = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (filter(prop)) {
        contentProps[key] = prop;
      } else if (prop.type === "object" && prop.properties) {
        const nestedContentProps = extractProperties(prop as TObject);
        if (Object.keys(nestedContentProps).length > 0) {
          Object.assign(contentProps, nestedContentProps);
        }
      }
    }
    return contentProps;
  }
  return extractProperties(manifest.props as TObject);
}
