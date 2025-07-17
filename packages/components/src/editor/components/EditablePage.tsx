import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef } from "react";
import { usePageStyle } from "~/shared/hooks/use-page-style";
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
import { useFontWatcher } from "../hooks/use-font-watcher";
import { useGridObserver } from "../hooks/use-grid-observer";
import { useResizable } from "../hooks/use-resizable";
import Section from "./EditableSection";

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
  useGridObserver(pageRef);

  // on page load, set last loaded property so that the store is saved to local storage
  useEffect(draft.setLastLoaded, []);

  useResizable("[data-brick]", {
    gridSnap: {
      width: gridConfig.colWidth,
      height: gridConfig.rowHeight,
    },
    // On desktop, we allow resizing in all directions
    enabledDirections:
      previewMode === "desktop"
        ? undefined
        : // on mobile, we only allow resizing vertically
          {
            n: true,
            s: true,
          },
    onResizeStart: (event) => {
      const target = event.target as HTMLElement;
      // disable flex-grow temporarily to allow resize
      target.style.setProperty("flex-grow", "0");
    },

    onResizeEnd: (event) => {
      const target = event.target as HTMLElement;
      const brickId = target.dataset.brickId as string;
      const parentBrick = draftHelpers.getParentBrick(brickId);
      const existingBrick = draftHelpers.getBrick(brickId)?.props;
      const parentElement = target.parentElement as HTMLElement;
      const parentWidth = parentElement.clientWidth;
      if (!parentWidth) {
        console.warn("Page width is not available, cannot update brick props.");
        return;
      }

      draftHelpers.updateBrickProps(brickId, {
        width:
          previewMode === "mobile"
            ? "auto"
            : parentBrick
              ? `${event.rect.width}px`
              : `${(event.rect.width / parentWidth) * 100}%`,
        height: `${event.rect.height}px`,
        growHorizontally: event.edges.left || event.edges.right ? false : existingBrick?.growHorizontally,
      });

      target.style.removeProperty("top");
      target.style.removeProperty("left");
      target.style.removeProperty("right");
      target.style.removeProperty("bottom");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-left");
      target.style.removeProperty("margin-right");
      target.style.removeProperty("width");
      target.style.removeProperty("height");
      target.style.removeProperty("min-height");
      target.style.removeProperty("min-width");
      target.style.removeProperty("flex-grow");
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
    if (generationState.isReady) {
      document.addEventListener("click", listener, true);
    }
    return () => {
      document.removeEventListener("click", listener, true);
    };
  }, [generationState.isReady]);

  return (
    <div
      id="page-container"
      ref={pageRef}
      className={tx(pageClassName)}
      style={{
        zoom,
      }}
    >
      {/* If the navbar is enabled, set it statically */}
      {sections.map((section, index) => (
        <Section key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}
