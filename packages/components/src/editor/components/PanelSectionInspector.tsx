import { usePreviewMode } from "../hooks/use-editor";
import { RxSection } from "react-icons/rx";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { Callout, Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { useLocalStorage } from "usehooks-ts";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import SectionSettingsView from "./SectionSettingsView";
import PageHierarchy from "./PageHierarchy";

type TabType = "settings" | "content";

export default function PanelSectionInspector({ section }: { section: Section }) {
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const selectedTab = tabsMapping[section.id] ?? "settings";
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
        value={selectedTab}
        onValueChange={(val) => {
          setTabsMapping((prev) => ({ ...prev, [section.id]: val as TabType }));
        }}
        className="flex-1 flex flex-col"
      >
        <ScrollablePanelTab tab="settings">
          <SettingsTab section={section} />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}

function SettingsTab({ section }: { section: Section }) {
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
      <PageHierarchy section={section} className="h-[50cqh]" />
    </div>
  );
}
