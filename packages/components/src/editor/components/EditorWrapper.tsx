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
import { UploaderProvider, type UploaderProviderProps } from "./UploaderContext";
import "@radix-ui/themes/styles.css";
import "@upstart.gg/style-system/editor.css";
import "@upstart.gg/style-system/radix.css";
// import "@upstart.gg/components/dist/assets/style.css";
import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/style-system/react-resizable.css";
import "@upstart.gg/style-system/tiptap-text-editor.css";
import { createDraftStore, type DraftStateProps, DraftStoreContext } from "../hooks/use-page-data";
import type { UpstartUIMessage } from "@upstart.gg/sdk/shared/ai/types";

// Define the interface for accessing stores
export interface EditorWrapperRef {
  editorStore: ReturnType<typeof createEditorStore>;
  draftStore: ReturnType<typeof createDraftStore>;
}

export type EditorWrapperProps = Pick<
  EditorStateProps,
  "chatSession" | "logoLink" | "onShowPopup" | "onPublish" | "onSavePage" | "onSaveSite"
> &
  UploaderProviderProps &
  SiteAndPagesConfig & { pageVersion: string; pageId: string; onReady?: () => void };

// export type EditorWrapperProps = {
//   chatSession: {
//     id: string;
//     messages: UpstartUIMessage[];
//   };
//   pageVersion: string;
//   pageId: string;
//   config: SiteAndPagesConfig;
//   logoLink?: string;
//   /**
//    * Callback when an image is uploaded through the editor.
//    * The callback should return the URL of the uploaded image.
//    */
//   onImageUpload: (file: File) => Promise<string>;
//   onReady?: () => void;

//   /**
//    * Callback when a tour is completed.
//    */
//   onShowPopup: EditorStateProps["onShowPopup"];
//   onPublish: EditorStateProps["onPublish"];
//   onSavePage?: EditorStateProps["onSavePage"];
//   onSaveSite?: EditorStateProps["onSaveSite"];
// };

/**
 * Wrap the Editor component with the EditorStore and DraftStore contexts.
 * If no children are provided, the default Page component will be rendered, but not within the Editor.
 */
export const EditorWrapper = forwardRef<EditorWrapperRef, PropsWithChildren<EditorWrapperProps>>(
  (
    {
      chatSession,
      site,
      pages,
      pageVersion,
      pageId,
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
    const urlParams = new URL(self.location.href).searchParams;
    const setup = urlParams.has("setup");
    const debugMode = urlParams.has("debug") && urlParams.get("debug") !== "false";

    const editorStore = useRef(
      createEditorStore({
        onPublish,
        onSaveSite,
        onSavePage,
        onShowPopup,
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

    const page = pages.find((p) => p.id === pageId) ?? pages[0];

    const draftStore = useRef(
      createDraftStore({
        site: {
          ...site,
          ...(setup
            ? {
                attributes: {} as SiteAndPagesConfig["site"]["attributes"],
                datarecords: [],
                datasources: [],
                sitemap: [],
                themes: [],
              }
            : {}),
        },
        page: {
          ...page,
          version: pageVersion,
          ...(setup
            ? {
                attributes: {
                  path: "/",
                } as SiteAndPagesConfig["pages"][0]["attributes"],
                sections: [],
                label: "Home",
              }
            : {}),
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
