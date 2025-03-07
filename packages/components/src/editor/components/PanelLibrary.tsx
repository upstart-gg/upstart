import { tx, css } from "@upstart.gg/style-system/twind";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { Value } from "@sinclair/typebox/value";
import { WiStars } from "react-icons/wi";
import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  Tooltip,
  IconButton,
} from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { BrickManifest, StaticManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { Static } from "@sinclair/typebox";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import interact from "interactjs";
import { IoCloseOutline } from "react-icons/io5";
import { panelTabContentScrollClass } from "../utils/styles";
import { useEditorHelpers } from "../hooks/use-editor";

export default function PanelLibrary() {
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [brickPrompt, setBrickPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const interactable = useRef<Interact.Interactable | null>(null);
  const { hidePanel } = useEditorHelpers();

  useEffect(() => {
    /**
     * Initialize interactjs for draggable bricks from the library.
     * The drop logic is handled in `use-draggable.ts`, not here.
     */
    interactable.current = interact(".draggable-brick");
    interactable.current.draggable({
      inertia: true,
      autoScroll: {
        enabled: false,
      },
    });
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);

  const generateBrick = async () => {
    if (!brickPrompt) {
      return;
    }
    setIsGenerating(true);
    // todo...
    setIsGenerating(false);
  };

  return (
    <Tabs.Root defaultValue="library">
      <Tabs.List className={tx("sticky top-0 z-50")}>
        <Tabs.Trigger value="library" className={tx("!flex-1")}>
          Library
        </Tabs.Trigger>
        <Tabs.Trigger value="ai" className={tx("!flex-1")}>
          AI creator <BsStars className={tx("ml-1 w-4 h-4 text-upstart-500")} />
        </Tabs.Trigger>
        <IconButton
          title="Close"
          className="self-center items-center justify-center inline-flex !mr-1 !mt-2"
          size="1"
          variant="ghost"
          color="gray"
          onClick={() => hidePanel()}
        >
          <IoCloseOutline className="w-4 h-4 text-gray-400 hover:text-gray-700" />
        </IconButton>
      </Tabs.List>
      <Tabs.Content value="library">
        {shouldDisplayLibraryCallout && (
          <Callout.Root size="1">
            <Callout.Icon>
              <TbDragDrop className={tx("w-8 h-8 mt-3 stroke-1")} />
            </Callout.Icon>
            <Callout.Text>Drag and drop blocks to add them to your page.</Callout.Text>
          </Callout.Root>
        )}

        <div
          className={tx(
            "flex flex-col max-h-[calc(100dvh/2-99px)] overflow-y-auto",
            panelTabContentScrollClass,
          )}
        >
          <h3
            className={tx(
              "text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]",
            )}
          >
            Base bricks
          </h3>
          <div
            className={tx("grid gap-1 p-1.5")}
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            }}
          >
            {Object.values(manifests)
              .filter((m) => m.kind === "brick" && !m.hideInLibrary)
              .map((brickImport) => {
                const brick = Value.Create(brickImport);
                return (
                  <Tooltip content={brickImport.description} key={brickImport.type}>
                    <DraggableBrick brick={brick} />
                  </Tooltip>
                );
              })}
          </div>
        </div>
        <div
          className={tx(
            "flex flex-col max-h-[calc(100dvh/2-99px)] overflow-y-auto",
            panelTabContentScrollClass,
          )}
        >
          <h3
            className={tx(
              "text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]",
            )}
          >
            Widgets
          </h3>
          <div
            className={tx("grid gap-1 p-1.5")}
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
            }}
          >
            {Object.values(manifests)
              .filter((m) => m.kind === "widget" && !m.hideInLibrary)
              .map((brickImport) => {
                const brick = Value.Create(brickImport);
                return (
                  <Tooltip content={brickImport.description} key={brickImport.type} delayDuration={850}>
                    <DraggableBrick brick={brick} />
                  </Tooltip>
                );
              })}
          </div>
        </div>
      </Tabs.Content>
      <ScrollablePanelTab tab="ai" className={tx("p-2")}>
        <Callout.Root size="1">
          <Callout.Icon>
            <WiStars className={tx("w-8 h-8 mt-3")} />
          </Callout.Icon>
          <Callout.Text>Tell AI what you want and it will generate a brick for you!</Callout.Text>
        </Callout.Root>
        <TextArea
          onInput={(e) => {
            setBrickPrompt(e.currentTarget.value);
          }}
          className={tx("w-full my-2 h-24")}
          size="2"
          placeholder="Add an image of delivery guy"
          spellCheck={false}
        />
        <Button
          size="2"
          disabled={brickPrompt.length < 10 || isGenerating}
          className={tx("block !w-full")}
          onClick={generateBrick}
        >
          <Spinner loading={isGenerating}>
            <BsStars className={tx("w-4 h-4")} />
          </Spinner>
          {isGenerating ? "Generating themes" : "Generate a brick"}
        </Button>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

type DraggableBrickProps = {
  brick: StaticManifest<BrickManifest>;
};

const DraggableBrick = forwardRef<HTMLButtonElement, DraggableBrickProps>(({ brick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      data-brick-type={brick.type}
      data-brick-min-w={brick.minWidth}
      data-brick-min-h={brick.minHeight}
      data-brick-preferred-w={brick.defaultWidth}
      data-brick-preferred-h={brick.defaultHeight}
      type="button"
      className={tx(
        "rounded border border-transparent hover:border-upstart-600 bg-white dark:bg-dark-700 cursor-grab active:cursor-grabbing touch-none select-none pointer-events-auto transition draggable-brick [&:is(.clone)]:(opacity-80 !bg-white)",
      )}
      {...props}
    >
      <div
        className={tx(
          "h-full w-full flex flex-col px-1 py-2 items-center gap-0.5 rounded-[inherit] select-none",
        )}
      >
        <span
          className={tx(
            "w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block",
          )}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: brick.icon }}
        />
        <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
      </div>
    </button>
  );
});
