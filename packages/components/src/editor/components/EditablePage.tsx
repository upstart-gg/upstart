import { useEffect, useRef } from "react";
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
import { usePageStyle } from "~/shared/hooks/use-page-style";
import { useFontWatcher } from "../hooks/use-font-watcher";
import Section from "./EditableSection";
import { tx } from "@upstart.gg/style-system/twind";
import { useResizable } from "../hooks/use-resizable";
import { useGridObserver } from "../hooks/use-grid-observer";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";

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
    // On desktop, we allow resizing in all directions
    enabledDirections:
      previewMode === "desktop"
        ? undefined
        : // on mobile, we only allow resizing vertically
          {
            n: true,
            s: true,
          },
    // onResizeStart: (event) => {
    //   console.log("Resize started:", event.target);
    //   const target = event.target as HTMLElement;
    // },
    // onResize: (event) => {
    //   console.log("Resizing:", event);
    //   console.log("brick id:", event.target.dataset.brickId);
    // },
    onResizeEnd: (event) => {
      const target = event.target as HTMLElement;
      const brickId = target.dataset.brickId as string;
      const brickType = target.dataset.brickType as string;
      const manifest = manifests[brickType];
      const parentBrick = draftHelpers.getParentBrick(brickId);

      // target.style.setProperty("transition", "top,margin-right,margin-bottom,height 0.3s ease-in-out");

      const parentElement = target.parentElement as HTMLElement;
      const parentWidth = parentElement.clientWidth;
      if (!parentWidth) {
        console.warn("Page width is not available, cannot update brick props.");
        return;
      }

      console.log("Parent element width:", parentWidth, "px");
      console.log("Parent element offsetWidth:", parentElement.offsetWidth, "px");

      draftHelpers.updateBrickProps(brickId, {
        width:
          previewMode === "mobile"
            ? "auto"
            : parentBrick
              ? `${event.rect.width}px`
              : `${(event.rect.width / parentWidth) * 100}%`,
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
        // target.style.setProperty("transition", "none");
      }, 300); // Remove transition after a short delay
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
