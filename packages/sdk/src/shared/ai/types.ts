// Define your custom message type once
import type { UIMessage } from "ai";
import type { Theme } from "../theme";
import type { Sitemap } from "../sitemap";
import type { VersionedPage } from "../page";
import type { PageAttributes, SiteAttributes } from "../attributes";
import type { Brick, Section } from "../bricks";
import type { AskUserChoiceInput, WaitingMessageSchema } from "./schemas";
import type { Datarecord, InternalDatarecord } from "../datarecords/types";
import type { InternalDatasource } from "../datasources/types";
import type { ImageSearchResultsType } from "../images";
import type { NavbarProps } from "../bricks/manifests/navbar.manifest";
import type { FooterProps } from "../bricks/manifests/footer.manifest";
// ... import your tool and data part types

export type Tools = {
  askUserChoice: {
    input: AskUserChoiceInput;
    output: string | string[] | null; // The user's choice(s
  };
  listThemes: {
    input: null; // Just type the waiting message for now
    output: Theme[];
  };
  createSection: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Section;
  };
  getSection: {
    input: { id: string }; // Just type the waiting message for now
    output: Section | string; // Error string if not found
  };
  listSections: {
    input: null; // Just type the waiting message for now
    output: Section[];
  };
  createThemes: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Theme[];
  };
  getCurrentTheme: {
    input: null; // Just type the waiting message for now
    output: Theme; // Theme or message if no theme applied yet
  };
  createSitemap: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Sitemap;
  };
  getSitemap: {
    input: null; // Just type the waiting message for now
    output: Sitemap;
  };
  createPage: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: VersionedPage;
  };
  editPage: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: VersionedPage;
  };
  getCurrentPage: {
    input: null; // Just type the waiting message for now
    output: VersionedPage;
  };
  createNavbar: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: NavbarProps;
  };
  createFooter: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: FooterProps;
  };
  createBrick: {
    input: WaitingMessageSchema & { sectionId: string; index: number }; // Just type the waiting message for now
    output: Brick;
  };
  editBrick: {
    input: WaitingMessageSchema & { id: string }; // Just type the waiting message for now
    output: Brick;
  };
  listImages: {
    input: null; // Just type the waiting message for now
    output: ImageSearchResultsType;
  };
  listSiteQueries: {
    input: null; // Just type the waiting message for now
    output: NonNullable<SiteAttributes["queries"]>;
  };
  createSiteQueries: {
    input: WaitingMessageSchema & { instructions: string }; // Just type the waiting message for now
    output: NonNullable<SiteAttributes["queries"]>;
  };
  editSiteQueries: {
    input: WaitingMessageSchema & { instructions: string }; // Just type the waiting message for now
    output: NonNullable<SiteAttributes["queries"]>;
  };
  createPageQueries: {
    input: WaitingMessageSchema & { instructions: string }; // Just type the waiting message for now
    output: NonNullable<PageAttributes["queries"]>;
  };
  editPageQueries: {
    input: WaitingMessageSchema & { instructions: string }; // Just type the waiting message for now
    output: NonNullable<PageAttributes["queries"]>;
  };
  createSiteAttributes: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: SiteAttributes;
  };
  getSiteAttributes: {
    input: null; // Just type the waiting message for now
    output: SiteAttributes;
  };
  createDatasource: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: InternalDatasource;
  };
  listDatasources: {
    input: null; // Just type the waiting message for now
    output: InternalDatasource[];
  };
  createDatarecord: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Datarecord;
  };
  listDatarecords: {
    input: null; // Just type the waiting message for now
    output: Datarecord[];
  };
  searchImages: {
    input: WaitingMessageSchema & { query: string }; // Just type the waiting message for now
    output: ImageSearchResultsType;
  };
  deleteBrick: {
    input: { id: string; waitingMessage: string }; // Just type the waiting message for now
    output: boolean | string; // true if deleted, error message if failed
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
