import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import type { ImageSearchResultsType } from "@upstart.gg/sdk/shared/images";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import type { GenericPageConfig } from "@upstart.gg/sdk/shared/page";
import type { SitePrompt } from "@upstart.gg/sdk/shared/prompt";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Site, SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { enableMapSet } from "immer";
import { isEqual } from "lodash-es";
import { createContext, useContext } from "react";
import { temporal } from "zundo";
import { createStore, useStore } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { type DraftState, usePageContext } from "./use-page-data";
import type { Editor as TextEditor } from "@tiptap/react";
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
  data: Partial<GenericPageConfig>;
};

export type SiteSavePayload = {
  siteId: string;
  data: Partial<Site>;
};

export interface EditorStateProps {
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

  sitePrompt: SitePrompt;
  // pages: GenericPageConfig[];

  previewMode: Resolution;
  gridConfig?: {
    colWidth: number;
    rowHeight: number;
  };
  settingsVisible?: boolean;
  genFlowDone?: boolean;

  selectedBrickId?: Brick["id"];
  selectedGroup?: Brick["id"][];
  selectedSectionId?: string;

  resizing?: boolean;

  isEditingTextForBrickId?: string;
  panel?: "library" | "inspector" | "theme" | "settings" | "data";
  modal?: "image-search" | "datasources";
  panelPosition: "left" | "right";
  chatVisible: boolean;
  logoLink: string;
  themesLibrary: Theme[];
  imagesSearchResults?: ImageSearchResultsType;
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
  setImagesSearchResults: (images: EditorStateProps["imagesSearchResults"]) => void;
  togglePanelPosition: () => void;
  toggleDebugMode: () => void;
  showModal: (modal: EditorStateProps["modal"]) => void;
  hideModal: () => void;
  toggleChat: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setDraggingBrickType: (type: Brick["type"] | null) => void;
  setMouseOverPanel: (over: boolean) => void;
}

export const createEditorStore = (initProps: Partial<EditorStateProps>) => {
  const DEFAULT_PROPS = {
    previewMode: "desktop" satisfies EditorStateProps["previewMode"],
    themesLibrary: [] as Theme[],
    pages: [] as GenericPageConfig[],
    panelPosition: "left" satisfies EditorStateProps["panelPosition"],
    logoLink: "/dashboard",
    zoom: 1,
    chatVisible: true,
    contextMenuVisible: false,
    planIndex: 0,
    imagesSearchResults: import.meta.env.DEV
      ? [
          {
            blurHash: "",
            description: "Placeholder image",
            provider: "unsplash",
            url: "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            user: {
              name: "Placeholder",
              profile_url: "https://unsplash.com/@placeholder",
            },
          },
          {
            blurHash: "",
            description: "Placeholder image",
            provider: "unsplash",
            url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=3538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            user: {
              name: "Placeholder",
              profile_url: "https://unsplash.com/@placeholder",
            },
          },
          {
            blurHash: "",
            description: "Placeholder image",
            provider: "unsplash",
            url: "https://plus.unsplash.com/premium_photo-1661596686441-611034b8077e?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            user: {
              name: "Placeholder",
              profile_url: "https://unsplash.com/@placeholder",
            },
          },
        ]
      : undefined,
    sitePrompt: "",
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
      persist(
        temporal(
          immer((set, _get) => ({
            ...DEFAULT_PROPS,
            ...initProps,
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
              }),
            toggleDebugMode: () =>
              set((state) => {
                state.debugMode = !state.debugMode;
              }),
            setImagesSearchResults: (images) =>
              set((state) => {
                state.imagesSearchResults = images;
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
              }),

            setSelectedSectionId: (sectionId) =>
              set((state) => {
                state.selectedSectionId = sectionId;
                if (sectionId) {
                  state.selectedBrickId = undefined;
                  state.selectedGroup = undefined;
                }
              }),

            deselectBrick: (brickId) =>
              set((state) => {
                if (state.selectedBrickId && (!brickId || state.selectedBrickId === brickId)) {
                  state.selectedBrickId = undefined;
                }
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
          // limit undo history to 100
          {
            limit: 100,
            equality: (pastState, currentState) => isEqual(pastState, currentState),
          },
        ),
        {
          name: "editor-state",
          partialize: (state) =>
            Object.fromEntries(
              Object.entries(state).filter(([key]) => ["chatVisible", "previewMode"].includes(key)),
            ),
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

export function useSelectedSectionId() {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.selectedSectionId);
}

export function useSelectedSection() {
  const ctx = useEditorStoreContext();
  const draft = usePageContext();
  return useStore(ctx, (state) => {
    const section = draft.getState().sections.find((s) => s.id === state.selectedSectionId);
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

export const useImagesSearchResults = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.imagesSearchResults);
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

export const useIsMouseOverPanel = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => state.isMouseOverPanel);
};

export const useEditorHelpers = () => {
  const ctx = useEditorStoreContext();
  return useStore(ctx, (state) => ({
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
    setImagesSearchResults: state.setImagesSearchResults,
    setPanel: state.setPanel,
    togglePanel: state.togglePanel,
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
