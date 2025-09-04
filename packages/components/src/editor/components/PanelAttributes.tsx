import { useMemo, useState } from "react";
import { pageAttributesSchema, siteAttributesSchema } from "@upstart.gg/sdk/shared/attributes";
import { Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { css, tx } from "@upstart.gg/style-system/twind";
import AttributesSettingsView from "./AttributesSettingsView";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { usePageAttributes, useSiteAttributes } from "../hooks/use-page-data";
import { useDebugMode } from "../hooks/use-editor";

export default function SettingsForm() {
  const [currentTab, setCurrentTab] = useState("page-settings");
  const attrSchema = currentTab === "page-settings" ? pageAttributesSchema : siteAttributesSchema; // Assuming both tabs use the same schema for simplicity
  const pageAttributes = usePageAttributes();
  const siteAttributes = useSiteAttributes();
  const debugMode = useDebugMode();

  const filteredAttrSchema = useMemo(() => {
    const filteredSchema = {
      ...attrSchema,
      properties: Object.fromEntries(
        Object.entries(attrSchema.properties).filter(([key, value]) => {
          return !value["ui:hidden"];
        }),
      ),
    };
    return filteredSchema as typeof attrSchema;
  }, [attrSchema]);

  return (
    <div className="flex flex-col h-full">
      <PanelBlockTitle>Settings</PanelBlockTitle>
      <Tabs.Root
        defaultValue={currentTab}
        onValueChange={setCurrentTab}
        className="flex-grow flex flex-col h-dvh"
      >
        <Tabs.List size="1" className="sticky top-0 z-50 bg-gray-100">
          <Tabs.Trigger value="site-settings" className={tx("!flex-1")}>
            Site
          </Tabs.Trigger>
          <Tabs.Trigger value="page-settings" className={tx("!flex-1")}>
            Current Page
          </Tabs.Trigger>
          {debugMode && (
            <Tabs.Trigger value="debug" className={tx("!flex-1")}>
              Debug
            </Tabs.Trigger>
          )}
        </Tabs.List>
        <ScrollablePanelTab tab="page-settings">
          <AttributesSettingsView
            type="page"
            attributes={pageAttributes}
            attributesSchema={filteredAttrSchema}
            title="Page settings"
          />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="site-settings">
          <AttributesSettingsView
            type="site"
            attributes={siteAttributes}
            attributesSchema={filteredAttrSchema}
            title="Site settings"
          />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="debug">
          <DebugTab />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}

function DebugTab() {
  const codeClassName = tx(
    css({
      display: "block",
      fontFamily: "monospace",
      fontSize: "0.7rem",
      lineHeight: "1.3",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    }),
  );
  const siteAttributes = useSiteAttributes();
  const pageAttributes = usePageAttributes();
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      <PanelBlockTitle>Page Attributes</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(pageAttributes, null, 2)}</code>
        </pre>
      </div>
      <PanelBlockTitle>Site Attributes</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(siteAttributes, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
