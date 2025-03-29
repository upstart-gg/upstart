import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { useEffect, useState } from "react";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { debounce } from "lodash-es";

export function useGridConfig(elementRef: React.RefObject<HTMLElement>) {
  const [colWidth, setColWidth] = useState(0);
  const previewMode = usePreviewMode();

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (elementRef.current) {
        const containerWidth = elementRef.current.clientWidth;
        setColWidth(containerWidth / LAYOUT_COLS[previewMode]);
      }
    }, 250);

    updateCellWidth();

    // mutation oberver for the page container styles
    const observer = new MutationObserver(updateCellWidth);
    observer.observe(elementRef.current as Node, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", updateCellWidth, true);

    return () => {
      window.removeEventListener("resize", updateCellWidth, true);
      observer.disconnect();
    };
  }, [previewMode, elementRef]);

  return {
    colWidth,
    rowHeight: LAYOUT_ROW_HEIGHT,
  };
}

export type GridConfig = ReturnType<typeof useGridConfig>;
