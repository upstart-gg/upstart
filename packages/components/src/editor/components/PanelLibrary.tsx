import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { Value } from "@sinclair/typebox/value";
import { WiStars } from "react-icons/wi";
import { MdOutlineHelpOutline } from "react-icons/md";
import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  Tooltip,
  IconButton,
  useMergeRefs,
} from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { type ComponentProps, type CSSProperties, forwardRef, useEffect, useRef, useState } from "react";
import type { BrickDefaults, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import interact from "interactjs";
import { IoCloseOutline } from "react-icons/io5";
import { panelTabContentScrollClass } from "../utils/styles";
import { useEditorHelpers } from "../hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { Draggable, type DraggableStateSnapshot, type DraggableStyle, Droppable } from "@hello-pangea/dnd";

export default function PanelLibrary() {
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [brickPrompt, setBrickPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const interactable = useRef<Interact.Interactable | null>(null);
  const { hidePanel } = useEditorHelpers();

  // useEffect(() => {
  //   /**
  //    * Initialize interactjs for draggable bricks from the library.
  //    * The drop logic is handled in `use-draggable.ts`, not here.
  //    */
  //   interactable.current = interact(".draggable-brick", {
  //     styleCursor: false,
  //   });
  //   interactable.current
  //     .draggable({
  //       inertia: false,
  //       autoScroll: {
  //         enabled: true,
  //       },
  //     })
  //     .draggable({
  //       listeners: {
  //         // Remove manualStart - let interact.js handle the start automatically
  //         start(event: Interact.DragEvent) {
  //           const target = event.target as HTMLElement;
  //           const computedStyle = window.getComputedStyle(target);

  //           // Create clone on drag start
  //           const clone = target.cloneNode(true) as HTMLElement;

  //           // Position clone at current mouse position
  //           clone.style.position = "absolute";
  //           clone.style.left = `${event.clientX - target.offsetWidth / 2}px`;
  //           clone.style.top = `${event.clientY - target.offsetHeight / 2}px`;
  //           clone.style.width = computedStyle.width;
  //           clone.style.height = computedStyle.height;
  //           clone.style.zIndex = "99999";
  //           clone.style.opacity = "0.8";
  //           clone.style.boxShadow = "0px 0px 24px rgba(0, 0, 0, 0.2)";
  //           clone.style.border = "1px solid";
  //           clone.style.borderColor = computedStyle.borderColor;
  //           clone.style.pointerEvents = "none"; // Prevent interference

  //           clone.classList.add("clone");

  //           document.body.appendChild(clone);
  //           document.body.style.cursor = "grabbing";

  //           // Store reference to clone on the interaction
  //           // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //           (event.interaction as any).clone = clone;
  //         },

  //         move(event: Interact.DragEvent) {
  //           // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //           const clone = (event.interaction as any).clone as HTMLElement;

  //           if (clone) {
  //             // Update clone position based on mouse movement
  //             clone.style.left = `${event.clientX - clone.offsetWidth / 2}px`;
  //             clone.style.top = `${event.clientY - clone.offsetHeight / 2}px`;
  //           }
  //         },

  //         end(event: Interact.DragEvent) {
  //           // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //           const clone = (event.interaction as any).clone as HTMLElement;
  //           document.body.style.cursor = "default"; // Reset cursor style

  //           console.log("Drag ended", event);

  //           if (clone) {
  //             clone.remove();
  //           }
  //         },
  //       },
  //     });
  //   return () => {
  //     interactable.current?.unset();
  //     interactable.current = null;
  //   };
  // }, []);

  return (
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
          className={tx("grid gap-1.5 p-2")}
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          }}
        >
          <Droppable
            droppableId="bricks-library"
            type="brick"
            // isDropDisabled={true}
            renderClone={(provided, snapshot, rubric) => {
              console.log("clone", { provided, snapshot, rubric });
              const brick = manifests[rubric.draggableId] as BrickManifest;

              return (
                <button
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className={tx(
                    `rounded border border-upstart-100 border-upstart-600 bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
                  )}
                  style={getDraggableStyle(provided.draggableProps.style ?? {}, snapshot)}
                >
                  <div
                    className={tx(
                      "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
                    )}
                  >
                    <IconRender {...brick} />
                    <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
                  </div>
                </button>
              );
            }}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={tx("contents")}>
                {Object.values(manifests)
                  .filter((m) => m.kind === "brick" && !m.hideInLibrary)
                  .map((brickImport, index) => {
                    return (
                      <Tooltip content={brickImport.description} key={brickImport.type} delayDuration={850}>
                        <DraggableBrick brick={defaultProps[brickImport.type]} index={index} />
                      </Tooltip>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
            <Callout.Text size="1">Widgets are more complex components you can use.</Callout.Text>
          </Callout.Root>
        )}

        <div
          className={tx("grid gap-1.5 p-2")}
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          }}
        >
          <Droppable droppableId="widgets-library" type="library-widget" isDropDisabled={true}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={tx("contents")}>
                {Object.values(manifests)
                  .filter((m) => m.kind === "widget" && !m.hideInLibrary)
                  .map((brickImport, index) => {
                    return (
                      <Tooltip content={brickImport.description} key={brickImport.type} delayDuration={850}>
                        <DraggableBrick brick={defaultProps[brickImport.type]} index={index} />
                      </Tooltip>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
}

type DraggableBrickProps = {
  brick: BrickDefaults;
  index: number;
};

function IconRender(props: BrickManifest) {
  const icon =
    typeof props.icon === "string" ? (
      <span
        className={tx(
          "w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block",
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: props.icon }}
      />
    ) : (
      <props.icon
        className={tx("w-6 h-6 text-upstart-600/90 group-hovertext-upstart-700", props.iconClassName)}
      />
    );
  return icon;
}

function getDraggableStyle(style: DraggableStyle, snapshot: DraggableStateSnapshot): CSSProperties {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`,
  };
}

const DraggableBrick = forwardRef<HTMLDivElement, DraggableBrickProps>(({ brick, index, ...props }, ref) => {
  return (
    <Draggable
      index={index}
      draggableId={brick.type}
      data-brick-type={brick.type}
      data-brick-min-w={brick.minWidth?.desktop}
      data-brick-min-h={brick.minHeight?.desktop}
      data-brick-default-w={brick.defaultWidth?.desktop}
      data-brick-default-h={brick.defaultHeight?.desktop}
      {...props}
    >
      {(provided, snapshot) => {
        const mergedRef = useMergeRefs([provided.innerRef, ref]);
        return (
          <div
            ref={mergedRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={tx(
              `rounded border border-upstart-100 hover:border-upstart-600 hover:bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
            )}
          >
            <div
              className={tx(
                "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
              )}
            >
              <IconRender {...brick} />
              <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
});
