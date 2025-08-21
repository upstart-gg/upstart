import FormNavigator from "./json-form/FormNavigator";
import { getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { useCallback, useMemo } from "react";
import { merge, set } from "lodash-es";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import type {
  PageAttributes,
  pageAttributesSchema,
  SiteAttributes,
  siteAttributesSchema,
} from "@upstart.gg/sdk/shared/attributes";
import { usePreviewMode } from "../hooks/use-editor";
import { useDraft } from "../hooks/use-page-data";

type AttributesSettingsViewProps = {
  attributes: PageAttributes | SiteAttributes;
  attributesSchema: typeof pageAttributesSchema | typeof siteAttributesSchema;
  type: "page" | "site";
  title: string;
  group?: string;
};

export default function AttributesSettingsView({
  attributes,
  attributesSchema,
  title,
  group,
  type,
}: AttributesSettingsViewProps) {
  const previewMode = usePreviewMode();
  const draft = useDraft();
  const filter: SchemaFilter = (prop) => {
    return (
      (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
        prop.metadata?.["ui:responsive"] === true ||
        prop.metadata?.["ui:responsive"] === previewMode) &&
      (typeof prop["ui:responsive"] === "undefined" ||
        prop["ui:responsive"] === true ||
        prop["ui:responsive"] === previewMode)
      // &&       (!prop.metadata?.category || prop.metadata?.category === "settings")
      /* &&
      (!group || !prop.metadata?.group || (prop.metadata?.group && key === group))*/
    );
  };

  const navItems = getNavItemsFromManifest(attributesSchema, filter);

  const formData = useMemo(() => {
    // const resolvedSchema = resolveSchema(attributesSchema);
    const defProps = getSchemaDefaults(attributesSchema);
    return merge({}, defProps, attributes ?? {});
  }, [attributes, attributesSchema]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: draft.updatePageAttributes and draft.updateSiteAttributes are stable functions
  const onChange = useCallback((data: Record<string, unknown>, propertyChanged: string) => {
    console.trace("AttributesSettingsView onChange");
    // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
    const attrObj = structuredClone(attributes);
    // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
    // For this we use lodash.set
    set(attrObj, propertyChanged, data[propertyChanged]);

    if (type === "page") {
      draft.updatePageAttributes(attrObj as PageAttributes);
    } else {
      draft.updateSiteAttributes(attrObj as SiteAttributes);
    }
  }, []);

  return (
    <FormNavigator
      brickId="none"
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
