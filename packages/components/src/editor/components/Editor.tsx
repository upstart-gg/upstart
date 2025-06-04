import {
  useChatVisible,
  useDraft,
  useDraftHelpers,
  useEditorEnabled,
  useGenerationState,
  useImagesSearchResults,
  usePanel,
  useSections,
  useThemes,
} from "../hooks/use-editor";
import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";
import { css, tx, tw } from "@upstart.gg/style-system/twind";
import { Button } from "@upstart.gg/style-system/system";
import { usePageAutoSave } from "~/editor/hooks/use-page-autosave";
import { getThemeCss } from "~/shared/utils/get-theme-css";
import { useEditorHotKeys } from "../hooks/use-editor-hot-keys";
import ThemesPreviewList from "./ThemesPreviewList";
import BlankWaitPage from "./BlankWaitPage";
import type { GenerationState } from "@upstart.gg/sdk/shared/context";

const Tour = lazy(() => import("./Tour"));
const NavBar = lazy(() => import("./NavBar"));
const Chat = lazy(() => import("./Chat"));
const EditablePage = lazy(() => import("./EditablePage"));
const Page = lazy(() => import("~/shared/components/Page"));
const DeviceFrame = lazy(() => import("./DeviceFrame"));
const Panel = lazy(() => import("./Panel"));

type EditorProps = ComponentProps<"div">;

export default function Editor(props: EditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const draft = useDraft();
  const editorEnabled = useEditorEnabled();
  const chatVisible = useChatVisible();
  const sections = useSections();
  const { panelPosition } = usePanel();
  const themes = useThemes();
  const generationState = useGenerationState();
  // const images = useImagesSearchResults();
  // const [bgImg, setBgImg] = useState<NonNullable<typeof images>[number] | null>(null);

  usePageAutoSave();
  useEditorHotKeys();

  useEffect(() => {
    const themeUsed = draft.previewTheme ?? draft.theme;
    if (themeUsed) {
      tw(css(getThemeCss(themeUsed)));
    }
  }, [draft.previewTheme, draft.theme]);

  // useEffect(() => {
  //   if (generationState.isReady || !images?.length) {
  //     return;
  //   }
  //   // If generation is not ready, set a random background image from the images
  //   const randomImage = images[Math.floor(Math.random() * images.length)];
  //   setBgImg(randomImage);
  //   const itv = setInterval(async () => {
  //     const randomImage = images[Math.floor(Math.random() * images.length)];

  //     // preload the image to avoid flickering
  //     const img = new Image();
  //     img.src = randomImage.url;
  //     await img.decode(); // Wait for the image to load
  //     setBgImg(randomImage);
  //   }, 10000); // Change every 10 seconds
  //   return () => clearInterval(itv);
  // }, [generationState.isReady, images]);

  if (!editorEnabled) {
    return (
      <div className="@container">
        <Suspense>
          <Page
            page={{
              ...draft,
              tags: [],
            }}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div
      id="editor"
      className={tx(
        "grid relative transition-all mx-auto w-full",
        getEditorCss(generationState, chatVisible),
        "min-h-[100dvh] max-h-[100dvh]",
        /*
.firstSection {
    --opacity: 0.65;
  background: linear-gradient(
    120deg,
    oklab(from #9291e7 l a b / var(--opacity)),
    oklab(from #7270c6 l a b / var(--opacity)),
    oklab(from #c050c2 l a b / var(--opacity)),
    oklab(from #ef50a2 l a b / var(--opacity)),
    oklab(from #ff6285 l a b / var(--opacity)),
    oklab(from #ff806b l a b / var(--opacity)),
    oklab(from #ffa25a l a b / var(--opacity)),
    oklab(from #ffc358 l a b / var(--opacity))
  );
  padding-top: 90px;
  display: flex;
  flex-direction: column  ;
  justify-content: center;
  position: relative;
}

        */
        generationState.isReady === false &&
          css({
            background: `linear-gradient(120deg,
              oklab(from #9291e7 l a b / 0.65),
              oklab(from #7270c6 l a b / 0.65),
              oklab(from #c050c2 l a b / 0.65),
              oklab(from #ef50a2 l a b / 0.65),
              oklab(from #ff6285 l a b / 0.65),
              oklab(from #ff806b l a b / 0.65),
              oklab(from #ffa25a l a b / 0.65),
              oklab(from #ffc358 l a b / 0.65)
          )`,
          }),
        generationState.isReady === false && "transition-all duration-500 ease-in-out",
        //   "my-auto h-[clamp(500px,70dvh,1000px)] max-h-[clamp(500px,70dvh,1000px)]",
      )}
      {...props}
      ref={rootRef}
    >
      {sections.length > 0 && generationState.isReady && (
        <Suspense>
          <Tour />
        </Suspense>
      )}
      <Suspense>
        <NavBar />
      </Suspense>
      {chatVisible && (
        <Suspense>
          <Chat />
        </Suspense>
      )}
      <Suspense>
        <Panel />
      </Suspense>
      <main
        className={tx(
          "flex-1 flex place-content-center z-40 overscroll-none ",
          "overflow-x-auto overflow-y-visible ",
          generationState.isReady === false && "!hidden",
          css({
            gridArea: "main",
            scrollbarColor: "var(--violet-4) var(--violet-2)",
            scrollBehavior: "smooth",
            scrollbarGutter: "stable",
            scrollbarWidth: panelPosition === "left" ? "thin" : "none",
            "&:hover": {
              scrollbarColor: "var(--violet-7) var(--violet-3)",
            },
          }),
        )}
      >
        {generationState.isReady && (
          <Suspense>
            <DeviceFrame>
              <EditablePage />
              {draft.previewTheme && <ThemePreviewConfirmButton />}
            </DeviceFrame>
          </Suspense>
        )}
        {!generationState.isReady &&
          (themes.length > 0 ? (
            <DeviceFrame>
              <ThemesPreviewList themes={themes} />
            </DeviceFrame>
          ) : (
            <DeviceFrame>
              <BlankWaitPage />
            </DeviceFrame>
          ))}
      </main>
    </div>
  );
}

function getEditorCss(generationState: GenerationState, chatVisible: boolean) {
  return css({
    gridTemplateAreas: chatVisible ? `"navbar navbar" "chat main"` : `"navbar" "main"`,
    gridTemplateRows: "64px 1fr",
    gridTemplateColumns:
      generationState.isReady === false ? "1fr 0px" : chatVisible ? "clamp(280px, 25%, 410px) 1fr" : "1fr",
    // maxWidth: generationState.isReady === false ? "clamp(500px, 40dvw, 650px)" : "none",
  });
}

function ThemePreviewConfirmButton() {
  const { validatePreviewTheme } = useDraftHelpers();
  return (
    <div className="sticky bottom-4 left-0 right-0 flex justify-center items-center z-[9999]">
      <div className="p-3 bg-black/70 backdrop-blur-md rounded-lg max-w-fit flex gap-2 shadow-xl">
        <Button variant="solid" color="gray" onClick={() => validatePreviewTheme(false)}>
          Revert
        </Button>
        <Button onClick={() => validatePreviewTheme(true)} variant="solid">
          Accept theme
        </Button>
      </div>
    </div>
  );
}
