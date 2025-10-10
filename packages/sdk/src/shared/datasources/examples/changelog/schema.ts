import { Type } from "@sinclair/typebox";
import type { InternalDatasource } from "../../types";

const changelogSchema = Type.Array(
  Type.Object({
    title: Type.String({
      title: "Release Title",
      description: "Title of the release",
    }),
    version: Type.Optional(
      Type.String({
        title: "Version",
        description: "Version number",
      }),
    ),
    releaseDate: Type.String({
      title: "Release Date",
      format: "date",
      description: "Release date in ISO format",
    }),
    changes: Type.String({
      title: "Changes",
      description: "Description of changes in this release",
      format: "richtext",
    }),
  }),
  {
    title: "Changelog",
    description: "Changelog items",
  },
);

export const changelogManifestExample: InternalDatasource = {
  id: "changelog",
  label: "Changelog",
  provider: "internal",
  schema: changelogSchema,
  indexes: [
    {
      name: "full_text_search_idx",
      fields: ["title", "changes"],
      fulltext: true,
    },
    {
      name: "version_idx",
      fields: ["version"],
    },
    {
      name: "releaseDate_idx",
      fields: ["releaseDate"],
    },
  ],
};
