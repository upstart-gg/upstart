import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateId, type Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "./EditableBrick";
import {
  useAttributes,
  useBricks,
  useDraft,
  useDraftHelpers,
  useDraftStoreContext,
  useEditorHelpers,
  usePreviewMode,
  useSections,
  useSelectedBrick,
} from "../hooks/use-editor";
import { useHotkeys } from "react-hotkeys-hook";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import Selecto from "react-selecto";
import { useEditablePage } from "~/editor/hooks/use-draggable";
import { defaultProps } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import {
  shouldAdjustBrickHeightBecauseOverflow,
  canDropOnLayout,
  getBrickAtPosition,
  getBricksOverlap,
  getDropOverGhostPosition,
  getNeededBricksAdjustments,
  getSectionAtPosition,
} from "~/shared/utils/layout-utils";
import { useFontWatcher } from "../hooks/use-font-watcher";
import ResizeHandle from "./ResizeHandle";
import Section from "./EditableSection";
import { useGridConfig } from "~/shared/hooks/use-grid-config";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

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
  // const draftStore = useDraftStoreContext();
  const draft = useDraft();
  const pageRef = useRef<HTMLDivElement>(null);
  const attributes = useAttributes();
  const sections = useSections();
  const dragOverRef = useRef<HTMLDivElement>(null);
  const typography = useFontWatcher();
  const pageClassName = usePageStyle({ attributes, typography, editable: true, previewMode, showIntro });
  const gridConfig = useGridConfig(pageRef);

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
    gridConfig,
    dragCallbacks: {
      onDragMove(brick, pos, gridPosition) {
        const dropOverPos = getDropOverGhostPosition({
          brick,
          bricks: draft.bricks,
          currentBp: previewMode,
          dropPosition: gridPosition,
        });
        // console.log("%o", dropOverPos);
        // updateDragOverGhostStyle(dropOverPos);
        // editorHelpers.setCollidingBrick(dropOverPos.collision);
      },

      onDragEnd: (updatedPositions, event) => {
        updateDragOverGhostStyle(false);

        const firstPos = updatedPositions[0];
        const dropOverBrick = getBrickAtPosition(
          firstPos.gridPosition.x,
          firstPos.gridPosition.y,
          draft.bricks,
          previewMode,
        );

        if (dropOverBrick?.isContainer && event.shiftKey) {
          console.debug("Moving element(s) to parent %s", dropOverBrick.id);
          updatedPositions.forEach(({ brick }) => {
            draftHelpers.moveBrickToParent(brick.id, dropOverBrick.id);
          });
        } else {
          updatedPositions.forEach(({ brick, gridPosition, sectionId }) => {
            console.debug(
              "Updating position of %s to x = %s, y = %s in section %s",
              brick.id,
              gridPosition.x,
              gridPosition.y,
              sectionId,
            );
            draft.updateBrick(brick.id, { sectionId });
            draft.updateBrickPosition(brick.id, previewMode, {
              ...draft.getBrick(brick.id)!.position[previewMode],
              x: gridPosition.x,
              y: gridPosition.y,
            });
          });
        }

        // reset the selected group
        editorHelpers.setSelectedGroup();
      },
    },
    dropCallbacks: {
      onDropMove(event, gridPosition, brick) {
        const canDrop = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints);
        console.log("onDropMove", canDrop);
        updateDragOverGhostStyle(canDrop);
      },
      onDropDeactivate() {
        updateDragOverGhostStyle(false);
      },
      onDrop(event, gridPosition, brick) {
        console.debug("onDrop (%s)", previewMode, gridPosition, brick);

        updateDragOverGhostStyle(false);

        const position = canDropOnLayout(draft.bricks, previewMode, gridPosition, brick.constraints);
        const section = getSectionAtPosition(event.dragEvent.client.x, event.dragEvent.client.y);

        invariant(section, "No section found for drop event");

        if (position) {
          console.debug("New brick dropped at", position);
          const bricksDefaults = defaultProps[brick.type];
          const newBrick: Brick = {
            id: `brick-${generateId()}`,
            ...bricksDefaults,
            //TODO: add section id
            sectionId: section.id,
            type: brick.type,
            position: {
              desktop: position,
              mobile: position,
              [previewMode]: position,
            },
          };

          // add the new brick to the store
          draft.addBrick(newBrick, position.parent);

          setTimeout(() => {
            console.log("Checking for overflow");
            // Check if the brick should adjust its height because of overflow
            const adjustedHeight = shouldAdjustBrickHeightBecauseOverflow(newBrick.id);

            console.log("-> adjusted height", adjustedHeight);

            if (adjustedHeight) {
              draft.updateBrickPosition(newBrick.id, previewMode, {
                h: adjustedHeight,
              });
            }

            // rewrite the mobile layout based on the desktop layout
            draft.adjustMobileLayout();
          }, 200);

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
        console.log("onResizeEnd (%s)", previewMode, brickId, gridPos);

        updateDragOverGhostStyle(false);

        // Check if the brick should adjust its height because of overflow
        const adjustedHeight = shouldAdjustBrickHeightBecauseOverflow(brickId);

        // Update the brick position (and height if needed)
        draft.updateBrickPosition(brickId, previewMode, {
          ...draft.getBrick(brickId)!.position[previewMode],
          w: gridPos.w,
          // Give the priority to the adjusted height if it is bigger than the current height
          h: adjustedHeight && adjustedHeight > gridPos.h ? adjustedHeight : gridPos.h,
          // when resizing through the mobile view, set the manual height
          // so that the system knows that the height is not automatic
          ...(previewMode === "mobile" ? { manualHeight: gridPos.h } : {}),
        });

        // Reorganize all bricks so there is no overlap
        // const adjustments = getNeededBricksAdjustments(draft.bricks);
        // console.log("needed adjustments", adjustments);

        // try to automatically adjust the mobile layout when resizing from desktop
        if (previewMode === "desktop") {
          draft.adjustMobileLayout();
        }
      },
    },
  });

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
        console.debug("click out, hidding", event, event.target);
        draftHelpers.deselectBrick();
        // also deselect the library panel
        editorHelpers.hidePanel("library");
        editorHelpers.hidePanel("inspector");
        editorHelpers.setTextEditMode("default");
      }
    };
    document.addEventListener("click", listener, true);
    return () => {
      document.removeEventListener("click", listener, true);
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
      <div id="page-container" ref={pageRef} className={pageClassName}>
        {sections.map((section) => (
          <Section key={section.id} section={section} gridConfig={gridConfig} />
        ))}
        <div
          ref={dragOverRef}
          className={tx("drop-indicator bg-upstart-50 rounded transition-all duration-200 opacity-0 hidden")}
        />
      </div>
      <Selecto
        className="selecto"
        selectableTargets={[".brick:not(.container-child)"]}
        selectFromInside={false}
        hitRate={1}
        selectByClick={false}
        dragCondition={(e) => {
          // prevent triggering a selection when clicking on sections resize handle buttons
          return !e.inputEvent.target.closest(".section-options-buttons");
        }}
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
