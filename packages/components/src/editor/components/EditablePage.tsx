import { Toaster } from "@upstart.gg/style-system/system";
import { startTransition, useEffect, useRef } from "react";
import { generateId, type Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  useAttributes,
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  useGenerationState,
  useImagesSearchResults,
  usePreviewMode,
  useSections,
  useSiteReady,
  useTheme,
  useZoom,
} from "../hooks/use-editor";
import Selecto from "react-selecto";
import { useEditablePage } from "~/editor/hooks/use-editable-page";
import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import { useFontWatcher } from "../hooks/use-font-watcher";
import Section from "./EditableSection";
import { getBrickElementAtPosition } from "~/shared/utils/layout-utils";
import { tx } from "@upstart.gg/style-system/twind";

const ghostValid = tx("bg-upstart-100");
const ghostInvalid = tx("bg-red-100");

type EditablePageProps = {
  showIntro?: boolean;
};

export default function EditablePage({ showIntro }: EditablePageProps) {
  const previewMode = usePreviewMode();
  const editorHelpers = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const draft = useDraft();
  const { zoom } = useZoom();
  const pageRef = useRef<HTMLDivElement>(null);
  const attributes = useAttributes();
  const sections = useSections();
  const dragOverRef = useRef<HTMLDivElement>(null);
  const typography = useFontWatcher();
  const pageClassName = usePageStyle({ attributes, typography, editable: true, previewMode, showIntro });
  const siteReady = useSiteReady();
  const genState = useGenerationState();
  const imagesSearchResults = useImagesSearchResults();
  const { setLastToolCallResult } = useEditorHelpers();
  const theme = useTheme();

  // on page load, set last loaded property so that the store is saved to local storage
  useEffect(draft.setLastLoaded, []);

  useEffect(() => {
    console.log("Gen state changed in EditablePage", genState);
  }, [genState]);

  /**
   *  Update the ghost style based on the drop position
   */
  function updateDragOverGhostStyle(
    info: {
      x: number;
      y: number;
      w: number;
      h: number;
    } | null,
  ) {
    if (info) {
      dragOverRef.current?.style.setProperty("opacity", "0.4");
      dragOverRef.current?.style.setProperty("left", `${info.x}px`);
      dragOverRef.current?.style.setProperty("top", `${info.y}px`);
      dragOverRef.current?.style.setProperty("width", `${info.w}px`);
      dragOverRef.current?.style.setProperty("height", `${info.h}px`);
      dragOverRef.current?.style.setProperty("display", "block");
      dragOverRef.current?.classList.toggle(ghostInvalid, false);
      dragOverRef.current?.classList.toggle(ghostValid, true);
    } else {
      dragOverRef.current?.style.setProperty("opacity", "0");
      dragOverRef.current?.style.setProperty("display", "none");
    }
  }

  useEditablePage("[data-brick]:not(.container-child):not([data-no-drag='true'])", pageRef, {
    dragOptions: {
      // enabled: previewMode === "desktop",
    },
    dragCallbacks: {
      onDragEnd: (updatedPositions, event) => {
        // updateDragOverGhostStyle(null);

        updatedPositions.forEach(({ brick, gridPosition, sectionId }) => {
          // Move the brick to the new position
        });

        // reset the selected group
        editorHelpers.setSelectedGroup();
      },
    },
    dropCallbacks: {
      onDropMove(event, rect, brickType) {
        // updateDragOverGhostStyle(rect);
      },
      onDropDeactivate() {
        // updateDragOverGhostStyle(null);
      },
      onDrop(event, position, section, brickType) {
        console.debug("onDrop (%s)", previewMode, position, brickType);

        // updateDragOverGhostStyle(null);

        if (position) {
          console.debug("New brick dropped at", position, section);
          const bricksDefaults = defaultProps[brickType];
          const newBrick: Brick = {
            id: `brick-${generateId()}`,
            ...bricksDefaults,
            type: brickType,
          };

          const hoveredBrickElement = getBrickElementAtPosition(position.x, position.y);
          const hoveredBrick = hoveredBrickElement
            ? draft.getBrick(hoveredBrickElement.dataset.brickId as string)
            : null;
          const hoveredBrickManifest = hoveredBrick ? manifests[hoveredBrick.type] : null;

          // Add the new brick to the store
          // Specify the parent if we dropped on a container
          draft.addBrick(
            newBrick,
            section.id,
            hoveredBrick && hoveredBrickManifest?.isContainer ? hoveredBrick.id : null,
          );

          if (previewMode === "desktop") {
            startTransition(() => {
              draft.adjustMobileLayout();
            });
          }
        } else {
          console.warn("Can't drop here");
        }
      },
    },
    resizeCallbacks: {
      onResizeEnd: (brickId, gridPos) => {
        console.debug("onResizeEnd (%s)", previewMode, brickId, gridPos);
        // updateDragOverGhostStyle(null);
        // TODO: Update the brick position
        // try to automatically adjust the mobile layout when resizing from desktop
        if (previewMode === "desktop") {
          draftHelpers.adjustMobileLayout();
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
        !target.closest("[data-element-kind]") &&
        !target.matches("[data-element-kind]")
      ) {
        console.debug("click out, hidding", event, event.target);
        editorHelpers.deselectBrick();
        // also deselect the library panel
        editorHelpers.hidePanel("library");
        editorHelpers.hidePanel("inspector");
        editorHelpers.hidePanel("settings");
        editorHelpers.hidePanel("theme");
        editorHelpers.setTextEditMode("default");
      }
    };
    if (siteReady) {
      document.addEventListener("click", listener, true);
    }
    return () => {
      document.removeEventListener("click", listener, true);
    };
  }, [siteReady]);

  return (
    <>
      <div
        id="page-container"
        ref={pageRef}
        className={pageClassName}
        style={{
          zoom,
        }}
      >
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
        <div
          ref={dragOverRef}
          className={tx(
            "fixed z-[99999] isolate pointer-events-none drop-indicator bg-upstart-50 rounded opacity-0 hidden",
          )}
        />
      </div>
      {siteReady === true && (
        <Selecto
          className="selecto"
          selectableTargets={["[data-brick]:not(.container-child)"]}
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
      )}
      <Toaster
        toastOptions={{
          position: "bottom-center",
          style: {
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            fontSize: "0.85rem",
            fontWeight: "500",
          },
          error: {
            style: {
              background: "#880808",
            },
          },
        }}
      />
    </>
  );
}
