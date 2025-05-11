import { createStore, useStore } from "zustand";
import { debounce, isEqual, merge } from "lodash-es";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import { generateId } from "@upstart.gg/sdk/shared/bricks";
import type { GenericPageConfig, GenericPageContext } from "@upstart.gg/sdk/shared/page";
import type { Site } from "@upstart.gg/sdk/shared/site";
export { type Immer } from "immer";
import type { ColorAdjustment } from "@upstart.gg/sdk/shared/themes/color-system";

enableMapSet();

export type PagePublishPayload =
  | { siteId: string; mode: "publish-page"; pageId: string; pageVersionId: string }
  | { siteId: string; mode: "publish-site" };

export type PageSavePayload = {
  siteId: string;
  pageId: string;
  pageVersionId: string;
  data: Partial<GenericPageConfig>;
};

export type SiteSavePayload = {
  siteId: string;
  data: Partial<Site>;
};

export interface EditorStateProps {
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
  /**
   * When debugMode is enabled, context menu are disabled so that inspecting using devtools is easier
   */
  debugMode?: boolean;
  /**
   * When true, disable the editor and renders the page as it would be rendered in production using non-editable components
   */
  disabled?: boolean;

  previewMode: Resolution;
  textEditMode?: "default" | "large";
  lastTextEditPosition?: number;
  settingsVisible?: boolean;

  selectedBrickId?: Brick["id"];
  selectedGroup?: Brick["id"][];

  isEditingTextForBrickId?: string;
  panel?: "library" | "inspector" | "theme" | "settings" | "data";
  modal?: "image-search" | "datasources";
  panelPosition: "left" | "right";
  chatVisible?: boolean;
  seenTours: string[];
  disableTours?: boolean;
  logoLink: string;

  /**
   * Latest used color adjustment
   */
  colorAdjustment: ColorAdjustment;
  collidingBrick?: { brick: Brick; side: "top" | "bottom" | "left" | "right" };
  onShowLogin: () => void;
  onPublish: (data: PagePublishPayload) => void;
  /**
   * Returns the updated version id
   */
  onSavePage?: (page: PageSavePayload) => Promise<{
    pageVersionId: string;
  }>;
  onSaveSite?: (site: SiteSavePayload) => Promise<void>;
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: Resolution) => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettings: () => void;
  toggleTextEditMode: () => void;
  toggleEditorEnabled: () => void;
  setTextEditMode: (mode: EditorStateProps["textEditMode"]) => void;
  setIsEditingText: (forBrickId: string | false) => void;
  setlastTextEditPosition: (position?: number) => void;
  setPanel: (panel?: EditorStateProps["panel"]) => void;
  togglePanel: (panel?: EditorStateProps["panel"]) => void;
  hidePanel: (panel?: EditorStateProps["panel"]) => void;
  setSelectedGroup: (group?: Brick["id"][]) => void;
  setSelectedBrickId: (brickId?: Brick["id"]) => void;
  deselectBrick: (brickId?: Brick["id"]) => void;
  setColorAdjustment: (colorAdjustment: ColorAdjustment) => void;
  markTourAsSeen: (tourId: string) => void;
  togglePanelPosition: () => void;
  showModal: (modal: EditorStateProps["modal"]) => void;
  setCollidingBrick: (info: { brick: Brick; side: "top" | "bottom" | "left" | "right" } | null) => void;
  hideModal: () => void;
  toggleChat: () => void;
}

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS: Omit<EditorStateProps, "pageConfig" | "pages"> = {
    previewMode: "desktop",
    seenTours: [],
    mode: "local",
    colorAdjustment: "default",
    panelPosition: "left",
    logoLink: "/dashboard",
    onShowLogin: () => {
      console.warn("onShowLogin is not implemented");
    },
    onPublish: () => {
      console.warn("onPublish is not implemented");
    },
    debugMode: false,
  };

  return createStore<EditorState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,
            toggleEditorEnabled: () =>
              set((state) => {
                state.disabled = !state.disabled;
              }),
            toggleChat: () =>
              set((state) => {
                state.chatVisible = !state.chatVisible;
              }),
            markTourAsSeen: (tourId) =>
              set((state) => {
                state.seenTours = [...state.seenTours, tourId];
              }),

            setCollidingBrick: (info) =>
              set((state) => {
                state.collidingBrick = info ?? undefined;
              }),

            setlastTextEditPosition: (position) =>
              set((state) => {
                state.lastTextEditPosition = position;
              }),

            toggleTextEditMode: () =>
              set((state) => {
                state.textEditMode =
                  !state.textEditMode || state.textEditMode === "default" ? "large" : "default";
              }),

            setTextEditMode: (mode) =>
              set((state) => {
                state.textEditMode = mode;
              }),

            setPreviewMode: (mode) =>
              set((state) => {
                state.previewMode = mode;
              }),

            setSettingsVisible: (visible) =>
              set((state) => {
                state.settingsVisible = visible;
              }),

            toggleSettings: () =>
              set((state) => {
                state.settingsVisible = !state.settingsVisible;
              }),

            setIsEditingText: (forBrickId: string | false) =>
              set((state) => {
                state.isEditingTextForBrickId = forBrickId || undefined;
              }),

            setPanel: (panel) =>
              set((state) => {
                state.panel = panel;
              }),

            togglePanel: (panel) =>
              set((state) => {
                state.panel = panel && state.panel === panel ? undefined : panel;
              }),

            hidePanel: (panel) =>
              set((state) => {
                if (!panel || state.panel === panel) {
                  state.panel = undefined;
                }
              }),

            setSelectedGroup: (group) =>
              set((state) => {
                state.selectedGroup = group;
              }),

            setSelectedBrickId: (brickId) =>
              set((state) => {
                state.selectedBrickId = brickId;
              }),

            deselectBrick: (brickId) =>
              set((state) => {
                if (state.selectedBrickId && (!brickId || state.selectedBrickId === brickId)) {
                  state.selectedBrickId = undefined;
                }
              }),

            setColorAdjustment: (colorAdjustment) =>
              set((state) => {
                state.colorAdjustment = colorAdjustment;
              }),

            togglePanelPosition: () =>
              set((state) => {
                state.panelPosition = state.panelPosition === "left" ? "right" : "left";
              }),

            showModal: (modal) =>
              set((state) => {
                state.modal = modal;
              }),

            hideModal: () =>
              set((state) => {
                state.modal = undefined;
              }),
          })),
          {
            name: `editor-state`,
            skipHydration: initProps.mode === "remote",
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(
                  ([key]) =>
                    ![
                      "mode",
                      "selectedBrickId",
                      "selectedGroup",
                      "collidingBrick",
                      "panel",
                      "isEditingTextForBrickId",
                      "textEditMode",
                      "onShowLogin",
                      "disableTours",
                      "logoLink",
                      "debugMode",
                      "disabled",
                    ].includes(key),
                ),
              ),
          },
        ),
        // limit undo history to 100
        { limit: 100, equality: (pastState, currentState) => isEqual(pastState, currentState) },
      ),
    ),
  );
};

type EditorStore = ReturnType<typeof createEditorStore>;

export interface DraftStateProps {
  id: string;
  path: string;
  label: string;
  sections: Section[];
  data: Record<string, unknown>;
  datasources?: Site["datasources"];
  datarecords?: Site["datarecords"];
  attr: GenericPageContext["attr"];
  attributes: GenericPageConfig["attributes"];
  siteAttributes: Site["attributes"];
  theme: Site["theme"];
  siteId: Site["id"];
  siteLabel: Site["label"];
  pagesMap: Site["pagesMap"];
  hostname: Site["hostname"];
  previewTheme?: Theme;
  version?: string;
  lastSaved?: Date;
  dirty?: boolean;
  lastLoaded?: Date;
  brickMap: Map<string, { brick: Brick; sectionId: string; parentId: string | null }>;

  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
}

export interface DraftState extends DraftStateProps {
  getBrick: (id: string) => Brick | undefined;
  getParentBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  getPageDataForDuplication: () => Pick<
    DraftStateProps,
    "id" | "label" | "path" | "sections" | "attr" | "attributes" | "datasources" | "datarecords"
  >;
  duplicateBrick: (id: string) => void;
  duplicateSection: (id: string) => void;
  moveBrickWithin: (id: string, to: "left" | "right") => void;
  moveBrickToParent: (id: string, parentId: string) => void;
  addBrick: (brick: Brick, sectiondId: string, parentContainerId: Brick["id"] | null) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>, isMobileProps?: boolean) => void;
  toggleBrickVisibility: (id: string, resolution: Resolution) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  validatePreviewTheme: () => void;
  cancelPreviewTheme: () => void;
  updateAttributes: (attr: Partial<Attributes>) => void;
  setLastSaved: (date: Date) => void;
  setDirty: (dirty: boolean) => void;
  setLastLoaded: () => void;
  setVersion(version: string): void;
  adjustMobileLayout(): void;

  getPositionWithinParent: (brickId: Brick["id"]) => number | undefined;
  canMoveToWithinParent: (brickId: Brick["id"], to: "left" | "right") => boolean;

  isFirstSection: (sectionId: string) => boolean;
  isLastSection: (sectionId: string) => boolean;

  // Section order management
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  reorderSections: (orderedIds: string[]) => void;

  // New section methods
  addSection: (section: Section) => void;
  updateSection: (id: string, sectionData: Partial<Section>) => void;
  updateSectionProps: (id: string, props: Partial<Section["props"]>, isMobileProps?: boolean) => void;
  deleteSection: (id: string) => void;
  getSection: (id: string) => Section | undefined;
}

/**
 * Create a draft store with initial props
 *
 * Note: `data` is optional but `attr` is always provided
 */
export const createDraftStore = (
  initProps: Partial<DraftStateProps> & {
    id: DraftStateProps["id"];
    version: DraftStateProps["version"];
    path: DraftStateProps["path"];
    label: DraftStateProps["label"];
    attr: DraftStateProps["attr"];
    attributes: DraftStateProps["attributes"];
    datasources?: DraftStateProps["datasources"];
    datarecords?: DraftStateProps["datarecords"];
    siteAttributes: DraftStateProps["siteAttributes"];
    siteLabel: DraftStateProps["siteLabel"];
    siteId: DraftStateProps["siteId"];
    hostname: DraftStateProps["hostname"];
    pagesMap: DraftStateProps["pagesMap"];
    theme: DraftStateProps["theme"];
    sections: DraftStateProps["sections"];
  },
) => {
  const DEFAULT_PROPS = {
    data: {},
    mode: "local" as const,
    brickMap: buildBrickMap(initProps.sections),
  };
  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,

            isFirstSection: (sectionId) => {
              const state = _get();
              return state.sections.find((s) => s.order === 0)?.id === sectionId;
            },

            getPageDataForDuplication: () => {
              const state = _get();
              const pageCount = state.pagesMap.length + 1;
              console.log("state.pagesMap", state.pagesMap);
              const newPage = {
                id: `page-${generateId()}`,
                label: `${state.label} (page ${pageCount})`,
                path: `${state.path}-${pageCount}`,
                sections: state.sections,
                attr: state.attr,
                attributes: state.attributes,
                datasources: state.datasources,
                datarecords: state.datarecords,
              };
              return newPage;
            },

            isLastSection: (sectionId) => {
              const state = _get();
              return state.sections.find((s) => s.order === state.sections.length - 1)?.id === sectionId;
            },

            addSection: (section) =>
              set((state) => {
                state.sections.push(section);
              }),

            updateSection: (id, sectionData) =>
              set((state) => {
                const sectionIndex = state.sections.findIndex((s) => s.id === id);
                if (sectionIndex !== -1) {
                  state.sections[sectionIndex] = {
                    ...state.sections[sectionIndex],
                    ...sectionData,
                  };
                }
              }),

            duplicateSection: (id) =>
              set((state) => {
                const section = state.sections.find((s) => s.id === id);
                if (!section) {
                  console.error("Cannot duplicate section %s, it does not exist", id);
                  return;
                }
                const newSection = {
                  ...section,
                  id: `section-${generateId()}`,
                  order: state.sections.length,
                  label: `${section.label} (copy)`,
                };
                state.sections.push(newSection);
              }),

            deleteSection: (id) =>
              set((state) => {
                const section = state.sections.find((s) => s.id === id);
                if (section) {
                  return null;
                }
                // delete all bricks in this section in the brickMap reference
                state.brickMap.forEach((m) => {
                  if (m.sectionId === id) {
                    state.brickMap.delete(m.brick.id);
                  }
                });
                // Then remove the section
                state.sections = state.sections.filter((s) => s.id !== id);
              }),

            getSection: (id) => {
              return _get().sections.find((s) => s.id === id);
            },

            moveSectionUp: (sectionId) =>
              set((state) => {
                // current
                const section = state.sections.find((s) => s.id === sectionId);
                const sectionIndex = state.sections.findIndex((s) => s.id === sectionId);
                invariant(section, "Section not found");
                // previous
                const previous = state.sections.find((s) => s.order === section.order - 1);
                const previousIndex = state.sections.findIndex((s) => s.order === section.order - 1);
                invariant(previous, "Previous section not found");
                // swap
                const temp = section.order;
                section.order = previous.order;
                previous.order = temp;

                state.sections[sectionIndex] = section;
                state.sections[previousIndex] = previous;
              }),

            moveSectionDown: (sectionId) =>
              set((state) => {
                // current
                const section = state.sections.find((s) => s.id === sectionId);
                const sectionIndex = state.sections.findIndex((s) => s.id === sectionId);
                invariant(section, "Section not found");
                // next
                const next = state.sections.find((s) => s.order === section.order + 1);
                const nextIndex = state.sections.findIndex((s) => s.order === section.order + 1);
                invariant(next, "Next section not found");

                // swap
                const currentOrder = section.order;
                const nextOrder = next.order;

                state.sections[sectionIndex].order = nextOrder;
                state.sections[nextIndex].order = currentOrder;
              }),

            reorderSections: (orderedIds) =>
              set((state) => {
                // Create a new array of sections in the specified order
                const newSections: Section[] = [];

                // Add sections in the order specified by orderedIds
                orderedIds.forEach((id) => {
                  const section = state.sections.find((s) => s.id === id);
                  if (section) {
                    newSections.push(section);
                  }
                });

                // Add any sections not included in orderedIds at the end
                state.sections.forEach((section) => {
                  if (!orderedIds.includes(section.id)) {
                    newSections.push(section);
                  }
                });

                // Replace the sections array
                state.sections = newSections;
              }),

            setLastLoaded: () =>
              set((state) => {
                state.lastLoaded = new Date();
              }),

            deleteBrick: (id) =>
              set((state) => {
                // 1. retrieve all possible brick children ids
                const brickToDelete = state.brickMap.get(id);
                if (!brickToDelete) {
                  console.error("Cannot delete brick %s, it does not exist", id);
                  return;
                }

                const childrenIds: string[] = [];
                const collectChildrenIds = (brickId: string) => {
                  const map = state.brickMap.get(brickId);
                  if (map?.brick.props?.$children) {
                    const children = map.brick.props.$children as Brick[];
                    children.forEach((child) => {
                      childrenIds.push(child.id);
                      collectChildrenIds(child.id);
                    });
                  }
                };

                collectChildrenIds(id);

                // 2. delete brick in state sections
                const { sectionId, parentId } = brickToDelete;
                const section = state.sections.find((s) => s.id === sectionId);

                if (parentId) {
                  // Brick is inside a container, remove from parent's $children
                  const parentBrick = state.getBrick(parentId);
                  if (parentBrick?.props.$children) {
                    parentBrick.props.$children = (parentBrick.props.$children as Brick[]).filter(
                      (b) => b.id !== id,
                    );
                  }
                } else if (section) {
                  // Brick is at the top level of a section
                  section.bricks = section.bricks.filter((b) => b.id !== id);
                }

                // 3. delete brick and children ids in brickMap
                state.brickMap.delete(id);
                childrenIds.forEach((childId) => {
                  state.brickMap.delete(childId);
                });
              }),

            duplicateBrick: (id) =>
              set((state) => {
                const original = state.brickMap.get(id);
                if (!original) {
                  console.error("Cannot duplicate brick %s, it does not exist", id);
                  return;
                }

                // Deep clone the brick to create a new copy with new IDs
                const deepCloneBrick = (brick: Brick): Brick => {
                  const newId = `brick-${generateId()}`;
                  const newBrick: Brick = {
                    ...brick,
                    id: newId,
                    props: { ...brick.props },
                    mobileProps: brick.mobileProps ? { ...brick.mobileProps } : undefined,
                  };

                  // Handle children recursively if this is a container
                  if (brick.props.$children) {
                    const children = brick.props.$children as Brick[];
                    newBrick.props.$children = children.map((child) => deepCloneBrick(child));
                  }

                  return newBrick;
                };

                // Create a new brick with a new ID
                const newBrick = deepCloneBrick(original.brick);

                // Update the brick map with the new brick and its children
                const updateBrickMap = (brick: Brick, sectionId: string, parentId: string | null) => {
                  state.brickMap.set(brick.id, {
                    brick,
                    sectionId,
                    parentId,
                  });

                  if (brick.props.$children) {
                    const children = brick.props.$children as Brick[];
                    children.forEach((child) => updateBrickMap(child, sectionId, brick.id));
                  }
                };

                // Add the duplicated brick to the appropriate location
                const { sectionId, parentId } = original;

                if (parentId) {
                  // Brick is inside a container, add to parent's $children
                  const parentBrick = state.getBrick(parentId);
                  if (parentBrick?.props.$children) {
                    const children = parentBrick.props.$children as Brick[];
                    const originalIndex = children.findIndex((b) => b.id === id);

                    // Insert duplicated brick after the original
                    (parentBrick.props.$children as Brick[]).splice(originalIndex + 1, 0, newBrick);
                  }
                } else {
                  // Brick is at the top level of a section
                  const section = state.sections.find((s) => s.id === sectionId);
                  if (section) {
                    const originalIndex = section.bricks.findIndex((b) => b.id === id);
                    section.bricks.splice(originalIndex + 1, 0, newBrick);
                  }
                }

                // Update the brickMap with the new brick and all its children
                updateBrickMap(newBrick, sectionId, parentId);
              }),

            updateBrick: (id, brick) =>
              set((state) => {
                const original = getBrick(id, state);
                if (original) {
                  Object.assign(original, brick);
                }
              }),

            updateBrickProps: (id, props, isMobileProps) =>
              set((state) => {
                const brick = getBrick(id, state);
                if (brick) {
                  if (isMobileProps) {
                    brick.mobileProps = mergeIgnoringArrays({}, brick.mobileProps, props, {
                      lastTouched: Date.now(),
                    });
                  } else {
                    brick.props = mergeIgnoringArrays({}, brick.props, props, { lastTouched: Date.now() });
                  }
                }
              }),

            updateSectionProps: (id, props, isMobileProps) =>
              set((state) => {
                const section = state.sections.find((s) => s.id === id);
                if (section) {
                  if (isMobileProps) {
                    section.mobileProps = mergeIgnoringArrays({}, section.mobileProps, props, {
                      lastTouched: Date.now(),
                    });
                  } else {
                    // @ts-ignore
                    section.props = mergeIgnoringArrays({}, section.props, props, {
                      lastTouched: Date.now(),
                    });
                  }
                }
              }),

            /**
             * Move abrick inside its container.
             * If the brick does not belong to a container, does nothing
             */
            moveBrickWithin: (id, to) =>
              set((state) => {
                const parentBrick = state.getParentBrick(id);
                if (!parentBrick || !parentBrick.props.$children) {
                  console.error("Cannot move brick %s, it does not have a parent container", id);
                  return;
                }

                const children = parentBrick.props.$children as Brick[];
                const currentIndex = children.findIndex((b) => b.id === id);

                if (currentIndex === -1) {
                  console.error("Cannot move brick %s, it is not found in its parent's children", id);
                  return;
                }

                // Calculate the new index based on the direction
                const newIndex =
                  to === "left"
                    ? Math.max(0, currentIndex - 1)
                    : Math.min(children.length - 1, currentIndex + 1);

                // Don't do anything if we're already at the boundary
                if (newIndex === currentIndex) {
                  return;
                }

                // Remove from current position and insert at new position
                const [brickToMove] = children.splice(currentIndex, 1);
                children.splice(newIndex, 0, brickToMove);
              }),

            moveBrickToParent: (id, parentId) =>
              set((state) => {
                const brick = state.getBrick(id);
                const parent = state.getBrick(parentId);
                const brickMapping = state.brickMap.get(id);
                if (!brick || !parent || !brickMapping) {
                  console.error("Cannot move brick %s to new parent, brick or new parent is null", id);
                  return;
                }
                if (!("$children" in parent.props)) {
                  console.error("Cannot move brick %s, parent brick %s is not a container", id, parentId);
                  return;
                }
                const { sectionId, parentId: currentParentId } = brickMapping;

                // 1. Remove brick from its current parent
                if (currentParentId) {
                  // Brick is currently in a container
                  const currentParent = state.getBrick(currentParentId);
                  if (currentParent?.props.$children) {
                    // Filter out the brick from current parent's children
                    currentParent.props.$children = (currentParent.props.$children as Brick[]).filter(
                      (child) => child.id !== id,
                    );
                  }
                } else {
                  // Brick is currently at the top level of a section
                  const section = state.sections.find((s) => s.id === sectionId);
                  if (section) {
                    section.bricks = section.bricks.filter((b) => b.id !== id);
                  }
                }

                // 2. Add brick to new parent's children
                if (!parent.props.$children) {
                  parent.props.$children = [];
                }
                (parent.props.$children as Brick[]).push(brick);

                // 3. Update the brickMap reference
                const targetMapping = state.brickMap.get(parentId);
                if (targetMapping) {
                  // Update the mapping for this brick
                  state.brickMap.set(id, {
                    brick,
                    sectionId: targetMapping.sectionId,
                    parentId,
                  });

                  // Also update mappings for all children recursively
                  const updateChildMappings = (brickId: string, newSectionId: string) => {
                    const mapping = state.brickMap.get(brickId);
                    if (mapping?.brick.props?.$children) {
                      const children = mapping.brick.props.$children as Brick[];
                      children.forEach((child) => {
                        state.brickMap.set(child.id, {
                          brick: child,
                          sectionId: newSectionId,
                          parentId: brickId,
                        });
                        updateChildMappings(child.id, newSectionId);
                      });
                    }
                  };

                  updateChildMappings(id, targetMapping.sectionId);
                }
              }),

            getBrick: (id) => {
              return _get().brickMap.get(id)?.brick;
            },

            getParentBrick: (id) => {
              const map = _get().brickMap;
              const { parentId } = map.get(id) ?? {};
              if (parentId) {
                return map.get(parentId)?.brick;
              }
            },

            getPositionWithinParent: (brickId) => {
              const parent = _get().getParentBrick(brickId);
              if (parent && "$children" in parent.props) {
                return (parent.props.$children as Brick[]).findIndex((b: Brick) => b.id === brickId);
              }
            },

            canMoveToWithinParent: (brickId, to) => {
              const parent = _get().getParentBrick(brickId);
              if (parent && "$children" in parent.props) {
                const children = parent.props.$children as Brick[];
                const index = children.findIndex((b: Brick) => b.id === brickId);
                return to === "left" ? index > 0 : index < children.length - 1;
              }
              return false;
            },

            setPreviewTheme: (theme) =>
              set((state) => {
                state.previewTheme = theme;
              }),

            validatePreviewTheme: () =>
              set((state) => {
                if (state.previewTheme) {
                  state.theme = state.previewTheme;
                }
                state.previewTheme = undefined;
              }),

            cancelPreviewTheme: () =>
              set((state) => {
                state.previewTheme = undefined;
              }),

            setTheme: (theme) =>
              set((state) => {
                state.theme = theme;
              }),

            toggleBrickVisibility: (id, breakpoint) =>
              set((state) => {
                const brick = getBrick(id, state);
                if (brick) {
                  brick.props.hidden[breakpoint] = !brick.props.hidden[breakpoint];
                }
              }),

            addBrick: (brick, sectionId, parentContainerId) =>
              set((state) => {
                // Find the section to add the brick to
                const section = state.sections.find((s) => s.id === sectionId);
                if (!section) {
                  console.error("Cannot add brick, section %s does not exist", sectionId);
                  return;
                }

                // Check if this brick is being added to a container
                if (parentContainerId) {
                  const parentBrick = state.getBrick(parentContainerId);
                  if (!parentBrick) {
                    console.error("Cannot add brick, parent container %s does not exist", parentContainerId);
                    return;
                  }

                  if (!parentBrick.props.$children) {
                    parentBrick.props.$children = [];
                  }

                  // Add the brick to the parent container's children
                  (parentBrick.props.$children as Brick[]).push(brick);
                } else {
                  // Add the brick directly to the section
                  section.bricks.push(brick);
                }

                // Add the brick to the brick map
                state.brickMap.set(brick.id, {
                  brick,
                  sectionId,
                  parentId: parentContainerId,
                });

                // If this is a container brick with children, recursively add those to the brick map
                if (brick.props?.$children) {
                  const addChildrenToBrickMap = (children: Brick[], parentId: string) => {
                    children.forEach((child) => {
                      state.brickMap.set(child.id, {
                        brick: child,
                        sectionId,
                        parentId,
                      });

                      if (child.props?.$children) {
                        addChildrenToBrickMap(child.props.$children as Brick[], child.id);
                      }
                    });
                  };

                  addChildrenToBrickMap(brick.props.$children as Brick[], brick.id);
                }
              }),

            updateAttributes: (attr) =>
              set((state) => {
                state.attr = { ..._get().attr, ...attr };
              }),

            setVersion: (version) =>
              set((state) => {
                state.version = version;
              }),

            adjustMobileLayout: () =>
              set((state) => {
                // state.bricks = adjustMobileLayout(state.bricks);
              }),

            setLastSaved: (date) =>
              set((state) => {
                state.lastSaved = date;
              }),

            setDirty: (dirty) =>
              set((state) => {
                state.dirty = dirty;
              }),
          })),
          {
            name: `draft-state-${initProps.id}`,
            skipHydration: initProps.mode === "remote" || import.meta.env.DEV,
            // Add this to force storage on initialization
            onRehydrateStorage: () => (state) => {
              if (state) {
                // Rebuild the brickMap after rehydration
                state.brickMap = buildBrickMap(state.sections);
                console.log("Draft State has been rehydrated and brickMap rebuilt");
              }
            },
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(
                  ([key]) =>
                    ![
                      "previewTheme",
                      "attributes",
                      "lastSaved",
                      "pagesMap",
                      "datasources",
                      "brickMap",
                    ].includes(key),
                ),
              ),
          },
        ),
        {
          // limit undo history to 100
          limit: 100,
          equality: (pastState, currentState) => isEqual(pastState, currentState),
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(
                ([key]) =>
                  ![
                    "previewTheme",
                    "attributes",
                    "lastSaved",
                    "pagesMap",
                    "datasources",
                    "brickMap",
                  ].includes(key),
              ),
            ) as DraftState,
          // handleSet: (handleSet) =>
          //   debounce<typeof handleSet>((state) => {
          //     if (state) {
          //       handleSet(state);
          //     }
          //   }, 200),
        },
      ),
    ),
  );
};

type DraftStore = ReturnType<typeof createDraftStore>;

export const EditorStoreContext = createContext<EditorStore | null>(null);
export const DraftStoreContext = createContext<DraftStore | null>(null);

export const useEditorStoreContext = () => {
  const store = useContext(EditorStoreContext);
  if (!store) {
    console.log("Problem with EditorStoreContext", store);
  }
  invariant(store, "useEditorStoreContext must be used within a EditorStoreContext");
  return store;
};

export const useDraftStoreContext = () => {
  const store = useContext(DraftStoreContext);
  invariant(store, "useDraftStoreContext must be used within a DraftStoreContext");
  return store;
};

export const useDraftUndoManager = () => {
  const ctx = useDraftStoreContext();
  return ctx.temporal.getState();
};

export const useEditor = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx);
};

export const usePagesInfo = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.pagesMap);
};

export const usePreviewMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.previewMode);
};

export const useEditorEnabled = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => !state.disabled);
};

export const useLogoLink = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.logoLink);
};

export const useSelectedGroup = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedGroup);
};

export const useSelectedBrickId = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedBrickId);
};

export const useColorAdjustment = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.colorAdjustment);
};

export const useDebugMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => !!state.debugMode);
};

export const usePanel = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({ panel: state.panel, panelPosition: state.panelPosition }));
};

export const useEditorMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.mode);
};

export const useChatVisible = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.chatVisible);
};

export const useTours = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
    seenTours: state.seenTours,
    disabled: state.disableTours,
    markTourAsSeen: state.markTourAsSeen,
  }));
};

export const useTextEditMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.textEditMode);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};

export const useGetBrick = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.getBrick);
};

export function usePageVersion() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.version);
}

export function useEditingTextForBrickId() {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.isEditingTextForBrickId);
}

export function useLastSaved() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.lastSaved);
}

export const useSections = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.sections);
};

export const useSection = (sectionId?: string) => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => {
    const section = state.sections.find((s) => sectionId && s.id === sectionId);
    if (!section) {
      return null;
    }
    return {
      section,
      bricks: Array.from(state.brickMap).filter(([, rec]) => rec.sectionId === sectionId),
    };
  });
};

export const useAttributes = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.attr);
};

export const useAttributesSchema = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.attributes ?? state.siteAttributes);
};

export const useDatasourcesSchemas = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.datasources);
};

export const useEditorHelpers = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
    setPreviewMode: state.setPreviewMode,
    setSettingsVisible: state.setSettingsVisible,
    toggleSettings: state.toggleSettings,
    toggleTextEditMode: state.toggleTextEditMode,
    setTextEditMode: state.setTextEditMode,
    setIsEditingText: state.setIsEditingText,
    setlastTextEditPosition: state.setlastTextEditPosition,
    setPanel: state.setPanel,
    togglePanel: state.togglePanel,
    hidePanel: state.hidePanel,
    setSelectedGroup: state.setSelectedGroup,
    setSelectedBrickId: state.setSelectedBrickId,
    deselectBrick: state.deselectBrick,
    setColorAdjustment: state.setColorAdjustment,
    togglePanelPosition: state.togglePanelPosition,
    showModal: state.showModal,
    hideModal: state.hideModal,
    setCollidingBrick: state.setCollidingBrick,
    toggleEditorEnabled: state.toggleEditorEnabled,
    onShowLogin: state.onShowLogin,
    onPublish: state.onPublish,
    onSavePage: state.onSavePage,
    onSaveSite: state.onSaveSite,
    toggleChat: state.toggleChat,
  }));
};

export const useDraftHelpers = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => ({
    deleteBrick: state.deleteBrick,
    duplicateBrick: state.duplicateBrick,
    getBrick: state.getBrick,
    adjustMobileLayout: state.adjustMobileLayout,
    duplicateSection: state.duplicateSection,
    toggleBrickVisibilityPerBreakpoint: state.toggleBrickVisibility,
    getParentBrick: state.getParentBrick,
    updateBrick: state.updateBrick,
    updateBrickProps: state.updateBrickProps,
    moveBrickWithin: state.moveBrickWithin,
    getPositionWithinParent: state.getPositionWithinParent,
    canMoveToWithinParent: state.canMoveToWithinParent,
    moveBrickToParent: state.moveBrickToParent,
    deleteSection: state.deleteSection,
    moveSectionUp: state.moveSectionUp,
    moveSectionDown: state.moveSectionDown,
    reorderSections: state.reorderSections,
    updateSection: state.updateSection,
    updateSectionProps: state.updateSectionProps,
    addSection: state.addSection,
    isFirstSection: state.isFirstSection,
    isLastSection: state.isLastSection,
  }));
};

export const useDatarecordsSchemas = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.datarecords);
};

export const usePageInfo = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => ({
    id: state.id,
    path: state.path,
    label: state.label,
    siteLabel: state.siteLabel,
    siteId: state.siteId,
    hostname: state.hostname,
  }));
};

export const useTheme = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.theme);
};

export const useSectionsSubscribe = (callback: (sections: DraftState["sections"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.sections, debounce(callback, 200), { fireImmediately: false });
  }, []);
};

export const useAttributesSubscribe = (callback: (attr: DraftState["attr"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.attr, callback);
  }, []);
};

export const useThemeSubscribe = (callback: (theme: DraftState["theme"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.theme, callback);
  }, []);
};

export const usePagePathSubscribe = (callback: (path: DraftState["path"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.path, callback);
  }, []);
};

function getBrick(id: string, state: DraftState) {
  const { brick } = state.brickMap.get(id) ?? {};
  return brick;
}

function buildBrickMap(sections: Section[]): DraftState["brickMap"] {
  const brickMap: DraftState["brickMap"] = new Map();

  function collectBrick(brick: Brick, sectionId: string, parentId: string | null) {
    // Add the brick itself
    brickMap.set(brick.id, { brick, sectionId, parentId });

    // Recursively process any children in props.$children
    if (brick.props?.$children) {
      const children = brick.props.$children as Brick[];
      children.forEach((child) => collectBrick(child, sectionId, brick.id));
    }
  }

  // Process all sections and their bricks
  sections.forEach((section) => {
    section.bricks.forEach((brick) => collectBrick(brick, section.id, null));
  });

  return brickMap;
}
