import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef } from "react";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import {
  useEditorHelpers,
  useGridConfig,
  usePreviewMode,
  useSelectedBrickId,
  useSelectedSectionId,
  useZoom,
} from "../hooks/use-editor";
import { useFontWatcher } from "../hooks/use-font-watcher";
import { useGridObserver } from "../hooks/use-grid-observer";
import { useResizable } from "../hooks/use-resizable";
import Section from "./EditableSection";
import { useDraftHelpers, useSections, useGenerationState, usePageAttributes } from "../hooks/use-page-data";

type EditablePageProps = {
  showIntro?: boolean;
};

export default function EditablePage({ showIntro }: EditablePageProps) {
  const previewMode = usePreviewMode();
  const editorHelpers = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const { zoom } = useZoom();
  const pageRef = useRef<HTMLDivElement>(null);
  const gridConfig = useGridConfig();
  const attributes = usePageAttributes();
  const sections = useSections();
  const typography = useFontWatcher();
  const selectedBrickId = useSelectedBrickId();
  const selectedSectionId = useSelectedSectionId();

  const pageClassName = usePageStyle({
    attributes,
    typography,
    editable: true,
    previewMode,
    showIntro,
  });

  const generationState = useGenerationState();
  useGridObserver(pageRef);

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
      // startTransition(() => {
      //   editorHelpers.setIsResizing(true);
      // });
      // disable flex-grow temporarily to allow resize
      //target.style.setProperty("flex-grow", "0");
      // Disable fixed height of the upper section ?
    },

    onResizeEnd: (event) => {
      const target = event.target as HTMLElement;
      const brickId = target.dataset.brickId as string;
      const parentBrick = draftHelpers.getParentBrick(brickId);
      // parentElement corresponds to the wrapper of the brick
      const parentWrapperElement = target.parentElement as HTMLElement;

      // Compute the parent innerWidth (clientWidth - padding)
      const parentWidth =
        parentWrapperElement.clientWidth -
        parseFloat(getComputedStyle(parentWrapperElement).paddingLeft) -
        parseFloat(getComputedStyle(parentWrapperElement).paddingRight);

      if (!parentWidth) {
        console.warn("Parent element width is not available, cannot update brick props.");
        return;
      }

      const rectWidth = Math.abs(event.rect.width);
      const futureWidth = Math.min(Math.round((rectWidth / parentWidth) * 100), 100);
      const widthPercentage = previewMode === "mobile" ? "auto" : `${futureWidth.toFixed(0)}%`;

      // Horizontal resizing
      if (event.edges.left || event.edges.right) {
        if (futureWidth === 100 && parentBrick) {
          console.log("Resizing to 100% width, updating parent brick props");
          // Also update the parent brick props with fixed values
          draftHelpers.updateBrickProps(parentBrick.id, {
            width: `${rectWidth}px`,
            grow: false,
          });
        }
        draftHelpers.updateBrickProps(brickId, {
          width: widthPercentage,
          grow: false,
        });
      }

      if (event.edges.top || event.edges.bottom) {
        draftHelpers.updateBrickProps(brickId, {
          height: `${event.rect.height}px`,
        });
      }

      requestAnimationFrame(() => {
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
        target.style.removeProperty("transform");
      });
    },
  });

  // When preview mode changes, scroll to the selected element if any
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedBrickId) {
      const element = document.getElementById(selectedBrickId);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "center" });
      }
    } else if (selectedSectionId) {
      const element = document.getElementById(selectedSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "center" });
      }
    }
  }, [previewMode]);

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
        // editorHelpers.hidePanel("settings");
        editorHelpers.hidePanel("theme");
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
