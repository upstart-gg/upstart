import FormNavigator from "./FormNavigator";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { NavItem } from "./types";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { useDraftHelpers, useGetBrick, usePreviewMode } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

type SchemaFilter = (prop: TSchema) => boolean;

const defaultFilter: SchemaFilter = () => true;

function getNavItemsFromManifest(
  manifest: TObject | TArray,
  filter = defaultFilter,
  pathsParts: string[] = [],
): NavItem[] {
  const items = Object.entries<TSchema>(manifest.properties)
    .filter(([, prop]) => prop["ui:field"] !== "hidden")
    .filter(([, prop]) => filter(prop))
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

type BrickSettingsMenuProps = {
  brick: Brick;
};

export default function BrickSettingsMenu({ brick }: BrickSettingsMenuProps) {
  const { updateBrickProps } = useDraftHelpers();
  const manifest = useBrickManifest(brick.type);
  const previewMode = usePreviewMode();
  const getBrickInfo = useGetBrick();
  const brickInfo = getBrickInfo(brick.id);
  const filter: SchemaFilter = (prop) => {
    return (
      (previewMode !== "mobile" || prop["ui:responsive"]) &&
      (!prop.metadata?.category || prop.metadata?.category === "settings")
    );
  };
  const navItems = getNavItemsFromManifest(manifest.props, filter);
  const formData = useMemo(() => {
    return previewMode === "mobile" ? merge({}, brick.props, brick.mobileProps) : brick.props ?? {};
  }, [brick, previewMode]);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChangedPath: string) => {
      if (!propertyChangedPath) {
        console.warn("propertyChangedPath is missing in style tab");
        // ignore changes unrelated to the brick
        return;
      }
      // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
      const props = JSON.parse(JSON.stringify(brickInfo?.props ?? {}));
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(props, propertyChangedPath, data[propertyChangedPath]);
      // Update the brick props in the store
      updateBrickProps(brick.id, props, previewMode === "mobile");
    },
    [brick.id, previewMode, updateBrickProps, brickInfo],
  );

  return <FormNavigator title="Settings" navItems={navItems} formData={formData} onChange={onChange} />;
}
