import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Site, SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { enableMapSet } from "immer";
import { isEqual, isNil } from "lodash-es";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type DraftState, usePageContext } from "./use-page-data";
import type { Page } from "@upstart.gg/sdk/shared/page";
import type { UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";
export type { Immer } from "immer";

enableMapSet();

export type PagePublishPayload =
  | {
      siteId: string;
      mode: "publish-page";
      pageId: string;
      pageVersionId: string;
      schedulePublishedAt?: string | null;
    }
  | { siteId: string; mode: "publish-site" };

export type PageSavePayload = {
  siteId: string;
  pageId: string;
  pageVersionId: string;
  data: Partial<Page>;
};

export type SiteSavePayload = {
  siteId: string;
  data: Partial<Site>;
};

export interface EditorStateProps {
  chatSession: {
    id: string;
    messages: UpstartUIMessage[];
  };
  /**
   * When debugMode is enabled, context menu are disabled so that inspecting using devtools is easier
   */
  debugMode?: boolean;
  /**
   * When true, disable the editor and renders the page as it would be rendered in production using non-editable components
   */
  disabled?: boolean;
  zoom: number;

  /**
   * 0 = free
   * 1 = essentials
   * 2 = pro
   * ...
   */
  planIndex: number;

  previewMode: Resolution;
  gridConfig?: {
    colWidth: number;
    rowHeight: number;
  };
  settingsVisible?: boolean;

  selectedBrickId?: Brick["id"];
  selectedGroup?: Brick["id"][];
  selectedSectionId?: string;

  attributesTab?: "site" | "page";
  attributesGroup?: string;

  resizing?: boolean;

  isEditingTextForBrickId?: string;
  panel?: "library" | "inspector" | "theme" | "settings";
  modal?: "image-search" | "datasources" | "queries";
  panelPosition: "left" | "right";
  chatVisible: boolean;
  logoLink: string;
  themesLibrary: Theme[];
  contextMenuVisible: boolean;
  draggingBrickType?: Brick["type"];
  isMouseOverPanel?: boolean;

  onShowPopup?: (id: string | false) => void;
  onPublish: (data: PagePublishPayload) => void;
  /**
   * Returns the updated version id
   */
  onSavePage?: (page: PageSavePayload) => Promise<{
    pageVersionId: string;
  }>;
  onSaveSite?: (site: SiteSavePayload) => Promise<void>;
  onDraftChange?: (draft: DraftState, siteAndPages: SiteAndPagesConfig) => Promise<void>;
}

export interface EditorState extends EditorStateProps {
  setPreviewMode: (mode: Resolution) => void;
  setSettingsVisible: (visible: boolean) => void;
  toggleSettings: () => void;
  setContextMenuVisible: (open: boolean) => void;
  toggleEditorEnabled: () => void;
  setGridConfig: (config: EditorStateProps["gridConfig"]) => void;
  setIsEditingText: (forBrickId: string | false) => void;
  setIsResizing: (resizing: boolean) => void;
  setPanel: (panel?: EditorStateProps["panel"]) => void;
  togglePanel: (panel?: EditorStateProps["panel"]) => void;
  hidePanel: (panel?: EditorStateProps["panel"]) => void;
  setSelectedGroup: (group?: Brick["id"][]) => void;
  setSelectedBrickId: (brickId?: Brick["id"]) => void;
  setSelectedSectionId: (sectionId?: string) => void;
  deselectBrick: (brickId?: Brick["id"]) => void;
  togglePanelPosition: () => void;
  toggleDebugMode: () => void;
  showModal: (modal: EditorStateProps["modal"]) => void;
  toggleModal: (modal: EditorStateProps["modal"]) => void;
  hideModal: () => void;
  toggleChat: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setDraggingBrickType: (type: Brick["type"] | null) => void;
  setMouseOverPanel: (over: boolean) => void;
  updateHistory(): void;
  setAttributesTab: (tab: "site" | "page") => void;
  setAttributesGroup: (group: string | undefined) => void;
}

export const createEditorStore = (
  initProps: Partial<EditorStateProps> & { chatSession: EditorStateProps["chatSession"] },
) => {
  const DEFAULT_PROPS = {
    previewMode: "desktop" satisfies EditorStateProps["previewMode"],
    themesLibrary: [] as Theme[],
    panelPosition: "left" satisfies EditorStateProps["panelPosition"],
    logoLink: "/dashboard",
    zoom: 1,
    chatVisible: true,
    contextMenuVisible: false,
    planIndex: 0,
    attributesTab: "page" as EditorStateProps["attributesTab"],
    onPublish: () => {
      console.warn("onPublish is not implemented");
    },
    onDraftChange: async () => {
      console.warn("onDraftChange is not implemented");
    },
    debugMode: false,
  } as const;

  return createStore<EditorState>()(
    subscribeWithSelector(
      temporal(
        immer((set, _get) => ({
          ...DEFAULT_PROPS,
          ...initProps,
          updateHistory: () => {
            setTimeout(() => {
              const currentState = _get();
              const state = {
                panel: currentState.panel,
                selectedBrickId: currentState.selectedBrickId,
                selectedSectionId: currentState.selectedBrickId ? undefined : currentState.selectedSectionId,
                panelPosition: currentState.panelPosition,
                attributesTab: currentState.attributesTab,
                modal: currentState.modal,
                debug: import.meta.env.DEV ? currentState.debugMode : undefined,
              };
              const newUrl = new URL(window.location.href);
              Object.entries(state).forEach(([key, value]) => {
                if (!isNil(value) && value.toString().trim() !== "") {
                  newUrl.searchParams.set(key, value.toString());
                } else {
                  newUrl.searchParams.delete(key);
                }
              });
              window.history.pushState(state, "", newUrl.toString());
            }, 100);
          },

          setAttributesGroup: (group) =>
            set((state) => {
              state.attributesGroup = group;
            }),

          setAttributesTab: (tab) =>
            set((state) => {
              state.attributesTab = tab;
            }),
          setIsResizing: (resizing) =>
            set((state) => {
              state.resizing = resizing;
            }),

          setMouseOverPanel: (over) =>
            set((state) => {
              state.isMouseOverPanel = over;
            }),
          setContextMenuVisible: (open) =>
            set((state) => {
              state.contextMenuVisible = open;
            }),
          setDraggingBrickType: (type) =>
            set((state) => {
              state.draggingBrickType = type ?? undefined;
            }),
          setGridConfig: (config) =>
            set((state) => {
              state.gridConfig = config;
            }),
          toggleEditorEnabled: () =>
            set((state) => {
              state.disabled = !state.disabled;
            }),
          toggleChat: () =>
            set((state) => {
              state.chatVisible = !state.chatVisible;
              if (state.chatVisible) {
                state.panel = undefined;
                state.panelPosition = "right";
              }
              state.updateHistory();
            }),
          toggleDebugMode: () =>
            set((state) => {
              state.debugMode = !state.debugMode;
            }),

          setPreviewMode: (mode) =>
            set((state) => {
              state.previewMode = mode;
            }),

          setSettingsVisible: (visible) =>
            set((state) => {
              state.settingsVisible = visible;
              state.updateHistory();
            }),

          toggleSettings: () =>
            set((state) => {
              state.settingsVisible = !state.settingsVisible;
              state.updateHistory();
            }),

          setIsEditingText: (forBrickId: string | false) =>
            set((state) => {
              state.isEditingTextForBrickId = forBrickId || undefined;
            }),

          setPanel: (panel) =>
            set((state) => {
              state.panel = panel;
              state.updateHistory();
            }),

          togglePanel: (panel) =>
            set((state) => {
              state.panel = panel && state.panel === panel ? undefined : panel;
              state.updateHistory();
            }),

          hidePanel: (panel) =>
            set((state) => {
              if (!panel || state.panel === panel) {
                state.panel = undefined;
              }
              state.updateHistory();
            }),

          toggleModal: (modal) =>
            set((state) => {
              state.modal = modal && state.modal === modal ? undefined : modal;
              state.updateHistory();
            }),

          zoomIn: () =>
            set((state) => {
              state.zoom = Math.min(state.zoom + 0.1, 2);
            }),

          zoomOut: () =>
            set((state) => {
              state.zoom = Math.max(state.zoom - 0.1, 0.5);
            }),

          resetZoom: () =>
            set((state) => {
              state.zoom = 1;
            }),

          setSelectedGroup: (group) =>
            set((state) => {
              state.selectedGroup = group;
            }),

          setSelectedBrickId: (brickId) =>
            set((state) => {
              state.selectedBrickId = brickId;
              if (brickId) {
                state.selectedSectionId = undefined;
              }
              state.updateHistory();
            }),

          setSelectedSectionId: (sectionId) =>
            set((state) => {
              state.selectedSectionId = sectionId;
              if (sectionId) {
                state.selectedBrickId = undefined;
                state.selectedGroup = undefined;
              }
              state.updateHistory();
            }),

          deselectBrick: (brickId) =>
            set((state) => {
              if (state.selectedBrickId && (!brickId || state.selectedBrickId === brickId)) {
                state.selectedBrickId = undefined;
              }
              state.updateHistory();
            }),

          togglePanelPosition: () =>
            set((state) => {
              state.panelPosition = state.panelPosition === "left" ? "right" : "left";
              state.updateHistory();
            }),

          showModal: (modal) =>
            set((state) => {
              state.modal = modal;
              state.updateHistory();
            }),

          hideModal: () =>
            set((state) => {
              state.modal = undefined;
              state.updateHistory();
            }),
        })),
        // limit undo history to 100
        {
          limit: 100,
          equality: (pastState, currentState) => isEqual(pastState, currentState),
        },
      ),
    ),
  );
};

type EditorStore = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStore | null>(null);

export const useEditorStoreContext = () => {
  const store = useContext(EditorStoreContext);
  if (!store) {
    console.log("Problem with EditorStoreContext", store);
  }
  invariant(store, "useEditorStoreContext must be used within a EditorStoreContext");
  return store;
};

export const useEditor = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx);
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

export const useAttributesTab = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.attributesTab ?? "page");
};

export const useAttributesGroup = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.attributesGroup);
};

export function useSelectedSectionId() {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedSectionId);
}

export function useSelectedSection() {
  const ctx = useEditorStoreContext();
  const draft = usePageContext();
  return useStore(ctx, (state) => {
    const section = draft.getState().page.sections.find((s) => s.id === state.selectedSectionId);
    if (!section) {
      return null;
    }
    return section;
  });
}

export const useDebugMode = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => !!state.debugMode);
};

export const usePanel = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
    panel: state.panel,
    panelPosition: state.panelPosition,
  }));
};

export const useModal = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.modal);
};

export const useIsPremiumPlan = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.planIndex > 0);
};

export function useHasPlanOrHigher(plan: number) {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.planIndex >= plan);
}

export const useThemesLibrary = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.themesLibrary);
};

export const useZoom = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
    zoom: state.zoom,
    zoomIn: state.zoomIn,
    zoomOut: state.zoomOut,
    canZoomIn: state.zoom < 2,
    canZoomOut: state.zoom > 0.5,
    resetZoom: state.resetZoom,
  }));
};

export const useChatSession = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.chatSession);
};

export const useChatVisible = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => !!state.chatVisible);
};

export const useIsResizing = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.resizing);
};

export function useEditingTextForBrickId() {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.isEditingTextForBrickId);
}

export const useDraggingBrickType = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.draggingBrickType);
};

export const useContextMenuVisible = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.contextMenuVisible);
};

export const useEditorHelpers = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
    setAttributesGroup: state.setAttributesGroup,
    setAttributesTab: state.setAttributesTab,
    setIsResizing: state.setIsResizing,
    setMouseOverPanel: state.setMouseOverPanel,
    toggleDebugMode: state.toggleDebugMode,
    setContextMenuVisible: state.setContextMenuVisible,
    setDraggingBrickType: state.setDraggingBrickType,
    setPreviewMode: state.setPreviewMode,
    setSettingsVisible: state.setSettingsVisible,
    setGridConfig: state.setGridConfig,
    toggleSettings: state.toggleSettings,
    setIsEditingText: state.setIsEditingText,
    setPanel: state.setPanel,
    togglePanel: state.togglePanel,
    toggleModal: state.toggleModal,
    hidePanel: state.hidePanel,
    setSelectedGroup: state.setSelectedGroup,
    setSelectedBrickId: state.setSelectedBrickId,
    setSelectedSectionId: state.setSelectedSectionId,
    deselectBrick: state.deselectBrick,
    togglePanelPosition: state.togglePanelPosition,
    showModal: state.showModal,
    hideModal: state.hideModal,
    toggleEditorEnabled: state.toggleEditorEnabled,
    onPublish: state.onPublish,
    onSavePage: state.onSavePage,
    onSaveSite: state.onSaveSite,
    onDraftChange: state.onDraftChange,
    toggleChat: state.toggleChat,
    onShowPopup: state.onShowPopup,
  }));
};

export function useGridConfig() {
  const ctx = useEditorStoreContext();
  return useStore(
    ctx,
    (state) =>
      state.gridConfig ?? {
        colWidth: 20,
        rowHeight: LAYOUT_ROW_HEIGHT,
      },
  );
}
