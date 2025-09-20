import { useDebounceCallback } from "usehooks-ts";
import { useEditorHelpers, type PageSavePayload, type SiteSavePayload } from "./use-editor";
import {
  useDraft,
  usePage,
  useSectionsSubscribe,
  usePageAttributesSubscribe,
  useSiteAttributesSubscribe,
  useThemeSubscribe,
  useSite,
  usePageLabelSubscribe,
  useDatasourcesSubscribe,
  useDatarecordsSubscribe,
} from "./use-page-data";

const AUTO_SAVE_MIN_INTERVAL = 1000; // Auto save every N seconds

export function usePageAutoSave() {
  const draft = useDraft();
  const pageConfig = usePage();
  const site = useSite();
  const { onSavePage, onSaveSite } = useEditorHelpers();

  const savePage = useDebounceCallback(async (data: PageSavePayload["data"]) => {
    await onSavePage?.({
      pageId: pageConfig.id,
      pageVersionId: "latest",
      siteId: site.id,
      data,
    });
    draft.setDirty(false);
  }, AUTO_SAVE_MIN_INTERVAL);

  const saveSite = useDebounceCallback(async (data: SiteSavePayload["data"]) => {
    await onSaveSite?.({
      siteId: site.id,
      data,
    });
    draft.setDirty(false);
  }, AUTO_SAVE_MIN_INTERVAL);

  useSectionsSubscribe((sections) => {
    console.debug("Sections have changed, updating page version", sections);
    savePage({ sections });
  });
  usePageLabelSubscribe((label) => {
    console.debug("Page label has changed:", label);
    savePage({ label });
  });
  useDatasourcesSubscribe((datasources) => {
    console.debug("Datasources have changed:", datasources);
    saveSite({ datasources });
  });
  useDatarecordsSubscribe((datarecords) => {
    console.debug("Datarecords have changed:", datarecords);
    saveSite({ datarecords });
  });
  usePageAttributesSubscribe((attributes) => {
    console.debug("Page attributes have changed:", attributes);
    savePage({ attributes });
  });
  useSiteAttributesSubscribe((attributes) => {
    console.debug("Site attributes have changed:", attributes);
    saveSite({ attributes });
  });
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    saveSite({ theme });
  });
}
