import { useDebugMode, usePreviewMode } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { Callout, Tabs } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import BrickSettingsView from "./BrickSettingsView";
import { css, tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import PageHierarchy from "./PageHierarchy";
import { IconRender } from "./IconRender";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { filterSchemaProperties } from "@upstart.gg/sdk/shared/utils/schema";
import { useSectionByBrickId, useDraftHelpers, useDynamicParent } from "../hooks/use-page-data";

type TabType = "preset" | "settings" | "content";

export default function PanelBrickInspector({ brick }: { brick: Brick }) {
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const section = useSectionByBrickId(brick.id);
  const debugMode = useDebugMode();
  const manifest = useBrickManifest(brick.type);
  const contentProperties = filterSchemaProperties(manifest.props, (prop) => {
    return (
      prop.metadata?.category === "content" &&
      prop["ui:field"] !== "hidden" &&
      (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
        prop.metadata?.["ui:responsive"] === true ||
        prop.metadata?.["ui:responsive"] === previewMode) &&
      (typeof prop["ui:responsive"] === "undefined" ||
        prop["ui:responsive"] === true ||
        prop["ui:responsive"] === previewMode)
    );
  });
  const hasContentProperties = Object.keys(contentProperties).length > 0;
  const showTabsList =
    (!!manifest.props.properties.preset && previewMode === "desktop") || hasContentProperties || debugMode;

  const selectedTab = tabsMapping[brick.type] ?? (hasContentProperties ? "content" : "settings");

  useEffect(() => {
    if (!hasContentProperties && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.type]: "settings" }));
    }
  }, [setTabsMapping, brick.type, selectedTab, hasContentProperties]);

  if (!section) {
    console.warn(`No section found for brick: ${brick.id}`);
    return null;
  }

  return (
    <div key={`brick-inspector-${brick.id}`} className="flex flex-col flex-grow h-full">
      <PanelBlockTitle>
        <div className="flex flex-1 justify-between items-center group">
          <span className="flex items-center">
            <IconRender manifest={manifest} className="inline-block mr-2 !h-4 !w-4 " />
            {manifest.name}
          </span>
          <span
            className={tx(
              "text-xs font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000",
            )}
            onClick={() => {
              navigator.clipboard.writeText(brick.id);
            }}
          >
            {brick.id}
          </span>
        </div>
      </PanelBlockTitle>
      <Tabs.Root
        value={selectedTab}
        onValueChange={(val) => {
          setTabsMapping((prev) => ({ ...prev, [brick.type]: val as TabType }));
        }}
        className="flex-1 flex flex-col"
      >
        {showTabsList && (
          <Tabs.List className="sticky top-0 z-50 bg-gray-100 dark:bg-dark-900" size="1">
            {hasContentProperties && (
              <Tabs.Trigger value="content" className="!flex-1">
                Content
              </Tabs.Trigger>
            )}
            <Tabs.Trigger value="settings" className="!flex-1">
              {previewMode === "mobile" ? "Mobile settings" : "Settings"}
            </Tabs.Trigger>
            {debugMode && (
              <Tabs.Trigger value="debug" className="!flex-1">
                Debug
              </Tabs.Trigger>
            )}
          </Tabs.List>
        )}
        <ScrollablePanelTab tab="settings">
          <SettingsTab brick={brick} section={section} hasTabs={showTabsList} />
        </ScrollablePanelTab>
        {hasContentProperties && (
          <ScrollablePanelTab tab="content">
            <ContentTab brick={brick} section={section} hasTabs={showTabsList} />
          </ScrollablePanelTab>
        )}
        {debugMode && (
          <ScrollablePanelTab tab="debug">
            <DebugTab brick={brick} section={section} hasTabs={showTabsList} />
          </ScrollablePanelTab>
        )}
      </Tabs.Root>
    </div>
  );
}

function DebugTab({ brick, section, hasTabs }: { brick: Brick; section: Section; hasTabs: boolean }) {
  const codeClassName = tx(
    css({
      display: "block",
      fontFamily: "monospace",
      fontSize: "0.7rem",
      lineHeight: "1.3",
    }),
  );
  const { getParentBrick } = useDraftHelpers();
  const parentBrick = getParentBrick(brick.id);
  return (
    <div className="flex flex-col h-full">
      <div className="h-[50cqh] grow-0 overflow-y-auto">
        <PanelBlockTitle>
          Brick <code className="text-xs">Id: {brick.id}</code>
        </PanelBlockTitle>
        <div className="flex-1 ">
          <pre className="p-1">
            <code className={codeClassName}>{JSON.stringify(brick, null, 2)}</code>
          </pre>
        </div>
        {parentBrick && (
          <>
            <PanelBlockTitle>
              Parent Brick <code className="text-xs">Id: {parentBrick.id}</code>
            </PanelBlockTitle>
            <div className="flex-1 ">
              <pre className="p-1">
                <code className={codeClassName}>{JSON.stringify(parentBrick, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
        <PanelBlockTitle>
          Section <code className="text-xs">Id: {section.id}</code>
        </PanelBlockTitle>
        <div className="flex-1 ">
          <pre className="p-1">
            <code className={codeClassName}>{JSON.stringify(section, null, 2)}</code>
          </pre>
        </div>
      </div>
      <PageHierarchy
        brick={brick}
        section={section}
        className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")}
      />
    </div>
  );
}

function SettingsTab({ brick, section, hasTabs }: { brick: Brick; section: Section; hasTabs: boolean }) {
  const previewMode = usePreviewMode();
  return (
    <form className={tx("flex flex-col h-full")} onSubmit={(e) => e.preventDefault()}>
      {previewMode === "mobile" && (
        <Callout.Root size="1">
          <Callout.Text size="1">
            <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
            the brick appears on mobile devices.
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="basis-[50%] shrink-0 grow flex flex-col">
        <BrickSettingsView brick={brick} />
      </div>
      <PageHierarchy
        brick={brick}
        section={section}
        className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")}
      />
    </form>
  );
}

function ContentTab({ brick, section, hasTabs }: { brick: Brick; section: Section; hasTabs: boolean }) {
  const dynamicParent = useDynamicParent(brick.id);
  const kbdClassname = tx("shadow-sm border px-1 py-[3px] rounded border-upstart-300 text-[80%] bg-white/80");
  return (
    <div className={tx("flex flex-col h-full")}>
      <div className="basis-[50%] shrink-0 grow flex flex-col">
        {dynamicParent !== null && (
          <Callout.Root size="1">
            <Callout.Text size="1" className="gap-2 flex-col flex">
              <span className="block">
                This brick is inside a dynamic parent brick so it will be rendered with dynamic content.
              </span>
              <span className="block">
                Start typing <kbd className={kbdClassname}>{`{{`}</kbd> or simply click the associated button{" "}
                <kbd className={kbdClassname}>{`{}`}</kbd> to insert a variable from your database.
              </span>
            </Callout.Text>
          </Callout.Root>
        )}
        <BrickSettingsView
          brick={brick}
          label="content"
          categoryFilter={(category) => category === "content"}
        />
      </div>
      <PageHierarchy
        brick={brick}
        section={section}
        className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")}
      />
    </div>
  );
}
