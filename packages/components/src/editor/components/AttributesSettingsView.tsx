import FormNavigator from "./json-form/FormNavigator";
import { getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { useCallback, useMemo } from "react";
import { merge, set, unset } from "lodash-es";
import { getNavItemsFromManifest, type SchemaFilter } from "./json-form/form-utils";
import type {
  PageAttributes,
  pageAttributesSchema,
  SiteAttributes,
  siteAttributesSchema,
} from "@upstart.gg/sdk/shared/attributes";
import { useAttributesGroup, useEditorHelpers, usePreviewMode } from "../hooks/use-editor";
import { useDraft } from "../hooks/use-page-data";
import type { NavItem } from "./json-form/types";

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
  const editorHelpers = useEditorHelpers();
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
  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChanged: string) => {
      console.log("attributes -> propertyChanged", propertyChanged);
      if (type === "page") {
        if (data[propertyChanged] === null) {
          draft.deletePageAttribute(propertyChanged);
        } else {
          const props = {};
          set(props, propertyChanged, data[propertyChanged]);
          draft.updatePageAttributes(props as PageAttributes);
        }
      } else {
        if (data[propertyChanged] === null) {
          draft.deleteSiteAttribute(propertyChanged);
        } else {
          const props = {};
          set(props, propertyChanged, data[propertyChanged]);
          draft.updateSiteAttributes(props as SiteAttributes);
        }
      }
    },
    [attributes],
  );

  const onNavigate = (item: NavItem | null) => {
    // reset group if navigating to top
    if (!item) {
      editorHelpers.setAttributesGroup(undefined);
    }
  };

  return (
    <FormNavigator
      key={`${type}-attributes-form-${group || "all"}`}
      onNavigate={onNavigate}
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
