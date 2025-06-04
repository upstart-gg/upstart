import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
  type EditorState,
  type EditorStateProps,
} from "../hooks/use-editor";
import { useEffect, useRef, type PropsWithChildren } from "react";
import { Theme } from "@upstart.gg/style-system/system";
import { useDarkMode } from "usehooks-ts";
import { UploaderProvider } from "./UploaderContext";
import { DatasourceProvider } from "~/shared/hooks/use-datasource";
import type { SiteAndPagesConfig } from "@upstart.gg/sdk/shared/site";
import { tx } from "@upstart.gg/style-system/twind";

import "@radix-ui/themes/styles.css";
import "@upstart.gg/style-system/radix.css";
import "@upstart.gg/style-system/editor.css";
// import "@upstart.gg/components/dist/assets/style.css";
import "@upstart.gg/style-system/tiptap-text-editor.css";
import "@upstart.gg/style-system/react-resizable.css";
import "@upstart.gg/style-system/default-theme.css";

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
  onShowLogin: () => void;
  onPublish: EditorStateProps["onPublish"];
  onSavePage?: EditorStateProps["onSavePage"];
  onSaveSite?: EditorStateProps["onSaveSite"];
  /**
   *  Used when mode = "anonymous" to notify the editor that the draft has changed.
   */
  onDraftChange?: EditorStateProps["onDraftChange"];
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export function EditorWrapper({
  config,
  pageVersion,
  pageId,
  mode,
  onImageUpload,
  children,
  onShowLogin,
  onSaveSite,
  onSavePage,
  onDraftChange,
  onPublish,
  onReady = () => {},
}: PropsWithChildren<EditorWrapperProps>) {
  const { site, pages } = config;

  const debugMode = new URLSearchParams(window.location.search).has("debug");
  const page = pages.find((p) => p.id === pageId) ?? pages[0];

  const editorStore = useRef(
    createEditorStore({
      mode,
      onShowLogin,
      onPublish,
      onSaveSite,
      onSavePage,
      onDraftChange,
      debugMode,
      panel: (new URL(self.location.href).searchParams.get("panel") as EditorState["panel"]) ?? undefined,
      pages,
      sitePrompt: site.sitePrompt,
    }),
  ).current;

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
      // todo: pass the appropriate data for the page
      data: {},
      theme: site.theme,
    }),
  ).current;

  const { isDarkMode } = useDarkMode();

  useEffect(onReady, []);

  return (
    <DatasourceProvider>
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
    </DatasourceProvider>
  );
}
