import { useDebounceCallback } from "usehooks-ts";
import {
  useAttributesSubscribe,
  useSectionsSubscribe,
  useDraft,
  useEditorHelpers,
  useEditorMode,
  usePageInfo,
  usePagePathSubscribe,
  useThemeSubscribe,
  type PageSavePayload,
  type SiteSavePayload,
  useSiteAndPages,
} from "./use-editor";

const AUTO_SAVE_MIN_INTERVAL = 1000; // Auto save every N seconds

export function usePageAutoSave() {
  const draft = useDraft();
  const pageConfig = usePageInfo();
  const { onSavePage, onSaveSite, onDraftChange } = useEditorHelpers();

  const savePage = useDebounceCallback(async (data: PageSavePayload["data"]) => {
    await onSavePage?.({
      pageId: pageConfig.id,
      pageVersionId: "latest",
      siteId: pageConfig.siteId,
      data,
    });
    draft.setDirty(false);
  }, AUTO_SAVE_MIN_INTERVAL);

  const saveSite = useDebounceCallback(async (data: SiteSavePayload["data"]) => {
    await onSaveSite?.({
      siteId: pageConfig.siteId,
      data,
    });
    draft.setDirty(false);
  }, AUTO_SAVE_MIN_INTERVAL);

  useSectionsSubscribe((sections) => {
    console.debug("Sections have changed, updating page version", sections);
    draft.setDirty(true);
    savePage({ sections });
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
