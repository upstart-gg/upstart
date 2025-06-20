import FormNavigator from "./json-form/FormNavigator";
import { sectionSchema } from "@upstart.gg/sdk/shared/bricks";
import { getSchemaObjectDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { useCallback, useMemo } from "react";
import { merge } from "lodash-es";
import { useAttributes, useDraft, useDraftHelpers, usePreviewMode } from "~/editor/hooks/use-editor";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import type { Attributes, AttributesSchema } from "@upstart.gg/sdk/shared/attributes";

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
  const draft = useDraft();
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
    const defProps = getSchemaObjectDefaults(attributesSchema);
    return merge({}, defProps, attr ?? {});
  }, [attr, attributesSchema]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: draft.updateAttributes is a stable function
  const onChange = useCallback((data: Record<string, unknown>, propertyChanged: string) => {
    console.log("changed attr %o", data);
    draft.updateAttributes(data as Attributes);
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
