import {
  useDebugMode,
  useDraftHelpers,
  useDynamicParent,
  useHasDynamicParent,
  usePreviewMode,
  useSectionByBrickId,
} from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { Callout, SegmentedControl, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import BrickSettingsView from "./BrickSettingsView";
import { css, tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import PageHierarchy from "./PageHierarchy";
import { IconRender } from "./IconRender";
import type { TObject, TSchema } from "@sinclair/typebox";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import DatasourceMappingField from "./json-form/fields/datasource-mapping";
import { useDatasource } from "../hooks/use-datasource";
import SwitchField from "./json-form/fields/switch";

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
  const debugMode = useDebugMode();
  const manifest = useBrickManifest(brick.type);
  const hasContentProperties = hasFilteredProperties(manifest, (prop) => {
    return (
      prop.metadata?.category === "content" &&
      (typeof prop.metadata?.["ui:responsive"] === "undefined" ||
        prop.metadata?.["ui:responsive"] === true ||
        prop.metadata?.["ui:responsive"] === previewMode) &&
      (typeof prop["ui:responsive"] === "undefined" ||
        prop["ui:responsive"] === true ||
        prop["ui:responsive"] === previewMode)
    );
  });

  const showTabsList =
    (!!manifest.props.properties.preset && previewMode === "desktop") || hasContentProperties || debugMode;

  const selectedTab = tabsMapping[brick.id] ?? (hasContentProperties ? "content" : "settings");

  useEffect(() => {
    if (!hasContentProperties && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.id]: "settings" }));
    }
  }, [setTabsMapping, brick?.id, selectedTab, hasContentProperties]);

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
          setTabsMapping((prev) => ({ ...prev, [brick.id]: val as TabType }));
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
      fontSize: "0.75rem",
      lineHeight: "1.6",
    }),
  );
  return (
    <div className="flex flex-col h-full">
      <div className="h-[50cqh] grow-0 overflow-y-auto">
        <PanelBlockTitle>
          Brick <code className="text-xs">Id: {brick.id}</code>
        </PanelBlockTitle>
        <div className="flex-1 bg-gray-100">
          <pre className="p-1">
            <code className={codeClassName}>{JSON.stringify(brick, null, 2)}</code>
          </pre>
        </div>
        <PanelBlockTitle>
          Section <code className="text-xs">Id: {section.id}</code>
        </PanelBlockTitle>
        <div className="flex-1 bg-gray-100">
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
  const dynamicContent = !!brick.props.dynamicContent;
  const ds = useDatasource(brick.props.datasource?.id);
  const { updateBrickProps } = useDraftHelpers();
  return (
    <div className={tx("flex flex-col h-full")}>
      <div className="basis-[50%] shrink-0 grow flex flex-col">
        {dynamicParent !== null && (
          <div className="flex flex-col">
            <Callout.Root size="1">
              <Callout.Text size="1">
                This brick is inside a dynamic parent brick so you can choose to use dynamic content in it.
              </Callout.Text>
            </Callout.Root>
            <div className="flex p-2">
              <SwitchField
                brickId={brick.id}
                currentValue={dynamicContent}
                onChange={(value) => {
                  updateBrickProps(brick.id, { dynamicContent: value });
                }}
                title="Use dynamic content"
                description="Enable this to allow dynamic content mapping for this brick."
                formData={brick.props}
                formSchema={manifests[brick.type].props as TObject}
                schema={manifests[brick.type].props as TObject}
              />
            </div>
          </div>
        )}
        {!dynamicContent && (
          <BrickSettingsView
            brick={brick}
            label="content"
            categoryFilter={(category) => category === "content"}
          />
        )}
        {dynamicParent !== null && dynamicContent && (
          <DatasourceMappingField
            currentValue={brick.props.datasourceMapping}
            formData={brick.props}
            schema={manifests[brick.type].props}
            formSchema={manifests[brick.type].props as TObject}
            brickId={brick.id}
            onChange={(data) => {
              // Handle the change in datasource mapping
            }}
          />
        )}
      </div>
      <PageHierarchy
        brick={brick}
        section={section}
        className={tx(hasTabs ? "h-[calc(50cqh-58px)]" : "h-[50cqh]")}
      />
    </div>
  );
}
