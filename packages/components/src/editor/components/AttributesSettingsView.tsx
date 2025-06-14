import FormNavigator from "./json-form/FormNavigator";
import { sectionSchema } from "@upstart.gg/sdk/shared/bricks";
import { getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { useCallback, useMemo } from "react";
import { merge } from "lodash-es";
import { useAttributes, usePreviewMode } from "~/editor/hooks/use-editor";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import type { AttributesSchema } from "@upstart.gg/sdk/shared/attributes";

type AttributesSettingsViewProps = {
  attributesSchema: AttributesSchema;
  title: string;
  group?: string;
};

export default function AttributesSettingsView({
  attributesSchema,
  title,
  group,
}: AttributesSettingsViewProps) {
  const previewMode = usePreviewMode();
  const attr = useAttributes();
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

  const navItems = getNavItemsFromManifest(attributesSchema, filter);

  const formData = useMemo(() => {
    const defProps = getSchemaDefaults(attributesSchema);
    return merge({}, defProps, attr ?? {});
  }, [attr, attributesSchema]);

  const onChange = useCallback((data: Record<string, unknown>, propertyChangedPath: string) => {
    console.log("onChange", data, propertyChangedPath);
  }, []);

  return (
    <FormNavigator
      title={title}
      initialGroup={group}
      navItems={navItems}
      formSchema={sectionSchema.properties.props}
      className="h-full"
      formData={formData}
      onChange={onChange}
    />
  );
}
