import type { SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";
import { Theme } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef, forwardRef, useImperativeHandle, type PropsWithChildren } from "react";
import { useDarkMode } from "usehooks-ts";
import {
  EditorStoreContext,
  createEditorStore,
  type EditorState,
  type EditorStateProps,
} from "../hooks/use-editor";
import { UploaderProvider } from "./UploaderContext";
import "@radix-ui/themes/styles.css";
import "@upstart.gg/style-system/editor.css";
import "@upstart.gg/style-system/radix.css";
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

export type EditorWrapperProps = {
  mode?: "anonymous" | "authenticated";
  pageVersion?: string;
  pageId?: string;
  config: SiteAndPagesConfig;
  /**
   * Callback when an image is uploaded through the editor.
   * The callback should return the URL of the uploaded image.
   */
  onImageUpload: (file: File) => Promise<string>;
  onReady?: () => void;

  /**
   * Callback when a tour is completed.
   */
  onTourComplete?: (tourId: string) => void;
  onShowPopup: EditorStateProps["onShowPopup"];
  onPublish: EditorStateProps["onPublish"];
  onSavePage?: EditorStateProps["onSavePage"];
  onSaveSite?: EditorStateProps["onSaveSite"];
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export const EditorWrapper = forwardRef<EditorWrapperRef, PropsWithChildren<EditorWrapperProps>>(
  (
    {
      config,
      pageVersion,
      pageId,
      mode,
      onImageUpload,
      children,
      onSaveSite,
      onSavePage,
      onPublish,
      onShowPopup,
      onReady = () => {},
    },
    ref,
  ) => {
    const { site, pages } = config;
    const debugMode = new URLSearchParams(window.location.search).has("debug");

    const editorStore = useRef(
      createEditorStore({
        mode,
        onPublish,
        onSaveSite,
        onSavePage,
        onShowPopup,
        debugMode,
        panel: (new URL(self.location.href).searchParams.get("panel") as EditorState["panel"]) ?? undefined,
        sitePrompt: site.sitePrompt,
      }),
    ).current;

    const page = pages.find((p) => p.id === pageId) ?? pages[0];

    const draftStore = useRef(
      createDraftStore({
        siteId: site.id,
        hostname: site.hostname,
        sitemap: site.sitemap,
        siteLabel: site.label,
        id: page.id,
        version: pageVersion,
        path: page.path,
        label: page.label,
        sections: page.sections,
        siteAttr: site.attr,
        attr: Object.assign({}, site.attr, page.attr),
        attributes: page.attributes,
        siteAttributes: site.attributes,
        datasources: site.datasources,
        datarecords: site.datarecords,
        pages,
        // todo: pass the appropriate data for the page
        data: {},
        theme: site.theme,
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
