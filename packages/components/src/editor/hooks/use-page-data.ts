import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { generateId, processSections } from "@upstart.gg/sdk/shared/bricks";
import type { GenerationState } from "@upstart.gg/sdk/shared/context";
import type { DatasourcesList, Datasource, Query } from "@upstart.gg/sdk/shared/datasources/types";
import type { DatarecordsList, Datarecord } from "@upstart.gg/sdk/shared/datarecords/types";
import type { GenericPageConfig, GenericPageContext } from "@upstart.gg/sdk/shared/page";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Site } from "@upstart.gg/sdk/shared/site";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";
import { enableMapSet } from "immer";
import { debounce, isEqual, merge } from "lodash-es";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import type { PageAttributes } from "@upstart.gg/sdk/shared/attributes";
export type { Immer } from "immer";

enableMapSet();

type BrickId = string;

export interface DraftStateProps {
  id: string;
  path: string;
  label: string;
  tags: string[];
  sections: Section[];
  data: Record<BrickId, Record<string, unknown>[]>;
  datasources: DatasourcesList;
  datarecords: DatarecordsList;

  queries: Query[];

  /**
   * Site attributes key/value pairs
   */
  siteAttributes: Site["attributes"];

  /**
   * Page attributes key/value pairs
   */
  pageAttributes: GenericPageContext["attributes"];

  theme: Theme;
  previewTheme?: Theme;
  themes: Theme[];
  siteId: Site["id"];
  siteLabel: Site["label"];
  sitemap: Site["sitemap"];
  sitePrompt: string;
  hostname: Site["hostname"];
  version?: string;
  lastSaved?: Date;
  dirty?: boolean;
  brickMap: Map<string, { brick: Brick; sectionId: string; parentId: string | null }>;
  // All pages in the site, used when in setup mode
  pages: GenericPageConfig[];
}

export interface DraftState extends DraftStateProps {
  getBrick: (id: string) => Brick | undefined;
  getParentBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  getPageDataForDuplication: () => Pick<
    DraftStateProps,
    "id" | "label" | "path" | "sections" | "pageAttributes" | "siteAttributes" | "datasources" | "datarecords"
  >;
  duplicateBrick: (id: string) => void;
  duplicateSection: (id: string) => void;
  moveBrick: (id: string, to: "previous" | "next") => void;
  reorderBrickWithin: (brickId: string, toIndex: number) => void;
  moveBrickToContainerBrick: (id: string, parentId: string, index: number) => void;
  moveBrickToSection: (id: string, sectionId: string | null, index?: number) => void;
  detachBrickFromContainer: (id: string) => void;
  upsertQuery: (query: Query) => void;
  addBrick: (brick: Brick, sectiondId: string, index: number, parentContainerId: Brick["id"] | null) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>, isMobileProps?: boolean) => void;
  updatePropsMapping: (id: string, mapping: Record<string, string>) => void;
  toggleBrickVisibility: (id: string, resolution: Resolution) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  pickTheme: (themeId: Theme["id"]) => void;
  setThemes: (themes: Theme[]) => void;
  validatePreviewTheme: (accept: boolean) => void;
  cancelPreviewTheme: () => void;
  updatePageAttributes: (attr: Partial<PageAttributes>) => void;
  updateSiteAttributes: (attr: Partial<Site["attributes"]>) => void;
  setLastSaved: (date: Date) => void;
  setDirty: (dirty: boolean) => void;
  setVersion(version: string): void;
  adjustMobileLayout(): void;

  addPage: (page: GenericPageConfig) => void;
  addDatasource: (datasource: Datasource) => void;
  addDatarecord: (datarecord: Datarecord) => void;

  setSitemap(sitemap: Site["sitemap"]): void;

  getPositionWithinParent: (brickId: Brick["id"]) => number | undefined;
  canMoveTo: (brickId: Brick["id"], to: "previous" | "next") => boolean;

  isFirstSection: (sectionId: string) => boolean;
  isLastSection: (sectionId: string) => boolean;

  // Section order management
  moveSectionUp: (sectionId: string) => void;
  moveSectionDown: (sectionId: string) => void;
  reorderSections: (orderedIds: string[]) => void;

  // New section methods
  createEmptySection: (id: string, afterSectionId?: string) => void;
  addSection: (section: Section) => void;
  updateSection: (id: string, sectionData: Partial<Section>) => void;
  updateSectionProps: (id: string, props: Partial<Section["props"]>, isMobileProps?: boolean) => void;
  deleteSection: (id: string) => void;
  getSection: (id: string) => Section | undefined;
  setSections: (sections: Section[]) => void;
}

export const createDraftStore = (
  initProps: Partial<DraftStateProps> & {
    id: DraftStateProps["id"];
    version: DraftStateProps["version"];
    path: DraftStateProps["path"];
    label: DraftStateProps["label"];
    pageAttributes: DraftStateProps["pageAttributes"];
    siteAttributes: DraftStateProps["siteAttributes"];
    datasources?: DraftStateProps["datasources"];
    datarecords?: DraftStateProps["datarecords"];
    siteLabel: DraftStateProps["siteLabel"];
    siteId: DraftStateProps["siteId"];
    hostname: DraftStateProps["hostname"];
    sitemap: DraftStateProps["sitemap"];
    theme: DraftStateProps["theme"];
    sections: DraftStateProps["sections"];
  },
) => {
  const DEFAULT_PROPS = {
    data: {},
    mode: "local" as const,
    brickMap: buildBrickMap(initProps.sections),
    themes: [],
    pages: [],
    datasources: [],
    datarecords: [],
    queries: [],
    tags: [],
    sitePrompt: "",
  };
  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,

          upsertQuery: (query: Query) =>
            set((state) => {
              const existingIndex = state.queries.findIndex((q) => q.id === query.id);
              if (existingIndex !== -1) {
                state.queries[existingIndex] = query;
              } else {
                state.queries.push(query);
              }
            }),

          detachBrickFromContainer: (id) =>
            set((state) => {
              const data = state.brickMap.get(id);
              invariant(data, `Cannot detach brick ${id}, it does not exist in the brickMap`);
              const { brick, sectionId, parentId } = data;
              if (!parentId) {
                console.warn("Cannot detach brick %s, it is not in a container", id);
                return;
              }
              // Remove the brick from its parent container
              const parentBrick = getBrickFromDraft(parentId, state);
              if (!parentBrick) {
                console.error("Cannot detach brick %s, its parent %s does not exist", id, parentId);
                return;
              }
              const parentSection = state.sections.find((s) => s.id === sectionId);
              if (!parentSection) {
                console.error("Cannot detach brick %s, its parent section %s does not exist", id, sectionId);
                return;
              }
              // Remove from parent brick
              parentBrick.props.$children = (parentBrick.props.$children as Brick[] | undefined)?.filter(
                (child) => child.id !== id,
              );
              // Add it directly to the section, just after the parent brick
              const index = parentSection.bricks.findIndex((b) => b.id === parentId);
              parentSection.bricks.splice(index + 1, 0, {
                ...brick,
              });

              // Rebuild the brickMap
              state.brickMap = buildBrickMap(state.sections);
            }),

          createEmptySection: (id, afterSectionId) =>
            set((state) => {
              const count = state.sections.length;
              const nextOrder =
                1 +
                (afterSectionId
                  ? (state.sections.find((s) => s.id === afterSectionId)?.order ?? count)
                  : count);
              const newSection: Section = {
                id,
                order: nextOrder,
                label: `Section ${count + 1}`,
                bricks: [],
                props: {},
              };
              // Update all section that have an order greater than or equal to nextOrder
              state.sections.forEach((s) => {
                if (s.order >= nextOrder) {
                  s.order += 1;
                }
              });
              // Add the new section to the state
              state.sections.push(newSection);
            }),

          addPage: (page) =>
            set((state) => {
              state.pages.push(page);
              //  Overwrite the default page if it exists
              if (state.id === "_default_") {
                state.id = page.id;
                state.path = page.path;
                state.label = page.label;
                state.sections = page.sections;
                if (page.attributes) {
                  state.pageAttributes = page.attributes;
                }
              }
            }),

          isFirstSection: (sectionId) => {
            const state = _get();
            return state.sections.find((s) => s.order === 0)?.id === sectionId;
          },

          setSections: (sections) =>
            set((state) => {
              state.sections = sections;
              // Rebuild the brickMap based on the new sections
              state.brickMap = buildBrickMap(sections);
            }),

          pickTheme: (themeId) =>
            set((state) => {
              const theme = state.themes.find((t) => t.id === themeId);
              if (!theme) {
                console.error("Cannot pick theme %s, it does not exist", themeId);
                return;
              }
              state.theme = theme;
            }),

          setThemes: (themes) =>
            set((state) => {
              state.themes = themes;
            }),

          setSitemap: (sitemap) =>
            set((state) => {
              state.sitemap = sitemap;
            }),

          getPageDataForDuplication: () => {
            const state = _get();
            const pageCount = state.sitemap.length + 1;
            const newPage = {
              id: `page-${generateId()}`,
              label: `${state.label} (page ${pageCount})`,
              path: `${state.path}-${pageCount}`,
              sections: state.sections,
              pageAttributes: state.pageAttributes,
              siteAttributes: state.siteAttributes,
              datasources: state.datasources,
              datarecords: state.datarecords,
            };
            return newPage;
          },

          isLastSection: (sectionId) => {
            const state = _get();
            return state.sections.find((s) => s.order === state.sections.length - 1)?.id === sectionId;
          },

          addDatasource: (datasource) =>
            set((state) => {
              const existing = state.datasources.find((ds) => ds.id === datasource.id);
              if (existing) {
                console.error("Cannot add datasource %s, it already exists", datasource.id);
                return;
              }
              state.datasources.push(datasource);
            }),

          addDatarecord: (datarecord) =>
            set((state) => {
              const existing = state.datarecords.find((dr) => dr.id === datarecord.id);
              if (existing) {
                console.error("Cannot add datarecord %s, it already exists", datarecord.id);
                return;
              }
              state.datarecords.push(datarecord);
            }),

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
              const sectionIndex = state.sections.findIndex((s) => s.id === id);
              const newSection = {
                ...section,
                id: `s_${generateId()}`,
                order: section.order + 1, // increment order to place it after the original
                label: `${section.label} (copy)`,
                // generate new bricks with new IDs
                bricks: section.bricks.map((brick) => ({
                  ...brick,
                  id: `b_${generateId()}`,
                  props: mergeIgnoringArrays({}, brick.props, {
                    $children: (brick.props.$children as Brick[] | undefined)?.map((child) => ({
                      ...child,
                      id: `b_${generateId()}`,
                    })),
                  }),
                })),
              };
              state.sections.splice(sectionIndex + 1, 0, newSection);
              state.brickMap = buildBrickMap(state.sections);
            }),

          deleteSection: (id) =>
            set((state) => {
              const section = state.sections.find((s) => s.id === id);
              if (!section) {
                console.warn("Cannot delete section %s: not found", id);
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

              // state.sections[sectionIndex] = section;
              // state.sections[previousIndex] = previous;
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
              let tmpOrder = 0;

              // Add sections in the order specified by orderedIds
              orderedIds.forEach((id) => {
                const section = state.sections.find((s) => s.id === id);
                if (section) {
                  newSections.push({ ...section, order: ++tmpOrder });
                }
              });

              // Add any sections not included in orderedIds at the end
              state.sections.forEach((section) => {
                if (!orderedIds.includes(section.id)) {
                  newSections.push({ ...section, order: ++tmpOrder });
                }
              });

              // Replace the sections array
              state.sections = newSections;

              // rebuild map
              state.brickMap = buildBrickMap(state.sections);
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
                const parentBrick = getBrickFromDraft(parentId, state);
                // const parentBrick = state.getBrick(parentId);
                if (parentBrick?.props.$children) {
                  const index = (parentBrick.props.$children as Brick[]).findIndex((b) => b.id === id);
                  // delete the brick from parent's $children
                  (parentBrick.props.$children as Brick[]).splice(index, 1);
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
                const parentBrick = getBrickFromDraft(parentId, state);
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

          updatePropsMapping: (id, mapping) =>
            set((state) => {
              // Update the brick in the brickMap
              const brick = getBrickFromDraft(id, state);
              if (brick) {
                brick.propsMapping = merge({}, brick.propsMapping, mapping);
                brick.props.lastTouched = Date.now();
                // rebuild map
                state.brickMap = buildBrickMap(state.sections);
              } else {
                console.error(
                  "Cannot update props mapping for brick %s, it does not exist in the brick map",
                  id,
                );
              }
            }),

          updateBrickProps: (id, props, isMobileProps) =>
            set((state) => {
              // Update the brick in the brickMap
              const brick = getBrickFromDraft(id, state);
              if (brick) {
                if (isMobileProps) {
                  brick.mobileProps = mergeIgnoringArrays({}, brick.mobileProps, props, {
                    lastTouched: Date.now(),
                  });
                } else {
                  brick.props = mergeIgnoringArrays({}, brick.props, props, {
                    lastTouched: Date.now(),
                  });
                }
                // rebuild map
                state.brickMap = buildBrickMap(state.sections);
              } else {
                console.error("Cannot update props for brick %s, it does not exist in the brick map", id);
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
                  section.props = mergeIgnoringArrays({}, section.props, props, {
                    lastTouched: Date.now(),
                  });
                }
              } else {
                console.warn("Cannot update section %s, it does not exist", id);
              }
            }),
          /**
           * Move a brick inside its container or its section
           * If the brick does not belong to a container, it will be moved within its section
           */
          moveBrick: (id, to) =>
            set((state) => {
              let children: Brick[] = [];
              let currentIndex = -1;

              const roParentBrick = state.getParentBrick(id);

              // If the brick has a parent, we need to find its children in the parent's $children
              if (roParentBrick) {
                const parentBrick = getBrickFromDraft(roParentBrick.id, state)!;
                children = parentBrick.props.$children as Brick[];
                currentIndex = children.findIndex((b) => b.id === id);
                // Otherwise we move the brick within its section
              } else {
                const section = getBrickSection(id, state)!;
                children = section.bricks;
                currentIndex = children.findIndex((b) => b.id === id);
              }

              // Calculate the new index based on the direction
              const newIndex =
                to === "previous"
                  ? Math.max(0, currentIndex - 1)
                  : Math.min(children.length - 1, currentIndex + 1);

              // Don't do anything if we're already at the boundary
              if (newIndex === currentIndex) {
                return;
              }

              // Remove from current position and insert at new position
              const [brickToMove] = children.splice(currentIndex, 1);
              children.splice(newIndex, 0, brickToMove);
              state.brickMap = buildBrickMap(state.sections);
            }),

          /**
           * Reorder a brick within its section using indices
           */
          reorderBrickWithin: (brickId, toIndex) =>
            set((state) => {
              const brickMapping = state.brickMap.get(brickId);
              if (!brickMapping) {
                console.error("Cannot reorder brick %s, brick mapping not found", brickId);
                return;
              }

              const { sectionId, parentId } = brickMapping;
              console.debug("Reordering brick %s in section %s, parent %s", brickId, sectionId, parentId);

              if (parentId) {
                // Brick is inside a container, reorder within parent's children
                const parentBrick = getBrickFromDraft(parentId, state);
                if (parentBrick?.props.$children) {
                  const children = parentBrick.props.$children as Brick[];
                  const originalIndex = children.findIndex((b) => b.id === brickId);
                  if (originalIndex === -1) {
                    console.error("Cannot reorder brick %s, it does not exist in parent's children", brickId);
                    return;
                  }
                  const [movedBrick] = children.splice(originalIndex, 1);
                  children.splice(toIndex, 0, movedBrick);
                } else {
                  console.error(
                    "Cannot reorder brick %s, parent brick %s has no children",
                    brickId,
                    parentId,
                  );
                }
              } else {
                // Brick is at the top level of a section
                const section = state.sections.find((s) => s.id === sectionId);
                if (section) {
                  const originalIndex = section.bricks.findIndex((b) => b.id === brickId);
                  if (originalIndex === -1) {
                    console.error(
                      "Cannot reorder brick %s, it does not exist in section %s",
                      brickId,
                      sectionId,
                    );
                    return;
                  }
                  const [movedBrick] = section.bricks.splice(originalIndex, 1);
                  section.bricks.splice(toIndex, 0, movedBrick);
                }
              }
            }),

          moveBrickToContainerBrick: (id, parentId, index) =>
            set((state) => {
              const brick = state.getBrick(id);
              const parent = getBrickFromDraft(parentId, state);
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
                const currentParent = getBrickFromDraft(currentParentId, state);
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

              // Use splice instead of push to insert at specific index
              (parent.props.$children as Brick[]).splice(index, 0, brick);

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

          moveBrickToSection: (id, sectionId, index) =>
            set((state) => {
              const brick = state.getBrick(id);
              if (!sectionId) {
                sectionId = state.brickMap.get(id)?.sectionId!;
              }
              const targetSection = state.sections.find((s) => s.id === sectionId);
              const brickMapping = state.brickMap.get(id);

              if (!brick || !targetSection || !brickMapping) {
                console.error(
                  "Cannot move brick %s to section %s, brick or section not found",
                  id,
                  sectionId,
                );
                return;
              }

              const { sectionId: currentSectionId, parentId: currentParentId } = brickMapping;

              // 1. Remove brick from its current location
              if (currentParentId) {
                // Brick is currently in a container
                const currentParent = getBrickFromDraft(currentParentId, state);
                if (currentParent?.props.$children) {
                  currentParent.props.$children = (currentParent.props.$children as Brick[]).filter(
                    (child) => child.id !== id,
                  );
                }
              } else {
                // Brick is currently at the top level of a section
                const currentSection = state.sections.find((s) => s.id === currentSectionId);
                if (currentSection) {
                  currentSection.bricks = currentSection.bricks.filter((b) => b.id !== id);
                }
              }

              // 2. Add brick to target section at specified index (or end if no index)
              if (typeof index === "number") {
                targetSection.bricks.splice(index, 0, brick);
              } else {
                targetSection.bricks.push(brick);
              }

              // 3. Update the brickMap reference
              state.brickMap.set(id, {
                brick,
                sectionId,
                parentId: null, // Top level in section
              });

              // 4. Also update mappings for all children recursively to new section
              const updateChildMappings = (
                brickId: string,
                newSectionId: string,
                newParentId: string | null,
              ) => {
                const mapping = state.brickMap.get(brickId);
                if (mapping?.brick.props?.$children) {
                  const children = mapping.brick.props.$children as Brick[];
                  children.forEach((child) => {
                    state.brickMap.set(child.id, {
                      brick: child,
                      sectionId: newSectionId,
                      parentId: brickId,
                    });
                    updateChildMappings(child.id, newSectionId, brickId);
                  });
                }
              };

              updateChildMappings(id, sectionId, null);
            }),

          /**
           * @deprecated Use getBrickFromDraft instead
           */
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

          canMoveTo: (brickId, to) => {
            const parent = _get().getParentBrick(brickId);
            if (parent && "$children" in parent.props) {
              const children = parent.props.$children as Brick[];
              const index = children.findIndex((b: Brick) => b.id === brickId);
              return to === "previous" ? index > 0 : index < children.length - 1;
            }
            const section = getBrickSection(brickId, _get())!;
            const index = section?.bricks.findIndex((b) => b.id === brickId) ?? -1;
            return to === "previous" ? index > 0 : index < section?.bricks.length - 1;
          },

          setPreviewTheme: (theme) =>
            set((state) => {
              state.previewTheme = theme;
            }),

          validatePreviewTheme: (accept) =>
            set((state) => {
              if (state.previewTheme && accept) {
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
              const brick = getBrickFromDraft(id, state);
              if (brick) {
                brick.props.hidden ??= { desktop: false, mobile: false };
                brick.props.hidden[breakpoint] = !brick.props.hidden?.[breakpoint];
              }
            }),

          addBrick: (brick, sectionId, index, parentContainerId) =>
            set((state) => {
              // Find the section to add the brick to
              const section = state.sections.find((s) => s.id === sectionId);
              if (!section) {
                console.error("Cannot add brick, section %s does not exist", sectionId);
                return;
              }

              // Check if this brick is being added to a container
              if (parentContainerId) {
                console.log("Adding brick to parent container", parentContainerId);
                const parentBrick = getBrickFromMap(parentContainerId, state);
                if (!parentBrick) {
                  console.warn("Cannot add brick, parent container %s does not exist", parentContainerId);
                  return;
                }

                // Find the section of the parent brick
                const parentSection = state.sections.find((s) => s.id === sectionId);
                if (!parentSection) {
                  console.warn("Cannot add brick, parent section %s does not exist", sectionId);
                  return;
                }
                // Find the parent brick from the section's bricks
                const parentBrickInSection = parentSection.bricks.find((b) => b.id === parentContainerId);
                if (!parentBrickInSection) {
                  console.warn(
                    "Cannot add brick, parent brick %s does not exist in section %s",
                    parentContainerId,
                    sectionId,
                  );
                  return;
                }

                if (!parentBrickInSection.props.$children) {
                  console.warn("Brick added to a container without $children, initializing it");
                  parentBrickInSection.props.$children = [];
                }

                // Add the brick to the parent container's children
                (parentBrickInSection.props.$children as Brick[]).push(brick);
              } else {
                section.bricks.splice(index, 0, brick);
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
                console.log("Adding children to brick map", brick.props.$children);
                addChildrenToBrickMap(brick.props.$children as Brick[], brick.id);
              }
            }),

          updatePageAttributes: (attr) =>
            set((state) => {
              state.pageAttributes = { ..._get().pageAttributes, ...attr };
            }),

          updateSiteAttributes: (attr) =>
            set((state) => {
              state.siteAttributes = { ..._get().siteAttributes, ...attr };
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
          // limit undo history to 100
          limit: 100,
          equality: (pastState, currentState) => isEqual(pastState, currentState),
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(([key]) => ["sections", "attr"].includes(key)),
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

export const DraftStoreContext = createContext<DraftStore | null>(null);

export const usePageContext = () => {
  const store = useContext(DraftStoreContext);
  invariant(store, "useDraftStoreContext must be used within a DraftStoreContext");
  return store;
};

export const useDraftUndoManager = () => {
  const ctx = usePageContext();
  return ctx.temporal.getState();
};

export const useSitemap = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.sitemap);
};

export const useGenerationState = () => {
  const draft = usePageContext();
  return useStore(draft, (state) => {
    const hasSitemap = state.sitemap.length > 0;
    const hasThemesGenerated = state.themes.length > 0;
    const isReady = hasSitemap && hasThemesGenerated && state.sitemap.length > 0;
    const isGenerating = new URL(window.location.href).searchParams.get("action") === "generate";
    return {
      hasSitemap,
      hasThemesGenerated,
      sitemap: state.sitemap,
      pages: state.pages,
      isReady: !isGenerating || isReady || import.meta.env.DEV,
    } satisfies GenerationState;
  });
};

export const useSiteAndPages = () => {
  const ctx = usePageContext();
  const pages = useStore(ctx, (state) => state.pages);
  const site = useSite();
  return {
    site,
    pages,
  };
};

export const useThemes = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.themes);
};

export const useDraft = () => {
  const ctx = usePageContext();
  return useStore(ctx);
};

export function useHasDynamicParent(brickId: string) {
  const ctx = usePageContext();
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  let tmp = getParentBrick(brickId);
  while (tmp) {
    if (tmp.type === "dynamic") {
      return true;
    }
    brickId = tmp.id;
    tmp = getParentBrick(brickId);
  }
  return false;
}

export function useDynamicParent(brickId: string) {
  const ctx = usePageContext();
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  let tmp = getParentBrick(brickId);
  while (tmp) {
    if (tmp.type === "dynamic") {
      return tmp;
    }
    brickId = tmp.id;
    tmp = getParentBrick(brickId);
  }
  return null;
}

/**
 * Returns the dynamic config is set on the brick itself or any of its parents.
 * This is used to determine if the brick should use dynamic configuration.
 */
export function useDynamicConfig(brickId: string) {
  const ctx = usePageContext();
  const props = useBrick(brickId)?.props;
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  let tmp = getParentBrick(brickId);
  const dynamicSettings: LoopSettings[] = props?.dynamic ? [props.dynamic as LoopSettings] : [];
  while (tmp) {
    if (tmp.props.dynamic) {
      dynamicSettings.push(tmp.props.dynamic as LoopSettings);
    }
    brickId = tmp.id;
    tmp = getParentBrick(brickId);
  }
  return dynamicSettings.length > 0 ? dynamicSettings : null;
}

export function useQueries() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.queries);
}

export function useQuery(queryId?: string) {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.queries.find((q) => q.id === queryId) ?? null);
}

export function useParentBrick(brickId: string) {
  const ctx = usePageContext();
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  return getParentBrick(brickId);
}

export function usePageVersion() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.version);
}

export function useLastSaved() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.lastSaved);
}

export const useSections = () => {
  const ctx = usePageContext();
  const sections = useStore(ctx, (state) => state.sections);
  return processSections(sections);
};

export const useSection = (sectionId?: string) => {
  const ctx = usePageContext();
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

export const useBrick = (brickId?: string) => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => {
    return brickId ? getBrickFromDraft(brickId, state) : null;
  });
};

export const useSectionByBrickId = (brickId: string) => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => getBrickSection(brickId, state));
};

export const usePageAttributes = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.pageAttributes);
};

export const useSiteAttributes = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.siteAttributes);
};

export const useData = (brickId: string, samples: Record<string, unknown>[] | undefined) => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.data[brickId] ?? samples ?? []);
};

export const usePageQueries = () => {
  const ctx = usePageContext();
  return useStore(
    ctx,
    (state) =>
      state.pageAttributes.queries?.map((pageQuery) => ({
        ...pageQuery,
        queryInfo: state.queries.find((q) => q.id === pageQuery.queryId),
      })) ?? [],
  );
};

export const useDraftHelpers = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => ({
    deleteBrick: state.deleteBrick,
    detachBrickFromContainer: state.detachBrickFromContainer,
    upsertQuery: state.upsertQuery,
    setSections: state.setSections,
    setThemes: state.setThemes,
    setTheme: state.setTheme,
    pickTheme: state.pickTheme,
    setSitemap: state.setSitemap,
    addPage: state.addPage,
    addDatasource: state.addDatasource,
    addDatarecord: state.addDatarecord,
    duplicateBrick: state.duplicateBrick,
    addBrick: state.addBrick,
    getBrick: state.getBrick,
    validatePreviewTheme: state.validatePreviewTheme,
    adjustMobileLayout: state.adjustMobileLayout,
    duplicateSection: state.duplicateSection,
    toggleBrickVisibilityPerBreakpoint: state.toggleBrickVisibility,
    getParentBrick: state.getParentBrick,
    updateBrickProps: state.updateBrickProps,
    updatePropsMapping: state.updatePropsMapping,
    moveBrick: state.moveBrick,
    reorderBrickWithin: state.reorderBrickWithin,
    getPositionWithinParent: state.getPositionWithinParent,
    canMoveTo: state.canMoveTo,
    moveBrickToContainerBrick: state.moveBrickToContainerBrick,
    moveBrickToSection: state.moveBrickToSection,
    deleteSection: state.deleteSection,
    moveSectionUp: state.moveSectionUp,
    moveSectionDown: state.moveSectionDown,
    reorderSections: state.reorderSections,
    updateSection: state.updateSection,
    updateSectionProps: state.updateSectionProps,
    addSection: state.addSection,
    createEmptySection: state.createEmptySection,
    isFirstSection: state.isFirstSection,
    isLastSection: state.isLastSection,
  }));
};

export const usePageInfo = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => ({
    id: state.id,
    path: state.path,
    label: state.label,
    siteLabel: state.siteLabel,
    siteId: state.siteId,
    hostname: state.hostname,
  }));
};

export const useSite = () => {
  const draft = usePageContext();
  const draftData = useStore(draft, (state) => ({
    id: state.siteId,
    label: state.label,
    sitemap: state.sitemap,
    queries: state.queries,
    theme: state.theme,
    themes: state.themes,
    attributes: state.siteAttributes,
    hostname: state.hostname,
    datasources: state.datasources,
    datarecords: state.datarecords,
    sitePrompt: state.sitePrompt,
  }));
  return draftData;
};

export const useTheme = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.theme);
};

export const useSectionsSubscribe = (callback: (sections: DraftState["sections"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state?.sections ?? [], debounce(callback, 200), {
      fireImmediately: false,
    });
  }, []);
};

export const usePageAttributesSubscribe = (callback: (attr: DraftState["pageAttributes"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.pageAttributes, callback, {
      equalityFn: isEqual,
    });
  }, []);
};

export const useSiteAttributesSubscribe = (callback: (attr: DraftState["siteAttributes"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.siteAttributes, callback, {
      equalityFn: isEqual,
    });
  }, []);
};

export const useThemeSubscribe = (callback: (theme: DraftState["theme"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.theme, callback);
  }, []);
};

export const usePagePathParams = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => {
    const path = state.pageAttributes.path;
    // Extract placeholders like ":slug" from the path
    const regex = /:([a-zA-Z0-9_]+)/g;
    const matches = Array.from(path.matchAll(regex));
    return matches.map((match) => match[0]);
  });
};

export const usePagePathSubscribe = (callback: (path: DraftState["path"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.path, callback);
  }, []);
};

function getBrickFromMap(id: string, state: DraftState) {
  const { brick } = state.brickMap.get(id) ?? {};
  return brick;
}

function getBrickSection(brickId: string, state: DraftState) {
  const mapping = state.brickMap.get(brickId);
  if (mapping) {
    return state.sections.find((s) => s.id === mapping.sectionId);
  }
}

function getBrickFromDraft(id: string, state: DraftState) {
  // Find the brick in the sections
  for (const section of state.sections) {
    const brick = section.bricks.find((b) => b.id === id);
    if (brick) {
      return brick;
    }
    // Check children recursively
    const findInChildren = (children: Brick[]): Brick | undefined => {
      for (const child of children) {
        if (child.id === id) {
          return child;
        }
        if (child.props?.$children) {
          const found = findInChildren(child.props.$children as Brick[]);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    };
    const foundInChildren = findInChildren(section.bricks);
    if (foundInChildren) {
      return foundInChildren;
    }
  }
  return null;
}

export const useSitePrompt = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.sitePrompt);
};

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
