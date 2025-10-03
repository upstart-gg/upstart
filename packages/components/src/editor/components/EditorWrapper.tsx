import "@radix-ui/themes/styles.css";
import type { SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";
import "@upstart.gg/style-system/editor.css";
import "@upstart.gg/style-system/radix.css";
import { Theme } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef, useEffect, useImperativeHandle, useRef, type PropsWithChildren } from "react";
import { useDarkMode } from "usehooks-ts";
import {
  createEditorStore,
  EditorStoreContext,
  type EditorState,
  type EditorStateProps,
} from "../hooks/use-editor";
import { UploaderProvider, type UploaderProviderProps } from "./UploaderContext";
// import "@upstart.gg/components/dist/assets/style.css";
import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/style-system/react-resizable.css";
import "@upstart.gg/style-system/tiptap-text-editor.css";
import { createDraftStore, DraftStoreContext } from "../hooks/use-page-data";

// Define the interface for accessing stores
export interface EditorWrapperRef {
  editorStore: ReturnType<typeof createEditorStore>;
  draftStore: ReturnType<typeof createDraftStore>;
}

export type EditorWrapperProps = Pick<
  EditorStateProps,
  "chatSession" | "onShowPopup" | "onSavePage" | "onSaveSite" | "onPageCreated"
> &
  UploaderProviderProps &
  SiteAndPagesConfig & { pageVersion: string; pageId: string; onReady?: () => void };

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export const EditorWrapper = forwardRef<EditorWrapperRef, PropsWithChildren<EditorWrapperProps>>(
  (
    {
      chatSession,
      site,
      page,
      pageVersion,
      pageId,
      onImageUpload,
      children,
      onSaveSite,
      onSavePage,
      onShowPopup,
      onPageCreated,
      onReady = () => {},
    },
    ref,
  ) => {
    const urlParams = new URL(self.location.href).searchParams;
    const debugMode = urlParams.has("debug") && urlParams.get("debug") !== "false";

    const editorStore = useRef(
      createEditorStore({
        onSaveSite,
        onSavePage,
        onShowPopup,
        onPageCreated,
        logoLink: import.meta.env.DEV ? "/" : `/dashboard/sites/${site.id}`,
        debugMode,
        chatSession,
        panel: (urlParams.get("panel") as EditorState["panel"]) ?? undefined,
        selectedBrickId: (urlParams.get("selectedBrickId") as EditorState["selectedBrickId"]) ?? undefined,
        selectedSectionId: urlParams.get("selectedBrickId")
          ? undefined
          : ((urlParams.get("selectedSectionId") as EditorState["selectedSectionId"]) ?? undefined),
        modal: (urlParams.get("modal") as EditorState["modal"]) ?? undefined,
        attributesTab: (urlParams.get("attributesTab") as EditorState["attributesTab"]) ?? undefined,
        panelPosition: (urlParams.get("panelPosition") as EditorState["panelPosition"]) ?? undefined,
      }),
    ).current;

    const draftStore = useRef(
      createDraftStore({
        site,
        page: {
          ...page,
          version: pageVersion,
        },
      }),
    ).current;

    // Expose the stores to parent component via ref
    useImperativeHandle(
      ref,
      () => ({
        editorStore,
        draftStore,
      }),
      [editorStore, draftStore],
    );

    const { isDarkMode } = useDarkMode();

    useEffect(onReady, []);

    return (
      <UploaderProvider onImageUpload={onImageUpload}>
        <EditorStoreContext.Provider value={editorStore} key="EditorStoreContext">
          <DraftStoreContext.Provider value={draftStore} key="DraftStoreContext">
            <Theme
              accentColor="violet"
              className={tx("w-full flex flex-col")}
              appearance={isDarkMode ? "dark" : "light"}
            >
              {children}
            </Theme>
          </DraftStoreContext.Provider>
        </EditorStoreContext.Provider>
      </UploaderProvider>
    );
  },
);
