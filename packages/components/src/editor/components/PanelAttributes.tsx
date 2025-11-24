import { useMemo, useState } from "react";
import { pageAttributesSchema, siteAttributesSchema } from "@upstart.gg/sdk/shared/site/attributes";
import { Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { css, tx } from "@upstart.gg/style-system/twind";
import AttributesSettingsView from "./AttributesSettingsView";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { usePageAttributes, useSiteAttributes } from "../hooks/use-page-data";
import { useAttributesGroup, useAttributesTab, useDebugMode, useEditorHelpers } from "../hooks/use-editor";
import { useLocalStorage } from "usehooks-ts";
import { useDatasources } from "../hooks/use-datasource";
import { useDatarecords } from "../hooks/use-datarecord";

export default function SettingsForm() {
  // const [currentTab, setCurrentTab] = useState("page-settings");
  const currentTab = useAttributesTab();
  const attrSchema = currentTab === "page" ? pageAttributesSchema : siteAttributesSchema;
  const editorHelpers = useEditorHelpers();
  const pageAttributes = usePageAttributes();
  const siteAttributes = useSiteAttributes();
  const debugMode = useDebugMode();
  const attributesGroup = useAttributesGroup();

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
        // defaultValue={currentTab}
        value={currentTab}
        onValueChange={(tab) => editorHelpers.setAttributesTab(tab as "site" | "page")}
        className="flex-grow flex flex-col h-dvh"
      >
        <Tabs.List size="1" className="sticky top-0 z-50 bg-gray-100">
          <Tabs.Trigger value="site" className={tx("!flex-1")}>
            Site
          </Tabs.Trigger>
          <Tabs.Trigger value="page" className={tx("!flex-1")}>
            Page
          </Tabs.Trigger>
          {debugMode && (
            <Tabs.Trigger value="debug" className={tx("!flex-1")}>
              Debug
            </Tabs.Trigger>
          )}
        </Tabs.List>
        <ScrollablePanelTab tab="page">
          <AttributesSettingsView
            type="page"
            attributes={pageAttributes}
            attributesSchema={filteredAttrSchema}
            title="Page settings"
            group={attributesGroup}
          />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="site">
          <AttributesSettingsView
            type="site"
            attributes={siteAttributes}
            attributesSchema={filteredAttrSchema}
            title="Site settings"
            group={attributesGroup}
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
  const datasources = useDatasources();
  const datarecords = useDatarecords();

  return (
    <div className="flex flex-col h-[calc(100dvh-70px)] overflow-y-auto scrollbar-thin">
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
      <PanelBlockTitle>Datasources ({datasources.length})</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(datasources, null, 2)}</code>
        </pre>
      </div>
      <PanelBlockTitle>Datarecords ({datarecords.length})</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(datarecords, null, 2)}</code>
        </pre>
      </div>
      {/* <PanelBlockTitle>Page queries ({pageAttributes.queries?.length ?? 0})</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(pageAttributes.queries, null, 2)}</code>
        </pre>
      </div> */}
    </div>
  );
}
