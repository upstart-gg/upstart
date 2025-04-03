import { type TObject, Type, type Static } from "@sinclair/typebox";
import { processAttributesSchema, defaultAttributesSchema } from "./attributes";
import { datasourcesMap } from "./datasources/types";
import { templatePageSchema } from "./page";
import { manifestSchema } from "./manifest";
import { themeSchema } from "./theme";

export * from "@sinclair/typebox";

type TemplateDefinedConfig = Omit<TemplateConfig, "attributes"> & {
  attributes: TObject;
};

export function defineConfig(config: TemplateDefinedConfig): TemplateConfig {
  return {
    attributes: processAttributesSchema(config.attributes),
    attr: config.attr,
    manifest: config.manifest,
    pages: config.pages,
    themes: config.themes,
    ...(config.datasources ? { datasources: config.datasources } : {}),
  };
}

export const templateSchema = Type.Object(
  {
    manifest: manifestSchema,
    themes: Type.Array(themeSchema),
    datasources: Type.Optional(datasourcesMap),
    // Those are site-level attributes
    attributes: defaultAttributesSchema,
    attr: Type.Record(Type.String(), Type.Any()),
    pages: Type.Array(templatePageSchema),
  },
  {
    title: "Template schema",
    description: "The template configuration schema",
  },
);

export type StaticTemplate = Static<typeof templateSchema>;

export type TemplateConfig = Omit<StaticTemplate, "attributes" | "pages"> & {
  attributes: typeof defaultAttributesSchema;
  pages: Array<
    Omit<StaticTemplate["pages"][number], "attributes"> & {
      attributes?: typeof defaultAttributesSchema;
    }
  >;
};
