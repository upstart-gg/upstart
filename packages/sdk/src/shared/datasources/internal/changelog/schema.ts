import { Type, type Static } from "@sinclair/typebox";

export const changelogSchema = Type.Array(
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
    date: Type.String({
      title: "Release Date",
      format: "date",
      description: "Release date in ISO format",
    }),
    changes: Type.Array(
      Type.Object({
        type: Type.Union(
          [
            Type.Literal("added"),
            Type.Literal("changed"),
            Type.Literal("fixed"),
            Type.Literal("improved"),
            Type.Literal("deprecated"),
            Type.Literal("removed"),
          ],
          {
            title: "Change Type",
          },
        ),
        description: Type.String({
          title: "Description",
          format: "markdown",
        }),
      }),
    ),
  }),
);

export type ChangelogSchema = Static<typeof changelogSchema>;
