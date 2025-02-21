import { css, tx, sheet } from "@upstart.gg/style-system/twind";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { generateId, type Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "./EditableBrick";
import {
  useAttributes,
  useBricks,
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
import { useHotkeys } from "react-hotkeys-hook";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import Selecto from "react-selecto";
import { useEditablePage } from "~/editor/hooks/use-draggable";
import { debounce } from "lodash-es";
import { defaults } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import {
  canDropOnLayout,
  detectCollisions,
  getBrickAtPosition,
  getBricksOverlap,
  getDropOverGhostPosition,
} from "~/shared/utils/layout-utils";
import { useFontWatcher } from "../hooks/use-font-watcher";

const ghostValid = tx("bg-upstart-100");
const ghostInvalid = tx("bg-red-100");

type EditablePageProps = {
  showIntro?: boolean;
};

export default function EditablePage({ showIntro }: EditablePageProps) {
  const previewMode = usePreviewMode();
  const editorHelpers = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const selectedBrick = useSelectedBrick();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const attributes = useAttributes();
  const bricks = useBricks();
  const [colWidth, setColWidth] = useState(0);
  const dragOverRef = useRef<HTMLDivElement>(null);
  const typography = useFontWatcher();
  const pageClassName = usePageStyle({ attributes, typography, editable: true, previewMode, showIntro });

  // on page load, set last loaded property so that the store is saved to local storage
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    draft.setLastLoaded();
  }, []);

  /**
   *  Update the ghost style based on the drop position
   */
  function updateDragOverGhostStyle(
    info: ReturnType<typeof canDropOnLayout | typeof getDropOverGhostPosition>,
  ) {
    if (info) {
      dragOverRef.current?.style.setProperty("opacity", "0.2");
      dragOverRef.current?.style.setProperty("grid-column", `${info.x + 1} / span ${info.w}`);
      dragOverRef.current?.style.setProperty("grid-row", `${info.y + 1} / span ${info.h}`);
      dragOverRef.current?.style.setProperty("display", "block");
      if (info.forbidden) {
        dragOverRef.current?.classList.toggle(ghostInvalid, true);
        dragOverRef.current?.classList.toggle(ghostValid, false);
      } else {
        dragOverRef.current?.classList.toggle(ghostInvalid, false);
        dragOverRef.current?.classList.toggle(ghostValid, true);
      }
    } else {
      dragOverRef.current?.style.setProperty("opacity", "0");
      dragOverRef.current?.style.setProperty("display", "none");
    }
  }

  useEditablePage(".brick:not(.container-child)", pageRef, {
    dragOptions: {
      enabled: previewMode === "desktop",
    },
    gridConfig: {
      colWidth,
      rowHeight: LAYOUT_ROW_HEIGHT,
      containerHorizontalPadding:
        previewMode === "desktop" ? parseInt(attributes.$pagePadding.horizontal as string) : 10,
      containerVerticalPadding:
        previewMode === "desktop" ? parseInt(attributes.$pagePadding.vertical as string) : 10,
    },
    dragCallbacks: {
      onDragMove(brick, pos, gridPosition) {
        const dropOverPos = getDropOverGhostPosition({
          brick,
          bricks: draft.bricks,
          currentBp: previewMode,
          dropPosition: gridPosition,
        });
        // console.log("%o", dropOverPos);
        updateDragOverGhostStyle(dropOverPos);
        // editorHelpers.setCollidingBrick(dropOverPos.collision);
      },

      onDragEnd: (brick, pos, gridPos) => {
        updateDragOverGhostStyle(false);

        const collisions = detectCollisions({
          brick,
          bricks: draft.bricks,
          currentBp: previewMode,
          dropPosition: gridPos,
        });

        // Commented to allow dropping on top of other bricks
        // but we have to figure out how to handle this

        // if (collisions.length) {
        //   console.warn("Collisions detected, cancelling drop");
        //   // reset the selected group
        //   editorHelpers.setSelectedGroup();
        //   return;
        // }

        const dropOverBrick = getBrickAtPosition(gridPos.x, gridPos.y, draft.bricks, previewMode);
        const overlap = dropOverBrick ? getBricksOverlap(brick, gridPos, dropOverBrick) : null;
        console.debug("onDragEnd (%s)", brick.id, { brick, dropOverBrick, overlap });

        if (dropOverBrick?.isContainer && overlap !== null && overlap >= 0.2) {
          console.debug("Moving %s to parent %s", brick.id, dropOverBrick.id);
          draftHelpers.moveBrickToParent(brick.id, dropOverBrick.id);
        } else if (collisions.length) {
          console.warn("Collisions detected, cancelling drop");
        } else {
          console.debug("Updating position of %s", brick.id);
          draft.updateBrickPosition(brick.id, previewMode, {
            ...draft.getBrick(brick.id)!.position[previewMode],
            x: gridPos.x,
            y: gridPos.y,
          });
        }

        // reset the selected group
        editorHelpers.setSelectedGroup();
      },
    },
    dropCallbacks: {
      onDropMove(event, gridPosition, brick) {
        const canDrop = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints, false);
        updateDragOverGhostStyle(canDrop);
      },
      onDropDeactivate() {
        updateDragOverGhostStyle(false);
      },
      onDrop(event, gridPosition, brick) {
        console.debug("onDrop (%s)", previewMode, gridPosition, brick);

        updateDragOverGhostStyle(false);

        const position = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints);

        if (position) {
          console.log("dropped at", position);
          const bricksDefaults = defaults[brick.type];
          const newBrick: Brick = {
            id: `brick-${generateId()}`,
            ...bricksDefaults,
            type: brick.type,
            position: {
              desktop: position,
              mobile: position,
              [previewMode]: position,
            },
          };

          // add the new brick to the store
          draft.addBrick(newBrick, position.parent);

          // rewrite the mobile layout based on the desktop layout
          draft.adjustMobileLayout();

          // auto select the new brick
          draftHelpers.setSelectedBrick(newBrick);
          editorHelpers.setPanel("inspector");
        } else {
          console.warn("Can't drop here");
        }
      },
    },
    resizeCallbacks: {
      onResizeEnd: (brickId, pos, gridPos) => {
        console.debug("onResizeEnd (%s)", previewMode, brickId, gridPos);

        updateDragOverGhostStyle(false);

        draft.updateBrickPosition(brickId, previewMode, {
          ...draft.getBrick(brickId)!.position[previewMode],
          w: gridPos.w,
          h: gridPos.h,
          // when resizing through the mobile view, set the manual height
          // so that the system knows that the height is not automatic
          ...(previewMode === "mobile" ? { manualHeight: gridPos.h } : {}),
        });

        // try to automatically adjust the mobile layout when resizing from desktop
        if (previewMode === "desktop") {
          draft.adjustMobileLayout();
        }
      },
    },
  });

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (pageRef.current) {
        const containerWidth = pageRef.current.offsetWidth;
        const totalGapWidth = parseInt(attributes.$pagePadding.horizontal as string) * 2;
        const availableWidth = containerWidth - totalGapWidth;
        setColWidth(availableWidth / LAYOUT_COLS[previewMode]);
      }
    }, 250);

    updateCellWidth();

    // mutation oberver for the page container styles
    const observer = new MutationObserver(updateCellWidth);
    observer.observe(pageRef.current as Node, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", updateCellWidth, { passive: true });

    return () => {
      window.removeEventListener("resize", updateCellWidth);
      observer.disconnect();
    };
  }, [previewMode, attributes.$pagePadding]);

  // listen for global click events on the document
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const event = e as MouseEvent;
      const target = event.target as HTMLElement;
      if (
        !target.closest("[data-radix-popper-content-wrapper]") &&
        !target.closest("[data-radix-select-viewport]") &&
        !target.closest("#floating-panel") &&
        !target.closest('[role="dialog"]') &&
        !target.closest('[role="toolbar"]') &&
        !target.closest('[role="navigation"]') &&
        !target.matches('[role="menuitem"]') &&
        !target.matches(".drop-indicator") &&
        !target.closest("#text-editor-menubar") &&
        !target.matches("html") &&
        !target.matches("body") &&
        !target.matches(".brick") &&
        !target.closest(".brick")
      ) {
        console.debug("click out, hidding", event.target);
        draftHelpers.deselectBrick();
        // also deselect the library panel
        editorHelpers.hidePanel("library");
        editorHelpers.hidePanel("inspector");
        editorHelpers.setTextEditMode("default");
      }
    };
    document.addEventListener("click", listener, false);
    return () => {
      document.removeEventListener("click", listener, false);
    };
  }, []);

  useHotkeys("esc", () => {
    draftHelpers.deselectBrick();
    editorHelpers.hidePanel();
  });

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.debug("mod+c pressed");
    }
  });

  useHotkeys(["backspace", "del"], (e) => {
    if (selectedBrick) {
      e.preventDefault();
      draft.deleteBrick(selectedBrick.id);
      draftHelpers.deselectBrick(selectedBrick.id);
      editorHelpers.hidePanel("inspector");
    }
  });

  useHotkeys("s", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("settings");
  });
  useHotkeys("l", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("library");
  });
  useHotkeys("t", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("theme");
  });
  useHotkeys("p", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel();
  });

  /**
   * Move brick left within a container
   * @todo
   */
  useHotkeys("mod+left", (e) => {
    e.preventDefault();
    if (selectedBrick) {
      // console
      console.log("Moving %s to left", selectedBrick.id);
      draftHelpers.moveBrickWithin(selectedBrick.id, "left");
    }
  });
  /**
   * Move brick right within a container
   * @todo
   */
  useHotkeys("mod+right", (e) => {
    e.preventDefault();
    if (selectedBrick) {
      // console
      console.log("Moving %s to right", selectedBrick.id);
      draftHelpers.moveBrickWithin(selectedBrick.id, "right");
    }
  });

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (selectedBrick) {
      draft.duplicateBrick(selectedBrick.id);
    }
  });

  return (
    <>
      <div ref={pageRef} className={pageClassName}>
        {bricks
          .filter((b) => !b.position[previewMode]?.hidden)
          .map((brick, index) => (
            <BrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={index}>
              <ResizeHandle direction="s" />
              <ResizeHandle direction="n" />
              <ResizeHandle direction="w" />
              <ResizeHandle direction="e" />
            </BrickWrapper>
          ))}
        <div
          ref={dragOverRef}
          className={tx("drop-indicator bg-upstart-50 rounded transition-all opacity-0 hidden")}
        />
      </div>
      <Selecto
        className="selecto"
        selectableTargets={[".brick:not(.container-child)"]}
        selectFromInside={false}
        hitRate={1}
        selectByClick={false}
        onSelect={(e) => {
          if (e.selected.length) {
            editorHelpers.setSelectedGroup(e.selected.map((el) => el.id));
          }
          e.added.forEach((el) => {
            el.classList.add("selected-group");
          });
          e.removed.forEach((el) => {
            el.classList.remove("selected-group");
          });
        }}
      />
    </>
  );
}

export function ResizeHandle({
  direction,
}: {
  direction: "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
}) {
  return (
    <div
      className={tx(
        "react-resizable-handle absolute z-10 transition-opacity duration-200 opacity-0",
        "group-hover/brick:opacity-90 hover:!opacity-100 overflow-visible border-dashed border-upstart-600/80 hover:border-upstart-600",
        `react-resizable-handle-${direction}`,
        {
          "bottom-px left-px right-px h-1 w-[inherit] border-b cursor-s-resize": direction === "s",
          "top-px left-px bottom-px w-1 h-[inherit] border-l cursor-w-resize": direction === "w",
          "top-px right-px bottom-px w-1 h-[inherit] border-r cursor-e-resize": direction === "e",
          "top-px left-px right-px h-1 w-[inherit] border-t cursor-n-resize": direction === "n",

          // sw and nw
          "bottom-px left-px w-1 h-1 border-l border-b cursor-sw-resize": direction === "sw",
          "top-px left-px w-1 h-1 border-l border-t cursor-nw-resize": direction === "nw",

          // se and ne
          "bottom-px right-px w-1 h-1 border-r border-b cursor-se-resize": direction === "se",
          "top-px right-px w-1 h-1 border-r border-t cursor-ne-resize": direction === "ne",
        },
      )}
    >
      <div
        className={tx("absolute w-[10px] h-[10px] border-orange-400 border-2 rounded-full z-10 shadow-md", {
          "top-1/2 -translate-y-1/2 -left-[5px]": direction === "w",
          "top-1/2 -translate-y-1/2 -right-[5px]": direction === "e",
          "left-1/2 -translate-x-1/2 -top-[5px]": direction === "n",
          "left-1/2 -translate-x-1/2 -bottom-[5px]": direction === "s",

          // sw and nw
          "-bottom-[5px] -left-[5px]": direction === "sw",
          "-top-[5px] -left-[5px]": direction === "nw",

          // se and ne
          "-bottom-[5px] -right-[5px]": direction === "se",
          "-top-[5px] -right-[5px]": direction === "ne",
        })}
      />
    </div>
  );
}
