import { type StringOptions, Type, type Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

export function preset(defaultValue?: string) {
  return Type.Union(
    [
      Type.Literal("prominent-primary", {
        title: "Prominent Primary",
        description: "Prominent display on primary-700 background.",
      }),
      Type.Literal("prominent-secondary", {
        title: "Prominent Secondary",
        description: "Prominent display on secondary-700 background.",
      }),
      Type.Literal("prominent-accent", {
        title: "Prominent Accent",
        description: "Prominent display on accent-700 background.",
      }),
      Type.Literal("primary", {
        title: "Primary",
        description: "Filled display on primary background with dark text.",
      }),
      Type.Literal("secondary", {
        title: "Secondary",
        description: "Filled display on secondary background with dark text.",
      }),
      Type.Literal("accent", {
        title: "Accent",
        description: "Filled display on accent background with dark text.",
      }),

      Type.Literal("medium-primary", {
        title: "Medium Primary",
        description: "Filled display on primary-200 background.",
      }),
      Type.Literal("medium-secondary", {
        title: "Medium Secondary",
        description: "Medium display on secondary-200 background.",
      }),
      Type.Literal("medium-accent", {
        title: "Medium Accent",
        description: "Medium display on accent-200 background.",
      }),
      Type.Literal("subtle-primary", {
        title: "Subtle Primary",
        description: "Subtle display on primary-100 background and 1px border.",
      }),
      Type.Literal("subtle-secondary", {
        title: "Subtle Secondary",
        description: "Subtle display on secondary-100 background and 1px border.",
      }),
      Type.Literal("subtle-accent", {
        title: "Subtle Accent",
        description: "Subtle display on accent-100 background and 1px border.",
      }),
      Type.Literal("surface-1", {
        title: "Surface 1",
        description: "Surface elevation 1, light background with dark text.",
      }),
      Type.Literal("surface-2", {
        title: "Surface 2",
        description: "Surface elevation 2, slightly darker background with dark text.",
      }),
      Type.Literal("surface-3", {
        title: "Surface 3",
        description: "Surface elevation 3, even darker background with dark text.",
      }),
      Type.Literal("light", {
        title: "Light",
        description:
          "Mainly white background with dark text. Useful for bricks inside a card or a container that already have a surface/background.",
      }),
      Type.Literal("dark", {
        title: "Dark",
        description:
          "Mainly dark background with light text. Useful for bricks inside a card or a container that already have a surface/background.",
      }),
      Type.Literal("preset-none", {
        title: "None",
        description:
          "No background and no border. Useful for bricks inside a card or a container that already have a surface/background.",
      }),
    ],
    {
      $id: "styles:preset",
      title: "Preset",
      description: "Styles presets are used to maintain styles consistency across the application.",
      default: defaultValue ?? "preset-none",
      "ui:field": "hidden",
    },
  );
}

export type Preset = Static<ReturnType<typeof preset>>;

export function presetRef(options: StringOptions = {}) {
  return typedRef("styles:preset", options);
}

export const presetsStyleProps = {
  "surface-1": {
    "styles:backgroundColor": "bg-base-100",
    "styles:color": "text-base-content",
    "styles:border": { color: "border-base-200" },
  },
  "surface-2": {
    "styles:backgroundColor": "bg-base-200",
    "styles:color": "text-base-content",
    "styles:border": { color: "border-base-300" },
  },
  "surface-3": {
    "styles:backgroundColor": "bg-base-300",
    "styles:color": "text-base-content",
    "styles:border": { color: "border-base-200" },
  },
  "prominent-primary": {
    "styles:backgroundColor": "bg-primary-700",
    "styles:color": "text-primary",
    "styles:border": { color: "border-primary-800" },
  },
  "prominent-secondary": {
    "styles:backgroundColor": "bg-secondary-700",
    "styles:color": "text-secondary",
    "styles:border": { color: "border-secondary-800" },
  },
  "prominent-accent": {
    "styles:backgroundColor": "bg-accent-700",
    "styles:color": "text-accent",
    "styles:border": { color: "border-accent-800" },
  },
  primary: {
    "styles:backgroundColor": "bg-primary",
    "styles:color": "text-primary",
    "styles:border": { color: "border-primary" },
  },
  secondary: {
    "styles:backgroundColor": "bg-secondary",
    "styles:color": "text-secondary",
    "styles:border": { color: "border-secondary" },
  },
  accent: {
    "styles:backgroundColor": "bg-accent",
    "styles:color": "text-accent",
    "styles:border": { color: "border-accent" },
  },

  "medium-primary": {
    "styles:backgroundColor": "bg-primary-200",
    "styles:color": "text-primary-800",
    "styles:border": { color: "border-primary-300" },
  },
  "medium-secondary": {
    "styles:backgroundColor": "bg-secondary-200",
    "styles:color": "text-secondary-800",
    "styles:border": { color: "border-secondary-300" },
  },
  "medium-accent": {
    "styles:backgroundColor": "bg-accent-200",
    "styles:color": "text-accent-800",
    "styles:border": { color: "border-accent-300" },
  },
  "subtle-primary": {
    "styles:backgroundColor": "bg-primary-100",
    "styles:color": "text-primary-800",
    "styles:border": { color: "border-primary-200" },
  },
  "subtle-secondary": {
    "styles:backgroundColor": "bg-secondary-100",
    "styles:color": "text-secondary-800",
    "styles:border": { color: "border-secondary-200" },
  },
  "subtle-accent": {
    "styles:backgroundColor": "bg-accent-100",
    "styles:color": "text-accent-800",
    "styles:border": { color: "border-accent-200" },
  },
  "preset-none": {},
};
