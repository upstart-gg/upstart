import { Type, type Static } from "@sinclair/typebox";

export const faqSchema = Type.Array(
  Type.Object({
    question: Type.String({
      title: "Question",
      format: "markdown",
    }),
    answer: Type.String({
      title: "Answer",
      format: "markdown",
    }),
    category: Type.Optional(
      Type.String({
        title: "Category",
      }),
    ),
    tags: Type.Optional(Type.Array(Type.String(), { title: "Tags" })),
    order: Type.Optional(Type.Number({ title: "Order in the list" })),
  }),
  {
    title: "FAQ",
    description: "Schema representing a collection of frequently asked questions (FAQ)",
  },
);

export type FaqSchema = Static<typeof faqSchema>;
