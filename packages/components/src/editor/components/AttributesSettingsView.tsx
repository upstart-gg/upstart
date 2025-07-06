import FormNavigator from "./json-form/FormNavigator";
import { sectionSchema } from "@upstart.gg/sdk/shared/bricks";
import { getSchemaObjectDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { useAttributes, useDraft, useDraftHelpers, usePreviewMode } from "~/editor/hooks/use-editor";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import type { Attributes, AttributesSchema } from "@upstart.gg/sdk/shared/attributes";
import { tx } from "@upstart.gg/style-system/twind";

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
      (typeof prop["ui:responsive"] === "undefined" ||
        prop["ui:responsive"] === true ||
        prop["ui:responsive"] === previewMode) &&
      (!prop.metadata?.category || prop.metadata?.category === "settings")
      /* &&
      (!group || !prop.metadata?.group || (prop.metadata?.group && key === group))*/
    );
  };

  const navItems = getNavItemsFromManifest(attributesSchema, filter);

  const formData = useMemo(() => {
    // const resolvedSchema = resolveSchema(attributesSchema);
    const defProps = getSchemaObjectDefaults(attributesSchema);
    return merge({}, defProps, attr ?? {});
  }, [attr, attributesSchema]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: draft.updateAttributes is a stable function
  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChanged: string) => {
      // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
      const attrObj = structuredClone(attr);
      // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
      // For this we use lodash.set
      set(attrObj, propertyChanged, data[propertyChanged]);
      console.log("changed attr, setting path %s to %s", propertyChanged, data[propertyChanged]);
      draft.updateAttributes(attrObj);
    },
    [attr],
  );

  return (
    <FormNavigator
      title={title}
      initialGroup={group}
      navItems={navItems}
      formSchema={attributesSchema}
      className="h-full"
      formData={formData}
      onChange={onChange}
    />
  );
}
