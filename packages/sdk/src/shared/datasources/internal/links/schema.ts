import { Type, type Static } from "@sinclair/typebox";

export const linksSchema = Type.Array(
  Type.Object({
    url: Type.String({ format: "uri", title: "URL" }),
    title: Type.String({ title: "Title" }),
    description: Type.Optional(Type.String({ title: "Description", format: "markdown" })),
    icon: Type.Optional(Type.String({ title: "Icon", format: "uri" })),
  }),
  {
    description: "Schema representing a collection of links",
  },
);

export type LinksSchema = Static<typeof linksSchema>;
