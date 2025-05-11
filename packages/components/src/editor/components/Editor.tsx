import {
  useChatVisible,
  useDraft,
  useEditorEnabled,
  useEditorHelpers,
  useGetBrick,
  usePanel,
  usePreviewMode,
  useSelectedBrickId,
} from "../hooks/use-editor";
import Toolbar from "./Toolbar";
import { LuPanelLeft, LuPanelRight } from "react-icons/lu";
import NavBar from "./NavBar";
import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { DeviceFrame } from "./Preview";
import EditablePage from "./EditablePage";
import { injectGlobal, css, tx } from "@upstart.gg/style-system/twind";
import { Button, Spinner, toast } from "@upstart.gg/style-system/system";
import { usePageAutoSave } from "~/editor/hooks/use-page-autosave";
import DataPanel from "./PanelData";
import PanelSettings from "./PanelSettings";
import PanelTheme from "./PanelTheme";
import PanelInspector from "./PanelInspector";
import PanelLibrary from "./PanelLibrary";
import Tour from "./Tour";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import Page from "~/shared/components/Page";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";
import Chat from "./Chat";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
};

export default function Editor({ mode = "local", ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const editorEnabled = useEditorEnabled();
  const chatVisible = useChatVisible();

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
      className={tx("min-h-[100dvh] max-h-[100dvh] grid relative", getEditorCss(chatVisible))}
      {...props}
      ref={rootRef}
    >
      {showIntro === false && <Tour />}
      {editorEnabled && <NavBar showIntro={showIntro} />}
      {editorEnabled && chatVisible && <Chat />}
      <Panel />
      {/* {editorEnabled && <Toolbar showIntro={showIntro} />} */}
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <main
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none ",
          showIntro
            ? "overflow-x-hidden overflow-y-hidden pointer-events-none"
            : "overflow-x-auto overflow-y-visible ",
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

function getEditorCss(chatVisible?: boolean) {
  return css({
    gridTemplateAreas: chatVisible ? `"navbar navbar" "chat main"` : `"navbar" "main"`,
    gridTemplateRows: "70px 1fr",
    gridTemplateColumns: chatVisible ? "clamp(280px, 25%, 380px) 1fr" : "1fr",
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
  const selectedBrickId = useSelectedBrickId();
  const { togglePanelPosition } = useEditorHelpers();
  const getBrickInfo = useGetBrick();
  const selectedBrick = selectedBrickId ? getBrickInfo(selectedBrickId) : null;

  if (TEMP_PANEL_DISABLED) {
    return null;
  }

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-0 bottom-0 flex shadow-2xl overscroll-none \
        min-w-[360px] w-[360px] opacity-100 transition-transform duration-150
        bg-white dark:bg-dark-700 border-upstart-200 dark:border-dark-700 overflow-visible`,
        {
          "left-0 border-r": panelPosition === "left",
          "right-0 border-l": panelPosition === "right",
          "-translate-x-full opacity-0": !panel && panelPosition === "left",
          "translate-x-full": !panel && panelPosition === "right",
        },
      )}
      {...props}
    >
      <div className="flex-1 relative">
        {previewMode === "desktop" && panel === "library" && <PanelLibrary />}
        {panel === "inspector" && selectedBrick && <PanelInspector brick={selectedBrick} />}
        {panel === "theme" && <PanelTheme />}
        {panel === "settings" && <PanelSettings />}
        {panel === "data" && <DataPanel />}

        <button
          type="button"
          className={tx(
            "absolute bottom-1 p-1 bg-upstart-50 rounded-sm text-upstart-400 dark:text-upstart-200 hover:text-upstart-600 dark:hover:text-upstart-100",
            panelPosition === "right" ? "left-1" : "right-1",
          )}
          onClick={() => {
            togglePanelPosition();
          }}
        >
          {panelPosition === "right" ? <LuPanelLeft size={24} /> : <LuPanelRight size={24} />}
        </button>
      </div>
    </aside>
  );
}
