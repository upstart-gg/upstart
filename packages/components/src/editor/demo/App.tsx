import { useRef, type PropsWithChildren } from "react";
import Editor from "~/editor/components/Editor";
import {
  EditorWrapper,
  type EditorWrapperRef,
  type EditorWrapperProps,
} from "~/editor/components/EditorWrapper";
import { ClientOnly } from "~/shared/utils/client-only";
// import "@upstart.gg/style-system/default-theme.css";
// import "@upstart.gg/components/dist/assets/style.css";
import { createEmptyConfig } from "@upstart.gg/sdk/shared/site";

export default function App({ path }: { path: string }) {
  const siteConfig = createEmptyConfig("a site about coffee and tea");
  const searchParams = new URL(`http://localhost${path}`).searchParams;
  const p = searchParams.get("p");
  const pageId = (siteConfig.pages.find((page) => page.id === p) ?? siteConfig.pages[0]).id;
  return (
    <ClientOnly>
      <InnerEditor config={siteConfig} pageId={pageId}>
        <Editor />
      </InnerEditor>
    </ClientOnly>
  );
}

function InnerEditor(
  props: PropsWithChildren<
    Omit<EditorWrapperProps, "onImageUpload" | "onShowPopup" | "onPublish" | "onSavePage" | "onSaveSite">
  >,
) {
  const onImageUpload = async (file: File) => {
    console.log("Image upload callback called with", file);
    return "https://via.placeholder.com/150";
  };
  const onPublish = () => {
    console.debug("onPublish: Out of the demo, the 'publish' modal should be displayed at this time.");
  };
  const onSavePage = async () => {
    console.debug("onSavePage: Out of the demo, the 'save' modal should be displayed at this time.");
    return { pageVersionId: "latest" };
  };
  const onSaveSite = async () => {
    console.debug("onSaveSite: Out of the demo, the 'save' modal should be displayed at this time.");
  };
  const onShowPopup = (popupId: string | false) => {
    console.debug(
      `onShowPopup: out of the demo, the popup with ID ${popupId} should be displayed at this time.`,
    );
  };
  const editorWrapperRef = useRef<EditorWrapperRef>(null);

  const demoDoSomethingInEditorState = () => {
    if (editorWrapperRef.current) {
      // EXAMPLE USAGE OF THE EDITOR REF
      const { editorStore, draftStore } = editorWrapperRef.current;
      editorStore.getState().setPreviewMode("mobile");
    }
  };

  return (
    <EditorWrapper
      ref={editorWrapperRef}
      {...props}
      onImageUpload={onImageUpload}
      onPublish={onPublish}
      onSavePage={onSavePage}
      onSaveSite={onSaveSite}
      onShowPopup={onShowPopup}
    >
      <Editor />
    </EditorWrapper>
  );
}
