import { useAttributes, useAttributesSchema, useDraft, useEditorHelpers } from "../hooks/use-editor";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Attributes, AttributesSchema } from "@upstart.gg/sdk/shared/attributes";
import { Tabs, Spinner, IconButton } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { tx, css } from "@upstart.gg/style-system/twind";
import FormNavigator from "./json-form/FormNavigator";
import AttributesSettingsView from "./AttributesSettingsView";

export default function SettingsForm() {
  const attrSchema = useAttributesSchema();
  const [shouldRender, setShouldRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("page-settings");

  const filteredAttrSchema = useMemo(() => {
    const filteredSchema = {
      ...attrSchema,
      properties: Object.fromEntries(
        Object.entries(attrSchema.properties).filter(([key, value]) => {
          // Filter out properties with "ui:hidden" set to true
          if (value["ui:hidden"]) {
            return false;
          }
          // Filter out properties based on the current tab
          if (currentTab === "page-settings" && value["ui:scope"] === "site") {
            return false;
          }
          if (currentTab === "site-settings" && value["ui:scope"] !== "site") {
            return false;
          }
          return true;
        }),
      ),
    };
    return filteredSchema as AttributesSchema;
  }, [attrSchema, currentTab]);

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
    <Tabs.Root
      defaultValue={currentTab}
      onValueChange={setCurrentTab}
      className="flex-grow flex flex-col h-dvh"
    >
      <Tabs.List className="sticky top-0 z-50 bg-gray-100">
        <Tabs.Trigger value="page-settings" className={tx("!flex-1")}>
          Page settings
        </Tabs.Trigger>
        <Tabs.Trigger value="site-settings" className={tx("!flex-1")}>
          Site settings
        </Tabs.Trigger>
      </Tabs.List>
      <ScrollablePanelTab tab="page-settings">
        <AttributesSettingsView attributesSchema={filteredAttrSchema} title="Page settings" />
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="site-settings">
        <AttributesSettingsView attributesSchema={filteredAttrSchema} title="Site settings" />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}
