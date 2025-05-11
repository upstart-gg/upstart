import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
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
import type { BrickDefaults, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import interact from "interactjs";
import { IoCloseOutline } from "react-icons/io5";
import { panelTabContentScrollClass } from "../utils/styles";
import { useEditorHelpers } from "../hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";

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
    interactable.current = interact(".draggable-brick", {
      styleCursor: false,
    });
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
      <Tabs.List className="sticky top-0 z-50 bg-gray-100">
        <Tabs.Trigger value="library" className={tx("!flex-1")}>
          Library
        </Tabs.Trigger>
        <Tabs.Trigger value="ai" className={tx("!flex-1")}>
          AI creator <BsStars className={tx("ml-1 w-4 h-4 text-upstart-500")} />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="library">
        <div className="flex flex-col gap-8">
          <div
            className={tx(
              "flex flex-col max-h-[calc(100dvh/2-40px)] overflow-y-auto",
              panelTabContentScrollClass,
            )}
          >
            <PanelBlockTitle>Base bricks</PanelBlockTitle>
            {shouldDisplayLibraryCallout && (
              <Callout.Root size="1" color="violet" className="!rounded-none">
                <Callout.Text size="1">Simply drag and drop those base bricks to your page.</Callout.Text>
              </Callout.Root>
            )}

            <div
              className={tx("grid gap-1 p-1.5")}
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
              }}
            >
              {Object.values(manifests)
                .filter((m) => m.kind === "brick" && !m.hideInLibrary)
                .map((brickImport) => {
                  return (
                    <Tooltip content={brickImport.description} key={brickImport.type}>
                      <DraggableBrick brick={defaultProps[brickImport.type]} />
                    </Tooltip>
                  );
                })}
            </div>
          </div>
          <div
            className={tx(
              "flex flex-col max-h-[calc(100dvh/2-40px)] overflow-y-auto",
              panelTabContentScrollClass,
            )}
          >
            <PanelBlockTitle>Widgets</PanelBlockTitle>
            {shouldDisplayLibraryCallout && (
              <Callout.Root size="1" color="violet" className="!rounded-none">
                <Callout.Text size="1">
                  Widgets are reusable components that can be added to your page.
                </Callout.Text>
              </Callout.Root>
            )}

            <div
              className={tx("grid gap-1 p-1.5")}
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
              }}
            >
              {Object.values(manifests)
                .filter((m) => m.kind === "widget" && !m.hideInLibrary)
                .map((brickImport) => {
                  return (
                    <Tooltip content={brickImport.description} key={brickImport.type} delayDuration={850}>
                      <DraggableBrick brick={defaultProps[brickImport.type]} />
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        </div>
      </Tabs.Content>
      <ScrollablePanelTab tab="ai" className={tx("p-2")}>
        <Callout.Root size="1">
          <Callout.Icon>
            <WiStars className={tx("w-7 h-7 mt-3")} />
          </Callout.Icon>
          <Callout.Text size="1">Tell AI what you want and it will generate a brick for you!</Callout.Text>
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
  brick: BrickDefaults;
};

const DraggableBrick = forwardRef<HTMLButtonElement, DraggableBrickProps>(({ brick, ...props }, ref) => {
  const icon =
    typeof brick.icon === "string" ? (
      <span
        className={tx(
          "w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block",
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: brick.icon }}
      />
    ) : (
      <brick.icon
        className={tx("w-6 h-6 text-upstart-600/90 group-hovertext-upstart-700", brick.iconClassName)}
      />
    );
  return (
    <button
      ref={ref}
      data-brick-type={brick.type}
      data-brick-min-w={brick.minWidth?.desktop}
      data-brick-min-h={brick.minHeight?.desktop}
      data-brick-default-w={brick.defaultWidth?.desktop}
      data-brick-default-h={brick.defaultHeight?.desktop}
      type="button"
      className={tx(
        `rounded border border-upstart-100 hover:border-upstart-600 hover:bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto transition draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
      )}
      {...props}
    >
      <div
        className={tx(
          "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
        )}
      >
        {icon}
        <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
      </div>
    </button>
  );
});
