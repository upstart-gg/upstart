import { Type, type Static } from "@sinclair/typebox";

export const recipesSchema = Type.Array(
  Type.Object({
    title: Type.String({
      title: "Title",
    }),
    description: Type.String({
      title: "Description",
      format: "markdown",
    }),
    time: Type.String({
      title: "Time to prepare the recipe",
    }),
    ingredients: Type.Array(
      Type.Object({
        name: Type.String({
          title: "Name of the ingredient",
        }),
        quantity: Type.String({
          title: "Quantity of the ingredient",
        }),
      }),
    ),
    steps: Type.Array(
      Type.Object({
        title: Type.String({
          title: "Step title",
        }),
        description: Type.String({
          title: "Step description",
        }),
      }),
    ),
  }),
  {
    title: "Recipes",
    description: "Collection of recipes",
  },
);

export type RecipesSchema = Static<typeof recipesSchema>;
