import { useMemo, useState } from "react";
import { pageAttributesSchema, siteAttributesSchema } from "@upstart.gg/sdk/shared/attributes";
import { Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { tx } from "@upstart.gg/style-system/twind";
import AttributesSettingsView from "./AttributesSettingsView";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { usePageAttributes, useSiteAttributes } from "../hooks/use-page-data";

export default function SettingsForm() {
  const [currentTab, setCurrentTab] = useState("page-settings");
  const attrSchema = currentTab === "page-settings" ? pageAttributesSchema : siteAttributesSchema; // Assuming both tabs use the same schema for simplicity
  const pageAttributes = usePageAttributes();
  const siteAttributes = useSiteAttributes();

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
    return filteredSchema as typeof attrSchema;
  }, [attrSchema, currentTab]);

  return (
    <div className="flex flex-col h-full">
      <PanelBlockTitle>Settings</PanelBlockTitle>
      <Tabs.Root
        defaultValue={currentTab}
        onValueChange={setCurrentTab}
        className="flex-grow flex flex-col h-dvh"
      >
        <Tabs.List className="sticky top-0 z-50 bg-gray-100">
          <Tabs.Trigger value="site-settings" className={tx("!flex-1")}>
            Site
          </Tabs.Trigger>
          <Tabs.Trigger value="page-settings" className={tx("!flex-1")}>
            Current Page
          </Tabs.Trigger>
        </Tabs.List>
        <ScrollablePanelTab tab="page-settings">
          <AttributesSettingsView
            attributes={pageAttributes}
            attributesSchema={filteredAttrSchema}
            title="Page settings"
          />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="site-settings">
          <AttributesSettingsView
            attributes={siteAttributes}
            attributesSchema={filteredAttrSchema}
            title="Site settings"
          />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}
