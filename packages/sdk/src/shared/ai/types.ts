// Define your custom message type once
import type { UIMessage } from "ai";
import type { Theme } from "../themes/theme";
import type { Sitemap } from "../site/sitemap";
import type { Page, VersionedPage } from "../site/page";
import type { PageAttributes, SiteAttributes } from "../site/attributes";
import type { Brick, Section, SectionSchemaNoBricks } from "../bricks/types";
import type {
  AskUserChoiceInput,
  ToolInputWaitingMessageType,
  ToolInputInstructionsType,
  ToolOutputWaitingMessageType,
} from "./schemas";
import type { Datarecord } from "../datarecords/types";
import type { InternalDatasource } from "../datasources/types";
import type { ImageSearchResultsType } from "./images";

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
  editSiteAttributes: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType;
    output: SiteAttributes;
  };
  generateImages: {
    input: ToolInputWaitingMessageType & { prompt: string; count: number; aspectRatio: string };
    output: ImageSearchResultsType;
  };
  delegateToOrchestrator: {
    input: unknown;
    output: ToolOutputWaitingMessageType & {
      status: "completed" | "in-progress" | "failed";
    };
  };
  listThemes: {
    input: unknown;
    output: Theme[];
  };
  createSection: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & Pick<Section, "id" | "label" | "order">;
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
  createThemes: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & { count: number };
    output: Theme[];
  };
  getCurrentTheme: {
    input: unknown;
    output: Theme; // Theme or message if no theme applied yet
  };
  // createSitemap: {
  //   input: ToolInputWaitingMessageType & ToolInputInstructionsType;
  //   output: Sitemap;
  // };
  createPage: {
    input: Pick<Page, "label"> &
      Pick<PageAttributes, "path"> &
      ToolInputWaitingMessageType &
      ToolInputInstructionsType;
    output: VersionedPage;
  };
  editPage: {
    input: ToolInputWaitingMessageType & ToolInputInstructionsType & Pick<Page, "id">;
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
  setTheme: {
    input: { id: string };
    output: Theme;
  };
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
};

type Metadata = {
  init?: boolean;
  creditsUsed?: number;
  userLanguage?: string; // ISO code of the user's language, e.g. "en", "fr", "es"
  wip?: boolean; // For current tests - TODO: remove later
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
