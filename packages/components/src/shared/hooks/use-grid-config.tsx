import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { useEffect, useMemo, useState } from "react";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { debounce } from "lodash-es";

export function useGridConfig(pageRef: React.RefObject<HTMLDivElement>) {
  const [colWidth, setColWidth] = useState(0);
  const previewMode = usePreviewMode();

  useEffect(() => {
    // Calculate cell width on mount and window resize
    const updateCellWidth = debounce(() => {
      if (pageRef.current) {
        const containerWidth = pageRef.current.offsetWidth;
        const availableWidth = containerWidth;
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
  }, [previewMode, pageRef]);

  return {
    colWidth,
    rowHeight: LAYOUT_ROW_HEIGHT,
  };
}

export type GridConfig = ReturnType<typeof useGridConfig>;
