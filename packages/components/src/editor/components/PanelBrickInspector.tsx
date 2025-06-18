import { useDraftHelpers, useGetBrick, usePreviewMode, useSectionByBrickId } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { Callout, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { FormRenderer } from "./json-form/FormRenderer";
import { useLocalStorage } from "usehooks-ts";
import { useCallback, useEffect } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import BrickSettingsView from "./BrickSettingsView";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import PageHierarchy from "./PageHierarchy";
import { ajv, resolveSchema } from "@upstart.gg/sdk/shared/ajv";

type TabType = "preset" | "settings" | "content";

export default function PanelBrickInspector({ brick }: { brick: Brick }) {
  const previewMode = usePreviewMode();

  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const section = useSectionByBrickId(brick.id);
  const selectedTab = tabsMapping[brick.id] ?? "settings";
  const manifest = manifests[brick.type];

  useEffect(() => {
    if (!manifest.isContainer && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.id]: "settings" }));
    }
  }, [setTabsMapping, brick?.id, selectedTab, manifest?.isContainer]);

  if (!section) {
    console.warn(`No section found for brick: ${brick.id}`);
    return null;
  }

  const showTabsList = !!(manifest.props.properties.preset || manifest.isContainer);

  return (
    <div>
      <PanelBlockTitle>
        <div className="flex justify-between items-center group">
          {manifest.name}
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
          console.log("changing tab to %s", val);
          setTabsMapping((prev) => ({ ...prev, [brick.id]: val as TabType }));
        }}
      >
        {showTabsList && (
          <Tabs.List className="sticky top-0 z-50 bg-gray-100 dark:bg-dark-900">
            {manifest.props.properties.preset && (
              <Tabs.Trigger value="preset" className="!flex-1">
                Preset
              </Tabs.Trigger>
            )}
            <Tabs.Trigger value="settings" className="!flex-1">
              {previewMode === "mobile" ? "Mobile settings" : "Settings"}
            </Tabs.Trigger>

            {manifest.isContainer && (
              <Tabs.Trigger value="content" className="!flex-1">
                Content
              </Tabs.Trigger>
            )}
          </Tabs.List>
        )}
        {manifest.props.properties.preset && (
          <ScrollablePanelTab tab="preset">
            <PresetsTab brick={brick} section={section} />
          </ScrollablePanelTab>
        )}

        <ScrollablePanelTab tab="settings">
          <SettingsTab brick={brick} section={section} />
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="content">
          <ContentTab brick={brick} manifest={manifest} />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}

function PresetsTab({ brick, section }: { brick: Brick; section: Section }) {
  const manifest = manifests[brick.type];
  const { updateBrickProps } = useDraftHelpers();
  const previewMode = usePreviewMode();
  const schema = resolveSchema(manifest.props.properties.preset);

  return (
    <div className={tx("flex flex-col h-full")}>
      <div className="basis-1/2 grow-0">
        <Callout.Root size="1" className="m-2">
          <Callout.Text size="1">
            <span className="font-semibold">Style presets</span> are pre-configured settings that can be
            applied to your bricks to quickly change their appearance. Start from a preset and customize it
            further in the <span className="font-semibold">Settings</span> tab.
          </Callout.Text>
        </Callout.Root>
        <div className="grid grid-cols-3 gap-2 auto-rows-[3rem] flex-1 mx-2">
          {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
          {schema.anyOf.map((preset: any) => (
            <button
              type="button"
              onClick={() => {
                console.debug("setting preset to %s", preset.const);
                updateBrickProps(brick.id, { preset: preset.const }, previewMode === "mobile");
              }}
              key={preset.const}
              className={tx(
                `${preset.const}`,
                preset.const === "preset-none" && "border-gray-200 col-span-3",
                `text-xs flex items-center justify-center text-center p-2 border
                   rounded-md hover:opacity-80`,
                brick.props.preset === preset.const && "outline outline-2 outline-upstart-400",
              )}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>
      <PageHierarchy brick={brick} section={section} />
    </div>
  );
}

function SettingsTab({ brick, section }: { brick: Brick; section: Section }) {
  const previewMode = usePreviewMode();
  return (
    <form className={tx("flex flex-col justify-between h-full")}>
      {previewMode === "mobile" && (
        <Callout.Root size="1" className="m-2">
          <Callout.Text size="1">
            <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
            the brick appears on mobile devices.
          </Callout.Text>
        </Callout.Root>
      )}
      <BrickSettingsView brick={brick} />
      <PageHierarchy brick={brick} section={section} />
    </form>
  );
}

function ContentTab({ brick, manifest }: { brick: Brick; manifest: BrickManifest }) {
  const { updateBrickProps } = useDraftHelpers();
  const previewMode = usePreviewMode();
  const getBrickInfo = useGetBrick();
  const brickInfo = getBrickInfo(brick.id);

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChanged: string) => {
      if (!propertyChanged) {
        // ignore changes unrelated to the brick
        return;
      }
      console.log("ContentTab.onChange(%o)", data, propertyChanged);
      updateBrickProps(brick.id, data, previewMode === "mobile");
    },
    [brick.id, previewMode, updateBrickProps],
  );

  invariant(brickInfo, "Brick info props is missing in ContentTab");

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer
        brickId={brick.id}
        formSchema={manifest.props}
        formData={brickInfo.props}
        filter={(prop) => {
          // todo: find out how to filter out the content properties (using $id for example like styles that are prefixed by #styles:)
          return true;
          // return prop["ui:inspector-tab"] === "content";
        }}
        onChange={onChange}
        previewMode={previewMode}
      />
    </form>
  );
}
