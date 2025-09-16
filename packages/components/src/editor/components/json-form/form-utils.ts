import { Kind, type TArray, type TObject, type TSchema } from "@sinclair/typebox";
import type { NavItem, NavItemGroup, NavItemProperty } from "./types";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema";

export type SchemaFilter = (prop: TSchema, key: string) => boolean;

const defaultFilter: SchemaFilter = () => true;

export function getNavItemsFromManifest(
  manifest: TObject | TArray,
  filter = defaultFilter,
  pathsParts: string[] = [],
): NavItem[] {
  // console.log("getNavItemsFromManifest", { manifest, pathsParts });
  const groups = manifest["ui:groups"] ?? {};
  const groupsProcessed = new Map<string, NavItemProperty[]>(); // group-id -> index
  const items = Object.entries<TSchema>(manifest.properties)
    .map(([key, prop]) => [key, resolveSchema(prop)] as [string, TSchema])
    .filter(([, prop]) => prop["ui:field"] !== "hidden")
    .filter(([key, prop]) => filter(prop, key))
    .map(([key, prop]) => {
      const nextPathParts = [...pathsParts, key];
      if (prop["ui:group"]) {
        const existingGroup = groupsProcessed.get(prop["ui:group"]);
        const isObjectGroup = prop.type === "object" && !prop["ui:field"];
        if (!existingGroup) {
          groupsProcessed.set(
            prop["ui:group"],
            isObjectGroup
              ? []
              : [
                  {
                    id: key,
                    label: prop.title!,
                    path: nextPathParts.join("."),
                    ...(prop.metadata && { metadata: prop.metadata }),
                    ...(prop.description ? { description: prop.description } : {}),
                    schema: prop,
                  },
                ],
          );
          const children = [];
          if (isObjectGroup) {
            for (const [childKey, childProp] of Object.entries((prop as TObject).properties)) {
              const childPath = [...nextPathParts, childKey].join(".");
              children.push({
                id: childKey,
                label: childProp.title!,
                path: childPath,
                ...(childProp.metadata && { metadata: childProp.metadata }),
                ...(childProp.description ? { description: childProp.description } : {}),
                schema: childProp,
              });
            }
          }
          return {
            id: prop["ui:group"],
            label: groups[prop["ui:group"]] ?? prop["ui:group"],
            ...(prop.metadata && { metadata: prop.metadata }),
            ...(prop.description ? { description: prop.description } : {}),
            path: nextPathParts.join("."),
            groupId: prop["ui:group"],
            children,
          };
        }
        existingGroup.push({
          id: key,
          label: prop.title!,
          path: nextPathParts.join("."),
          ...(prop.metadata && { metadata: prop.metadata }),
          ...(prop.description ? { description: prop.description } : {}),
          schema: prop,
        });
        return null;
      }
      return {
        id: key,
        label: prop.title!,
        path: nextPathParts.join("."),
        ...(prop.metadata && { metadata: prop.metadata }),
        ...(prop.description ? { description: prop.description } : {}),
        schema: prop,
      };
    })
    .filter((item) => item !== null)
    .map((prop) => {
      if (prop.groupId) {
        const children = groupsProcessed.get(prop.groupId);
        if (children?.length) {
          prop.children = children;
        }
      }
      return prop;
    });

  return items.flat();
}
