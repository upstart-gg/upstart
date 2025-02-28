import { Type, type Static, type TSchema } from "@sinclair/typebox";

export const stylePreset = Type.Object(
  {
    style: Type.Union([
      Type.Literal("ghost", {
        title: "Ghost",
        description: "Minimal style with transparent background and no border",
      }),
      Type.Literal("plain", {
        title: "Plain",
        description: "Simple style with solid dark background and basic border",
      }),
      Type.Literal("plain2", {
        title: "Plain 2",
        description: "Simple style with solid dark background and basic border",
      }),
      Type.Literal("plain3", {
        title: "Plain 3",
        description: "Simple style with solid dark background and basic border",
      }),
      Type.Literal("modern", {
        title: "Modern",
        description: "Bold borders with generous spacing and sharp corners",
      }),
      Type.Literal("modern2", {
        title: "Modern 2",
        description: "Bold borders with generous spacing and sharp corners",
      }),
      Type.Literal("soft", {
        title: "Soft",
        description: "Gentle curves and muted colors for a comfortable feel",
      }),
      Type.Literal("glass", {
        title: "Glass",
        description: "Translucent backdrop with blur effect for depth",
      }),
      Type.Literal("elevated", {
        title: "Elevated",
        description: "Floating appearance with shadow depth and no borders",
      }),
      Type.Literal("outlined", {
        title: "Outlined",
        description: "Simple outline with hover effect and no background",
      }),
      Type.Literal("paper", {
        title: "Paper",
        description: "Subtle texture and slight rotation for a paper-like appearance",
      }),
      Type.Literal("gradient", {
        title: "Gradient",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("gradient2", {
        title: "Gradient 2",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("gradient3", {
        title: "Gradient 3",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("gradient4", {
        title: "Gradient 4",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("gradient5", {
        title: "Gradient 5",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("gradient6", {
        title: "Gradient 6",
        description: "Smooth color gradients background with soft edges",
      }),
      Type.Literal("callout", {
        title: "Callout",
        description: "Prominent style for important information or CTAs",
      }),
    ]),
    variant: Type.Union([
      Type.Literal("primary", {
        title: "Primary",
        description: "Uses the theme primary color as the main color",
      }),
      Type.Literal("secondary", {
        title: "Secondary",
        description: "Uses the theme secondary color as the main color",
      }),
      Type.Literal("accent", {
        title: "Accent",
        description: "Uses the theme accent color as the main color",
      }),
      Type.Literal("neutral", {
        title: "Neutral",
        description: "Uses the theme neutral color as the main color",
      }),
    ]),
  },
  {
    "ui:field": "hidden",
  },
);

export type StylePreset = Static<typeof stylePreset>;

export const commonProps = Type.Object({
  id: Type.String({
    title: "Brick ID",
    "ui:field": "hidden",
  }),
  className: Type.String({
    default: "",
    "ui:field": "hidden",
  }),
  lastTouched: Type.Number({
    default: 0,
    "ui:field": "hidden",
  }),
  editable: Type.Boolean({
    description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
    default: false,
    "ui:field": "hidden",
  }),
  stylePreset,
});

export const richText = Type.String({
  default: "some text here",
  // "ui:field": "rich-text",
  "ui:paragraph-mode": "auto",
  "ui:field": "hidden",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export const richTextHero = Type.String({
  default: "<h1>some text here</h1>",
  "ui:field": "hidden",
  "ui:paragraph-mode": "hero",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export type RichText = Static<typeof richText>;

const imageProps = Type.Object(
  {
    src: Type.String({
      default: "/placeholder.svg",
      title: "Image",
    }),
    alt: Type.String({
      title: "Alternate Text",
      description: "Alternative text for the image. Recommended for screen readers and SEO.",
      "ui:placeholder": "Your image description",
    }),
  },
  {
    "ui:group": "image",
    "ui:group:title": "Image",
    "ui:group:order": 1,
    "ui:field": "image",
    "ui:accept": "image/*",
    "ui:show-img-search": true,
    "ui:allow-url": true,
  },
);

export type ImageProps = Static<typeof imageProps>;

export const imageSettings = Type.Object(imageProps.properties, {
  default: {
    src: "https://placehold.co/400x200",
    alt: "my image",
  },
});

export type ImageSettings = Static<typeof imageSettings>;

export const contentAwareProps = Type.Object({
  content: richText,
});

export const contentAwareHeroProps = Type.Object({
  content: richTextHero,
});

const datasource = Type.Object(
  {
    id: Type.String({
      title: "Data Source ID",
      description: "The ID of the data source to fetch data from",
    }),
    mapping: Type.Object(
      {},
      { additionalProperties: true, description: "Mapping of data source fields to brick props" },
    ),
  },
  {
    title: "Data source",
    description: "The data source to fetch data from",
    "ui:field": "datasource",
    additionalProperties: true,
  },
);

// export function getDatasourcesProp<T extends TSchema>(schema: T) {
//   return Type.Object({
//     datasources: Type.Object(
//       {
//         id: Type.String({
//           title: "Data Source ID",
//           description: "The ID of the data source to fetch data from",
//         }),
//         mapping: Type.Object(
//           {},
//           { additionalProperties: true, description: "Mapping of data source fields to brick props" },
//         ),
//         schema,
//       },
//       {
//         title: "Data source",
//         description: "The data source to fetch data from",
//         "ui:field": "datasource",
//         additionalProperties: true,
//       },
//     ),
//   });
// }

// export type DatasourceSettings = Static<ReturnType<typeof getDatasourcesProp<TSchema>>>["datasources"];

export const datasourceRef = Type.Object(
  {
    id: Type.String({
      title: "Data Source ID",
    }),
    useExistingDatasource: Type.Boolean({
      title: "Use Existing data source",
      default: false,
    }),
    mapping: Type.Record(Type.String(), Type.String(), {
      description: "Mapping of data source fields to brick props",
    }),
    filters: Type.Optional(
      Type.Record(
        Type.String(),
        Type.Object({
          op: Type.Union([
            Type.Literal("eq"),
            Type.Literal("ne"),
            Type.Literal("lt"),
            Type.Literal("lte"),
            Type.Literal("gt"),
            Type.Literal("gte"),
            Type.Literal("in"),
            Type.Literal("nin"),
            Type.Literal("contains"),
            Type.Literal("startsWith"),
            Type.Literal("endsWith"),
          ]),
          value: Type.String(),
        }),
        { description: "Filter data source records" },
      ),
    ),
    sort: Type.Optional(
      Type.Record(Type.String(), Type.String(), { description: "Sort data source records" }),
    ),
    limit: Type.Optional(Type.Number({ description: "Limit the number of records to fetch" })),
    offset: Type.Optional(Type.Number({ description: "Offset the records to fetch" })),
  },
  {
    title: "Database",
    description: "Reference to a data source",
    "ui:field": "datasource-ref",
    "ui:group": "content",
    "ui:group:title": "Database",
  },
);

export type DatasourceRef = Static<typeof datasourceRef>;

export const datasourceRefProps = Type.Object({
  datasourceRef,
});
