import { Type, type Static } from "@sinclair/typebox";

const groupBorder = {
  "ui:group": "border",
  "ui:group:title": "Border",
};

const groupSpacing = {
  "ui:group": "spacing",
  "ui:group:title": "Spacing",
};

const groupEffects = {
  "ui:group": "effects",
  "ui:group:title": "Effects",
};

const groupColors = {
  "ui:group": "colors",
  "ui:group:title": "Colors",
  "ui:group:order": 2,
};

const groupLayout = {
  "ui:group": "layout",
  "ui:group:title": "Layout",
  "ui:group:order": 0,
};

const groupAlign = {
  "ui:group": "align",
  "ui:group:title": "Alignment",
};

export const borderWidth = Type.Union(
  [
    Type.Literal("border-0", { title: "None" }),
    Type.Literal("border", { title: "Small" }),
    Type.Literal("border-2", { title: "Medium" }),
    Type.Literal("border-4", { title: "Large" }),
    Type.Literal("border-8", { title: "Extra large" }),
  ],
  {
    $id: "borderWidth",
    default: "border-0",
    title: "Border width",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const borderColor = Type.String({
  $id: "borderColor",
  default: "transparent",
  title: "Border color",
  "ui:field": "color",
  "ui:color-type": "border",
  ...groupBorder,
});

export function getTextShadowSchema(opts = groupEffects, defaultValue = "text-shadow-md") {
  return Type.Union(
    [
      Type.Literal("text-shadow-none", { title: "None" }),
      Type.Literal("text-shadow-sm", { title: "S" }),
      Type.Literal("text-shadow-md", { title: "M" }),
      Type.Literal("text-shadow-lg", { title: "L" }),
      Type.Literal("text-shadow-xl", { title: "XL" }),
    ],
    {
      default: defaultValue,
      title: "Text shadow",
      "ui:field": "enum",
      "ui:display": "button-group",
      ...opts,
    },
  );
}

export const borderStyle = Type.Union(
  [
    Type.Literal("border-solid", { title: "Solid" }),
    Type.Literal("border-dashed", { title: "Dashed" }),
    Type.Literal("border-dotted", { title: "Dotted" }),
  ],
  {
    $id: "borderStyle",
    default: "border-solid",
    title: "Border style",
    description: "The brick border style",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const borderRadius = Type.Union(
  [
    Type.Literal("rounded-none", { title: "None" }),
    Type.Literal("rounded-sm", { title: "Small" }),
    Type.Literal("rounded-md", { title: "Medium" }),
    Type.Literal("rounded-lg", { title: "Large" }),
    Type.Literal("rounded-xl", { title: "Extra large" }),
    Type.Literal("rounded-full", { title: "Full" }),
  ],
  {
    $id: "borderRadius",
    default: "rounded-none",
    title: "Rounding",
    description: "Corners rounding",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupBorder,
  },
);

export const border = Type.Optional(
  Type.Object(
    {
      radius: borderRadius,
      style: borderStyle,
      color: borderColor,
      width: borderWidth,
    },
    {
      title: "Border style",
      "ui:field": "border",
      "ui:group": "borders",
      "ui:group:title": "Borders",
      default: {
        radius: "rounded-none",
        style: "border-solid",
        color: "#000000",
        width: "border-0",
      },
    },
  ),
);

export type BorderSettings = Static<typeof border>;

export const padding = Type.Union(
  [
    Type.Literal("p-0", { title: "None" }),
    Type.Literal("p-1", { title: "Small" }),
    Type.Literal("p-2", { title: "Medium" }),
    Type.Literal("p-4", { title: "Large" }),
    Type.Literal("p-8", { title: "Extra large" }),
    Type.Literal("p-16", { title: "Extra large (v2)" }),
  ],
  {
    $id: "padding",
    default: "p-2",
    title: "Padding",
    description: "Space between the content and the border",
    "ui:field": "enum",
    "ui:display": "select",
    ...groupSpacing,
  },
);

export const layout = Type.Object(
  {
    height: Type.Optional(
      Type.Union([Type.Literal("fixed", { title: "Fixed" }), Type.Literal("auto", { title: "Auto" })]),
    ),
    padding: Type.Optional(padding),
    // verticalAlign: Type.Optional(
    //   Type.Union(
    //     [
    //       Type.Literal("start", { title: "Top" }),
    //       Type.Literal("center", { title: "Middle" }),
    //       Type.Literal("end", { title: "Bottom" }),
    //     ],
    //     {
    //       title: "Vertical align",
    //     },
    //   ),
    // ),
    // horizontalAlign: Type.Optional(
    //   Type.Union(
    //     [
    //       Type.Literal("start", { title: "Top" }),
    //       Type.Literal("center", { title: "Middle" }),
    //       Type.Literal("end", { title: "Bottom" }),
    //     ],
    //     {
    //       title: "Horizontal align",
    //     },
    //   ),
    // ),
  },
  {
    title: "Layout",
    "ui:field": "layout",
    "ui:responsive": true,
    ...groupLayout,
    default: {
      padding: "p-2",
      height: "fixed",
    },
  },
);

export type LayoutSettings = Static<typeof layout>;

/**
 * We don't manage margins yet (users have to move bricks over the grid to handle margins)
 */
const margin = Type.Union(
  [
    Type.Literal("m-0", { title: "0" }),
    Type.Literal("m-1", { title: "1" }),
    Type.Literal("m-2", { title: "2" }),
    Type.Literal("m-4", { title: "3" }),
    Type.Literal("m-8", { title: "4" }),
    Type.Literal("m-16", { title: "5" }),
    Type.Literal("m-32", { title: "6" }),
    Type.Literal("m-auto", { title: "Auto" }),
  ],
  {
    default: "m-0",
    title: "Margin",
    description: "Outside space around the brick",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupSpacing,
  },
);

export const backgroundColor = Type.String({
  $id: "backgroundColor",
  default: "transparent",
  title: "Background color",
  "ui:field": "color",
  "ui:color-type": "background",
  ...groupColors,
});

export const background = Type.Object(
  {
    color: Type.Optional(
      Type.String({
        default: "transparent",
        title: "Color",
      }),
    ),
    image: Type.Optional(
      Type.String({
        default: "https://placehold.co/400x200",
        title: "Image",
      }),
    ),
    size: Type.Optional(
      Type.Union(
        [
          Type.Literal("auto", { title: "Auto" }),
          Type.Literal("cover", { title: "Cover" }),
          Type.Literal("contain", { title: "Contain" }),
        ],
        {
          default: "auto",
        },
      ),
    ),
    repeat: Type.Optional(
      Type.Union(
        [
          Type.Literal("no-repeat", { title: "No repeat" }),
          Type.Literal("repeat", { title: "Repeat" }),
          Type.Literal("repeat-x", { title: "Repeat horizontally" }),
          Type.Literal("repeat-y", { title: "Repeat vertically" }),
          Type.Literal("space", { title: "Space" }),
          Type.Literal("round", { title: "Round" }),
        ],
        {
          default: "no-repeat",
        },
      ),
    ),
  },
  {
    "ui:field": "background",
    "ui:group": "background",
    "ui:group:title": "Background",
    "ui:show-img-search": true,
    title: "Background",
    default: {
      size: "auto",
      repeat: "no-repeat",
    },
  },
);

export type BackgroundSettings = Static<typeof background>;

const opacity = Type.Optional(
  Type.Number({
    $id: "opacity",
    minimum: 0.1,
    maximum: 1,
    default: 1,
    multipleOf: 0.1,
    title: "Opacity",
    description: "Global opacity",
    "ui:field": "slider",
    ...groupEffects,
  }),
);

const shadow = Type.Union(
  [
    Type.Literal("shadow-none", { title: "None" }),
    Type.Literal("shadow-sm", { title: "Small" }),
    Type.Literal("shadow-md", { title: "Medium" }),
    Type.Literal("shadow-lg", { title: "Large" }),
    Type.Literal("shadow-xl", { title: "Extra large" }),
    Type.Literal("shadow-2xl", { title: "Extra large (2x)" }),
  ],
  {
    $id: "shadow",
    default: "shadow-none",
    title: "Shadow",
    description: "Shadow",
    "ui:field": "enum",
    "ui:display": "button-group",
    ...groupEffects,
  },
);

export const effects = Type.Optional(
  Type.Object(
    {
      shadow,
      opacity,
    },
    {
      title: "Effects",
      "ui:field": "effects",
      "ui:group": "effects",
      "ui:group:title": "Effects",
      default: {
        shadow: "shadow-none",
        opacity: 1,
      },
    },
  ),
);

export type EffectsSettings = Static<typeof effects>;

export const flex = Type.Object(
  {
    direction: Type.Union(
      [Type.Literal("flex-row", { title: "Row" }), Type.Literal("flex-col", { title: "Column" })],
      {
        title: "Direction",
        description: "The direction of the container",
        "ui:field": "enum",
        "ui:display": "button-group",
        "ui:group": "layout",
      },
    ),
    wrap: Type.Union(
      [Type.Literal("flex-wrap", { title: "Wrap" }), Type.Literal("flex-nowrap", { title: "No wrap" })],
      {
        title: "Wrap",
        description: "Wrap items",
        "ui:field": "enum",
        "ui:display": "button-group",
        "ui:group": "layout",
      },
    ),
    gap: Type.Union(
      [
        Type.Literal("gap-0", { title: "None" }),
        Type.Literal("gap-1", { title: "Small" }),
        Type.Literal("gap-2", { title: "Medium" }),
        Type.Literal("gap-4", { title: "Large" }),
        Type.Literal("gap-8", { title: "Extra large" }),
        Type.Literal("gap-16", { title: "Extra large (2x)" }),
      ],
      {
        title: "Gap",
        description: "Space between items",
        "ui:field": "enum",
        "ui:group": "layout",
      },
    ),
  },
  {
    title: "Layout",
    "ui:field": "flex",
    "ui:responsive": true,
    default: {
      direction: "flex-row",
      gap: "gap-1",
      wrap: "flex-wrap",
    },
    ...groupLayout,
  },
);

export type FlexSettings = Static<typeof flex>;

export const alignFlex = Type.Object(
  {
    horizontal: Type.Union(
      [
        Type.Literal("start", { title: "Left" }),
        Type.Literal("center", { title: "Center" }),
        Type.Literal("end", { title: "Right" }),
        Type.Literal("between", { title: "Space between" }),
        Type.Literal("around", { title: "Space around" }),
        Type.Literal("evenly", { title: "Evenly distributed" }),
      ],
      {
        title: "Horizontal",
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "start",
      },
    ),
    vertical: Type.Union(
      [
        Type.Literal("start", { title: "Top" }),
        Type.Literal("center", { title: "Center" }),
        Type.Literal("end", { title: "Bottom" }),
        Type.Literal("baseline", { title: "Baseline" }),
        Type.Literal("stretch", { title: "Stretch" }),
      ],
      {
        title: "Vertical",
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "stretch",
      },
    ),
  },
  {
    "ui:responsive": true,
    "ui:field": "align-flex",
    default: {
      horizontal: "start",
      vertical: "stretch",
    },
    ...groupAlign,
  },
);

export const alignBasic = Type.Object(
  {
    horizontal: Type.Union(
      [
        Type.Literal("start", { title: "Left" }),
        Type.Literal("center", { title: "Center" }),
        Type.Literal("end", { title: "Right" }),
      ],
      {
        title: "Horizontal",
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "start",
      },
    ),
    vertical: Type.Union(
      [
        Type.Literal("start", { title: "Top" }),
        Type.Literal("center", { title: "Center" }),
        Type.Literal("end", { title: "Bottom" }),
      ],
      {
        title: "Vertical",
        "ui:group": "align",
        "ui:group:title": "Alignment",
        default: "stretch",
      },
    ),
  },
  {
    "ui:responsive": true,
    "ui:field": "align-basic",
    default: {
      horizontal: "start",
      vertical: "start",
    },
    ...groupAlign,
  },
);

export const alignBasicProps = Type.Object({
  align: alignBasic,
});

export type AlignFlexSettings = Static<typeof alignFlex>;
export type AlignBasicSettings = Static<typeof alignBasic>;

export const alignFlexProps = Type.Object({
  align: alignFlex,
});

export const flexProps = Type.Object({
  flex,
  children: Type.Array(Type.Any(), {
    "ui:field": "hidden",
  }),
});

const fontSize = Type.Union(
  [
    Type.Literal("inherit", { title: "Inherit from page/container" }),
    Type.Literal("text-xs", { title: "Extra small" }),
    Type.Literal("text-sm", { title: "Small" }),
    Type.Literal("text-base", { title: "Base size" }),
    Type.Literal("text-lg", { title: "Large" }),
    Type.Literal("text-xl", { title: "Extra large" }),
    Type.Literal("text-2xl", { title: "Extra large (x2)" }),
    Type.Literal("text-3xl", { title: "Extra large (x3)" }),
    Type.Literal("text-4xl", { title: "Extra large (x4)" }),
    Type.Literal("text-5xl", { title: "Extra large (x5)" }),
    Type.Literal("text-6xl", { title: "Extra large (x6)" }),
    Type.Literal("text-7xl", { title: "Extra large (x7)" }),
  ],
  {
    default: "inherit",
    title: "Default size",
    "ui:field": "enum",
    "ui:display": "select",
    "ui:group": "text",
  },
);

export const text = Type.Object(
  {
    size: fontSize,
    color: Type.Optional(
      Type.String({
        default: "transparent",
        title: "Default Color",
        "ui:field": "color",
        "ui:color-type": "text",
      }),
    ),
  },
  {
    title: "Text style",
    "ui:field": "text",
    "ui:group": "text",
    "ui:group:title": "Text",
    "ui:responsive": true,
    default: {
      size: "text-base",
      color: "inherit",
    },
  },
);

export type TextSettings = Static<typeof text>;

/**
 * No margin in common style props as bricks are usually placed in a grid
 */
export const commonStyleProps = Type.Object({
  layout,
  border,
  effects,
  background,
  text,
});

const textAlign = Type.Optional(
  Type.Union(
    [
      Type.Literal("text-left", { title: "Left", description: "Left align" }),
      Type.Literal("text-center", { title: "Center", description: "Center align" }),
      Type.Literal("text-right", { title: "Right", description: "Right align" }),
      Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
    ],
    {
      $id: "textAlign",
      default: "text-left",
      title: "Text alignment",
      description: "The text alignment",
      "ui:field": "enum",
      "ui:group": "text",
    },
  ),
);

const fontWeight = Type.Union(
  [
    Type.Literal("font-normal", { title: "1" }),
    Type.Literal("font-medium", { title: "2" }),
    Type.Literal("font-semibold", { title: "3" }),
    Type.Literal("font-bold", { title: "4" }),
    Type.Literal("font-extrabold", { title: "5" }),
  ],
  {
    $id: "fontWeight",
    default: "font-normal",
    title: "Font weight",
    description: "The text font weight",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:group": "text",
  },
);

export const color = Type.String({
  $id: "color",
  default: "transparent",
  title: "Text color",
  "ui:field": "color",
  "ui:color-type": "text",
  "ui:group": "text",
});

export const textStyleProps = Type.Object({
  color,
  textAlign,
  fontSize,
  fontWeight,
});
