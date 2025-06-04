import type { Static } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/schema";

export function preset(defaultValue?: string) {
  return StringEnum(
    [
      "surface-1",
      "surface-2",
      "surface-3",
      "bold-primary",
      "bold-secondary",
      "bold-accent",
      "medium-primary",
      "medium-secondary",
      "medium-accent",
      "subtle-primary",
      "subtle-secondary",
      "subtle-accent",
      "preset-none",
    ],
    {
      title: "Preset",
      description: `The styles preset of the component, used to maintain styles consistency across the application.
  * surface-1: Surface elevation 1, light background with dark text.
  * surface-2: Surface elevation 2, slightly darker background with dark text.
  * surface-3: Surface elevation 3, even darker background with dark text.
  * bold-primary: Bold display on primary-700 background.
  * bold-secondary: Bold display on secondary-700 background.
  * bold-accent: Bold display on accent-700 background.
  * medium-primary: Filled display on primary-200 background.
  * medium-secondary: Medium display on secondary-200 background.
  * medium-accent: Medium display on accent-200 background.
  * subtle-primary: Subtle display on primary-100 background and 1px border.
  * subtle-secondary: Subtle display on secondary-100 background and 1px border.
  * subtle-accent: Subtle display on accent-100 background and 1px border.
  * preset-none: No background and no border. Useful for bricks inside a card or a container that already have a surface/background.
`,
      default: defaultValue ?? "preset-none",
      enumNames: [
        "Surface 1",
        "Surface 2",
        "Surface 3",
        "Bold Primary",
        "Bold Secondary",
        "Bold Accent",
        "Medium Primary",
        "Medium Secondary",
        "Medium Accent",
        "Subtle Primary",
        "Subtle Secondary",
        "Subtle Accent",
        "None",
      ],
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
