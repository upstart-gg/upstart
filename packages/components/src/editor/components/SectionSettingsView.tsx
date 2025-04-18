import FormNavigator from "./json-form/FormNavigator";
import { Brick, type Section, sectionSchema } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { NavItem } from "./json-form/types";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { useDraftHelpers, useGetBrick, usePreviewMode, useSection } from "~/editor/hooks/use-editor";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import { Value } from "@sinclair/typebox/value";

type SectionSettingsViewProps = {
  section: Section;
  group?: string;
};

export default function SectionSettingsView({ section, group }: SectionSettingsViewProps) {
  const { updateSectionProps } = useDraftHelpers();
  const previewMode = usePreviewMode();
  const sectionInfo = useSection(section.id);

  const filter: SchemaFilter = (prop) => {
    return (
      (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
        prop.metadata?.["ui:responsive"] === true ||
        prop.metadata?.["ui:responsive"] === previewMode) &&
      (!prop.metadata?.category || prop.metadata?.category === "settings")
      /* &&
      (!group || !prop.metadata?.group || (prop.metadata?.group && key === group))*/
    );
  };

  const navItems = getNavItemsFromManifest(sectionSchema.properties.props, filter);

  const formData = useMemo(() => {
    const defProps = Value.Create(sectionSchema.properties.props);
    return previewMode === "mobile"
      ? merge({}, defProps, sectionInfo.props, sectionInfo.mobileProps)
      : merge({}, defProps, sectionInfo.props ?? {});
  }, [sectionInfo, previewMode]);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChangedPath: string) => {
      if (!propertyChangedPath) {
        console.warn("propertyChangedPath is missing in style tab");
        // ignore changes unrelated to the brick
        return;
      }
      // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
      const props = JSON.parse(JSON.stringify(sectionInfo?.props ?? {}));
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(props, propertyChangedPath, data[propertyChangedPath]);
      // Update the brick props in the store
      updateSectionProps(section.id, props, previewMode === "mobile");
    },
    [section.id, previewMode, updateSectionProps, sectionInfo],
  );

  return (
    <FormNavigator
      title={`Section settings`}
      initialGroup={group}
      navItems={navItems}
      formSchema={sectionSchema.properties.props}
      formData={formData}
      onChange={onChange}
      brickId={section.id}
    />
  );
}
