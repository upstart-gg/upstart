import { useAttributes, useAttributesSchema, useDraft, useEditorHelpers } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import { tx } from "@upstart.gg/style-system/twind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormRenderer } from "./json-form/FormRenderer";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import { Tabs, Spinner, IconButton } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { IoCloseOutline } from "react-icons/io5";

export default function SettingsForm() {
  const draft = useDraft();
  const attributes = useAttributes();
  const attrSchema = useAttributesSchema();
  const filteredAttrSchema = useMemo(() => sortJsonSchemaProperties(attrSchema), [attrSchema]);
  const [shouldRender, setShouldRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("page-settings");
  const { hidePanel } = useEditorHelpers();

  // biome-ignore lint/correctness/useExhaustiveDependencies: draft.updateAttributes is a stable function
  const onChange = useCallback((data: Record<string, unknown>, propertyChanged: string) => {
    console.log("changed attr %o", data);
    draft.updateAttributes(data as Attributes);
  }, []);

  useEffect(() => {
    // Defer the form rendering to the next frame
    const timeoutId = requestAnimationFrame(() => {
      setShouldRender(true);
    });

    return () => cancelAnimationFrame(timeoutId);
  }, []);

  const LoadingSpinner = () => (
    <div className="flex flex-1 items-center justify-center w-full h-full">
      <Spinner size="3" />
    </div>
  );

  if (!shouldRender) {
    return <LoadingSpinner />;
  }

  return (
    <Tabs.Root defaultValue={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List className={tx("sticky top-0 z-50")}>
        <Tabs.Trigger value="page-settings" className={tx("!flex-1")}>
          Page settings
        </Tabs.Trigger>
        <Tabs.Trigger value="site-settings" className={tx("!flex-1")}>
          Site settings
        </Tabs.Trigger>
        <IconButton
          title="Close"
          className="self-center items-center justify-center inline-flex !mr-1 !mt-2"
          size="1"
          variant="ghost"
          color="gray"
          onClick={() => hidePanel()}
        >
          <IoCloseOutline className="w-4 h-4 text-gray-400 hover:text-gray-700" />
        </IconButton>
      </Tabs.List>
      <ScrollablePanelTab tab="page-settings">
        <form className={tx("px-3 flex flex-col gap-y-2.5 pb-6")}>
          <FormRenderer
            formSchema={filteredAttrSchema}
            formData={attributes}
            filter={(field) => {
              return currentTab === "page-settings"
                ? field?.["ui:scope"] !== "site"
                : field?.["ui:scope"] === "site";
            }}
            onChange={onChange}
          />
        </form>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="site-settings">
        <form className={tx("px-3 flex flex-col gap-y-2.5 pb-6")}>
          <FormRenderer
            formSchema={filteredAttrSchema}
            formData={attributes}
            filter={(field) => {
              return currentTab === "page-settings"
                ? field?.["ui:scope"] !== "site"
                : field?.["ui:scope"] === "site";
            }}
            onChange={onChange}
          />
        </form>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}
