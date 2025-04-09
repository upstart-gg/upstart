import {
  useDraft,
  useEditorEnabled,
  usePanel,
  usePreviewMode,
  type DraftState,
  type usePageInfo,
} from "../hooks/use-editor";
import Toolbar from "./Toolbar";
import Topbar from "./Topbar";
import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { DeviceFrame } from "./Preview";
import EditablePage from "./EditablePage";
import { tx, injectGlobal, css } from "@upstart.gg/style-system/twind";
import { Button, Spinner, toast } from "@upstart.gg/style-system/system";
import { usePageAutoSave, useOnDraftChange } from "~/editor/hooks/use-page-autosave";
import DataPanel from "./PanelData";
import PanelSettings from "./PanelSettings";
import PanelTheme from "./PanelTheme";
import PanelInspector from "./PanelInspector";
import PanelLibrary from "./PanelLibrary";
import Tour from "./Tour";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import Page from "~/shared/components/Page";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
  onDraftChange?: (state: DraftState, pageInfo: ReturnType<typeof usePageInfo>) => void;
};

export default function Editor({ mode = "local", onDraftChange, ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const editorEnabled = useEditorEnabled();

  // intro is a state when the site has just been created.
  // It is used for animating the editor.
  const [showIntro, setShowIntro] = useState(new URLSearchParams(window.location.search).has("intro"));
  const setShowIntroDebounced = useDebounceCallback(setShowIntro, 300);

  const { panelPosition } = usePanel();

  useEffect(() => {
    if (showIntro) {
      const listener = (event: AnimationEvent) => {
        setShowIntroDebounced(false);
      };
      addEventListener("animationend", listener);
      return () => {
        removeEventListener("animationend", listener);
      };
    }
  }, [showIntro, setShowIntroDebounced]);

  usePageAutoSave();
  useOnDraftChange(onDraftChange);
  useEditorHotKeys();

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    injectGlobal(getThemeCss(themeUsed));
  }, [draft.previewTheme, draft.theme]);

  if (!editorEnabled) {
    return (
      <div className="@container">
        <Page
          page={{
            ...draft,
            tags: [],
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="editor"
      className={tx(
        "min-h-[100dvh] max-h-[100dvh] grid relative overscroll-none overflow-hidden",
        getEditorCss(showIntro, panelPosition),
      )}
      {...props}
      ref={rootRef}
    >
      {showIntro === false && <Tour />}
      {editorEnabled && <Topbar showIntro={showIntro} />}
      <Panel />
      {editorEnabled && <Toolbar showIntro={showIntro} />}
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <main
        className={tx(
          "editor-main flex-1 flex place-content-center z-40 overscroll-none transition-colors duration-300",
          showIntro
            ? "overflow-x-hidden overflow-y-hidden pointer-events-none"
            : "overflow-x-auto overflow-y-visible ",
          previewMode === "mobile" && "bg-gray-300",
          css({
            gridArea: "main",
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollBehavior: "smooth",
            scrollbarGutter: "stable",
            scrollbarWidth: panelPosition === "left" ? "thin" : "none",
            "&:hover": {
              scrollbarColor: "var(--violet-7) var(--violet-3)",
            },
          }),
        )}
      >
        <DeviceFrame>
          {editorEnabled ? (
            <EditablePage showIntro={showIntro} />
          ) : (
            <Page
              page={{
                ...draft,
                tags: [],
              }}
            />
          )}
        </DeviceFrame>
      </main>
    </div>
  );
}

function getEditorCss(showIntro: boolean, panelPosition: "left" | "right") {
  return css({
    gridTemplateAreas:
      panelPosition === "left" ? `"topbar topbar" "toolbar main"` : `"topbar topbar" "main toolbar"`,
    gridTemplateRows: "3.7rem 1fr",
    gridTemplateColumns: panelPosition === "left" ? "3.7rem 1fr" : "1fr 3.7rem",
  });
}

function ThemePreviewConfirmButton() {
  return <Button>Accept theme</Button>;
}

type PanelProps = ComponentProps<"aside">;

const TEMP_PANEL_DISABLED = false;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const { panel, panelPosition } = usePanel();
  const previewMode = usePreviewMode();

  if (TEMP_PANEL_DISABLED) {
    return null;
  }

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-[3.7rem] bottom-0 flex shadow-2xl flex-col overscroll-none \
        min-w-[300px] w-[320px] transition-all duration-200 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-upstart-200 dark:border-dark-700 overflow-visible`,
        {
          "left-[3.7rem]": panelPosition === "left",
          "right-[3.7rem]": panelPosition === "right",
          "-translate-x-full opacity-0": !panel && panelPosition === "left",
          "translate-x-full": !panel && panelPosition === "right",
        },
      )}
      {...props}
    >
      {previewMode === "desktop" && panel === "library" && <PanelLibrary />}
      {panel === "inspector" && <PanelInspector />}
      {panel === "theme" && <PanelTheme />}
      {panel === "settings" && <PanelSettings />}
      {panel === "data" && <DataPanel />}
    </aside>
  );
}
