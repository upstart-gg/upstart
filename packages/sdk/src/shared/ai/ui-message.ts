// Define your custom message type once
import type { UIMessage } from "ai";
import type { Theme } from "../theme";
import type { Sitemap } from "../sitemap";
import type { VersionedPage } from "../page";
import type { PageAttributes, SiteAttributes } from "../attributes";
import type { Brick, Section } from "../bricks";
import type { AskUserChoiceInput, WaitingMessageSchema } from "./schemas";
import type { InternalDatarecord } from "../datarecords/types";
import type { InternalDatasource } from "../datasources/types";
import type { ImageSearchResultsType } from "../images";
import type { NavbarProps } from "../bricks/manifests/navbar.manifest";
import type { FooterProps } from "../bricks/manifests/footer.manifest";
// ... import your tool and data part types

export type Tools = {
  askUserChoice: {
    input: AskUserChoiceInput;
    output: string | string[]; // The user's choice(s
  };
  createSection: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Section;
  };
  createThemes: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: Theme[];
  };
  createSitemap: {
    input: WaitingMessageSchema; // Just type the waiting message for now
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
  createNavbar: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: NavbarProps;
  };
  createFooter: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: FooterProps;
  };
  createSiteAttributes: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: SiteAttributes;
  };
  createDatasource: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: InternalDatasource;
  };
  createDatarecord: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: InternalDatarecord;
  };
  searchImages: {
    input: WaitingMessageSchema & { query: string }; // Just type the waiting message for now
    output: ImageSearchResultsType;
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
