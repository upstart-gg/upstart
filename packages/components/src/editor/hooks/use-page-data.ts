import type { PageAttributes, SiteAttributes } from "@upstart.gg/sdk/shared/attributes";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { generateId, processSections } from "@upstart.gg/sdk/shared/bricks";
import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import type { GenerationState } from "@upstart.gg/sdk/shared/context";
import type { Datarecord } from "@upstart.gg/sdk/shared/datarecords/types";
import type { Datasource, Query } from "@upstart.gg/sdk/shared/datasources/types";
import type { ImageSearchResultsType } from "@upstart.gg/sdk/shared/images";
import type { VersionedPage } from "@upstart.gg/sdk/shared/page";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Site } from "@upstart.gg/sdk/shared/site";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";
import { enableMapSet } from "immer";
import debounce from "lodash-es/debounce";
import isEqual from "lodash-es/isEqual";
import merge from "lodash-es/merge";
import unset from "lodash-es/unset";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export type { Immer } from "immer";

enableMapSet();

type QueryAlias = string;

export interface DraftStateProps {
  /**
   * Page ID being edited
   */
  data: Record<QueryAlias, Record<string, unknown>[]>;

  site: Site;
  page: VersionedPage;

  previewTheme?: Theme;
  /**
   * Last saved date
   */
  lastSaved?: Date;

  /**
   * True if the draft has unsaved changes
   */
  dirty?: boolean;

  /**
   * Map of brick IDs to their metadata - temporary structure to facilitate dealing with the nested structure
   */
  brickMap: Map<string, { brick: Brick; sectionId: string; parentId: string | null }>;

  additionalAssets: ImageSearchResultsType;
}

export interface DraftState extends DraftStateProps {
  getBrick: (id: string) => Brick | undefined;
  getParentBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  getPageDataForDuplication: () => VersionedPage;
  duplicateBrick: (id: string) => void;
  duplicateSection: (id: string) => void;
  moveBrick: (id: string, to: "previous" | "next") => void;
  reorderBrickWithin: (brickId: string, toIndex: number) => void;
  moveBrickToContainerBrick: (id: string, parentId: string, index: number) => void;
  moveBrickToSection: (id: string, sectionId: string | null, index?: number) => void;
  detachBrickFromContainer: (id: string) => void;
  upsertQuery: (query: Query) => void;
  addBrick: (brick: Brick, sectiondId: string, index: number, parentContainerId?: Brick["id"] | null) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>, isMobileProps?: boolean) => void;
  toggleBrickVisibility: (id: string, resolution: Resolution) => void;
  setPreviewTheme: (theme: Theme) => void;
  setTheme: (theme: Theme) => void;
  pickTheme: (themeId: Theme["id"]) => void;
  addThemes: (themes: Theme[]) => void;
  validatePreviewTheme: (accept: boolean) => void;
  cancelPreviewTheme: () => void;
  updatePageAttributes: (attr: Partial<PageAttributes>) => void;
  updatePage: (pageData: Partial<VersionedPage>) => void;
  deletePageAttribute: (key: string) => void;
  updateSiteAttributes: (attr: Partial<SiteAttributes>) => void;
  deleteSiteAttribute: (key: string) => void;
  setLastSaved: (date: Date) => void;
  setVersion(version: string): void;

  addPage: (page: VersionedPage) => void;
  addDatasource: (datasource: Datasource) => void;
  addDatarecord: (datarecord: Datarecord) => void;
  addAdditionalAssets: (assets: ImageSearchResultsType) => void;

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
  updateSection: (id: string, sectionData: Partial<Section>, override?: boolean) => void;
  updateSectionProps: (id: string, props: Partial<Section["props"]>, isMobileProps?: boolean) => void;
  deleteSection: (id: string) => void;
  getSection: (id: string) => Section | undefined;
  setSections: (sections: Section[]) => void;

  setSitePrompt: (prompt: string) => void;
  setSiteLabel: (label: string) => void;
}

export const createDraftStore = (
  initProps: Partial<DraftStateProps> & {
    page: VersionedPage;
    site: DraftStateProps["site"];
  },
) => {
  const DEFAULT_PROPS = {
    data: {},
    additionalAssets: [],
    brickMap: buildBrickMap(initProps.page.sections ?? []),
  } satisfies Partial<DraftStateProps>;
  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,

          setSiteLabel: (label: string) =>
            set((state) => {
              state.site.label = label;
            }),

          addAdditionalAssets: (assets) =>
            set((state) => {
              state.additionalAssets.push(...assets);
            }),

          updatePage: (pageData) =>
            set((state) => {
              const editedPage = merge({}, { ...state.page, ...pageData });
              state.page = editedPage;
              state.site.sitemap = state.site.sitemap.map((p) =>
                p.id === editedPage.id
                  ? {
                      id: editedPage.id,
                      label: editedPage.label,
                      path: editedPage.attributes.path,
                      tags: editedPage.attributes.tags,
                    }
                  : p,
              );
              state.brickMap = buildBrickMap(state.page.sections);
            }),

          setSitePrompt: (prompt) =>
            set((state) => {
              state.site.sitePrompt = prompt;
            }),

          upsertQuery: (query: Query) =>
            set((state) => {
              const existingIndex = state.site.attributes.queries?.findIndex((q) => q.id === query.id) ?? -1;
              if (existingIndex !== -1) {
                state.site.attributes.queries![existingIndex] = query;
              } else {
                state.site.attributes.queries ??= [];
                state.site.attributes.queries.push(query);
              }
            }),

          detachBrickFromContainer: (id) =>
            set((state) => {
              const data = state.brickMap.get(id);
              invariant(data, `Cannot detach brick ${id}, it does not exist in the brickMap`);
              const { sectionId, parentId } = data;
              const brick = getBrickFromDraft(id, state);
              if (!brick) {
                console.error("Cannot detach brick %s, it does not exist", id);
                return;
              }
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
              const parentSection = state.page.sections.find((s) => s.id === sectionId);
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
              parentSection.bricks.splice(index + 1, 0, { ...brick });

              // Rebuild the brickMap
              state.brickMap = buildBrickMap(state.page.sections);
            }),

          createEmptySection: (id, afterSectionId) =>
            set((state) => {
              const count = state.page.sections.length;
              const nextOrder =
                1 +
                (afterSectionId
                  ? (state.page.sections.find((s) => s.id === afterSectionId)?.order ?? count)
                  : count);
              const newSection: Section = {
                id,
                order: nextOrder,
                label: `Section ${count + 1}`,
                bricks: [],
                props: {
                  direction: "flex-row",
                },
              };
              // Update all section that have an order greater than or equal to nextOrder
              state.page.sections.forEach((s) => {
                if (s.order >= nextOrder) {
                  s.order += 1;
                }
              });
              // Add the new section to the state
              state.page.sections.push(newSection);
            }),

          addPage: (page) =>
            set((state) => {
              // Add to sitemap if not already present
              const existing = state.site.sitemap.find((p) => p.id === page.id);
              if (!existing) {
                state.site.sitemap.push({ ...page, path: page.attributes.path, tags: page.attributes.tags });
              }

              // Delayed update to allow creating the page via the API
              setTimeout(() => {
                //  Overwrite the default page if it exists
                state.page = page;
                state.brickMap = buildBrickMap(state.page.sections);
              }, 300);
            }),

          isFirstSection: (sectionId) => {
            const state = _get();
            return state.page.sections.find((s) => s.order === 0)?.id === sectionId;
          },

          setSections: (sections) =>
            set((state) => {
              state.page.sections = sections;
              // Rebuild the brickMap based on the new sections
              state.brickMap = buildBrickMap(sections);
            }),

          pickTheme: (themeId) =>
            set((state) => {
              const theme = state.site.themes.find((t) => t.id === themeId);
              if (!theme) {
                console.error("Cannot pick theme %s, it does not exist", themeId);
                return;
              }
              state.site.theme = theme;
            }),

          addThemes: (themes) =>
            set((state) => {
              const hasAlreadyThemes = state.site.themes.length > 0;
              for (const theme of themes) {
                const existing = state.site.themes.find((t) => t.id === theme.id);
                if (existing) {
                  console.error("Cannot add theme %s, it already exists", theme.id);
                  continue;
                }
                state.site.themes.push(theme);
              }
              // Set default theme if it is the first time setting themes
              if (!hasAlreadyThemes) {
                state.site.theme = themes[0];
              }
            }),

          setSitemap: (sitemap) =>
            set((state) => {
              state.site.sitemap = sitemap;
            }),

          getPageDataForDuplication: () => {
            const state = _get();
            const pageCount = state.site.sitemap.length + 1;
            const newPage = {
              ...state.page,
              id: `page-${generateId()}`,
              label: `${state.page.label} (page ${pageCount})`,
              attributes: {
                ...state.page.attributes,
                path: `${state.page.attributes.path}-${pageCount}`,
              },
            } satisfies VersionedPage;
            return newPage;
          },

          isLastSection: (sectionId) => {
            const state = _get();
            return (
              state.page.sections.find((s) => s.order === state.page.sections.length - 1)?.id === sectionId
            );
          },

          addDatasource: (datasource) =>
            set((state) => {
              const existing = state.site.datasources.find((ds) => ds.id === datasource.id);
              if (existing) {
                console.error("Cannot add datasource %s, it already exists", datasource.id);
                return;
              }
              state.site.datasources.push(datasource);
            }),

          addDatarecord: (datarecord) =>
            set((state) => {
              const existing = state.site.datarecords.find((dr) => dr.id === datarecord.id);
              if (existing) {
                console.error("Cannot add datarecord %s, it already exists", datarecord.id);
                return;
              }
              state.site.datarecords.push(datarecord);
            }),

          addSection: (section) =>
            set((state) => {
              state.page.sections.push(section);
              state.brickMap = buildBrickMap(state.page.sections);
            }),

          updateSection: (id, sectionData, override = false) =>
            set((state) => {
              const sectionIndex = state.page.sections.findIndex((s) => s.id === id);
              if (sectionIndex !== -1) {
                if (override) {
                  state.page.sections[sectionIndex] = sectionData as Section;
                } else {
                  state.page.sections[sectionIndex] = merge({
                    ...state.page.sections[sectionIndex],
                    ...sectionData,
                  });
                }
                state.brickMap = buildBrickMap(state.page.sections);
              } else {
                console.warn("Cannot update section %s: not found", id);
              }
            }),

          duplicateSection: (id) =>
            set((state) => {
              const section = state.page.sections.find((s) => s.id === id);
              if (!section) {
                console.error("Cannot duplicate section %s, it does not exist", id);
                return;
              }
              const sectionIndex = state.page.sections.findIndex((s) => s.id === id);
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
              state.page.sections.splice(sectionIndex + 1, 0, newSection);
              state.brickMap = buildBrickMap(state.page.sections);
            }),

          deleteSection: (id) =>
            set((state) => {
              const section = state.page.sections.find((s) => s.id === id);
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
              state.page.sections = state.page.sections.filter((s) => s.id !== id);
            }),

          getSection: (id) => {
            return _get().page.sections.find((s) => s.id === id);
          },

          moveSectionUp: (sectionId) =>
            set((state) => {
              // current
              const section = state.page.sections.find((s) => s.id === sectionId);
              const sectionIndex = state.page.sections.findIndex((s) => s.id === sectionId);
              invariant(section, "Section not found");
              // previous
              const previous = state.page.sections.find((s) => s.order === section.order - 1);
              const previousIndex = state.page.sections.findIndex((s) => s.order === section.order - 1);
              invariant(previous, "Previous section not found");
              // swap
              const temp = section.order;
              section.order = previous.order;
              previous.order = temp;

              state.brickMap = buildBrickMap(state.page.sections);
            }),

          moveSectionDown: (sectionId) =>
            set((state) => {
              // current
              const section = state.page.sections.find((s) => s.id === sectionId);
              const sectionIndex = state.page.sections.findIndex((s) => s.id === sectionId);
              invariant(section, "Section not found");

              // next
              const next = state.page.sections
                .filter((s) => s.order > section.order)
                .toSorted((a, b) => a.order - b.order)
                .at(0);
              invariant(next, `Next section not found. No section with order > ${section.order} exists.`);
              const nextIndex = state.page.sections.findIndex((s) => s.id === next?.id);

              // swap
              const currentOrder = section.order;
              const nextOrder = next.order;

              state.page.sections[sectionIndex].order = nextOrder;
              state.page.sections[nextIndex].order = currentOrder;

              state.brickMap = buildBrickMap(state.page.sections);
            }),

          reorderSections: (orderedIds) =>
            set((state) => {
              // Create a new array of sections in the specified order
              const newSections: Section[] = [];
              let tmpOrder = 0;

              // Add sections in the order specified by orderedIds
              orderedIds.forEach((id) => {
                const section = state.page.sections.find((s) => s.id === id);
                if (section) {
                  newSections.push({ ...section, order: ++tmpOrder });
                }
              });

              // Add any sections not included in orderedIds at the end
              state.page.sections.forEach((section) => {
                if (!orderedIds.includes(section.id)) {
                  newSections.push({ ...section, order: ++tmpOrder });
                }
              });

              // Replace the sections array
              state.page.sections = newSections;

              // rebuild map
              state.brickMap = buildBrickMap(state.page.sections);
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
              const section = state.page.sections.find((s) => s.id === sectionId);

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

              // 3. rebuild the brickMap without the deleted brick and its children
              state.brickMap = buildBrickMap(state.page.sections);
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
              // const updateBrickMap = (brick: Brick, sectionId: string, parentId: string | null) => {
              //   state.brickMap.set(brick.id, {
              //     brick,
              //     sectionId,
              //     parentId,
              //   });

              //   if (brick.props.$children) {
              //     const children = brick.props.$children as Brick[];
              //     children.forEach((child) => updateBrickMap(child, sectionId, brick.id));
              //   }
              // };

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
                const section = state.page.sections.find((s) => s.id === sectionId);
                if (section) {
                  const originalIndex = section.bricks.findIndex((b) => b.id === id);
                  section.bricks.splice(originalIndex + 1, 0, newBrick);
                }
              }

              // Update the brickMap with the new brick and all its children
              state.brickMap = buildBrickMap(state.page.sections);
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
                state.brickMap = buildBrickMap(state.page.sections);
              } else {
                console.error("Cannot update props for brick %s, it does not exist in the brick map", id);
              }
            }),

          updateSectionProps: (id, props, isMobileProps) =>
            set((state) => {
              const section = state.page.sections.find((s) => s.id === id);
              if (section) {
                if (isMobileProps) {
                  section.mobileProps = mergeIgnoringArrays({}, section.mobileProps, props, {
                    lastTouched: Date.now(),
                  });
                } else {
                  section.props = mergeIgnoringArrays({}, section.props, props, {
                    lastTouched: Date.now(),
                  }) as Section["props"];
                }
                state.brickMap = buildBrickMap(state.page.sections);
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
              state.brickMap = buildBrickMap(state.page.sections);
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
                    console.log({ sectionId, parentId });
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
                const section = state.page.sections.find((s) => s.id === sectionId);
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

              state.brickMap = buildBrickMap(state.page.sections);
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
                const section = state.page.sections.find((s) => s.id === sectionId);
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
              state.brickMap = buildBrickMap(state.page.sections);
            }),

          /**
           * @todo check bricksmap update
           */
          moveBrickToSection: (id, sectionId, index) =>
            set((state) => {
              const brick = state.getBrick(id);
              if (!sectionId) {
                sectionId = state.brickMap.get(id)?.sectionId!;
              }
              const targetSection = state.page.sections.find((s) => s.id === sectionId);
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
                const currentSection = state.page.sections.find((s) => s.id === currentSectionId);
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
                state.site.theme = state.previewTheme;
              }
              state.previewTheme = undefined;
            }),

          cancelPreviewTheme: () =>
            set((state) => {
              state.previewTheme = undefined;
            }),

          setTheme: (theme) =>
            set((state) => {
              state.site.theme = theme;
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
              const section = state.page.sections.find((s) => s.id === sectionId);
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
                const parentSection = state.page.sections.find((s) => s.id === sectionId);
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
                parentId: parentContainerId ?? null,
              });

              // If this is a container brick with children, recursively add those to the brick map
              if (Array.isArray(brick.props?.$children)) {
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
              state.page.attributes = merge({}, _get().page.attributes, attr);
            }),

          deletePageAttribute: (key) =>
            set((state) => {
              unset(state.page.attributes, key);
            }),

          updateSiteAttributes: (attr) =>
            set((state) => {
              state.site.attributes = merge({}, _get().site.attributes, attr);
            }),

          deleteSiteAttribute: (key) =>
            set((state) => {
              unset(state.site.attributes, key);
            }),

          setVersion: (version) =>
            set((state) => {
              state.page.version = version;
            }),

          setLastSaved: (date) =>
            set((state) => {
              state.lastSaved = date;
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
  return useStore(ctx, (state) => state.site.sitemap);
};

export const useGenerationState = () => {
  const draft = usePageContext();
  return useStore(draft, (state) => {
    const hasSitemap = state.site.sitemap.length > 0;
    const hasThemesGenerated = state.site.themes.length > 0;
    const hasPages = state.page.id !== "_default_";
    const isReady = hasSitemap && hasThemesGenerated && hasPages && state.page.sections.length > 0;
    const isSetup = globalThis.window
      ? new URL(globalThis.window.location.href).searchParams.get("action") === "setup"
      : false;
    return {
      hasSitemap,
      hasThemesGenerated,
      isSetup,
      isReady: !isSetup || isReady,
    } satisfies GenerationState;
  });
};

export const useThemes = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.site.themes);
};

export const useDraft = () => {
  const ctx = usePageContext();
  return useStore(ctx);
};

export function useSiteQueries() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.site.attributes.queries ?? []);
}

export function useSiteQuery(queryId?: string) {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.site.attributes.queries?.find((q) => q.id === queryId) ?? null);
}

export function useParentBrick(brickId: string) {
  const ctx = usePageContext();
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  return getParentBrick(brickId);
}

export function usePageVersion() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.page.version);
}

export function useLastSaved() {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.lastSaved);
}

export const useSections = () => {
  const ctx = usePageContext();
  const sections = useStore(ctx, (state) => state.page.sections ?? []);
  const siteAttributes = useSiteAttributes();
  const pageAttributes = usePageAttributes();
  return processSections(sections, siteAttributes, pageAttributes);
};

export const useSection = (sectionId?: string) => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => {
    const section = state.page.sections.find((s) => sectionId && s.id === sectionId);
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
  return useStore(ctx, (state) => state.page.attributes);
};

export const useSiteAttributes = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.site.attributes);
};

/**
 * return all available data
 */
export const useData = (editable?: boolean) => {
  const ctx = usePageContext();
  const pageQueries = usePageQueries();
  return useStore(ctx, (state) => {
    if (!editable) {
      console.log("useData: returning production data");
      return state.data;
    }

    // Reduce page queries to build an abject that is a Record<alias, examples>
    const data: Record<string, Record<string, unknown>[]> = {};
    for (const query of pageQueries) {
      const examples = query.datasource.schema.items.examples;
      if (examples) {
        data[query.alias] = examples;
      }
    }
    return data;
  });
};

export const useLoopedQuery = (loopAlias?: string) => {
  const pageQueries = usePageQueries();
  return pageQueries.find((q) => q.alias === loopAlias) ?? null;
};

/**
 * If the brick is looping or one of its parent is looping, this hook will return the query alias used to loop on.
 * Otherwise, it will return null.
 */
export function useLoopAlias(brickId: string) {
  const ctx = usePageContext();
  const getParentBrick = useStore(ctx, (state) => state.getParentBrick);
  let currentBrickId: string | undefined = brickId;
  while (currentBrickId) {
    const brick = getBrickFromDraft(currentBrickId, ctx.getState());
    const loop = brick?.props.loop as LoopSettings | undefined;
    if (loop?.over) {
      return loop.over;
    }
    currentBrickId = getParentBrick(currentBrickId)?.id;
  }
  return null;
}

export const usePageQueries = () => {
  const ctx = usePageContext();
  return useStore(
    ctx,
    (state) =>
      state.page.attributes.queries
        ?.map((pageQuery) => {
          const queryInfo = state.site.attributes.queries?.find((q) => q.id === pageQuery.queryId);
          if (!queryInfo) {
            console.log(`WARN: Query with id ${pageQuery.queryId} not found in the store`);
            return null;
          }
          // get datasource
          const datasource = state.site.datasources.find((ds) => ds.id === queryInfo.datasourceId);
          if (!datasource) {
            console.warn(
              `Datasource with id ${queryInfo.datasourceId} not found for query ${pageQuery.queryId}`,
            );
            return null;
          }
          return {
            ...pageQuery,
            queryInfo,
            datasource,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null) ?? [],
  );
};

export const useDraftHelpers = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => ({
    addAdditionalAssets: state.addAdditionalAssets,
    deleteBrick: state.deleteBrick,
    detachBrickFromContainer: state.detachBrickFromContainer,
    updateSiteAttributes: state.updateSiteAttributes,
    updatePageAttributes: state.updatePageAttributes,
    updatePage: state.updatePage,
    upsertQuery: state.upsertQuery,
    setSections: state.setSections,
    addThemes: state.addThemes,
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
    duplicateSection: state.duplicateSection,
    toggleBrickVisibilityPerBreakpoint: state.toggleBrickVisibility,
    getParentBrick: state.getParentBrick,
    updateBrickProps: state.updateBrickProps,
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
    setSitePrompt: state.setSitePrompt,
    setSiteLabel: state.setSiteLabel,
  }));
};

export const usePage = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.page);
};

export const useSite = () => {
  const draft = usePageContext();
  const draftData = useStore(draft, (state) => state.site);
  return draftData;
};

export const useTheme = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.site.theme);
};

export const usePreviewTheme = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.previewTheme);
};

export const useSectionsSubscribe = (callback: (sections: DraftState["page"]["sections"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state?.page.sections ?? [], debounce(callback, 200), {
      fireImmediately: false,
    });
  }, []);
};

export const usePageLabelSubscribe = (callback: (label: DraftState["page"]["label"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.page.label, callback);
  }, []);
};

export const useSiteLabelSubscribe = (callback: (label: DraftState["site"]["label"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.label, callback);
  }, []);
};

export function useDatasourcesSubscribe(callback: (datasources: DraftState["site"]["datasources"]) => void) {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.datasources, callback, {
      equalityFn: isEqual,
    });
  }, []);
}

export function useDatarecordsSubscribe(callback: (datarecords: DraftState["site"]["datarecords"]) => void) {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.datarecords, callback, {
      equalityFn: isEqual,
    });
  }, []);
}

export const usePageAttributesSubscribe = (callback: (attr: DraftState["page"]["attributes"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.page.attributes, callback, {
      equalityFn: isEqual,
    });
  }, []);
};

export const useSiteAttributesSubscribe = (callback: (attr: DraftState["site"]["attributes"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.attributes, callback, {
      equalityFn: isEqual,
    });
  }, []);
};

export const useThemeSubscribe = (callback: (theme: DraftState["site"]["theme"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.theme, callback);
  }, []);
};

export const useThemesSubscribe = (callback: (themes: DraftState["site"]["themes"]) => void) => {
  const ctx = usePageContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.site.themes, callback);
  }, []);
};

export const usePagePathParams = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => {
    const path = state.page.attributes.path;
    // Extract placeholders like ":slug" from the path
    const regex = /:([a-zA-Z0-9_]+)/g;
    const matches = Array.from(path.matchAll(regex));
    return matches.map((match) => match[0]);
  });
};

export const useAdditionalAssets = () => {
  const ctx = usePageContext();
  return useStore(ctx, (state) => state.additionalAssets);
};

function getBrickFromMap(id: string, state: DraftState) {
  const { brick } = state.brickMap.get(id) ?? {};
  return brick;
}

function getBrickSection(brickId: string, state: DraftState) {
  const mapping = state.brickMap.get(brickId);
  if (mapping) {
    return state.page.sections.find((s) => s.id === mapping.sectionId);
  }
}

function getBrickFromDraft(id: string, state: DraftState): Brick | null {
  // Find the brick in the sections
  for (const section of state.page.sections) {
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
  return useStore(ctx, (state) => state.site.sitePrompt);
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
    (section.bricks as Brick[]).forEach((brick) => collectBrick(brick, section.id, null));
  });

  return brickMap;
}
