import { usePreviewMode, useSectionByBrickId } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { Callout, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import BrickSettingsView from "./BrickSettingsView";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import PageHierarchy from "./PageHierarchy";
import { IconRender } from "./IconRender";
import type { TObject, TSchema } from "@sinclair/typebox";

type TabType = "preset" | "settings" | "content";

function hasFilteredProperties(manifest: BrickManifest, filter: (prop: TSchema) => boolean): boolean {
  function extractProperties(schema: TObject): Record<string, TSchema> {
    const contentProps: Record<string, TSchema> = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (filter(prop)) {
        contentProps[key] = prop;
      } else if (prop.type === "object" && prop.properties) {
        const nestedContentProps = extractProperties(prop as TObject);
        if (Object.keys(nestedContentProps).length > 0) {
          Object.assign(contentProps, nestedContentProps);
        }
      }
    }
    return contentProps;
  }
  const filteredProps = extractProperties(manifest.props as TObject);
  return Object.keys(filteredProps).length > 0;
}

export default function PanelBrickInspector({ brick }: { brick: Brick }) {
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const section = useSectionByBrickId(brick.id);
  const selectedTab = tabsMapping[brick.id] ?? "settings";
  const manifest = manifests[brick.type];

  const hasContentProperties = hasFilteredProperties(manifest, (prop) => {
    return prop.metadata?.category === "content";
  });

  useEffect(() => {
    if (!hasContentProperties && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.id]: "settings" }));
    }
  }, [setTabsMapping, brick?.id, selectedTab, hasContentProperties]);

  if (!section) {
    console.warn(`No section found for brick: ${brick.id}`);
    return null;
  }

  const showTabsList =
    (!!manifest.props.properties.preset && previewMode === "desktop") || hasContentProperties;

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
          setTabsMapping((prev) => ({ ...prev, [brick.id]: val as TabType }));
        }}
        className="flex-grow flex flex-col"
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
          </Tabs.List>
        )}
        <ScrollablePanelTab tab="settings">
          <SettingsTab brick={brick} section={section} />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="content">
          <ContentTab brick={brick} section={section} />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}

function SettingsTab({ brick, section }: { brick: Brick; section: Section }) {
  const previewMode = usePreviewMode();
  return (
    <form className={tx("flex flex-col justify-between h-full")}>
      {previewMode === "mobile" && (
        <Callout.Root size="1">
          <Callout.Text size="1">
            <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
            the brick appears on mobile devices.
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="basis-[70%] flex flex-col">
        <BrickSettingsView brick={brick} />
      </div>
      <PageHierarchy brick={brick} section={section} />
    </form>
  );
}
function ContentTab({ brick, section }: { brick: Brick; section: Section }) {
  const previewMode = usePreviewMode();
  return (
    <form className={tx("flex flex-col justify-between h-full")}>
      {previewMode === "mobile" && (
        <Callout.Root size="1">
          <Callout.Text size="1">
            <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
            the brick appears on mobile devices.
          </Callout.Text>
        </Callout.Root>
      )}
      <div className="basis-[70%] flex flex-col">
        <BrickSettingsView
          brick={brick}
          label="content"
          categoryFilter={(category) => category === "content"}
        />
      </div>
      <PageHierarchy brick={brick} section={section} />
    </form>
  );
}
