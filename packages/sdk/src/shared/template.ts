import type { TObject, TProperties } from "@sinclair/typebox";
import { processAttributesSchema, type Attributes } from "./attributes";
import type { DatasourcesMap } from "./datasources/types";
import type { TemplateManifest } from "./manifest";
import type { TemplatePage } from "./page";
import type { Theme } from "./theme";

export function defineConfig(config: TemplateConfig): TemplateConfig {
  return {
    attributes: processAttributesSchema(config.attributes),
    attr: config.attr,
    manifest: config.manifest,
    pages: config.pages,
    themes: config.themes,
    ...(config.datasources ? { datasources: config.datasources } : {}),
  };
}

export type TemplateConfig = {
  /**
   * The template manifest and settings
   */
  manifest?: TemplateManifest;
  /**
   * The attributes declared for the template
   */
  attributes: TObject<TProperties>;
  attr?: Partial<Attributes>;
  /**
   * The datasources declared for the template
   */
  datasources?: DatasourcesMap;
  /**
   * The Pages
   */
  pages: TemplatePage[];
  /**
   * The themes declared by the site.
   */
  themes: Theme[];
};
