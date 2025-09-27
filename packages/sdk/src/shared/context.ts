import { type Static, Type } from "@sinclair/typebox";
import { imageResultsSchema, type ImageSearchResultsType } from "./images";
import { pageSchema, versionedPageSchema, type VersionedPage } from "./page";
import { siteSchema, type Site } from "./site";

export const generationStateSchema = Type.Object(
  {
    isReady: Type.Boolean(),
    isSetup: Type.Boolean(),
    hasSitemap: Type.Boolean(),
    hasThemesGenerated: Type.Boolean(),
  },
  {
    additionalProperties: false,
  },
);

export type GenerationState = {
  isReady: boolean;
  isSetup: boolean;
  hasSitemap: boolean;
  hasThemesGenerated: boolean;
};

export const callContextSchema = Type.Object(
  {
    site: siteSchema,
    page: versionedPageSchema,
    generationState: Type.Optional(generationStateSchema),
    userLanguage: Type.Optional(
      Type.String({
        minLength: 2,
        maxLength: 2,
      }),
    ),
    assets: imageResultsSchema,
  },
  {
    additionalProperties: true,
  },
);

export type CallContextProps = Static<typeof callContextSchema>;
