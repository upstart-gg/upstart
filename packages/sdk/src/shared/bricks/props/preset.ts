import { Type, type Static, type SchemaOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

type ColorPresetOptions = SchemaOptions & {
  "ui:presets": ColorPresets;
};

export function colorPreset(opts?: ColorPresetOptions) {
  const { title = "Color preset", ...options } = opts ?? {};
  return Type.String({
    title,
    description: "Color preset to apply to background and text",
    $id: "presets:color",
    "ui:styleId": "presets:color",
    "ui:field": "color-preset",
    "ui:responsive": "desktop",
    ...options,
  });
}

export type ColorPresetSettings = Static<ReturnType<typeof colorPreset>>;

export function colorPresetRef(options: ColorPresetOptions) {
  return typedRef("presets:color", { ...options, "ui:styleId": "presets:color" });
}

export type ColorPresets = Record<
  string,
  {
    /**
     * Class name to apply for the background color pill preview.
     */
    previewBgClass?: string;
    /**
     * Part/className object to apply to the brick.
     */
    value: Record<string, string>;
    label: string;
  }
>;
