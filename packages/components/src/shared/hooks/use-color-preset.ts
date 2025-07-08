import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { ColorPresets } from "@upstart.gg/sdk/shared/bricks/props/preset";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickManifest } from "./use-brick-manifest";
import get from "lodash-es/get";

/**
 * Get the class name for a color preset.
 * If a preset is provided, it will return the class name for that preset.
 * If no preset is provided, it will return undefined.
 */
export function useColorPreset<T extends BrickManifest>(brick: BrickProps<T>["brick"]) {
  const manifest = useBrickManifest(brick.type);
  for (const [path, schema] of Object.entries(manifest.props.properties)) {
    if (schema["ui:presets"]) {
      const availablePresets = schema["ui:presets"] as ColorPresets;
      const currentPreset = get(brick.props, path) as keyof ColorPresets;
      if (currentPreset && availablePresets[currentPreset]) {
        return availablePresets[currentPreset].value;
      }
      return schema.default as ColorPresets[keyof ColorPresets]["value"];
    }
  }
  return {} as ColorPresets[keyof ColorPresets]["value"];
}
