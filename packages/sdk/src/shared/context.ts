import type { GenericPageConfig } from "./page";
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
   * All pages in the site.
   */
  pages: GenericPageConfig[];
  /**
   * Current page ID. Undefined if flow is "setup" and no paage has been created yet.
   */
  currentPageId?: string;
  /**
   * When generating a new site, the flow should be "setup".
   * Otherwise, it should be "edit".
   */
  flow: "setup" | "edit";
  /**
   * The current generation state of the site. Only used when flow is "setup".
   */
  generationState?: GenerationState;
  /**
   * The initial site prompt describing the purpose and main features of the site.
   */
  sitePrompt: string;
  /**
   * The user language guessed from the sitePrompt, if available.
   */
  userLanguage?: string;
};
