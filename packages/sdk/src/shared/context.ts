import { type Static, Type } from "@sinclair/typebox";
import { imageResultsSchema } from "./images";
import { versionedPageSchema } from "./page";
import { siteSchema } from "./site";

export const generationStateSchema = Type.Object({
  isReady: Type.Boolean(),
  isSetup: Type.Boolean(),
  hasSitemap: Type.Boolean(),
  hasThemesGenerated: Type.Boolean(),
});

export type GenerationState = {
  isReady: boolean;
  isSetup: boolean;
  hasSitemap: boolean;
  hasThemesGenerated: boolean;
};

export const callContextSchema = Type.Object({
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
});

export type CallContextProps = Static<typeof callContextSchema>;
