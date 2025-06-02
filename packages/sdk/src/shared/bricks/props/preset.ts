import { Type, type Static } from "@sinclair/typebox";
import { backgroundColor } from "./background";

export function preset(defaultValue?: string) {
  return Type.Union(
    [
      Type.Literal("surface-1", {
        title: "Surface 1",
        description: "Surface elevation 1",
      }),
      Type.Literal("surface-2", {
        title: "Surface 2",
        description: "Surface elevation 2",
      }),
      Type.Literal("surface-3", {
        title: "Surface 3",
        description: "Surface elevation 3",
      }),
      Type.Literal("bold-primary", {
        title: "Bold Primary",
        description: "Bold display on primary-700 background",
      }),
      Type.Literal("bold-secondary", {
        title: "Bold Secondary",
        description: "Bold display on secondary-700 background",
      }),
      Type.Literal("bold-accent", {
        title: "Bold Accent",
        description: "Bold display on accent-700 background",
      }),
      Type.Literal("medium-primary", {
        title: "Medium Primary",
        description: "Filled display on primary-200 background",
      }),
      Type.Literal("medium-secondary", {
        title: "Medium Secondary",
        description: "Medium display on secondary-200 background",
      }),
      Type.Literal("medium-accent", {
        title: "Medium Accent",
        description: "Medium display on accent-200 background",
      }),

      Type.Literal("subtle-primary", {
        title: "Subtle Primary",
        description: "Subtle display on primary-100 background and 1px border",
      }),
      Type.Literal("subtle-secondary", {
        title: "Subtle Secondary",
        description: "Subtle display on secondary-100 background and 1px border",
      }),
      Type.Literal("subtle-accent", {
        title: "Subtle Accent",
        description: "Subtle display on accent-100 background and 1px border",
      }),
      Type.Literal("preset-none", {
        title: "None",
        description:
          "No background and no border. This is useful for bricks inside a card or a container that already have a surface/background.",
      }),
    ],
    {
      title: "Preset",
      description: "The styles preset of the component",
      "ui:field": "hidden",
      default: defaultValue ?? "preset-none",
    },
  );
}

export type Preset = Static<ReturnType<typeof preset>>;

/*
   ["surface-", ({ $$ }) => `@(bg-base-${$$}00 text-base${$$}00 border-base-${$$}00)`],
    ["bold-", ({ $$ }) => `@(bg-${$$}-700 text-${$$} border-${$$}-800)`],
    ["medium-", ({ $$ }) => `@(bg-${$$}-200 text-${$$}-800 border-${$$}-300)`],
    ["subtle-", ({ $$ }) => `@(bg-${$$}-50 text-${$$}-800 border-${$$}-100)`],
    */
export const presetsStyleProps = {
  "surface-1": {
    "#styles:backgroundColor": "bg-base-100",
    "#styles:color": "text-base-100",
    "#styles:border": { color: "border-base-100" },
  },
  "surface-2": {
    "#styles:backgroundColor": "bg-base-200",
    "#styles:color": "text-base-200",
    "#styles:border": { color: "border-base-200" },
  },
  "surface-3": {
    "#styles:backgroundColor": "bg-base-300",
    "#styles:color": "text-base-300",
    "#styles:border": { color: "border-base-300" },
  },
  "bold-primary": {
    "#styles:backgroundColor": "bg-primary-700",
    "#styles:color": "text-primary",
    "#styles:border": { color: "border-primary-800" },
  },
  "bold-secondary": {
    "#styles:backgroundColor": "bg-secondary-700",
    "#styles:color": "text-secondary",
    "#styles:border": { color: "border-secondary-800" },
  },
  "bold-accent": {
    "#styles:backgroundColor": "bg-accent-700",
    "#styles:color": "text-accent",
    "#styles:border": { color: "border-accent-800" },
  },
  "medium-primary": {
    "#styles:backgroundColor": "bg-primary-200",
    "#styles:color": "text-primary-800",
    "#styles:border": { color: "border-primary-300" },
  },
  "medium-secondary": {
    "#styles:backgroundColor": "bg-secondary-200",
    "#styles:color": "text-secondary-800",
    "#styles:border": { color: "border-secondary-300" },
  },
  "medium-accent": {
    "#styles:backgroundColor": "bg-accent-200",
    "#styles:color": "text-accent-800",
    "#styles:border": { color: "border-accent-300" },
  },
  "subtle-primary": {
    "#styles:backgroundColor": "bg-primary-100",
    "#styles:color": "text-primary-800",
    "#styles:border": { color: "border-primary-100" },
  },
  "subtle-secondary": {
    "#styles:backgroundColor": "bg-secondary-100",
    "#styles:color": "text-secondary-800",
    "#styles:border": { color: "border-secondary-100" },
  },
  "subtle-accent": {
    "#styles:backgroundColor": "bg-accent-100",
    "#styles:color": "text-accent-800",
    "#styles:border": { color: "border-accent-100" },
  },
  "preset-none": {},
};
