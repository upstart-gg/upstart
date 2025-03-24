import {
  EditorStoreContext,
  DraftStoreContext,
  createDraftStore,
  createEditorStore,
  type EditorState,
} from "../hooks/use-editor";
import { useEffect, useRef, type PropsWithChildren } from "react";
import type { GenericPageConfig, SiteConfig } from "@upstart.gg/sdk/shared/page";
import { Theme } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { useDarkMode } from "usehooks-ts";
import { UploaderProvider } from "./UploaderContext";

import "@radix-ui/themes/styles.css";
import "@upstart.gg/style-system/radix.css";
// import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/style-system/tiptap-text-editor.css";
import "@upstart.gg/style-system/react-resizable.css";
import { DatasourceProvider } from "~/shared/hooks/use-datasource";

export type EditorWrapperProps = {
  mode?: "local" | "remote";
  pageConfig: GenericPageConfig;
  siteConfig: SiteConfig;
  /**
   * Callback when an image is uploaded through the editor.
   * The callback should return the URL of the uploaded image.
   */
  onImageUpload: (file: File) => Promise<string>;
  onReady?: () => void;

  /**
   * Tours that already have been displayed to the user.
   */
  seenTours?: string[];
  disableTours?: boolean;

  /**
   * Callback when a tour is completed.
   */
  onTourComplete?: (tourId: string) => void;
  onShowLogin?: () => void;
};

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export function EditorWrapper({
  pageConfig,
  siteConfig,
  mode,
  onImageUpload,
  children,
  seenTours = [],
  disableTours,
  onShowLogin,
  onReady = () => {},
}: PropsWithChildren<EditorWrapperProps>) {
  const debugMode = new URLSearchParams(window.location.search).has("debug");
  const editorStore = useRef(
    createEditorStore({
      mode,
      seenTours,
      onShowLogin,
      disableTours,
      debugMode,
      panel: (new URL(self.location.href).searchParams.get("panel") as EditorState["panel"]) ?? undefined,
    }),
  ).current;
  const draftStore = useRef(
    createDraftStore({
      siteId: siteConfig.id,
      hostname: siteConfig.hostname,
      pagesMap: siteConfig.pagesMap,
      siteLabel: siteConfig.label,
      id: pageConfig.id,
      path: pageConfig.path,
      label: pageConfig.label,
      sections: pageConfig.sections,
      bricks: pageConfig.bricks,
      attr: Object.assign({}, siteConfig.attr, pageConfig.attr),
      attributes: pageConfig.attributes,
      siteAttributes: siteConfig.attributes,
      datasources: siteConfig.datasources,
      datarecords: siteConfig.datarecords,
      data: pageConfig.data,
      theme: siteConfig.theme,
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
              className={tx("w-[100dvw] overflow-hidden")}
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
