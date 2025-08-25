import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";
import { tx } from "@upstart.gg/style-system/twind";
import { get, set } from "lodash-es";
import { useCallback, useMemo } from "react";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { useBrick, useDraftHelpers } from "~/editor/hooks/use-page-data";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import FormNavigator from "./json-form/FormNavigator";

type BrickSettingsViewProps = {
  brick: Brick;
  label?: string;
  group?: string;
  categoryFilter?: (category: string | undefined) => boolean;
};

const defaultFilter = (category: string | undefined) => category === "settings" || !category;

export default function BrickSettingsView({
  brick,
  label,
  group,
  categoryFilter = defaultFilter,
}: BrickSettingsViewProps) {
  const { updateBrickProps } = useDraftHelpers();
  const manifest = useBrickManifest(brick.type);
  const previewMode = usePreviewMode();
  const brickInfo = useBrick(brick.id);
  const filter: SchemaFilter = useCallback(
    (prop) => {
      return (
        (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
          prop.metadata?.["ui:responsive"] === true ||
          prop.metadata?.["ui:responsive"] === previewMode) &&
        (typeof prop["ui:responsive"] === "undefined" ||
          prop["ui:responsive"] === true ||
          prop["ui:responsive"] === previewMode) &&
        categoryFilter(prop.metadata?.category)
      );
    },
    [previewMode, categoryFilter],
  );

  const navItems = useMemo(() => getNavItemsFromManifest(manifest.props, filter), [filter, manifest.props]);

  // Get base form data
  const formData = useMemo(() => {
    const defProps = defaultProps[brick.type].props;
    return previewMode === "mobile"
      ? mergeIgnoringArrays({} as Brick["props"], defProps, brick.props, brick.mobileProps ?? {})
      : mergeIgnoringArrays({} as Brick["props"], defProps, brick.props ?? {});
  }, [brick, previewMode]);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChangedPath: string) => {
      if (!propertyChangedPath) {
        console.warn("propertyChangedPath is missing in onChange");
        // ignore changes unrelated to the brick
        return;
      }

      // Get property schema from the manifest
      const manifestField = get(manifest.props.properties, propertyChangedPath);
      // All content props should be set on the brick props, not mobileProps
      const isMobileProps = previewMode === "mobile" && manifestField?.metadata?.category !== "content";

      const props = structuredClone(
        isMobileProps ? (brickInfo?.mobileProps ?? {}) : (brickInfo?.props ?? {}),
      );
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(props, propertyChangedPath, data[propertyChangedPath]);

      console.debug("Props update for brick %s: %o", brick.id, props);

      // Update the brick props in the store
      updateBrickProps(brick.id, props, isMobileProps);
    },
    [brick.id, manifest, previewMode, updateBrickProps, brickInfo],
  );

  return (
    <FormNavigator
      key={`brick-nav-${brick.id}-${previewMode}`}
      title={`${manifest.name} ${label ?? "settings"}`}
      initialGroup={group}
      navItems={navItems}
      formSchema={manifest.props}
      className={tx("flex-grow")}
      formData={formData}
      onChange={onChange}
      brickId={brick.id}
    />
  );
}
