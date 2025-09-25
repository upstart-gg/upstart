import { useDebounceCallback } from "usehooks-ts";
import { useEditorHelpers } from "./use-editor";
import {
  useDatarecordsSubscribe,
  useDatasourcesSubscribe,
  useDraft,
  usePage,
  usePageAttributesSubscribe,
  usePageLabelSubscribe,
  useSectionsSubscribe,
  useSite,
  useSiteAttributesSubscribe,
  useThemeSubscribe,
  useThemesSubscribe,
} from "./use-page-data";

const AUTO_SAVE_MIN_INTERVAL = 1000; // Auto save every N seconds

export function usePageAutoSave() {
  const draft = useDraft();
  const pageConfig = usePage();
  const site = useSite();
  const { onSavePage, onSaveSite } = useEditorHelpers();

  const saveSections = useDebounceCallback(async (sections: typeof pageConfig.sections) => {
    await onSavePage?.({
      pageId: pageConfig.id,
      pageVersionId: "latest",
      siteId: site.id,
      data: { sections },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useSectionsSubscribe((sections) => {
    console.debug("Sections have changed, updating page version", sections);
    saveSections(sections);
  });

  const saveLabel = useDebounceCallback(async (label: typeof pageConfig.label) => {
    await onSavePage?.({
      pageId: pageConfig.id,
      pageVersionId: "latest",
      siteId: site.id,
      data: { label },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  usePageLabelSubscribe((label) => {
    console.debug("Page label has changed:", label);
    saveLabel(label);
  });

  const saveDatasources = useDebounceCallback(async (datasources: typeof site.datasources) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { datasources },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useDatasourcesSubscribe((datasources) => {
    console.debug("Datasources have changed:", datasources);
    saveDatasources(datasources);
  });

  const saveDatarecords = useDebounceCallback(async (datarecords: typeof site.datarecords) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { datarecords },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useDatarecordsSubscribe((datarecords) => {
    console.debug("Datarecords have changed:", datarecords);
    saveDatarecords(datarecords);
  });

  const savePageAttributes = useDebounceCallback(async (attributes: typeof pageConfig.attributes) => {
    await onSavePage?.({
      pageId: pageConfig.id,
      pageVersionId: "latest",
      siteId: site.id,
      data: { attributes },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  usePageAttributesSubscribe((attributes) => {
    console.debug("Page attributes have changed:", attributes);
    savePageAttributes(attributes);
  });

  const saveSiteAttributes = useDebounceCallback(async (attributes: typeof site.attributes) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { attributes },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useSiteAttributesSubscribe((attributes) => {
    console.debug("Site attributes have changed:", attributes);
    saveSiteAttributes(attributes);
  });

  const saveTheme = useDebounceCallback(async (theme: typeof site.theme) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { theme },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useThemeSubscribe((theme) => {
    console.debug("theme has changed, updating page version");
    saveTheme(theme);
  });

  const saveThemes = useDebounceCallback(async (themes: typeof site.themes) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { themes },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);
  useThemesSubscribe((themes) => {
    console.debug("themes have changed, updating site with themes", themes);
    saveThemes(themes);
  });
}
