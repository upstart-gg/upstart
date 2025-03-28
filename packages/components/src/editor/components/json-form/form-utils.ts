import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { NavItem } from "./types";

export type SchemaFilter = (prop: TSchema, key: string) => boolean;

const defaultFilter: SchemaFilter = () => true;

export function getNavItemsFromManifest(
  manifest: TObject | TArray,
  filter = defaultFilter,
  pathsParts: string[] = [],
): NavItem[] {
  const items = Object.entries<TSchema>(manifest.properties)
    .filter(([, prop]) => prop["ui:field"] !== "hidden")
    .filter(([key, prop]) => filter(prop, key))
    .map(([key, prop]) => {
      const nextPathParts = [...pathsParts, key];
      return {
        id: key,
        label: prop.title!,
        path: nextPathParts.join("."),
        ...(prop.metadata && { metadata: prop.metadata }),
        ...(prop.description ? { description: prop.description } : {}),
        ...(prop.metadata?.group
          ? {
              children: getNavItemsFromManifest(prop as TObject, filter, nextPathParts),
            }
          : { schema: prop as TSchema }),
      };
    });
  return items;
}
