import { Type, type Static } from "@sinclair/typebox";

export const templateManifestSchema = Type.Object({
  id: Type.Optional(
    Type.String({
      title: "Template ID",
      description: "A unique identifier for the template. Can be any string, but should be unique.",
    }),
  ),
  name: Type.String({
    title: "Template Name",
  }),
  description: Type.Optional(
    Type.String({
      title: "Show template description",
    }),
  ),
  readme: Type.Optional(
    Type.Record(
      Type.RegExp(/^[a-z]{2}$/), // language code
      Type.String(),
      {
        title: "Readme texts.",
        description:
          "A dictionary of readme files for different languages (iso 2 letters code). Currently on supported for 'en' and 'fr'.",
      },
    ),
  ),
  tags: Type.Optional(Type.Array(Type.String(), { title: "Tags" })),
  author: Type.Optional(
    Type.String({
      title: "Author name",
    }),
  ),
  thumbnail: Type.Optional(
    Type.String({
      title: "Thumbnail",
      description: "A URL to the thumbnail image for the template.",
    }),
  ),
  homepage: Type.Optional(
    Type.String({
      title: "Homepage",
      description: "A URL to the homepage of the template.",
    }),
  ),
});

export type TemplateManifest = Static<typeof templateManifestSchema>;
export type PublishedTemplateManifest = TemplateManifest & Required<Pick<TemplateManifest, "id">>;
