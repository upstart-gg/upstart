import { Type, type Static } from "@sinclair/typebox";

export const linksSchema = Type.Array(
  Type.Object({
    url: Type.String({ format: "uri", description: "URL" }),
    title: Type.String({ description: "Title" }),
    description: Type.Optional(Type.String({ description: "Description", format: "markdown" })),
    icon: Type.Optional(Type.String({ description: "Icon" })),
  }),
  {
    description: "Schema representing a collection of links",
  },
);

export type LinksSchema = Static<typeof linksSchema>;
