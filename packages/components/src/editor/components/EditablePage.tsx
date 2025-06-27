import { Toaster } from "@upstart.gg/style-system/system";
import { startTransition, useEffect, useRef } from "react";
import {
  useAttributes,
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  useGenerationState,
  useGridConfig,
  usePreviewMode,
  useSections,
  useZoom,
} from "../hooks/use-editor";
import { Droppable } from "@hello-pangea/dnd";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import { useFontWatcher } from "../hooks/use-font-watcher";
import Section from "./EditableSection";
import { tx } from "@upstart.gg/style-system/twind";
import { processSections } from "@upstart.gg/sdk/shared/bricks";
import { useResizable } from "../hooks/use-resizable";
import { useGridObserver } from "../hooks/use-grid-observer";

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
  useGridObserver(pageRef);
  const gridConfig = useGridConfig();
  const attributes = useAttributes();
  const sections = useSections();
  const typography = useFontWatcher();
  const pageClassName = usePageStyle({
    attributes,
    typography,
    editable: true,
    previewMode,
    showIntro,
  });
  const generationState = useGenerationState();

  // on page load, set last loaded property so that the store is saved to local storage
  useEffect(draft.setLastLoaded, []);

  useResizable("[data-brick]", {
    gridSnap: {
      width: gridConfig.colWidth,
      height: gridConfig.rowHeight,
    },
    onResizeStart: (event) => {
      console.log("Resize started:", event.target);
      const target = event.target as HTMLElement;
    },
    onResize: (event) => {
      console.log("Resizing:", event);
      console.log("brick id:", event.target.dataset.brickId);
    },
    onResizeEnd: (event) => {
      console.log("Resize ended:", event.rect);
      const target = event.target as HTMLElement;
      const brickId = target.dataset.brickId as string;
      target.style.setProperty("transition", "top,margin-right,margin-bottom,height 0.3s ease-in-out");
      draftHelpers.updateBrickProps(brickId, {
        width: `${event.rect.width}px`,
        height: `${event.rect.height}px`,
      });
      target.style.removeProperty("top");
      target.style.removeProperty("left");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("margin-right");
      target.style.removeProperty("width");
      target.style.removeProperty("height");
      target.style.removeProperty("min-height");
      target.style.removeProperty("min-width");
      setTimeout(() => {
        target.style.setProperty("transition", "none");
      }, 300); // Remove transition after a short delay
    },
  });

  // const handleDragEnd = (result: DropResult) => {
  //   const { destination, source, draggableId, type } = result;

  //   // reset body pointer events
  //   document.body.style.pointerEvents = "auto";

  //   // If dropped outside a valid droppable area
  //   if (!destination) {
  //     return;
  //   }

  //   // If dropped in the same position
  //   if (destination.droppableId === source.droppableId && destination.index === source.index) {
  //     return;
  //   }

  //   if (type === "section") {
  //     // Reorder sections
  //     const newSectionOrder = Array.from(sections);
  //     const [reorderedSection] = newSectionOrder.splice(source.index, 1);
  //     newSectionOrder.splice(destination.index, 0, reorderedSection);

  //     draftHelpers.reorderSections(newSectionOrder.map((section) => section.id));
  //   } else if (type === "brick") {
  //     // Handle brick movement
  //     const sourceSectionId = source.droppableId;
  //     const destinationSectionId = destination.droppableId;

  //     if (sourceSectionId === destinationSectionId) {
  //       // Moving within the same section - use the new reorder function
  //       draftHelpers.reorderBrickWithin(draggableId, source.index, destination.index);
  //       console.log(
  //         `Moving brick ${draggableId} within section from ${source.index} to ${destination.index}`,
  //       );
  //     } else {
  //       // Moving between sections - use the new moveBrickToSection function
  //       console.log(`Moving brick ${draggableId} from section ${sourceSectionId} to ${destinationSectionId}`);
  //       draftHelpers.moveBrickToSection(draggableId, destinationSectionId, destination.index);
  //     }

  //     // Auto-adjust mobile layout if needed
  //     if (previewMode === "desktop") {
  //       startTransition(() => {
  //         draftHelpers.adjustMobileLayout();
  //       });
  //     }
  //   }
  // };

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
    if (generationState.isReady) {
      document.addEventListener("click", listener, true);
    }
    return () => {
      document.removeEventListener("click", listener, true);
    };
  }, [generationState.isReady]);

  return (
    <>
      <div
        id="page-container"
        ref={pageRef}
        className={pageClassName}
        style={{
          zoom,
        }}
        data-dropzone
      >
        <Droppable droppableId="sections" type="section" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className={tx("contents")}>
              {processSections(sections).map((section, index) => (
                <Section key={section.id} section={section} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
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
