import { createStore, useStore } from "zustand";
import { debounce, isEqual } from "lodash-es";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createContext, useContext, useEffect } from "react";
import { temporal } from "zundo";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import type { Brick, BrickPosition } from "@upstart.gg/sdk/shared/bricks";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import { generateId } from "@upstart.gg/sdk/shared/bricks";
import type { GenericPageConfig, GenericPageContext, SiteConfig } from "@upstart.gg/sdk/shared/page";
export { type Immer } from "immer";
import type { ColorAdjustment } from "@upstart.gg/sdk/shared/themes/color-system";
import { adjustMobileLayout } from "~/shared/utils/layout-utils";

export interface EditorStateProps {
  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
  // pageConfig: GenericPageConfig;
  previewMode: ResponsiveMode;
  textEditMode?: "default" | "large";
  lastTextEditPosition?: number;
  settingsVisible?: boolean;

  selectedGroup?: Brick["id"][];
  isEditingTextForBrickId?: string;
  shouldShowGrid?: boolean;
  panel?: "library" | "inspector" | "theme" | "settings" | "data";
  modal?: "image-search" | "datasources";
  panelPosition: "left" | "right";
  seenTours: string[];
  disableTours?: boolean;
  logoLink: string;
  /**
   * Latest used color adjustment
   */
  colorAdjustment: ColorAdjustment;
  collidingBrick?: { brick: Brick; side: "top" | "bottom" | "left" | "right" };
  onShowLogin: () => void;
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: ResponsiveMode) => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettings: () => void;
  toggleTextEditMode: () => void;
  setTextEditMode: (mode: EditorStateProps["textEditMode"]) => void;
  setIsEditingText: (forBrickId: string | false) => void;
  setlastTextEditPosition: (position?: number) => void;
  setPanel: (panel?: EditorStateProps["panel"]) => void;
  togglePanel: (panel?: EditorStateProps["panel"]) => void;
  hidePanel: (panel?: EditorStateProps["panel"]) => void;
  setSelectedGroup: (group?: Brick["id"][]) => void;
  setShouldShowGrid: (show: boolean) => void;
  setColorAdjustment: (colorAdjustment: ColorAdjustment) => void;
  togglePanelPosition: () => void;
  showModal: (modal: EditorStateProps["modal"]) => void;
  setCollidingBrick: (info: { brick: Brick; side: "top" | "bottom" | "left" | "right" } | null) => void;
  hideModal: () => void;
  onShowLogin: () => void;
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
  };

  return createStore<EditorState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,

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

            setShouldShowGrid: (show) =>
              set((state) => {
                state.shouldShowGrid = show;
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
                      "selectedBrick",
                      "selectedGroup",
                      "collidingBrick",
                      "panel",
                      "isEditingTextForBrickId",
                      "shouldShowGrid",
                      "textEditMode",
                      "onShowLogin",
                      "seenTours",
                      "disableTours",
                      "logoLink",
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
  bricks: Brick[];
  selectedBrick?: Brick;
  data: Record<string, unknown>;
  datasources?: SiteConfig["datasources"];
  datarecords?: SiteConfig["datarecords"];
  attr: GenericPageContext["attr"];
  attributes: GenericPageConfig["attributes"];
  siteAttributes: SiteConfig["attributes"];
  theme: SiteConfig["theme"];
  siteId: SiteConfig["id"];
  siteLabel: SiteConfig["label"];
  pagesMap: SiteConfig["pagesMap"];
  hostname: SiteConfig["hostname"];
  previewTheme?: Theme;
  version?: string;
  lastSaved?: Date;
  dirty?: boolean;
  lastLoaded?: Date;

  /**
   * When local, the editor does not fetch data from the server or save data to the server
   * It is used when the user is not logged in yet or does not have an account yet
   */
  mode: "local" | "remote";
}

export interface DraftState extends DraftStateProps {
  setBricks: (bricks: Brick[]) => void;
  getBrick: (id: string) => Brick | undefined;
  getParentBrick: (id: string) => Brick | undefined;
  deleteBrick: (id: string) => void;
  duplicateBrick: (id: string) => void;
  moveBrick: (id: string, to: "left" | "right") => void;
  addBrick: (brick: Brick, parentContainer?: Brick) => void;
  updateBrick: (id: string, brick: Partial<Brick>) => void;
  updateBrickProps: (id: string, props: Record<string, unknown>, isMobileProps?: boolean) => void;
  updateBrickPosition: (id: string, bp: keyof Brick["position"], position: Partial<BrickPosition>) => void;
  updateBricksPositions: (bp: keyof Brick["position"], positions: Record<string, BrickPosition>) => void;
  toggleBrickVisibilityPerBreakpoint: (id: string, breakpoint: keyof Brick["position"]) => void;
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
  setSelectedBrick: (brick?: Brick) => void;
  deselectBrick: (brickId?: Brick["id"]) => void;
}

/**
 * Create a draft store with initial props
 *
 * Note: `data` is optional but `attr` is always provided
 */
export const createDraftStore = (
  initProps: Partial<DraftStateProps> & {
    id: DraftStateProps["id"];
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
  },
) => {
  const DEFAULT_PROPS: Omit<
    DraftStateProps,
    | "attr"
    | "attributes"
    | "datasources"
    | "datarecords"
    | "siteLabel"
    | "siteAttributes"
    | "pagesMap"
    | "theme"
    | "id"
    | "path"
    | "label"
    | "hostname"
    | "siteId"
  > = {
    bricks: [],
    data: {},
    mode: "local",
  };

  return createStore<DraftState>()(
    subscribeWithSelector(
      temporal(
        persist(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,

            setLastLoaded: () =>
              set((state) => {
                state.lastLoaded = new Date();
              }),

            setBricks: (bricks) =>
              set((state) => {
                state.bricks = bricks;
              }),

            setSelectedBrick: (brick) =>
              set((state) => {
                state.selectedBrick = brick;
              }),

            deselectBrick: (brickId) =>
              set((state) => {
                if (state.selectedBrick && (!brickId || state.selectedBrick?.id === brickId)) {
                  state.selectedBrick = undefined;
                }
              }),

            deleteBrick: (id) =>
              set((state) => {
                const bricks: Brick[] = [];
                for (const brick of state.bricks) {
                  if (brick.id !== id) {
                    bricks.push({
                      ...brick,
                      ...("children" in brick.props
                        ? {
                            props: {
                              ...brick.props,
                              children: brick.props.children.filter((child: Brick) => {
                                return child.id !== id;
                              }),
                            },
                          }
                        : {}),
                    });
                  }
                }
                state.bricks = bricks;
              }),

            duplicateBrick: (id) =>
              set((state) => {
                const brick = state.bricks.find((item) => item.id === id);
                if (brick) {
                  const newBrick = {
                    ...brick,
                    id: `brick-${generateId()}`,
                    position: getDuplicatedBrickPosition(brick),
                  };
                  state.bricks.push(newBrick);
                }
              }),

            updateBrick: (id, brick) =>
              set((state) => {
                const original = getBrick(id, state.bricks);
                if (original) {
                  Object.assign(original, brick);
                }
              }),

            updateBrickProps: (id, props, isMobileProps) =>
              set((state) => {
                const brick = getBrick(id, state.bricks);
                if (brick) {
                  if (isMobileProps) {
                    brick.mobileProps = { ...brick.mobileProps, ...props, lastTouched: Date.now() };
                  } else {
                    brick.props = { ...brick.props, ...props, lastTouched: Date.now() };
                  }
                }
              }),

            /**
             * Move abrick inside its container.
             * If the brick does not belong to a container, does nothing
             */
            moveBrick: (id, to) =>
              set((state) => {
                const brick = getBrick(id, state.bricks);
                if (!brick?.parentId) {
                  console.error("Cannot move brick %s, it does not belong to a container", id);
                  return;
                }
                const parentBrick = getBrick(brick.parentId, _get().bricks);
                if (!parentBrick) {
                  console.error(
                    "Cannot move brick %s, parent brick %s not found",
                    id,
                    brick.parentId ?? "<unknown id>",
                  );
                  return;
                }
                const parentBrickIndex = state.bricks.findIndex((b) => b.id === parentBrick.id);
                if ("children" in parentBrick.props) {
                  const children = parentBrick.props.children as Brick[];
                  const index = children.findIndex((b) => b.id === id);
                  if (index === -1) {
                    console.error("Cannot move brick %s, it is not a child of its parent", id);
                    return;
                  }
                  const newIndex = to === "left" ? index - 1 : index + 1;
                  if (newIndex < 0 || newIndex >= children.length) {
                    console.error("Cannot move brick %s, it would be out of bounds", id);
                    return;
                  }
                  // clone children array
                  const newChildren = [...children];
                  // splice the array
                  newChildren.splice(index, 1);
                  newChildren.splice(newIndex, 0, brick);
                  // recreate parent brick with new children
                  const newParentBrick = {
                    ...parentBrick,
                    props: { ...parentBrick.props, children: newChildren },
                  };
                  state.bricks[parentBrickIndex] = newParentBrick;
                }
              }),

            getBrick: (id) => {
              return getBrick(id, _get().bricks);
            },

            getParentBrick: (id) => {
              const brick = getBrick(id, _get().bricks);
              if (brick?.parentId) {
                return getBrick(brick.parentId, _get().bricks);
              }
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

            updateBricksPositions: (bp, positions) =>
              set((state) => {
                state.bricks.forEach((b) => {
                  if (positions[b.id]) {
                    b.position[bp] = positions[b.id];
                  }
                });
              }),

            updateBrickPosition: (id, bp, position) =>
              set((state) => {
                const brick = getBrick(id, state.bricks);
                if (brick) {
                  Object.assign(brick.position[bp], position);
                }
              }),

            toggleBrickVisibilityPerBreakpoint: (id, breakpoint) =>
              set((state) => {
                const brick = getBrick(id, state.bricks);
                if (brick) {
                  brick.position[breakpoint] = {
                    ...brick.position[breakpoint],
                    hidden: !brick.position[breakpoint]?.hidden,
                  };
                }
              }),

            addBrick: (brick, parentContainer) =>
              set((state) => {
                if (!parentContainer) {
                  console.log("Adding brick", brick);
                  state.bricks.push(brick);
                } else {
                  console.log("Adding brick %o to container %o", brick, parentContainer);
                  const parentBrick = state.bricks.find((b) => b.id === parentContainer.id);
                  // @ts-ignore
                  parentBrick?.props.children?.push({ ...brick, parentId: parentContainer.id });
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
                state.bricks = adjustMobileLayout(state.bricks);
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
            // TODO: change when demo is done
            // skipHydration: initProps.mode === "remote",
            skipHydration: true,
            // Add this to force storage on initialization
            onRehydrateStorage: () => (state) => {
              if (state) {
                // Optional: Perform any initialization after rehydration
                console.log("Draft State has been rehydrated");
              }
            },
            partialize: (state) =>
              Object.fromEntries(
                Object.entries(state).filter(
                  ([key]) => !["previewTheme", "attributes", "lastSaved", "selectedBrick"].includes(key),
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
                ([key]) => !["previewTheme", "attributes", "lastSaved", "selectedBrick"].includes(key),
              ),
            ) as DraftState,
          handleSet: (handleSet) =>
            debounce<typeof handleSet>((state) => {
              if (state) {
                handleSet(state);
              }
            }, 200),
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
export const useLogoLink = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.logoLink);
};

export const useSelectedGroup = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedGroup);
};

export const useSelectedBrick = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.selectedBrick);
};

export const useColorAdjustment = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.colorAdjustment);
};

export const usePanel = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({ panel: state.panel, panelPosition: state.panelPosition }));
};

export const useEditorMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.mode);
};

export const useTours = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({ seenTours: state.seenTours, disabled: state.disableTours }));
};

export const useTextEditMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.textEditMode);
};

export const useDraft = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx);
};

export const useBricks = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.bricks);
};

export const useGetBrick = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.getBrick);
};

export function usePageVersion() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.version);
}

export function useLastSaved() {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => state.lastSaved);
}

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
    setShouldShowGrid: state.setShouldShowGrid,
    setColorAdjustment: state.setColorAdjustment,
    togglePanelPosition: state.togglePanelPosition,
    showModal: state.showModal,
    hideModal: state.hideModal,
    setCollidingBrick: state.setCollidingBrick,
    onShowLogin: state.onShowLogin,
  }));
};

export const useDraftHelpers = () => {
  const ctx = useDraftStoreContext();
  return useStore(ctx, (state) => ({
    setSelectedBrick: state.setSelectedBrick,
    deselectBrick: state.deselectBrick,
    deleteBrick: state.deleteBrick,
    getParentBrick: state.getParentBrick,
    updateBrickProps: state.updateBrickProps,
    moveBrick: state.moveBrick,
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

export const useBricksSubscribe = (callback: (bricks: DraftState["bricks"]) => void) => {
  const ctx = useDraftStoreContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return ctx.subscribe((state) => state.bricks, debounce(callback, 200), { fireImmediately: false });
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

/**
 * Return the original position of the duplicated brick translated to the new position (+1 row for each breakpoint)
 */
function getDuplicatedBrickPosition(brick: Brick) {
  const { mobile, desktop } = brick.position;
  return {
    mobile: { ...(mobile ?? desktop)!, y: (mobile ?? desktop)!.y + 1 },
    desktop: {
      ...(desktop ?? mobile)!,
      y: (desktop ?? mobile)!.y + 1,
      x: (desktop ?? mobile)!.x + 1,
    },
  };
}

/**
 * This helpers is meant to be used from within DraftState actions
 */
function getBrick(id: string, bricks: Brick[]) {
  let brick = bricks.find((b) => b.id === id);
  if (!brick) {
    for (const brickIter of bricks) {
      if ("children" in brickIter.props) {
        const child = brickIter.props.children.find((b: Brick) => b.id === id);
        if (child) {
          brick = child;
          break;
        }
      }
    }
  }
  return brick;
}
