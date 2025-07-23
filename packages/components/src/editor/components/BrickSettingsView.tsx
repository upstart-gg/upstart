import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";
import { tx } from "@upstart.gg/style-system/twind";
import { set } from "lodash-es";
import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useDraftHelpers, useGetBrick, usePreviewMode } from "~/editor/hooks/use-editor";
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
  const [showAdvanced, setShowAdvanced] = useLocalStorage("upstart:editor:show-advanced", false);
  const previewMode = usePreviewMode();
  const getBrickInfo = useGetBrick();
  const brickInfo = getBrickInfo(brick.id);
  const filter: SchemaFilter = useCallback(
    (prop) => {
      return (
        (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
          prop.metadata?.["ui:responsive"] === true ||
          prop.metadata?.["ui:responsive"] === previewMode) &&
        (typeof prop["ui:responsive"] === "undefined" ||
          prop["ui:responsive"] === true ||
          prop["ui:responsive"] === previewMode) &&
        categoryFilter(prop.metadata?.category) &&
        (!prop["ui:advanced"] || showAdvanced)
      );
    },
    [previewMode, showAdvanced, categoryFilter],
  );

  const navItems = useMemo(() => getNavItemsFromManifest(manifest.props, filter), [filter, manifest.props]);
  const formData = useMemo(() => {
    const defProps = defaultProps[brick.type].props;
    return previewMode === "mobile"
      ? mergeIgnoringArrays({}, defProps, brick.mobileProps ?? {})
      : mergeIgnoringArrays(defProps, brick.props ?? {});
  }, [brick, previewMode]);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChangedPath: string) => {
      if (!propertyChangedPath) {
        console.warn("propertyChangedPath is missing in style tab");
        // ignore changes unrelated to the brick
        return;
      }
      // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
      const props = structuredClone(brickInfo?.props ?? {});
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(props, propertyChangedPath, data[propertyChangedPath]);

      // Update the brick props in the store
      updateBrickProps(brick.id, props, previewMode === "mobile");
    },
    [brick.id, previewMode, updateBrickProps, brickInfo],
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
