import {
  useChatVisible,
  useDraft,
  useDraftHelpers,
  useEditorEnabled,
  usePanel,
  useSections,
  useSiteReady,
} from "../hooks/use-editor";
import { lazy, Suspense, useEffect, useRef, type ComponentProps } from "react";
import { css, tx, tw } from "@upstart.gg/style-system/twind";
import { Button } from "@upstart.gg/style-system/system";
import { usePageAutoSave } from "~/editor/hooks/use-page-autosave";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";

const Tour = lazy(() => import("./Tour"));
const NavBar = lazy(() => import("./NavBar"));
const Chat = lazy(() => import("./Chat"));
const EditablePage = lazy(() => import("./EditablePage"));
const Page = lazy(() => import("~/shared/components/Page"));
const DeviceFrame = lazy(() => import("./DeviceFrame"));
const Panel = lazy(() => import("./Panel"));

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
};

export default function Editor({ mode = "local", ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const editorEnabled = useEditorEnabled();
  const chatVisible = useChatVisible();
  const sections = useSections();
  const { panelPosition } = usePanel();
  const siteReady = useSiteReady();

  usePageAutoSave();
  useEditorHotKeys();

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    if (themeUsed) {
      tw(css(getThemeCss(themeUsed)));
    }
  }, [draft.previewTheme, draft.theme]);

  if (!editorEnabled) {
    return (
      <div className="@container">
        <Suspense>
          <Page
            page={{
              ...draft,
              tags: [],
            }}
          />
        </Suspense>
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
      {sections.length > 0 && siteReady && (
        <Suspense>
          <Tour />
        </Suspense>
      )}
      <Suspense>
        <NavBar />
      </Suspense>
      {chatVisible && (
        <Suspense>
          <Chat />
        </Suspense>
      )}
      <Suspense>
        <Panel />
      </Suspense>
      <main
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none ",
          "overflow-x-auto overflow-y-visible ",
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
        <Suspense>
          <DeviceFrame>
            <EditablePage />
            {draft.previewTheme && <ThemePreviewConfirmButton />}
          </DeviceFrame>
        </Suspense>
      </main>
    </div>
  );
}

function getEditorCss(chatVisible?: boolean) {
  return css({
    gridTemplateAreas: chatVisible ? `"navbar navbar" "chat main"` : `"navbar" "main"`,
    gridTemplateRows: "64px 1fr",
    gridTemplateColumns: chatVisible ? "clamp(280px, 25%, 410px) 1fr" : "1fr",
  });
}

function ThemePreviewConfirmButton() {
  const { validatePreviewTheme } = useDraftHelpers();
  return (
    <div className="sticky bottom-4 left-0 right-0 flex justify-center items-center z-[9999]">
      <div className="p-3 bg-black/70 backdrop-blur-md rounded-lg max-w-fit flex gap-2 shadow-xl">
        <Button variant="solid" color="gray" onClick={() => validatePreviewTheme(false)}>
          Revert
        </Button>
        <Button onClick={() => validatePreviewTheme(true)} variant="solid">
          Accept theme
        </Button>
      </div>
    </div>
  );
}
