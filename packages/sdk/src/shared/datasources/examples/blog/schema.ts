import { Type } from "@sinclair/typebox";
import type { InternalDatasource } from "../../types";

const blogSchema = Type.Array(
  Type.Object({
    title: Type.String({
      title: "Title",
      description: "Blog post title",
    }),
    excerpt: Type.String({
      title: "Excerpt",
      description: "Short summary of the blog post",
      format: "richtext",
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
      format: "richtext",
    }),
    author: Type.Object({
      name: Type.String({
        title: "Author Name",
        description: "Author's name",
      }),
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

export const blogSchemaExample: InternalDatasource = {
  id: "blog-posts",
  label: "Blog Posts",
  provider: "internal",
  schema: blogSchema,
  indexes: [
    {
      name: "full_text_search_idx",
      fields: ["title", "excerpt", "content"],
      fulltext: true,
    },
    {
      name: "tags_idx",
      fields: ["tags"],
    },
    {
      name: "categories_idx",
      fields: ["categories"],
    },
  ],
};
