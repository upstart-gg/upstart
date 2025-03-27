import { getNewSiteConfig } from "@upstart.gg/sdk/shared/page";
import testEnpageConfig from "~/test-config";
import { EditorWrapper, type EditorWrapperProps } from "~/editor/components/EditorWrapper";
import { ClientOnly } from "~/shared/utils/client-only";
import Editor from "~/editor/components/Editor";
import type { PropsWithChildren } from "react";

import "./app.css";
import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/components/dist/assets/style.css";

export default function App() {
  const siteConfig = getNewSiteConfig(
    testEnpageConfig,
    { label: "New site" },
    // use a fixed site id to avoid changing the site id on every reload
    true,
  );

  return (
    <ClientOnly>
      <InnerEditor pageConfig={siteConfig.pages[0]} siteConfig={siteConfig.site} mode="local">
        <Editor />
      </InnerEditor>
    </ClientOnly>
  );
}

function InnerEditor(props: PropsWithChildren<Omit<EditorWrapperProps, "onImageUpload">>) {
  const onImageUpload = async (file: File) => {
    console.log("Image upload callback called with", file);
    return "https://via.placeholder.com/150";
  };
  return (
    <EditorWrapper {...props} onImageUpload={onImageUpload}>
      <Editor />
    </EditorWrapper>
  );
}
