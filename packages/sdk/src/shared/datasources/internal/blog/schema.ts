import { Type, type Static } from "@sinclair/typebox";

export const blogSchema = Type.Array(
  Type.Object({
    title: Type.String({
      description: "Blog post title",
    }),
    content: Type.String({
      description: "Blog post content",
      format: "markdown",
    }),
    author: Type.Object({
      name: Type.String({
        description: "Author's name",
      }),
    }),
    publishedAt: Type.String({
      description: "Publication date in ISO format",
    }),
    updatedAt: Type.Optional(
      Type.String({
        description: "Last update date in ISO format",
      }),
    ),
    slug: Type.String({
      description: "URL-friendly version of the title",
    }),
    status: Type.Union([Type.Literal("draft"), Type.Literal("published"), Type.Literal("archived")], {
      description: "Publication status of the blog post",
    }),
    categories: Type.Optional(
      Type.Array(
        Type.String({
          description: "Blog post categories",
        }),
      ),
    ),
    tags: Type.Optional(
      Type.Array(
        Type.String({
          description: "Blog post tags",
        }),
      ),
    ),
    metadata: Type.Optional(
      Type.Object(
        {
          description: Type.Optional(Type.String()),
          featuredImage: Type.Optional(Type.String()),
        },
        {
          description: "Additional metadata for the blog post",
        },
      ),
    ),
  }),
);

export type BlogSchema = Static<typeof blogSchema>;
