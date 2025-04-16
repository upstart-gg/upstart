import { useDebounceCallback } from "usehooks-ts";
import {
  useAttributesSubscribe,
  useBricksSubscribe,
  useDraft,
  useEditorHelpers,
  useEditorMode,
  usePageInfo,
  usePagePathSubscribe,
  useThemeSubscribe,
  type PageSavePayload,
  type SiteSavePayload,
} from "./use-editor";

const AUTO_SAVE_MIN_INTERVAL = 3000; // Auto save every N seconds

const noop = async () => {
  console.log("Skip saving page in local mode");
  return false;
};

export function usePageAutoSave() {
  const draft = useDraft();
  const editorMode = useEditorMode();
  const pageConfig = usePageInfo();
  const { onSavePage, onSaveSite } = useEditorHelpers();
  const savePage = useDebounceCallback(
    editorMode === "remote"
      ? (data: PageSavePayload["data"]) => {
          onSavePage?.({
            pageId: pageConfig.id,
            pageVersionId: "latest",
            siteId: pageConfig.siteId,
            data,
          });
        }
      : noop,
    AUTO_SAVE_MIN_INTERVAL,
  );
  const saveSite = useDebounceCallback(
    editorMode === "remote"
      ? (data: SiteSavePayload["data"]) => {
          onSaveSite?.({
            siteId: pageConfig.siteId,
            data,
          });
        }
      : noop,
    AUTO_SAVE_MIN_INTERVAL,
  );

  useBricksSubscribe(async (bricks) => {
    console.debug("Bricks have changed, updating page version", bricks);
    draft.setDirty(true);
    savePage({ bricks });
  });
  useAttributesSubscribe((attributes) => {
    console.debug("Attributes have changed, updating page version");
    draft.setDirty(true);
    savePage({ attr: attributes });
  });
  usePagePathSubscribe((path) => {
    console.debug("pagePath has changed, updating page version");
    draft.setDirty(true);
    savePage({ path });
  });
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    draft.setDirty(true);
    saveSite({ theme });
  });
}
