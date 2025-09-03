import type { VersionedPage } from "./page";
import type { Site } from "./site";
import type { Sitemap } from "./sitemap";

export type GenerationState = {
  isReady: boolean;
  hasSitemap: boolean;
  hasThemesGenerated: boolean;
  sitemap: Sitemap;
};

export type CallContextProps = {
  /**
   * The site object
   */
  site: Site;
  /**
   * Sitemap
   */
  sitemap: Sitemap;
  /**
   * Current page. Undefined if flow is "setup" and no page has been created yet.
   */
  page?: VersionedPage;

  /**
   * The current generation state of the site. Only used when flow is "setup".
   */
  generationState?: GenerationState;
  /**
   * The user language guessed from the sitePrompt, if available.
   */
  userLanguage?: string;
};
