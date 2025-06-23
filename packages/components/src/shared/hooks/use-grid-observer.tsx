import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { type RefObject, useEffect, useState } from "react";
import { useEditorHelpers, usePreviewMode } from "~/editor/hooks/use-editor";
import { debounce } from "lodash-es";

export function useGridObserver(elementRef: RefObject<HTMLElement>) {
  const [colWidth, setColWidth] = useState(0);
  const previewMode = usePreviewMode();
  const { setGridConfig } = useEditorHelpers();

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (elementRef.current) {
        const containerWidth = elementRef.current.clientWidth;
        setColWidth(containerWidth / LAYOUT_COLS[previewMode]);
      }
    }, 250);

    // Wait for the element to be available
    if (!elementRef.current) {
      return;
    }

    updateCellWidth();

    // mutation oberver for the page container styles
    const observer = new MutationObserver(updateCellWidth);
    observer.observe(elementRef.current, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", updateCellWidth, true);

    return () => {
      window.removeEventListener("resize", updateCellWidth, true);
      observer.disconnect();
    };
  }, [previewMode, elementRef]);

  useEffect(() => {
    if (colWidth) {
      console.log("Setting grid config with colWidth:", colWidth);
      setGridConfig({
        colWidth,
        rowHeight: LAYOUT_ROW_HEIGHT,
      });
    }
  }, [colWidth, setGridConfig]);

  return {
    colWidth,
    rowHeight: LAYOUT_ROW_HEIGHT,
  };
}

export type GridConfig = ReturnType<typeof useGridObserver>;
