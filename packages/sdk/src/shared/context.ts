import type { VersionedPage } from "./page";
import type { Site } from "./site";

export type GenerationState = {
  isReady: boolean;
  hasSitemap: boolean;
  hasThemesGenerated: boolean;
};

export type CallContextProps = {
  /**
   * The site object
   */
  site: Site;
  /**
   * Current page. Undefined if flow is "setup" and no page has been created yet.
   */
  page: VersionedPage;

  /**
   * The current generation state of the site. Only used when flow is "setup".
   */
  generationState?: GenerationState;
  /**
   * The user language guessed from the sitePrompt, if available.
   */
  userLanguage?: string;
};
