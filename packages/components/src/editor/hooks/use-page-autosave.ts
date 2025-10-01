import type { Page } from "@upstart.gg/sdk/shared/page";
import { useDebounceCallback } from "./use-debounce-callback";
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
  useSiteLabelSubscribe,
  useSitemapSubscribe,
  useThemeSubscribe,
  useThemesSubscribe,
} from "./use-page-data";
import { resolvePageAttributes } from "@upstart.gg/sdk/shared/attributes";

const AUTO_SAVE_MIN_INTERVAL = 1000; // Auto save every N seconds

export function usePageAutoSave() {
  const draft = useDraft();
  const pageConfig = usePage();
  const site = useSite();
  const { onSavePage, onSaveSite, onPageCreated } = useEditorHelpers();

  // When sections change, save the page
  const saveSections = useDebounceCallback(
    async (sections: typeof pageConfig.sections) => {
      await onSavePage({
        pageId: pageConfig.id,
        pageVersionId: "latest",
        siteId: site.id,
        data: { sections },
      });
      draft.setLastSaved(new Date());
    },
    AUTO_SAVE_MIN_INTERVAL,
    [pageConfig.id],
  );

  useSectionsSubscribe((sections) => {
    console.debug("Sections have changed, updating page version", sections);
    saveSections(sections);
  });

  // When page label changes, save the page
  const savePageLabel = useDebounceCallback(
    async (label: typeof pageConfig.label) => {
      await onSavePage({
        pageId: pageConfig.id,
        pageVersionId: "latest",
        siteId: site.id,
        data: { label },
      });
      draft.setLastSaved(new Date());
    },
    AUTO_SAVE_MIN_INTERVAL,
    [pageConfig.id],
  );

  usePageLabelSubscribe((label) => {
    console.debug("Page label has changed:", label);
    savePageLabel(label);
  });

  // When site label changes, save the site
  const saveSiteLabel = useDebounceCallback(
    async (label: typeof site.label) => {
      await onSaveSite({
        siteId: site.id,
        data: { label },
      });
      draft.setLastSaved(new Date());
    },
    AUTO_SAVE_MIN_INTERVAL,
    [pageConfig.id],
  );

  useSiteLabelSubscribe((label) => {
    console.debug("Site label has changed:", label);
    saveSiteLabel(label);
  });

  // When datasources change, save the site
  const saveDatasources = useDebounceCallback(async (datasources: typeof site.datasources) => {
    await onSaveSite({
      siteId: site.id,
      data: { datasources },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);

  useDatasourcesSubscribe((datasources) => {
    console.debug("Datasources have changed, saving them", datasources);
    saveDatasources(datasources);
  });

  // When datarecords change, save the site
  const saveDatarecords = useDebounceCallback(async (datarecords: typeof site.datarecords) => {
    await onSaveSite?.({
      siteId: site.id,
      data: { datarecords },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);

  useDatarecordsSubscribe((datarecords) => {
    console.debug("Datarecords have changed, saving them", datarecords);
    saveDatarecords(datarecords);
  });

  // When page attributes change, save the page
  const savePageAttributes = useDebounceCallback(
    async (attributes: typeof pageConfig.attributes) => {
      await onSavePage({
        pageId: pageConfig.id,
        pageVersionId: "latest",
        siteId: site.id,
        data: { attributes },
      });
      draft.setLastSaved(new Date());
    },
    AUTO_SAVE_MIN_INTERVAL,
    [pageConfig.id],
  );

  usePageAttributesSubscribe((attributes) => {
    console.debug("Page attributes have changed, saving them", attributes);
    savePageAttributes(attributes);
  });

  // When site attributes change, save the site
  const saveSiteAttributes = useDebounceCallback(async (attributes: typeof site.attributes) => {
    await onSaveSite({
      siteId: site.id,
      data: { attributes },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);

  useSiteAttributesSubscribe((attributes) => {
    console.debug("Site attributes have changed, saving them", attributes);
    saveSiteAttributes(attributes);
  });

  // When theme changes, save the site
  const saveTheme = useDebounceCallback(async (theme: typeof site.theme) => {
    await onSaveSite({
      siteId: site.id,
      data: { theme },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);

  useThemeSubscribe((theme) => {
    console.debug("theme has changed, saving it", theme);
    saveTheme(theme);
  });

  // When themes change, save the site
  const saveThemes = useDebounceCallback(async (themes: typeof site.themes) => {
    await onSaveSite({
      siteId: site.id,
      data: { themes },
    });
    draft.setLastSaved(new Date());
  }, AUTO_SAVE_MIN_INTERVAL);

  useThemesSubscribe((themes) => {
    console.debug("themes have changed, saving them", themes);
    saveThemes(themes);
  });

  // when a page is created, call onPageCreated
  const saveNewPage = useDebounceCallback(async (newPage: Page) => {
    await onPageCreated(newPage);
  }, AUTO_SAVE_MIN_INTERVAL);

  useSitemapSubscribe((sitemap) => {
    // take last item in sitemap that is not the home page
    const page = sitemap.at(-1);
    if (page) {
      saveNewPage({
        id: page.id,
        label: page.label,
        sections: [],
        attributes: resolvePageAttributes({ title: page.label, path: page.path }),
      });
    }
  });
}
