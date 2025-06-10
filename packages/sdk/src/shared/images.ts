import { type Static, Type } from "@sinclair/typebox";
import { StringEnum } from "./utils/schema";

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
      provider: Type.String(),
      description: Type.String(),
      url: Type.String(),
      blurHash: Type.String(),
      user: Type.Object(
        {
          name: Type.String(),
          profile_url: Type.String(),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
);

export const imagesMapSchema = Type.Record(Type.String({ title: "Page id" }), imageResultsSchema);
export type ImagesMap = Static<typeof imagesMapSchema>;

export type ImageSearchResultsType = Static<typeof imageResultsSchema>;
export type SimpleImageMetadata = Pick<
  ImageSearchResultsType[number],
  "description" | "blurHash" | "user" | "url"
>;
