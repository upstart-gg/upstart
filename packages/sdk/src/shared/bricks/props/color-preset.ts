import type { Static, SchemaOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

type ColorPresetOptions = SchemaOptions & {
  "ui:presets"?: Record<string, { className: string; label: string }>;
};

export const colorPresets: NonNullable<ColorPresetOptions["ui:presets"]> = {
  "primary-50": {
    className: "bg-primary-50 text-primary-50-content",
    label: "Primary 50",
  },
  "primary-100": {
    className: "bg-primary-100 text-primary-100-content",
    label: "Primary 100",
  },
  "primary-200": {
    className: "bg-primary-200 text-primary-200-content",
    label: "Primary 200",
  },
  "primary-300": {
    className: "bg-primary-300 text-primary-300-content",
    label: "Primary 300",
  },
  "primary-400": {
    className: "bg-primary-400 text-primary-400-content",
    label: "Primary 400",
  },
  "primary-500": {
    className: "bg-primary-500 text-primary-500-content",
    label: "Primary 500",
  },
  "primary-600": {
    className: "bg-primary-600 text-primary-600-content",
    label: "Primary 600",
  },
  "primary-700": {
    className: "bg-primary-700 text-primary-700-content",
    label: "Primary 700",
  },
  "primary-800": {
    className: "bg-primary-800 text-primary-800-content",
    label: "Primary 800",
  },
  "primary-900": {
    className: "bg-primary-900 text-primary-900-content",
    label: "Primary 900",
  },
  "secondary-50": {
    className: "bg-secondary-50 text-secondary-50-content",
    label: "Secondary 50",
  },
  "secondary-100": {
    className: "bg-secondary-100 text-secondary-100-content",
    label: "Secondary 100",
  },
  "secondary-200": {
    className: "bg-secondary-200 text-secondary-200-content",
    label: "Secondary 200",
  },
  "secondary-300": {
    className: "bg-secondary-300 text-secondary-300-content",
    label: "Secondary 300",
  },
  "secondary-400": {
    className: "bg-secondary-400 text-secondary-400-content",
    label: "Secondary 400",
  },
  "secondary-500": {
    className: "bg-secondary-500 text-secondary-500-content",
    label: "Secondary 500",
  },
  "secondary-600": {
    className: "bg-secondary-600 text-secondary-600-content",
    label: "Secondary 600",
  },
  "secondary-700": {
    className: "bg-secondary-700 text-secondary-700-content",
    label: "Secondary 700",
  },
  "secondary-800": {
    className: "bg-secondary-800 text-secondary-800-content",
    label: "Secondary 800",
  },
  "secondary-900": {
    className: "bg-secondary-900 text-secondary-900-content",
    label: "Secondary 900",
  },
  "accent-50": {
    className: "bg-accent-50 text-accent-50-content",
    label: "Accent 50",
  },
  "accent-100": {
    className: "bg-accent-100 text-accent-100-content",
    label: "Accent 100",
  },
  "accent-200": {
    className: "bg-accent-200 text-accent-200-content",
    label: "Accent 200",
  },
  "accent-300": {
    className: "bg-accent-300 text-accent-300-content",
    label: "Accent 300",
  },
  "accent-400": {
    className: "bg-accent-400 text-accent-400-content",
    label: "Accent 400",
  },
  "accent-500": {
    className: "bg-accent-500 text-accent-500-content",
    label: "Accent 500",
  },
  "accent-600": {
    className: "bg-accent-600 text-accent-600-content",
    label: "Accent 600",
  },
  "accent-700": {
    className: "bg-accent-700 text-accent-700-content",
    label: "Accent 700",
  },
  "accent-800": {
    className: "bg-accent-800 text-accent-800-content",
    label: "Accent 800",
  },
  "accent-900": {
    className: "bg-accent-900 text-accent-900-content",
    label: "Accent 900",
  },
  "neutral-50": {
    className: "bg-neutral-50 text-neutral-50-content",
    label: "Neutral 50",
  },
  "neutral-100": {
    className: "bg-neutral-100 text-neutral-100-content",
    label: "Neutral 100",
  },
  "neutral-200": {
    className: "bg-neutral-200 text-neutral-200-content",
    label: "Neutral 200",
  },
  "neutral-300": {
    className: "bg-neutral-300 text-neutral-300-content",
    label: "Neutral 300",
  },
  "neutral-400": {
    className: "bg-neutral-400 text-neutral-400-content",
    label: "Neutral 400",
  },
  "neutral-500": {
    className: "bg-neutral-500 text-neutral-500-content",
    label: "Neutral 500",
  },
  "neutral-600": {
    className: "bg-neutral-600 text-neutral-600-content",
    label: "Neutral 600",
  },
  "neutral-700": {
    className: "bg-neutral-700 text-neutral-700-content",
    label: "Neutral 700",
  },
  "neutral-800": {
    className: "bg-neutral-800 text-neutral-800-content",
    label: "Neutral 800",
  },
  "neutral-900": {
    className: "bg-neutral-900 text-neutral-900-content",
    label: "Neutral 900",
  },
  "base-100": {
    className: "bg-base-100 text-base-100-content",
    label: "Base 100",
  },
  "base-200": {
    className: "bg-base-200 text-base-200-content",
    label: "Base 200",
  },
  "base-300": {
    className: "bg-base-300 text-base-300-content",
    label: "Base 300",
  },
  "primary-gradient-100": {
    className: "from-primary-100 to-primary-200 text-primary-100-content",
    label: "Primary gradient 1",
  },
  "primary-gradient-200": {
    className: "from-primary-200 to-primary-300 text-primary-200-content",
    label: "Primary gradient 2",
  },
  "primary-gradient-300": {
    className: "from-primary-300 to-primary-400 text-primary-300-content",
    label: "Primary gradient 3",
  },
  "primary-gradient-400": {
    className: "from-primary-400 to-primary-500 text-primary-400-content",
    label: "Primary gradient 4",
  },
  "primary-gradient-500": {
    className: "from-primary-500 to-primary-600 text-primary-500-content",
    label: "Primary gradient 5",
  },
  "primary-gradient-600": {
    className: "from-primary-600 to-primary-700 text-primary-600-content",
    label: "Primary gradient 6",
  },
  "primary-gradient-700": {
    className: "from-primary-700 to-primary-800 text-primary-700-content",
    label: "Primary gradient 7",
  },
  "primary-gradient-800": {
    className: "from-primary-800 to-primary-900 text-primary-800-content",
    label: "Primary gradient 8",
  },
  "secondary-gradient-100": {
    className: "from-secondary-100 to-secondary-200 text-secondary-100-content",
    label: "Secondary gradient 1",
  },
  "secondary-gradient-200": {
    className: "from-secondary-200 to-secondary-300 text-secondary-200-content",
    label: "Secondary gradient 2",
  },
  "secondary-gradient-300": {
    className: "from-secondary-300 to-secondary-400 text-secondary-300-content",
    label: "Secondary gradient 3",
  },
  "secondary-gradient-400": {
    className: "from-secondary-400 to-secondary-500 text-secondary-400-content",
    label: "Secondary gradient 4",
  },
  "secondary-gradient-500": {
    className: "from-secondary-500 to-secondary-600 text-secondary-500-content",
    label: "Secondary gradient 5",
  },
  "secondary-gradient-600": {
    className: "from-secondary-600 to-secondary-700 text-secondary-600-content",
    label: "Secondary gradient 6",
  },
  "secondary-gradient-700": {
    className: "from-secondary-700 to-secondary-800 text-secondary-700-content",
    label: "Secondary gradient 7",
  },
  "secondary-gradient-800": {
    className: "from-secondary-800 to-secondary-900 text-secondary-800-content",
    label: "Secondary gradient 8",
  },
  "accent-gradient-100": {
    className: "from-accent-100 to-accent-200 text-accent-100-content",
    label: "Accent gradient 1",
  },
  "accent-gradient-200": {
    className: "from-accent-200 to-accent-300 text-accent-200-content",
    label: "Accent gradient 2",
  },
  "accent-gradient-300": {
    className: "from-accent-300 to-accent-400 text-accent-300-content",
    label: "Accent gradient 3",
  },
  "accent-gradient-400": {
    className: "from-accent-400 to-accent-500 text-accent-400-content",
    label: "Accent gradient 4",
  },
  "accent-gradient-500": {
    className: "from-accent-500 to-accent-600 text-accent-500-content",
    label: "Accent gradient 5",
  },
  "accent-gradient-600": {
    className: "from-accent-600 to-accent-700 text-accent-600-content",
    label: "Accent gradient 6",
  },
  "accent-gradient-700": {
    className: "from-accent-700 to-accent-800 text-accent-700-content",
    label: "Accent gradient 7",
  },
  "accent-gradient-800": {
    className: "from-accent-800 to-accent-900 text-accent-800-content",
    label: "Accent gradient 8",
  },
  "neutral-gradient-100": {
    className: "from-neutral-100 to-neutral-200 text-neutral-100-content",
    label: "Neutral gradient 1",
  },
  "neutral-gradient-200": {
    className: "from-neutral-200 to-neutral-300 text-neutral-200-content",
    label: "Neutral gradient 2",
  },
  "neutral-gradient-300": {
    className: "from-neutral-300 to-neutral-400 text-neutral-300-content",
    label: "Neutral gradient 3",
  },
  "neutral-gradient-400": {
    className: "from-neutral-400 to-neutral-500 text-neutral-400-content",
    label: "Neutral gradient 4",
  },
  "neutral-gradient-500": {
    className: "from-neutral-500 to-neutral-600 text-neutral-500-content",
    label: "Neutral gradient 5",
  },
  "neutral-gradient-600": {
    className: "from-neutral-600 to-neutral-700 text-neutral-600-content",
    label: "Neutral gradient 6",
  },
  "neutral-gradient-700": {
    className: "from-neutral-700 to-neutral-800 text-neutral-700-content",
    label: "Neutral gradient 7",
  },
  "neutral-gradient-800": {
    className: "from-neutral-800 to-neutral-900 text-neutral-800-content",
    label: "Neutral gradient 8",
  },
  "base-gradient-100": {
    className: "from-base-100 to-base-200 text-base-100-content",
    label: "Base gradient 1",
  },
  "base-gradient-200": {
    className: "from-base-200 to-base-300 text-base-200-content",
    label: "Base gradient 2",
  },
  none: {
    className: "",
    label: "None",
  },
};

export function colorPreset(options: ColorPresetOptions = {}) {
  return StringEnum(Object.keys(colorPresets), {
    title: "Color preset",
    description: "Color preset to apply to background and text",
    enumNames: Object.keys(colorPresets).map((key) => colorPresets[key].label),
    "ai:instructions": `Presets are predefined color combinations of background and text colors that can be applied to elements. They include various shades of primary, secondary, accent, and neutral colors, as well as gradients. You can also select 'none' to remove any preset.`,
    "ui:styleId": "presets:color",
    "ui:field": "color-preset",
    "ui:responsive": true,
    "ui:presets": colorPresets,
    ...options,
  });
}

export type ColorPresetSettings = Static<ReturnType<typeof colorPreset>>;

export function colorPresetRef(options: ColorPresetOptions) {
  return typedRef("presets:color", options);
}
