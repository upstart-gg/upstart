import {
  useChatVisible,
  useDebugMode,
  useEditorEnabled,
  useEditorHelpers,
  usePanel,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { lazy, Suspense, useEffect, useRef, type ComponentProps } from "react";
import { css, tx, tw } from "@upstart.gg/style-system/twind";
import { Button, Switch } from "@upstart.gg/style-system/system";
import { usePageAutoSave } from "~/editor/hooks/use-page-autosave";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";
import ThemesPreviewList from "./ThemesPreviewList";
import BlankWaitPage from "./BlankWaitPage";
import type { GenerationState } from "@upstart.gg/sdk/shared/context";
import { createEmptyBrick } from "@upstart.gg/sdk/shared/bricks";
import { Toaster } from "@upstart.gg/style-system/system";
import { useIsLocalDev } from "../hooks/use-is-local-dev";
import {
  useDraft,
  useSections,
  useThemes,
  useGenerationState,
  useDraftHelpers,
} from "../hooks/use-page-data";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import Modal from "./Modal";
import useBeforeUnload from "../hooks/use-beforeunload";
import { isEqual } from "lodash-es";
import { useUserConfig } from "../hooks/use-user-config";

const Tour = lazy(() => import("./Tour"));
const NavBar = lazy(() => import("./NavBar"));
const Chat = lazy(() => import("./Chat"));
const EditablePage = lazy(() => import("./EditablePage"));
const Page = lazy(() => import("~/shared/components/Page"));
const DeviceFrame = lazy(() => import("./DeviceFrame"));
const Panel = lazy(() => import("./Panel"));

type EditorProps = ComponentProps<"div">;

export default function Editor(props: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const editorEnabled = useEditorEnabled();
  const chatVisible = useChatVisible();
  const sections = useSections();
  const { panelPosition } = usePanel();
  const themes = useThemes();
  const generationState = useGenerationState();
  const draftHelpers = useDraftHelpers();
  const { setDraggingBrickType, toggleDebugMode, hidePanel } = useEditorHelpers();
  const selectedBrickId = useSelectedBrickId();
  const selectedSectionId = useSelectedSectionId();
  const islocalDev = useIsLocalDev();
  const debug = useDebugMode();
  const userConfig = useUserConfig();
  const tmpAddedBrick = useRef<string | null>(null);

  usePageAutoSave();
  useEditorHotKeys();
  useBeforeUnload(() => !!draft.dirty, "You have unsaved changes. Are you sure you want to leave?");

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.site.theme;
    if (themeUsed) {
      tw(css(getThemeCss(themeUsed)));
    }
  }, [draft.previewTheme, draft.site.theme]);

  if (!editorEnabled) {
    return (
      <div className="@container">
        <Suspense>
          <Page page={draft.page} site={draft.site} />
        </Suspense>
      </div>
    );
  }

  return (
    <DragDropProvider
      onDragStart={(event, manager) => {
        const { operation } = event;

        if (operation.source?.type === "library") {
          const brickType = operation.source.data.manifest.type as string;
          setDraggingBrickType(brickType);
          return;
        }

        console.log(`Started dragging ${operation.source?.id}`);
        if (operation.source?.id) {
          const element = document.getElementById(operation.source.id as string);
          if (!element) {
            return;
          }
          console.log(`adding class ${operation.source.id}`);
          element?.classList.add("moving");

          // add shadow using css properties
          element.style.setProperty("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)", "important");
          // also add outline of 2px
          element.style.setProperty("outline", "2px solid var(--violet-8)", "important");
          element.style.setProperty("outline-offset", "0px", "important");

          const computedStyle = window.getComputedStyle(element);
          // Change the background color only if it is transparent
          if (computedStyle.getPropertyValue("background-color") === "rgba(0, 0, 0, 0)") {
            console.log("Changing background color to upstart-200");
            element.style.setProperty("background-color", "var(--violet-a5)", "important");
          }
        }
      }}
      onDragOver={(event, manager) => {
        const { operation } = event;
        const isLibraryDrag = operation.source?.type === "library";

        if (operation.canceled || !operation.target) {
          return;
        }

        if (
          operation.target?.data?.manifest?.isContainer &&
          (operation.activatorEvent as MouseEvent)?.metaKey
        ) {
          console.log("operation.activatorEvent", operation.activatorEvent);
          console.error("Dropping over a container, disable reordering");
          event.preventDefault();
          return;
        }

        // Transform section to Record<sectionId, brickId[]>
        const items = sections.reduce(
          (acc, section) => {
            acc[section.id] = section.bricks
              .filter((brick) => !draftHelpers.getParentBrick(brick.id)) // only top-level bricks
              .map((brick) => brick.id);
            return acc;
          },
          {} as Record<string, string[]>,
        );

        // Drag and drop from library
        if (isLibraryDrag) {
          // Simulate adding the brick to the library
          items.$library$ = tmpAddedBrick.current ? [] : [operation.source.id as string];
        }

        const newItems = move(items, event);

        if (isEqual(items, newItems)) {
          console.debug("Items are equal, no changes made");
        } else {
          // rebuild all sections
          for (const section of sections) {
            // if section has changed
            if (!isEqual(items[section.id], newItems[section.id])) {
              console.log("Rebuilding section", section.id);
              const modifiedSection = {
                ...section,
                bricks: newItems[section.id].map((brickId, index) => {
                  if (isLibraryDrag && brickId === operation.source.id && !draftHelpers.getBrick(brickId)) {
                    const newBrick = createEmptyBrick(operation.source.data?.manifest.type as string, true);
                    tmpAddedBrick.current = newBrick.id;
                    draftHelpers.addBrick(newBrick, section.id as string, index, null);
                    return newBrick;
                  }
                  return draftHelpers.getBrick(brickId)!;
                }),
              };
              draftHelpers.updateSection(section.id, modifiedSection);
            }
          }
        }
      }}
      onDragEnd={(event) => {
        console.log(`Ended dragging`, event);
        const {
          operation: { source },
        } = event;

        if (tmpAddedBrick.current) {
          draftHelpers.updateBrickProps(tmpAddedBrick.current, { ghost: false });
        }

        setDraggingBrickType(null);
        tmpAddedBrick.current = null;

        if (source?.id) {
          // remove all custom styles
          setTimeout(() => {
            const element = document.getElementById(source.id as string);
            if (element) {
              element.classList.remove("moving");
              element.style.removeProperty("box-shadow");
              element.style.removeProperty("outline");
              element.style.removeProperty("outline-offset");
              element.style.removeProperty("background-color");
            }
          }, 200);
        }
      }}
    >
      <div
        id="editor"
        className={tx(
          "grid relative transition-all mx-auto w-full",
          getEditorCss(generationState, chatVisible),
          "h-[100dvh] min-h-[100dvh] max-h-[100dvh]",
          generationState.isReady === false &&
            css({
              background: `linear-gradient(120deg,
              oklab(from #9291e7 l a b / 0.65),
              oklab(from #7270c6 l a b / 0.65),
              oklab(from #c050c2 l a b / 0.65),
              oklab(from #ef50a2 l a b / 0.65),
              oklab(from #ff6285 l a b / 0.65),
              oklab(from #ff806b l a b / 0.65),
              oklab(from #ffa25a l a b / 0.65),
              oklab(from #ffc358 l a b / 0.65)
          )`,
            }),
          generationState.isReady === false && "transition-all duration-500 ease-in-out",
        )}
        {...props}
        ref={rootRef}
      >
        {sections.length > 0 && generationState.isReady && (
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
          <Modal />
          <Panel />
          {!generationState.isReady && debug === true && (
            <div className="fixed flex flex-col gap-3 w-[30dvw] top-[60px] right-0 bottom-0 bg-gray-100 dark:bg-dark-800 border-gray-300 dark:border-gray-700 p-5 overflow-y-auto">
              <h2 className="text-xl font-bold">Debug Information</h2>
              <h4 className="text-lg font-semibold">Site</h4>
              <pre className="whitespace-pre-wrap break-words text-[75%]">
                {JSON.stringify(draft.site, null, 2)}
              </pre>
              <h4 className="text-lg font-semibold">Page</h4>
              <pre className="whitespace-pre-wrap break-words text-[75%]">
                {JSON.stringify(draft.page, null, 2)}
              </pre>
              <h4 className="text-lg font-semibold">User config</h4>
              <pre className="whitespace-pre-wrap break-words text-[75%]">
                {JSON.stringify(userConfig, null, 2)}
              </pre>
            </div>
          )}
        </Suspense>
        <main
          className={tx(
            "flex-1 flex place-content-center z-40 overflow-x-auto overscroll-none",
            generationState.isReady === false && "!hidden",
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
          {generationState.isReady && (
            <Suspense>
              <DeviceFrame>
                <EditablePage />
                {draft.previewTheme && <ThemePreviewConfirmButton />}
              </DeviceFrame>
            </Suspense>
          )}
          {!generationState.isReady &&
            (themes.length > 0 ? (
              <DeviceFrame>
                <ThemesPreviewList themes={themes} />
              </DeviceFrame>
            ) : (
              <DeviceFrame>
                <BlankWaitPage />
              </DeviceFrame>
            ))}

          <Toaster
            toastOptions={{
              position: "bottom-center",
              style: {
                background: "rgba(0, 0, 0, 0.85)",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: "500",
                // marginBottom: "1rem",
              },
              className: tx("last:mb-1 px-1 py-1 rounded-lg"),
              error: {
                style: {
                  background: "#880808",
                },
              },
            }}
          />
          {islocalDev && (
            <div
              className="fixed flex max-w-[548px] items-center divide-x divide-gray-300 bottom-0 right-6 p-2 text-xs text-gray-500 bg-gray-100 dark:bg-dark-800 z-[19999] rounded-t-md"
              style={{
                // Shadow to the top left corner
                boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1), -2px 0 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="px-2">Selected brick: {selectedBrickId ?? "none"}</div>
              <div className="px-2">Selected section: {selectedSectionId ?? "none"}</div>
              <div className="flex items-center gap-1 px-2">
                <Switch defaultChecked={debug} onCheckedChange={toggleDebugMode} size="1" id="debug-mode" />
                <label htmlFor="debug-mode" className="cursor-pointer select-none">
                  Debug mode{" "}
                  <b className={tx("font-semibold", debug ? "text-upstart-600" : "text-gray-500")}>
                    {debug ? "on" : "off"}
                  </b>
                </label>
              </div>
            </div>
          )}
        </main>
      </div>
    </DragDropProvider>
  );
}

function getEditorCss(generationState: GenerationState, chatVisible: boolean) {
  return css({
    gridTemplateAreas: chatVisible ? `"navbar navbar" "chat main"` : `"navbar" "main"`,
    gridTemplateRows: "64px 1fr",
    gridTemplateColumns: generationState.isReady === false ? "1fr 0px" : chatVisible ? "360px 1fr" : "1fr",
    // maxWidth: generationState.isReady === false ? "clamp(500px, 40dvw, 650px)" : "none",
  });
}

function ThemePreviewConfirmButton() {
  const { validatePreviewTheme } = useDraftHelpers();
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center z-[9999]">
      <div className="p-3 pb-2 bg-black/70 backdrop-blur-md rounded-t-lg max-w-fit flex gap-2 shadow-xl">
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
