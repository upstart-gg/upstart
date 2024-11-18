import {
  useDraft,
  useEditor,
  useBricksSubscribe,
  useAttributesSubscribe,
  usePagePathSubscribe,
  useThemeSubscribe,
  usePageConfig,
  useEditorMode,
  useAttributes,
  usePreviewMode,
} from "../hooks/use-editor";
import Toolbar from "./Toolbar";
import Topbar from "./Topbar";
import { useEffect, useRef, type ComponentProps } from "react";
import Inspector from "./Inspector";
import { DeviceFrame } from "./Preview";
import BlocksLibrary from "./BricksLibrary";
import { usePreviewModeInit } from "../hooks/use-is-device-type";
import EditablePage from "./EditablePage";
import { tx, injectGlobal, css, colors } from "@enpage/style-system/twind";
import { Button } from "@enpage/style-system";
import ThemePanel from "./ThemePanel";
import SettingsPanel from "./SettingsPanel";
import { patch } from "../utils/api";
import {
  generateShades,
  generateTextColors,
  isStandardColor,
  generateColorsVars,
} from "@enpage/sdk/shared/themes/color-system";

type EditorProps = ComponentProps<"div"> & {
  mode?: "local" | "live";
};

export default function Editor({ mode = "local", ...props }: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const editorMode = useEditorMode();
  const pageConfig = usePageConfig();
  const attributes = useAttributes();

  function updatePage(payload: Record<string, unknown>) {
    if (editorMode === "local") {
      return;
    }
    return patch(`/sites/${pageConfig.siteId}/pages/${pageConfig.id}/versions/latest`, payload)
      .then((res) => {
        console.log("Page version saved");
        console.log(res);
      })
      .catch((err) => {
        console.error("Error while updating page version");
        console.log(err);
      });
  }

  useBricksSubscribe(async (bricks) => {
    console.debug("Bricks have changed, updating page version");
    updatePage({ elements: bricks });
  });
  useAttributesSubscribe((attributes) => {
    console.debug("Attributes have changed, updating page version");
    updatePage({ attributes });
  });
  usePagePathSubscribe((path) => {
    console.debug("pagePath has changed, updating page version");
    updatePage({ path });
  });
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    updatePage({ theme });
  });

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    const shades = generateColorsVars(themeUsed);

    const injected = `
     @layer upstart-theme {
        :root {
          ${Object.entries(shades)
            .map(([key, value]) => `--${key}: ${value};`)
            .join("\n")}

          --color-link: var(--color-primary);

          --font-size-hero-1: clamp(2rem, 9vw, 3.5rem);
          --font-size-hero-2: clamp(3rem, 9vw, 5rem);
          --font-size-hero-3: clamp(4rem, 9vw, 7rem);
          --font-size-hero-4: clamp(5rem, 9vw, 9rem);
          --font-size-hero-5: clamp(6rem, 9vw, 11rem);

        }
        [data-upstart-theme] {
          .page-container {
            font-family: var(--font-${themeUsed.typography.body});
          }
        }
    }
    `;

    injectGlobal(injected);
  }, [draft.previewTheme, draft.theme]);

  usePreviewModeInit();

  return (
    <div
      id="editor"
      className={tx(
        "min-h-[100dvh] max-h-[100dvh] grid relative overscroll-none",
        css({
          gridTemplateAreas: `"topbar topbar" "toolbar main"`,
          gridTemplateRows: "3.7rem 1fr",
          gridTemplateColumns: "3.7rem 1fr",
        }),
      )}
      {...props}
      ref={rootRef}
    >
      <Topbar />
      <Panel />
      <Toolbar />
      {draft.previewTheme && <ThemePreviewConfirmButton />}
      <div
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none overflow-auto transition-colors duration-300",
          css({
            gridArea: "main",
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            "&:hover": {
              scrollbarColor: "var(--violet-7) var(--violet-3)",
            },
          }),
          previewMode === "desktop" &&
            isStandardColor(attributes.$backgroundColor) &&
            css({ backgroundColor: attributes.$backgroundColor }),
          previewMode === "desktop" &&
            isStandardColor(attributes.$textColor) &&
            css({ color: attributes.$textColor }),
          previewMode === "desktop" &&
            !isStandardColor(attributes.$backgroundColor) &&
            attributes.$backgroundColor,
          previewMode === "desktop" && !isStandardColor(attributes.$textColor) && attributes.$textColor,
        )}
      >
        <DeviceFrame>
          <EditablePage />
        </DeviceFrame>
      </div>
    </div>
  );
}

function ThemePreviewConfirmButton() {
  return <Button>Accept theme</Button>;
}

type PanelProps = ComponentProps<"aside">;
/**
 * Panel used to display both the inspector and the library
 */
function Panel({ className, ...props }: PanelProps) {
  const editor = useEditor();

  return (
    <aside
      id="floating-panel"
      className={tx(
        `z-[9999] fixed top-[3.7rem] bottom-0 left-[3.7rem] flex shadow-2xl flex-col overscroll-none \
        min-w-[300px] w-[18dvw] max-w-[18dvw] 2xl:max-w-[14dvw] transition-all duration-200 ease-in-out opacity-100
        bg-gray-50 dark:bg-dark-700 border-r border-upstart-200 dark:border-dark-700 overflow-auto`,
        {
          "-translate-x-full opacity-0": !editor.panel,
        },
      )}
      {...props}
    >
      {editor.panel === "library" && <BlocksLibrary />}
      {editor.panel === "inspector" && <Inspector />}
      {editor.panel === "theme" && <ThemePanel />}
      {editor.panel === "settings" && <SettingsPanel />}
    </aside>
  );
}
