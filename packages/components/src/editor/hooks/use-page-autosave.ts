import { useDebounceCallback } from "usehooks-ts";
import { useEditorHelpers, type PageSavePayload, type SiteSavePayload } from "./use-editor";
import {
  useDraft,
  usePageInfo,
  useSectionsSubscribe,
  usePageAttributesSubscribe,
  useSiteAttributesSubscribe,
  usePagePathSubscribe,
  useThemeSubscribe,
} from "./use-page-data";

const AUTO_SAVE_MIN_INTERVAL = 1000; // Auto save every N seconds

export function usePageAutoSave() {
  const draft = useDraft();
  const pageConfig = usePageInfo();
  const { onSavePage, onSaveSite } = useEditorHelpers();

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
    savePage({ sections });
  });
  usePageAttributesSubscribe((attributes) => {
    console.debug("Page attributes have changed:", attributes);
    savePage({ attributes });
  });
  useSiteAttributesSubscribe((attributes) => {
    console.debug("Site attributes have changed:", attributes);
    saveSite({ attributes });
  });
  usePagePathSubscribe((path) => {
    console.debug("pagePath has changed, updating page version");
    savePage({ path });
  });
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    saveSite({ theme });
  });
}
