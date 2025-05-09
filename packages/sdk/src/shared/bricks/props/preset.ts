import { Type } from "@sinclair/typebox";

export function preset(defaultValue?: string) {
  return Type.Union(
    [
      Type.Literal("bold-primary", {
        title: "Bold Primary",
        description: "Bold display on primary-700 background",
      }),
      Type.Literal("bold-primary-gradient", {
        title: "Bold Primary Gradient",
        description: "Bold display on primary-700 to primary-600 background gradient",
      }),
      Type.Literal("bold-secondary", {
        title: "Bold Secondary",
        description: "Bold display on secondary-700 background",
      }),
      Type.Literal("bold-secondary-gradient", {
        title: "Bold Secondary Gradient",
        description: "Bold display on secondary-700 to secondary-600 background gradient",
      }),
      Type.Literal("bold-accent", {
        title: "Bold Accent",
        description: "Bold display on accent-700 background",
      }),
      Type.Literal("bold-accent-gradient", {
        title: "Bold Accent Gradient",
        description: "Bold display on accent-700 to accent-600 background gradient",
      }),
      Type.Literal("medium-primary", {
        title: "Medium Primary",
        description: "Filled display on primary-200 background",
      }),
      Type.Literal("medium-primary-gradient", {
        title: "Medium Primary Gradient",
        description: "Filled display on primary-200 to primary-100 background gradient",
      }),
      Type.Literal("medium-secondary", {
        title: "Medium Secondary",
        description: "Medium display on secondary-200 background",
      }),
      Type.Literal("medium-secondary-gradient", {
        title: "Medium Secondary Gradient",
        description: "Medium display on secondary-200 to secondary-100 background gradient",
      }),
      Type.Literal("medium-accent", {
        title: "Medium Accent",
        description: "Medium display on accent-200 background",
      }),
      Type.Literal("medium-accent-gradient", {
        title: "Medium Accent Gradient",
        description: "Medium display on accent-200 to accent-100 background gradient",
      }),
      Type.Literal("medium-base", {
        title: "Medium Base",
        description: "Medium display on base-200",
      }),
      Type.Literal("medium-base-gradient", {
        title: "Medium Base Gradient",
        description: "Medium display on base-200 to base-100 background gradient",
      }),
      Type.Literal("subtle-base", {
        title: "Subtle",
        description: "Subtle display on base-100 background and 1px border",
      }),
      Type.Literal("subtle-base-gradient", {
        title: "Subtle Gradient",
        description: "Subtle display on base-200 to base-100 background gradient and 1px border",
      }),
      Type.Literal("subtle-primary", {
        title: "Subtle Primary",
        description: "Subtle display on primary-100 background and 1px border",
      }),
      Type.Literal("subtle-primary-gradient", {
        title: "Subtle Primary Gradient",
        description: "Subtle display on primary-200 to primary-100 background gradient and 1px border",
      }),
      Type.Literal("subtle-secondary", {
        title: "Subtle Secondary",
        description: "Subtle display on secondary-100 background and 1px border",
      }),
      Type.Literal("subtle-secondary-gradient", {
        title: "Subtle Secondary Gradient",
        description: "Subtle display on secondary-200 to secondary-100 background gradient and 1px border",
      }),
      Type.Literal("subtle-accent", {
        title: "Subtle Accent",
        description: "Subtle display on accent-100 background and 1px border",
      }),
      Type.Literal("subtle-accent-gradient", {
        title: "Subtle Accent Gradient",
        description: "Subtle display on accent-200 to accent-100 background gradient and 1px border",
      }),
      Type.Literal("ghost", {
        title: "Ghost",
        description:
          "No background and no border. This is useful for bricks inside a card or a container that already have a surface/background.",
      }),
    ],
    {
      title: "Preset",
      description: "The styles preset of the component",
      "ui:field": "hidden",
      default: defaultValue,
    },
  );
}
