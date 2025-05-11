import {
  useDraftHelpers,
  useEditorHelpers,
  useGetBrick,
  usePreviewMode,
  useSection,
  useSectionByBrickId,
  useSelectedBrickId,
} from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { Button, Callout, IconButton, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { FormRenderer } from "./json-form/FormRenderer";
import { IoCloseOutline } from "react-icons/io5";
import { useLocalStorage } from "usehooks-ts";
import PresetsView from "./BrickPresetsView";
import { useCallback, useEffect, useMemo } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import BrickSettingsView from "./BrickSettingsView";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import SectionSettingsView from "./SectionSettingsView";

type TabType = "preset" | "settings" | "content" | "container" | "section";

export default function Inspector({ brick }: { brick: Brick }) {
  const { getParentBrick } = useDraftHelpers();
  const getBrickInfo = useGetBrick();
  const { hidePanel, setSelectedBrickId, deselectBrick } = useEditorHelpers();
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});
  const section = useSectionByBrickId(brick.id);

  const selectedTab = tabsMapping[brick.id] ?? "settings";
  const manifest = manifests[brick.type];

  console.log(manifest);

  useEffect(() => {
    if (!manifest.isContainer && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.id]: "settings" }));
    }
  }, [setTabsMapping, brick?.id, selectedTab, manifest?.isContainer]);

  const parentBrick = getParentBrick(brick.id);
  // if (!manifest) {
  //   console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
  //   deselectBrick();
  //   hidePanel("inspector");
  //   return null;
  // }

  if (!section) {
    console.warn(`No section found for brick: ${brick.id}`);
    return null;
  }

  return (
    <Tabs.Root
      value={selectedTab}
      onValueChange={(val) => {
        console.log("changing tab to %s", val);
        setTabsMapping((prev) => ({ ...prev, [brick.id]: val as TabType }));
      }}
    >
      <Tabs.List className="sticky top-0 z-50 bg-gray-100">
        {previewMode === "desktop" && (
          <Tabs.Trigger value="preset" className="!flex-1">
            Preset
          </Tabs.Trigger>
        )}
        <Tabs.Trigger value="settings" className="!flex-1">
          {previewMode === "mobile" ? "Mobile settings" : "Settings"}
        </Tabs.Trigger>
        <Tabs.Trigger value="section" className="!flex-1">
          Section
        </Tabs.Trigger>
        {manifest.isContainer && (
          <Tabs.Trigger value="content" className="!flex-1">
            Content
          </Tabs.Trigger>
        )}
      </Tabs.List>
      <ScrollablePanelTab tab="preset">
        <PanelBlockTitle>
          <div className="flex justify-between pr-0">
            {parentBrick ? (
              <div className="flex gap-1.5 items-center">
                <span
                  className="text-upstart-700 cursor-pointer hover:(text-upstart-800 underline)"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBrickId(parentBrick.id);
                  }}
                >
                  {parentBrick.type}
                </span>
                <span className="text-xs ">&rarr;</span>
                <span>{manifest.name}</span>
              </div>
            ) : (
              manifest.name
            )}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </div>
        </PanelBlockTitle>
        <div className={tx("p-2 flex flex-col gap-3")}>
          <Callout.Root size="1">
            <Callout.Text size="1">
              <span className="font-semibold">Style presets</span> are pre-configured settings that can be
              applied to your bricks to quickly change their appearance. Start from a preset and customize it
              further in the <span className="font-semibold">Settings</span> tab.
            </Callout.Text>
          </Callout.Root>
          <div className="grid grid-cols-2 gap-2 auto-rows-[3rem]">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {manifest.props.properties.preset.anyOf.map((preset: any) => (
              <div
                key={preset.const}
                className="text-xs flex items-center justify-center text-center p-2 text-upstart-700 dark:text-upstart-400 border border-upstart-200 rounded-md hover:bg-upstart-50"
              >
                {preset.title}
              </div>
            ))}
          </div>
        </div>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="settings" hasTitle>
        <PanelBlockTitle>
          <div className="flex justify-between">
            {manifest.name}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </div>
        </PanelBlockTitle>
        {previewMode === "mobile" && (
          <Callout.Root size="1" className="m-2">
            <Callout.Text size="1">
              <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
              the brick appears on mobile devices.
            </Callout.Text>
          </Callout.Root>
        )}
        <SettingsTab brick={brick} section={section} />
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="section">
        {previewMode === "mobile" && (
          <Callout.Root size="1" className="m-2">
            <Callout.Text size="1">
              <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
              the brick appears on mobile devices.
            </Callout.Text>
          </Callout.Root>
        )}
        <SectionTab section={section} />
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="content">
        <ContentTab brick={brick} manifest={manifest} />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function SettingsTab({ brick, section }: { brick: Brick; section: Section }) {
  return (
    <form className={tx("flex flex-col justify-start h-[calc(100%-50px)] flex-1")}>
      <BrickSettingsView brick={brick} />
      <BrickHierarchy brick={brick} section={section} />
    </form>
  );
}
function BrickHierarchy({ brick: selectedBrick, section }: { brick: Brick; section: Section }) {
  const { setSelectedBrickId } = useEditorHelpers();

  function mapBricks(bricks: Brick[], level = 0) {
    return bricks.map((brick) => {
      const childBricks = "$children" in brick.props ? (brick.props.$children as Brick[]) : null;
      const icon = manifests[brick.type].icon;
      const iconComp = typeof icon === "string" ? icon : icon({ size: 16 });
      const brickName = manifests[brick.type].name;

      return (
        <div key={brick.id}>
          <div
            className={tx(
              "py-1 rounded-sm user-select-none",
              selectedBrick.id === brick.id
                ? "bg-upstart-50 font-bold cursor-default"
                : "hover:bg-gray-50 cursor-pointer",
            )}
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBrickId(brick.id);
            }}
          >
            <div className="text-upstart-700 hover:text-upstart-800 flex items-center justify-between gap-px px-1">
              <span className="inline-flex items-center gap-1.5">
                {iconComp} {brickName}
              </span>
              <span className="text-xs text-gray-400 font-mono lowercase">{brick.id}</span>
            </div>
          </div>

          {childBricks && childBricks.length > 0 && (
            <div className="flex flex-col gap-px">{mapBricks(childBricks, level + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="flex-1">
      <PanelBlockTitle>Hierarchy</PanelBlockTitle>
      <div className="py-2 px-2 flex flex-col gap-1 text-sm">
        <div className="text-upstart-700 hover:text-upstart-800 flex items-center justify-between gap-px">
          Section {section.label ?? "Unnamed"}
        </div>
        <div className="flex flex-col gap-px ml-2">{mapBricks(section.bricks)}</div>
      </div>
    </div>
  );
}
function SectionTab({ section }: { section: Section }) {
  return (
    <form className={tx("flex flex-col justify-between h-full flex-1")}>
      <SectionSettingsView section={section} />
      {/* delete section button */}
      <Button
        variant="outline"
        size="2"
        color="red"
        className="w-full !m-3"
        onClick={() => {
          alert("todo");
        }}
      >
        Delete section
      </Button>
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
          return prop["ui:inspector-tab"] === "content";
        }}
        onChange={onChange}
        previewMode={previewMode}
      />
    </form>
  );
}
