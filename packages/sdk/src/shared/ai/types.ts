// Define your custom message type once
import type { UIMessage } from "ai";
import type { Theme } from "../theme";
import type { Sitemap, SitemapWithPlans } from "../sitemap";
import type { Page, VersionedPage } from "../page";
import type {
  PageAttributes,
  PageAttributesNoQueries,
  SiteAttributes,
  SiteAttributesNoQueries,
} from "../attributes";
import type { Brick, Section, SectionSchemaNoBricks } from "../bricks";
import type {
  AskUserChoiceInput,
  ToolInputWaitingMessageType,
  ToolInputInstructionsType,
  GetDocInput,
} from "./schemas";
import type { Datarecord, InternalDatarecord } from "../datarecords/types";
import type { InternalDatasource } from "../datasources/types";
import type { ImageSearchResultsType } from "../images";
import type { Site } from "../site";
// ... import your tool and data part types

export type Tools = {
  setSitePrompt: {
    input: { prompt: string };
    output: string;
  };
  getBrickDocs: {
    input: { type: string };
    output: string; // The schema documentation in markdown format
  };
  askUserChoice: {
    input: AskUserChoiceInput;
    output: string | string[] | null; // The user's choice(s
  };
  setSiteAttributes: {
    input: SiteAttributesNoQueries;
    output: SiteAttributesNoQueries;
  };
  setPageAttributes: {
    input: PageAttributesNoQueries;
    output: PageAttributesNoQueries;
  };
  generateImages: {
    input: ToolInputWaitingMessageType & { prompt: string; count: number; aspectRatio: string };
    output: ImageSearchResultsType;
  };
  getCurrentSite: {
    input: unknown;
    output: Site;
  };
  listThemes: {
    input: unknown;
    output: Theme[];
  };
  createSection: {
    input: SectionSchemaNoBricks;
    output: Section;
  };
  editSection: {
    input: { id: string; data: Partial<SectionSchemaNoBricks> };
    output: Section;
  };
  deleteSection: {
    input: { id: string };
    output: { sections: Section[]; deleted: Section }; // Updated sections or error string if failed
  };
  getSection: {
    input: { id: string };
    output: Section; // Error string if not found
  };
  listSections: {
    input: unknown;
    output: Section[];
  };
  createThemes: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & { count: number };
    output: Theme[];
  };
  getCurrentTheme: {
    input: unknown;
    output: Theme; // Theme or message if no theme applied yet
  };
  createSitemap: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType;
    output: SitemapWithPlans;
  };
  createPage: {
    input: Omit<Page, "sections">;
    output: VersionedPage;
  };
  undo: {
    input: {
      steps?: number;
    };
    output: boolean;
  };
  setSiteLabel: {
    input: { label: string };
    output: string;
  };
  // editPage: {
  //   input: ToolInputWaitingMessageType;
  //   output: VersionedPage;
  // };
  listPages: {
    input: unknown;
    output: Sitemap;
  };
  getCurrentPage: {
    input: unknown;
    output: VersionedPage;
  };
  analyzeUrl: {
    input: {
      url: string;
      prompt: string;
    };
    output: string;
  };
  createBrick: {
    input: {
      instructions: string;
      otherBrickTypes: string[];
      sectionId: string;
      id: string;
      type: string;
      insertAt: { type: "section"; index: number } | { type: "brick"; id: string; index: number };
    };
    output: Brick;
  };
  editBrick: {
    input: { id: string; instructions: string; otherBrickTypes: string[] };
    output: Brick;
  };
  listImages: {
    input: unknown;
    output: ImageSearchResultsType;
  };
  listSiteQueries: {
    input: unknown;
    output: NonNullable<SiteAttributes["queries"]>;
  };
  listPageQueries: {
    input: unknown;
    output: NonNullable<PageAttributes["queries"]>;
  };
  createSiteQueries: {
    input: ToolInputWaitingMessageType & { instructions: string };
    output: NonNullable<SiteAttributes["queries"]>;
  };
  setTheme: {
    input: { id: string };
    output: Theme;
  };
  // editSiteQueries: {
  //   input: ToolInputWaitingMessageType & { instructions: string };
  //   output: NonNullable<SiteAttributes["queries"]>;
  // };
  createPageQueries: {
    input: ToolInputWaitingMessageType & { instructions: string };
    output: NonNullable<PageAttributes["queries"]>;
  };
  // editPageQueries: {
  //   input: ToolInputWaitingMessageType & { instructions: string };
  //   output: NonNullable<PageAttributes["queries"]>;
  // };
  // createSiteAttributes: {
  //   input: ToolInputWaitingMessageType;
  //   output: SiteAttributes;
  // };
  // getSiteAttributes: {
  //   input: unknown;
  //   output: SiteAttributes;
  // };

  createDatasource: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & { id: string };
    output: InternalDatasource;
  };
  listDatasources: {
    input: unknown;
    output: InternalDatasource[];
  };
  createDatarecord: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & { id: string };
    output: Datarecord;
  };
  listDatarecords: {
    input: unknown;
    output: Datarecord[];
  };
  searchImages: {
    input: ToolInputWaitingMessageType & { query: string };
    output: ImageSearchResultsType;
  };
  deleteBrick: {
    input: { id: string };
    output: Brick;
  };
  deleteSiteQuery: {
    input: { id: string };
    output: NonNullable<SiteAttributes["queries"]>; // Updated queries or error message if failed
  };
  deletePageQuery: {
    input: { alias: string };
    output: NonNullable<PageAttributes["queries"]>; // Updated queries or error message if failed
  };
};

type Metadata = {
  creditsUsed: number;
  userLanguage: string; // ISO code of the user's language, e.g. "en", "fr", "es"
};

// For now, let's keep it simple
type Data = {
  themes: Theme[];
  sitemap: Sitemap;
  page: VersionedPage;
  brick: {
    sectionId: string;
    brick: Brick;
  };
};

export type UpstartUIMessage = UIMessage<Metadata, Data, Tools>;
