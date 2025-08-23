import {
  useChatVisible,
  useDebugMode,
  useEditorEnabled,
  useEditorHelpers,
  usePanel,
  usePreviewMode,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { lazy, startTransition, Suspense, useEffect, useRef, type ComponentProps } from "react";
import { css, tx, tw } from "@upstart.gg/style-system/twind";
import { Button, Switch } from "@upstart.gg/style-system/system";
import { usePageAutoSave } from "~/editor/hooks/use-page-autosave";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";
import ThemesPreviewList from "./ThemesPreviewList";
import BlankWaitPage from "./BlankWaitPage";
import type { GenerationState } from "@upstart.gg/sdk/shared/context";
import {
  DragDropContext,
  type OnDragStartResponder,
  type DropResult,
  type OnBeforeCaptureResponder,
} from "@hello-pangea/dnd";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { createEmptyBrick, generateId } from "@upstart.gg/sdk/shared/bricks";
import { Toaster } from "@upstart.gg/style-system/system";
import { useIsLocalDev } from "../hooks/use-is-local-dev";
import {
  useDraft,
  useSections,
  useThemes,
  useGenerationState,
  useDraftHelpers,
} from "../hooks/use-page-data";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import Modal from "./Modal";
import useBeforeUnload from "../hooks/use-beforeunload";
import { isEqual } from "lodash-es";

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
  const previewMode = usePreviewMode();
  const { setDraggingBrickType, toggleDebugMode, hidePanel } = useEditorHelpers();
  const selectedBrickId = useSelectedBrickId();
  const selectedSectionId = useSelectedSectionId();
  const islocalDev = useIsLocalDev();
  const debug = useDebugMode();

  usePageAutoSave();
  useEditorHotKeys();

  useBeforeUnload(() => !!draft.dirty, "You have unsaved changes. Are you sure you want to leave?");

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    if (themeUsed) {
      tw(css(getThemeCss(themeUsed)));
    }
  }, [draft.previewTheme, draft.theme]);

  const handleDragStart: OnDragStartResponder = (result) => {
    const { draggableId } = result;
    const element = document.getElementById(draggableId);
    element?.classList.add(tx("moving"));
  };

  const onBeforeCapture: OnBeforeCaptureResponder = (before) => {
    setDraggingBrickType(before.draggableId);

    const element = document.getElementById(before.draggableId);

    if (element) {
      const computedStyle = window.getComputedStyle(element);
      console.log(
        "Original compute style background color:",
        computedStyle.getPropertyValue("background-color"),
      );
      // Change the background color only if it is transparent
      if (computedStyle.getPropertyValue("background-color") === "rgba(0, 0, 0, 0)") {
        console.log("Changing background color to upstart-200");
        element.style.setProperty("background-color", "rgba(229, 231, 235, .85)", "important");
      }
      element.classList.add(tx("shadow-2xl"));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type, combine } = result;
    setDraggingBrickType(null);

    const element = document.getElementById(draggableId);
    if (element) {
      element.classList.remove(tx("moving"));
      element.classList.remove(tx("shadow-2xl"));
      element.style.removeProperty("box-shadow");
      element.style.removeProperty("background-color");
      element.style.removeProperty("max-height");
      element.style.removeProperty("overflow");
      element.style.removeProperty("scale");
      element.style.removeProperty("transform-origin");
      element.style.removeProperty("transition");
    }

    // If dropped outside a valid droppable area
    if (!destination) {
      console.warn("Dropped outside a valid droppable area, no action taken.");
      return;
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log("Dropped in the same position, no action taken.");
      return;
    }

    // if the draggable comes from the library
    if (source.droppableId.startsWith("$library$")) {
      const destinationSection = sections.find((section) => section.id === destination.droppableId);

      // Destination is a section
      if (destinationSection) {
        const newBrick = createEmptyBrick(draggableId);

        // Add a new brick to the section
        draftHelpers.addBrick(newBrick, destinationSection.id, destination.index, null);
        console.log(
          `Added new brick ${draggableId} to section ${destinationSection.id} at index ${destination.index}`,
        );
      }

      const destinationContainer = draftHelpers.getBrick(destination.droppableId);
      if (
        destinationContainer &&
        manifests[destinationContainer.type] &&
        manifests[destinationContainer.type].isContainer
      ) {
        const newBrick = createEmptyBrick(draggableId);
        // If the destination is a container, we need to find the section ID
        const sectionId = draft.brickMap.get(destinationContainer.id)?.sectionId;

        if (!sectionId) {
          console.warn(`No section found for container ${destinationContainer.id}`);
          return;
        }

        // Add a new brick to the container
        draftHelpers.addBrick(newBrick, sectionId, destination.index, destinationContainer.id);
        console.log(
          `Added new brick ${draggableId} to container ${destinationContainer.id} at index ${destination.index} in section ${sectionId}`,
        );
      }

      if (destination.droppableId === "page") {
        const newSectionId = `s_${generateId()}`;
        draftHelpers.createEmptySection(newSectionId);
        const newBrick = createEmptyBrick(draggableId);
        // Add a new brick to the page
        draftHelpers.addBrick(newBrick, newSectionId, 0, null);
      }

      // Handle adding a new brick to a section
    } else if (type === "section") {
      // Reorder sections
      const newSectionOrder = Array.from(sections);
      const [reorderedSection] = newSectionOrder.splice(source.index, 1);
      newSectionOrder.splice(destination.index, 0, reorderedSection);

      draftHelpers.reorderSections(newSectionOrder.map((section) => section.id));
    } else if (type === "brick") {
      // Handle brick movement
      const sourceSectionId = source.droppableId;
      const destinationSectionId = destination.droppableId;

      const destinationSection = sections.find((section) => section.id === destination.droppableId);
      if (destinationSection) {
        if (sourceSectionId === destinationSectionId) {
          console.log(
            `Moving brick ${draggableId} within section from ${source.index} to ${destination.index}`,
          );
          // Moving within the same section - use the new reorder function
          draftHelpers.reorderBrickWithin(draggableId, destination.index);

          // moveBrickToContainerBrick
        } else {
          // Moving between sections - use the new moveBrickToSection function
          console.log(
            `Moving brick ${draggableId} from section ${sourceSectionId} to ${destinationSectionId}`,
          );
          draftHelpers.moveBrickToSection(draggableId, destinationSectionId, destination.index);
        }
      } else {
        // if the destination is a container, we need to find the section ID
        const destinationContainer = draftHelpers.getBrick(destination.droppableId);
        if (
          destinationContainer &&
          manifests[destinationContainer.type] &&
          manifests[destinationContainer.type].isContainer
        ) {
          // Moving to a container
          const sectionId = draft.brickMap.get(destinationContainer.id)?.sectionId;
          if (!sectionId) {
            console.warn(`No section found for container ${destinationContainer.id}`);
            return;
          }
          if (draggableId === destinationContainer.id) {
            console.warn("Cannot move a container into itself");
            return;
          }
          console.log(
            `Moving brick ${draggableId} to container ${destinationContainer.id} at index ${destination.index} in section ${sectionId}`,
          );
          draftHelpers.moveBrickToContainerBrick(draggableId, destinationContainer.id, destination.index);
        }
      }

      // Auto-adjust mobile layout if needed
      if (previewMode === "desktop") {
        startTransition(() => {
          draftHelpers.adjustMobileLayout();
        });
      }
    }
  };

  if (!editorEnabled) {
    return (
      <div className="@container">
        <Suspense>
          <Page
            page={{
              ...draft,
              attributes: draft.pageAttributes,
            }}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      // onDragStart={handleDragStart}
      // onBeforeCapture={onBeforeCapture}
    >
      <DragDropProvider
        onDragStart={(event, manager) => {
          const { operation } = event;
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
          const { cancelable, operation, defaultPrevented } = event;
          console.log("Drag over", operation);
          if (!operation.canceled) {
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
            const newItems = move(items, event);

            if (isEqual(items, newItems)) {
              console.log("Items are equal, no changes made");
            } else {
              console.log("Items are different, applying changes");
              // rebuild all sections
              for (const section of sections) {
                // if section has changed
                if (!isEqual(items[section.id], newItems[section.id])) {
                  console.log("Rebuilding section", section.id);
                  const modifiedSection = {
                    ...section,
                    bricks: newItems[section.id].map((brickId) => draftHelpers.getBrick(brickId)!),
                  };
                  draftHelpers.updateSection(section.id, modifiedSection);
                }
              }
            }

            console.log("Items before:", items);
            console.log("Proposed new items order:", newItems);
          }
        }}
        onCollision={(event, manager) => {
          // console.log(`Collision detected`, event);
        }}
        onDragEnd={(event, manager) => {
          console.log(`Ended dragging`, event);
          const { operation, canceled } = event;
          const { source, target } = operation;

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

          if (canceled) {
            // Replaces onDragCancel
            console.log(`Cancelled dragging ${source?.id}`);
            return;
          }

          if (target) {
            console.log(`Dropped ${source?.id} over ${target.id}`);
            // Access rich data
            console.log("Source data:", source?.data);
            console.log("Drop position:", operation.position.current);
          }
        }}
      >
        <div
          id="editor"
          className={tx(
            "grid relative transition-all mx-auto w-full",
            getEditorCss(generationState, chatVisible),
            "min-h-[100dvh] max-h-[100dvh]",
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
          </Suspense>
          <main
            className={tx(
              "flex-1 flex place-content-center z-40 overflow-x-auto overscroll-none ",
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
    </DragDropContext>
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
