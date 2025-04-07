import { Type, type Static } from "@sinclair/typebox";

export const changelogSchema = Type.Array(
  Type.Object({
    title: Type.String({
      description: "Title of the release",
    }),
    version: Type.Optional(
      Type.String({
        description: "Version number",
      }),
    ),
    date: Type.String({
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
            description: "Type of change",
          },
        ),
        description: Type.String({
          description: "Description of the change",
          format: "markdown",
        }),
      }),
    ),
  }),
);

export type ChangelogSchema = Static<typeof changelogSchema>;
