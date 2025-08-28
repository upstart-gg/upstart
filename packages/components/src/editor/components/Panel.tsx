import {
  useEditorHelpers,
  usePanel,
  usePreviewMode,
  useSelectedBrickId,
  useSelectedSection,
} from "../hooks/use-editor";
import { RxCross2 } from "react-icons/rx";
import { LuPanelLeft, LuPanelRight } from "react-icons/lu";
import type { ComponentProps } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import PanelSettings from "./PanelAttributes";
import PanelTheme from "./PanelTheme";
import PanelBrickInspector from "./PanelBrickInspector";
import PanelSectionInspector from "./PanelSectionInspector";
import PanelLibrary from "./PanelLibrary";
import { Tooltip } from "@upstart.gg/style-system/system";
import { useBrick } from "../hooks/use-page-data";

type PanelProps = ComponentProps<"aside">;

/**
 * Panel used to display both the inspector and the library
 */
export default function Panel({ className, ...props }: PanelProps) {
  const { panel, panelPosition } = usePanel();
  const previewMode = usePreviewMode();
  const selectedBrickId = useSelectedBrickId();
  const selectedSection = useSelectedSection();
  const { togglePanelPosition, hidePanel } = useEditorHelpers();
  const selectedBrick = useBrick(selectedBrickId);

  // Prevent blank panel when invalid brick / section id is selected
  if (!panel || (panel === "inspector" && !selectedBrick && !selectedSection)) {
    return null;
  }

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-0 bottom-0 flex shadow-2xl overscroll-none \
        min-w-[360px] w-[360px] opacity-100
        bg-white dark:bg-dark-900 border-upstart-200 dark:border-dark-700 overflow-visible`,
        {
          // "transition-transform duration-150": !!panel,
          "transition-all duration-100": !panel,
          "left-0 border-r": panelPosition === "left",
          "right-0 border-l": panelPosition === "right",
          "-translate-x-full opacity-0": !panel && panelPosition === "left",
          "translate-x-full": !panel && panelPosition === "right",
        },
      )}
      {...props}
    >
      <div className="flex-grow relative flex-col">
        {previewMode === "desktop" && panel === "library" && <PanelLibrary />}
        {panel === "inspector" && selectedBrick && <PanelBrickInspector brick={selectedBrick} />}
        {panel === "inspector" && !selectedBrick && selectedSection && (
          <PanelSectionInspector section={selectedSection} />
        )}
        {panel === "theme" && <PanelTheme />}
        {panel === "settings" && <PanelSettings />}
        {panel && (
          <>
            <Tooltip content="Close panel" delayDuration={500}>
              <button
                type="button"
                className={tx(
                  "absolute z-[9999] aspect-square h-7 w-7 top-0 flex justify-center items-center bg-gradient-to-tr from-red-800 to-red-700 hover:(opacity-80 text-white) border border-t-0 border-red-900 text-white/90",
                  panelPosition === "right" ? "-left-7 rounded-bl" : "-right-7 rounded-br",
                )}
                onClick={() => {
                  hidePanel();
                }}
              >
                <RxCross2 className="h-4 w-4" />
              </button>
            </Tooltip>
            <button
              type="button"
              className={tx(
                "absolute z-[9999] aspect-square h-8 w-8 bottom-0 flex justify-center items-center bg-gray-100 hover:(bg-upstart-100 text-upstart-800) backdrop-blur-md border border-b-0 border-upstart-200 text-black/50",
                panelPosition === "right"
                  ? "-left-8 rounded-tl border-r-0"
                  : "-right-8 rounded-tr border-l-0",
              )}
              onClick={() => {
                togglePanelPosition();
              }}
            >
              {panelPosition === "right" && <LuPanelLeft className="h-5 w-5" />}
              {panelPosition === "left" && <LuPanelRight className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
