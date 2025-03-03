import {
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  useGetBrick,
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { Callout, IconButton, Tabs } from "@upstart.gg/style-system/system";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { getFormComponents, FormRenderer } from "./json-form/form";
import { IoCloseOutline } from "react-icons/io5";
import type { JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import { useLocalStorage } from "usehooks-ts";
import merge from "lodash-es/merge";
import { BsStars } from "react-icons/bs";
import PresetsView from "./PresetsView";
import { useCallback, useEffect, useMemo } from "react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

type TabType = "preset" | "style" | "content";

export default function Inspector() {
  const brick = useSelectedBrick();
  const { deselectBrick, getParentBrick, updateBrickProps, setSelectedBrick } = useDraftHelpers();
  const { hidePanel } = useEditorHelpers();
  const previewMode = usePreviewMode();
  const [tabsMapping, setTabsMapping] = useLocalStorage<Record<string, TabType>>("inspector_tabs_map", {});

  if (!brick) {
    return null;
  }

  const parentBrick = getParentBrick(brick.id);

  const manifest = manifests[brick.type];
  if (!manifest) {
    console.warn(`No manifest found for brick: ${JSON.stringify(brick)}`);
    deselectBrick();
    hidePanel("inspector");
    return null;
  }

  const selectedTab =
    tabsMapping[brick.id] ??
    manifest.properties.defaultInspectorTab.const ??
    (previewMode === "desktop" ? "preset" : "style");

  useEffect(() => {
    if (!manifest.properties.isContainer && selectedTab === "content") {
      setTabsMapping((prev) => ({ ...prev, [brick.id]: "style" }));
    }
  }, [setTabsMapping, brick.id, selectedTab, manifest.properties.isContainer]);

  return (
    <Tabs.Root
      value={selectedTab}
      onValueChange={(val) => {
        console.log("changing tab to %s", val);
        setTabsMapping((prev) => ({ ...prev, [brick.id]: val as TabType }));
      }}
    >
      <Tabs.List className="sticky top-0 z-50">
        {previewMode === "desktop" && (
          <Tabs.Trigger value="preset" className="!flex-1">
            Style Preset
          </Tabs.Trigger>
        )}
        <Tabs.Trigger value="style" className="!flex-1">
          {previewMode === "mobile" ? "Mobile styles" : "Styles"}
        </Tabs.Trigger>
        {manifest.properties.isContainer && (
          <Tabs.Trigger value="content" className="!flex-1">
            Content
          </Tabs.Trigger>
        )}
        <IconButton
          title="Close"
          className="self-center items-center justify-center inline-flex !mr-1 !mt-2"
          size="1"
          variant="ghost"
          color="gray"
          onClick={() => {
            deselectBrick();
            hidePanel();
          }}
        >
          <IoCloseOutline className="w-4 h-4 text-gray-400 hover:text-gray-700" />
        </IconButton>
      </Tabs.List>
      <ScrollablePanelTab tab="preset">
        <div className="flex justify-between pr-0">
          <h2 className="py-1.5 px-2 flex justify-between bg-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {parentBrick ? (
              <div className="flex gap-1.5 items-center">
                <span
                  className="text-upstart-700 cursor-pointer hover:(text-upstart-800 underline)"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBrick(parentBrick);
                  }}
                >
                  {parentBrick.type}
                </span>
                <span className="text-xs ">&rarr;</span>
                <span>{manifest.properties.title.const}</span>
              </div>
            ) : (
              manifest.properties.title.const
            )}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </h2>
        </div>
        <div className={tx("p-2 flex flex-col gap-3")}>
          <Callout.Root size="1">
            <Callout.Text size="1">
              <span className="font-semibold">Style presets</span> are pre-configured settings that can be
              applied to your bricks to quickly change their appearance. Start from a preset and customize it
              further in the <span className="font-semibold">Settings</span> tab.
            </Callout.Text>
          </Callout.Root>
          <PresetsView
            onChoose={(preset) => {
              console.log("onChoose(%o)", preset);
              updateBrickProps(brick.id, preset, previewMode === "mobile");
            }}
          />
        </div>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="style">
        <div className="flex justify-between pr-0">
          <h2 className="group py-1.5 px-2 flex justify-between bg-gradient-to-t from-gray-200 to-gray-100 dark:!bg-dark-700 items-center font-medium text-sm capitalize flex-1 select-none">
            {parentBrick ? (
              <div className="flex gap-1.5 items-center">
                <span
                  className="text-upstart-700 cursor-pointer hover:(text-upstart-800 underline)"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBrick(parentBrick);
                  }}
                >
                  {parentBrick.type}
                </span>
                <span className="text-xs ">&rarr;</span>
                <span>{manifest.properties.title.const}</span>
              </div>
            ) : (
              manifest.properties.title.const
            )}
            <span
              className="text-xs text-gray-500 font-mono lowercase opacity-0 group-hover:opacity-70 transition-opacity delay-1000"
              onClick={() => {
                navigator.clipboard.writeText(brick.id);
              }}
            >
              {brick.id}
            </span>
          </h2>
        </div>
        {previewMode === "mobile" && (
          <Callout.Root size="1" className="m-2">
            <Callout.Text size="1">
              <strong>Note</strong>: You are editing mobile-only styles. Any changes here will only affect how
              the brick appears on mobile devices.
            </Callout.Text>
          </Callout.Root>
        )}
        <ElementInspector brick={brick} manifest={manifest} />
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="content">
        <ContentTab brick={brick} manifest={manifest} />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function ElementInspector({ brick, manifest }: { brick: Brick; manifest: BrickManifest }) {
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
      updateBrickProps(brick.id, data, previewMode === "mobile");
    },
    [brick.id, previewMode, updateBrickProps],
  );

  invariant(brickInfo, "Brick info props is missing in Element inspector");

  // const manifest = useMemo(() => manifests[brick.type], [brick.type]);
  const formData = useMemo(() => {
    return previewMode === "mobile"
      ? merge({}, brickInfo.props, brickInfo.mobileOverride)
      : brickInfo.props ?? {};
  }, [brickInfo, previewMode]);

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer
        components={getFormComponents({
          brickId: brick.id,
          formSchema: manifest.properties.props as unknown as JSONSchemaType<unknown>,
          formData,
          filter: (prop) => {
            return (
              (previewMode !== "mobile" || prop["ui:responsive"]) && prop["ui:inspector-tab"] === "style"
            );
          },
          onChange,
        })}
        previewMode={previewMode}
        brickId={brick.id}
      />
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
      updateBrickProps(brick.id, data, previewMode === "mobile");
    },
    [brick.id, previewMode, updateBrickProps],
  );

  invariant(brickInfo, "Brick info props is missing in ContentTab");

  console.log("content tab", brick);

  return (
    <form className={tx("px-3 flex flex-col gap-3")}>
      <FormRenderer
        components={getFormComponents({
          brickId: brick.id,
          formSchema: manifest.properties.props as unknown as JSONSchemaType<unknown>,
          formData: brickInfo.props,
          filter: (prop) => {
            return (
              prop["ui:inspector-tab"] === "content"
              // &&               (brickInfo.props?.isDynamic || prop["ui:field"] === "dynamic-content-switch")
            );
          },
          onChange,
        })}
        previewMode={previewMode}
        brickId={brick.id}
      />
    </form>
  );
}
