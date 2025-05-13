import {
  useDraftHelpers,
  useGetBrick,
  usePreviewMode,
  useSection,
  useSectionByBrickId,
} from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { preset } from "@upstart.gg/sdk/shared/bricks/props/preset";
import { Button, Callout, Tabs } from "@upstart.gg/style-system/system";
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
import SectionSettingsView from "./SectionSettingsView";
import PageHierarchy from "./PageHierarchy";

type TabType = "preset" | "settings" | "content";
const presets = preset().anyOf;

export default function PanelSectionInspector({ section }: { section: Section }) {
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const selectedTab = tabsMapping[section.id] ?? "settings";

  return (
    <div>
      <PanelBlockTitle>
        <div className="flex justify-between items-center group">
          {section.label ?? "unnamed"} Section
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
      >
        <Tabs.List className="sticky top-0 z-50 bg-gray-100 dark:bg-dark-900">
          {previewMode === "desktop" && (
            <Tabs.Trigger value="preset" className="!flex-1">
              Preset
            </Tabs.Trigger>
          )}
          <Tabs.Trigger value="settings" className="!flex-1">
            {previewMode === "mobile" ? "Mobile settings" : "Settings"}
          </Tabs.Trigger>
        </Tabs.List>
        <ScrollablePanelTab tab="preset">
          <div className={tx("p-2 flex flex-col gap-3")}>
            <Callout.Root size="1">
              <Callout.Text size="1">
                <span className="font-semibold">Style presets</span> are pre-configured settings that can be
                applied to your bricks to quickly change their appearance. Start from a preset and customize
                it further in the <span className="font-semibold">Settings</span> tab.
              </Callout.Text>
            </Callout.Root>
            <div className="grid grid-cols-3 gap-2 auto-rows-[3rem]">
              {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
              {presets.map((preset: any) => (
                <button
                  type="button"
                  onClick={() => {
                    console.debug("setting preset to %s", preset.const);
                    // updateBrickProps(brick.id, { preset: preset.const }, previewMode === "mobile");
                  }}
                  key={preset.const}
                  className={tx(
                    `${preset.const}`,
                    preset.const === "preset-none" && "border-gray-200 col-span-3",
                    `text-xs flex items-center justify-center text-center p-2 border
                   rounded-md hover:opacity-80`,
                    section.props.preset === preset.const && "outline outline-2 outline-upstart-400",
                  )}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="settings">
          {previewMode === "mobile" && (
            <Callout.Root size="1" className="m-2">
              <Callout.Text size="1">
                <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect
                how the brick appears on mobile devices.
              </Callout.Text>
            </Callout.Root>
          )}
          <SettingsTab section={section} />
        </ScrollablePanelTab>
      </Tabs.Root>
    </div>
  );
}

function SettingsTab({ section }: { section: Section }) {
  return (
    <form className={tx("flex flex-col justify-between h-full")}>
      <SectionSettingsView section={section} />
      {/* <div className="flex justify-center">
        <Button
          variant="ghost"
          size="1"
          color="red"
          className="w-full !mx-1 justify-center"
          onClick={() => {
            alert("todo");
          }}
        >
          Delete section
        </Button>
      </div> */}
      <PageHierarchy section={section} />
    </form>
  );
}
