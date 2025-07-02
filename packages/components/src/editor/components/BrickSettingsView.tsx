import FormNavigator from "./json-form/FormNavigator";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { useDraftHelpers, useGetBrick, usePreviewMode } from "~/editor/hooks/use-editor";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import { tx } from "@upstart.gg/style-system/twind";
import { useLocalStorage } from "usehooks-ts";

type BrickSettingsViewProps = {
  brick: Brick;
  group?: string;
};

export default function BrickSettingsView({ brick, group }: BrickSettingsViewProps) {
  const { updateBrickProps } = useDraftHelpers();
  const manifest = useBrickManifest(brick.type);
  const [showAdvanced, setShowAdvanced] = useLocalStorage("upstart:editor:show-advanced", false);
  const previewMode = usePreviewMode();
  const getBrickInfo = useGetBrick();
  const brickInfo = getBrickInfo(brick.id);
  const filter: SchemaFilter = (prop) => {
    return (
      (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
        prop.metadata?.["ui:responsive"] === true ||
        prop.metadata?.["ui:responsive"] === previewMode) &&
      (typeof prop["ui:responsive"] === "undefined" ||
        prop["ui:responsive"] === true ||
        prop["ui:responsive"] === previewMode) &&
      (!prop.metadata?.category || prop.metadata?.category === "settings") &&
      (!prop["ui:advanced"] || showAdvanced)
      /* &&
      (!group || !prop.metadata?.group || (prop.metadata?.group && key === group))*/
    );
  };

  console.log("brick manifest props", manifest.props);
  const navItems = getNavItemsFromManifest(manifest.props, filter);

  const formData = useMemo(() => {
    const defProps = defaultProps[brick.type].props;
    return previewMode === "mobile"
      ? merge({}, defProps, brick.props, brick.mobileProps)
      : merge({}, defProps, brick.props ?? {});
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
      title={`${brick.type} settings`}
      initialGroup={group}
      navItems={navItems}
      formSchema={manifest.props}
      className={tx("flex-1")}
      formData={formData}
      onChange={onChange}
      brickId={brick.id}
    />
  );
}
