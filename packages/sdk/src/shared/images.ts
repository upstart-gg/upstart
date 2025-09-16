import { type Static, Type } from "@sinclair/typebox";
import { StringEnum } from "./utils/string-enum";

export const imageSearchSchema = Type.Object({
  query: Type.String({
    description: 'The search query for finding images (e.g. "mountain landscape", "coffee shop")',
  }),
  orientation: Type.Optional(
    StringEnum(["landscape", "portrait", "squarish"], {
      description: "Filter by photo orientation",
    }),
  ),
});

// Derive TypeScript type from the schema
export type ImageSearchParams = Static<typeof imageSearchSchema>;

export const imageResultsSchema = Type.Array(
  Type.Object(
    {
      provider: Type.String({ description: "The image provider (e.g. unsplash, pexels)" }),
      description: Type.String({ description: "A brief description of the image" }),
      url: Type.String({ description: "The URL of the image" }),
      blurHash: Type.String({ description: "The blur hash of the image" }),
      user: Type.Object(
        {
          name: Type.String({ description: "The name of the user who uploaded the image" }),
          profile_url: Type.String({ description: "The profile URL of the user who uploaded the image" }),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
  {
    title: "Array of image search results",
  },
);

export type ImageSearchResultsType = Static<typeof imageResultsSchema>;
export type SimpleImageMetadata = Pick<
  ImageSearchResultsType[number],
  "description" | "blurHash" | "user" | "url" | "provider"
>;
