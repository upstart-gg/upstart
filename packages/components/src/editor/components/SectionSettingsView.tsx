import FormNavigator from "./json-form/FormNavigator";
import { type Section, sectionSchema } from "@upstart.gg/sdk/bricks";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import { useLocalStorage } from "usehooks-ts";
import { useDraftHelpers } from "../hooks/use-page-data";

type SectionSettingsViewProps = {
  section: Section;
  group?: string;
};

export default function SectionSettingsView({ section, group }: SectionSettingsViewProps) {
  const { updateSectionProps } = useDraftHelpers();
  const previewMode = usePreviewMode();
  const [showAdvanced, setShowAdvanced] = useLocalStorage("upstart:editor:show-advanced", false);

  const filter: SchemaFilter = useCallback(
    (prop) => {
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
    },
    [previewMode, showAdvanced],
  );

  const navItems = useMemo(() => getNavItemsFromManifest(sectionSchema.properties.props, filter), [filter]);

  const formData = useMemo(() => {
    const defProps = getSchemaDefaults(sectionSchema.properties.props, previewMode);
    return previewMode === "mobile"
      ? merge({}, defProps, section.props, section.mobileProps)
      : merge({}, defProps, section.props ?? {});
  }, [previewMode, section.props, section.mobileProps]);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChangedPath: string) => {
      if (!propertyChangedPath) {
        console.warn("propertyChangedPath is missing in style tab");
        // ignore changes unrelated to the brick
        return;
      }
      // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
      const props = structuredClone(section?.props ?? {});
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(props, propertyChangedPath, data[propertyChangedPath]);

      console.log("SectionSettingsView onChange", {
        props,
      });
      // Update the brick props in the store
      updateSectionProps(section.id, props, previewMode === "mobile");
    },
    [section.id, previewMode, updateSectionProps, section.props],
  );

  return (
    <FormNavigator
      key={`section-settings-${section.id}-${previewMode}`}
      title={`Section settings`}
      initialGroup={group}
      navItems={navItems}
      formSchema={sectionSchema.properties.props}
      className={"flex-grow"}
      formData={formData}
      onChange={onChange}
      brickId={section.id}
    />
  );
}
