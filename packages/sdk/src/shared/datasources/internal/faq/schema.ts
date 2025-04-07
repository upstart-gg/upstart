import { Type, type Static } from "@sinclair/typebox";

export const faqSchema = Type.Array(
  Type.Object({
    question: Type.String({
      description: "Question",
      format: "markdown",
    }),
    answer: Type.String({
      description: "Answer",
      format: "markdown",
    }),
    category: Type.Optional(
      Type.String({
        description: "Category",
      }),
    ),
    tags: Type.Optional(Type.Array(Type.String(), { description: "Tags" })),
    order: Type.Optional(Type.Number({ description: "Order number in the list" })),
  }),
  {
    description: "Schema representing a collection of frequently asked questions (FAQ)",
  },
);

export type FaqSchema = Static<typeof faqSchema>;
