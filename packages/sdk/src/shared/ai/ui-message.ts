// Define your custom message type once
import type { UIMessage } from "ai";
import type { Theme } from "../theme";
import type { Sitemap } from "../sitemap";
import type { VersionedPage } from "../page";
import type { PageAttributes, SiteAttributes } from "../attributes";
import type { Brick } from "../bricks";
import type { AskUserChoiceInput, WaitingMessageSchema } from "./schemas";
import type { InternalDatarecord } from "../datarecords/types";
import type { InternalDatasource } from "../datasources/types";
import type { ImageSearchResultsType } from "../images";
// ... import your tool and data part types

export type Tools = {
  askUserChoice: {
    input: AskUserChoiceInput;
    output: string | string[]; // The user's choice(s
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
    output: unknown;
  };
  createFooter: {
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: unknown;
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
    input: WaitingMessageSchema; // Just type the waiting message for now
    output: ImageSearchResultsType;
  };
};

type Metadata = {
  creditsUsed: number;
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
