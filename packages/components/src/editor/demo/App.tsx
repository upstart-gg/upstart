import { getNewSiteConfig } from "@upstart.gg/sdk/shared/page";
import testEnpageConfig from "~/test-config";
import { EditorWrapper, type EditorWrapperProps } from "~/editor/components/EditorWrapper";
import { ClientOnly } from "~/shared/utils/client-only";
import Editor from "~/editor/components/Editor";
import type { PropsWithChildren } from "react";

import "./app.css";
import "@upstart.gg/style-system/default-theme.css";
import "@upstart.gg/components/dist/assets/style.css";

export default function App({ path }: { path: string }) {
  const siteConfig = getNewSiteConfig(
    testEnpageConfig,
    "localhost:8080",
    { label: "New site" },
    // use a fixed site id to avoid changing the site id on every reload
    true,
  );

  const searchParams = new URL(`http://localhost${path}`).searchParams;
  const p = searchParams.get("p");
  const page = siteConfig.pages.find((page) => page.id === p) ?? siteConfig.pages[0];

  return (
    <ClientOnly>
      <InnerEditor pageConfig={page} siteConfig={siteConfig.site} mode="local">
        <Editor />
      </InnerEditor>
    </ClientOnly>
  );
}

function InnerEditor(props: PropsWithChildren<Omit<EditorWrapperProps, "onImageUpload" | "onShowLogin">>) {
  const onImageUpload = async (file: File) => {
    console.log("Image upload callback called with", file);
    return "https://via.placeholder.com/150";
  };
  const onShowLogin = () => {
    alert("Out of the demo, the 'login' modal should be displayed at this time.");
  };
  return (
    <EditorWrapper {...props} onShowLogin={onShowLogin} onImageUpload={onImageUpload}>
      <Editor />
    </EditorWrapper>
  );
}
