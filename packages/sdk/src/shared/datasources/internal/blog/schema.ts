import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "../../../utils/string-enum";

export const blogSchema = Type.Array(
  Type.Object({
    title: Type.String({
      title: "Title",
      description: "Blog post title",
    }),
    excerpt: Type.String({
      title: "Excerpt",
      description: "Short summary of the blog post",
      format: "markdown",
    }),
    image: Type.Optional(
      Type.String({
        title: "Image URL",
        format: "uri",
        description: "Blog post image",
      }),
    ),
    content: Type.String({
      title: "Content",
      description: "Blog post content",
      format: "markdown",
    }),
    author: Type.Object({
      name: Type.String({
        title: "Author Name",
        description: "Author's name",
      }),
    }),
    publishedAt: Type.String({
      title: "Published Date",
      format: "date",
      description: "Publication date in ISO format",
    }),
    slug: Type.String({
      title: "Slug",
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      description: "URL-friendly version of the title",
    }),
    status: StringEnum(["draft", "published", "archived"], {
      title: "Status",
      description: "Publication status of the blog post",
    }),
    categories: Type.Optional(
      Type.Array(
        Type.String({
          title: "Categories",
          description: "Blog post categories",
        }),
      ),
    ),
    tags: Type.Optional(
      Type.Array(
        Type.String({
          title: "Tags",
          description: "Blog post tags",
        }),
      ),
    ),
  }),
  {
    title: "Blog Posts",
    description: "List of blog posts",
  },
);

export type BlogSchema = Static<typeof blogSchema>;
