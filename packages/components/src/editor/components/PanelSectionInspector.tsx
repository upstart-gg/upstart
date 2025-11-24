import { usePreviewMode, useDebugMode } from "../hooks/use-editor";
import { RxSection } from "react-icons/rx";
import type { Section } from "@upstart.gg/sdk/bricks";
import { Callout, Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { useLocalStorage } from "usehooks-ts";
import { css, tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import SectionSettingsView from "./SectionSettingsView";
import PageHierarchy from "./PageHierarchy";
import { useEffect, useState } from "react";

type TabType = "settings" | "debug";

export default function PanelSectionInspector({ section }: { section: Section }) {
  const debugMode = useDebugMode();
  const [currentTab, setCurrentTab] = useState<TabType>(debugMode ? "debug" : "settings");
  const showTabsList = debugMode;

  useEffect(() => {
    if (currentTab === "debug" && !debugMode) {
      setCurrentTab("settings");
    }
  }, [currentTab, debugMode]);

  return (
    <div key={`section-inspector-${section.id}`} className="flex flex-col flex-grow h-full">
      <PanelBlockTitle>
        <div className="flex justify-between items-center group">
          <span className="flex items-center">
            <RxSection className="inline-block mr-2 w-5 h-5 text-upstart-600" />
            Section {section.label ?? "unnamed"}
          </span>
          <span
            className={tx(
              "text-xs font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000",
            )}
            onClick={() => {
              navigator.clipboard.writeText(section.id);
            }}
          >
            {section.id}
          </span>
        </div>
      </PanelBlockTitle>
      <Tabs.Root
        value={currentTab}
        onValueChange={(val) => {
          setCurrentTab(val as TabType);
        }}
        className="flex-1 flex flex-col"
      >
        {showTabsList && (
          <Tabs.List className="sticky top-0 z-50 bg-gray-100 dark:bg-dark-900" size="1">
            <Tabs.Trigger value="settings" className="!flex-1">
              Settings
            </Tabs.Trigger>
            {debugMode && (
              <Tabs.Trigger value="debug" className="!flex-1">
                Debug
              </Tabs.Trigger>
            )}
          </Tabs.List>
        )}
        <ScrollablePanelTab tab="settings">
          <SettingsTab section={section} hasTabs={showTabsList} />
        </ScrollablePanelTab>
        {debugMode && (
          <ScrollablePanelTab tab="debug">
            <DebugTab section={section} hasTabs={showTabsList} />
          </ScrollablePanelTab>
        )}
      </Tabs.Root>
    </div>
  );
}

function SettingsTab({ section, hasTabs }: { section: Section; hasTabs: boolean }) {
  const previewMode = usePreviewMode();
  return (
    <div className="flex flex-col h-full">
      {previewMode === "mobile" && (
        <Callout.Root size="1">
          <Callout.Text size="1">
            <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
            the brick appears on mobile devices.
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="basis-[50%] shrink-0 grow flex flex-col">
        <SectionSettingsView section={section} />
      </div>
      <PageHierarchy section={section} className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")} />
    </div>
  );
}

function DebugTab({ section, hasTabs }: { section: Section; hasTabs: boolean }) {
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

  return (
    <div className="flex flex-col h-full">
      <div className="h-[50cqh] grow-0 overflow-y-auto scrollbar-thin">
        <PanelBlockTitle>
          Section <code className="text-xs cursor-text select-all">{section.id}</code>
        </PanelBlockTitle>
        <div className="flex-1">
          <pre className="p-1">
            <code className={codeClassName}>{JSON.stringify(section, null, 2)}</code>
          </pre>
        </div>
      </div>
      <PageHierarchy section={section} className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")} />
    </div>
  );
}
