import { Type, type Static } from "@sinclair/typebox";

export const recipesSchema = Type.Array(
  Type.Object({
    title: Type.String({
      description: "Title of the recipe",
    }),
    description: Type.String({
      description: "Description of the recipe",
      format: "markdown",
    }),
    time: Type.String({
      description: "Time to prepare the recipe",
    }),
    ingredients: Type.Array(
      Type.Object({
        name: Type.String({
          description: "Name of the ingredient",
        }),
        quantity: Type.String({
          description: "Quantity of the ingredient",
        }),
      }),
    ),
    steps: Type.Array(
      Type.Object({
        title: Type.String({
          description: "Step title",
        }),
        description: Type.String({
          description: "Step description",
        }),
      }),
    ),
  }),
  {
    description: "Schema representing a collection of recipes",
  },
);

export type RecipesSchema = Static<typeof recipesSchema>;
