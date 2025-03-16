import { NavigationContainer } from "./NavigationView";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { NavItem } from "./types";
import { useMemo } from "react";

function getNavItemsFromManifest(manifest: TObject | TArray, pathsParts: string[] = []): NavItem[] {
  const items = Object.entries<TSchema>(manifest.properties)
    .filter(([, prop]) => prop["ui:field"] !== "hidden" && prop.title)
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
              children: getNavItemsFromManifest(prop as TObject, nextPathParts),
            }
          : { schema: prop as TSchema }),
      };
    });
  return items;
}

export default function BrickSettingsMenu({ brick }: { brick: Brick }) {
  const manifest = useBrickManifest(brick.type);
  const navItems = useMemo(() => getNavItemsFromManifest(manifest.props), [manifest]);
  return <NavigationContainer title="Settings" navItems={navItems} />;
}
