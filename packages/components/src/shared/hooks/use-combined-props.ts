import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { mergeIgnoringArrays } from "@upstart.gg/sdk/shared/utils/merge";

export function useCombinedPropForKey<T extends BrickManifest>(
  brick: BrickProps<T>["brick"],
  key: keyof BrickProps<T>["brick"]["props"],
) {
  return mergeIgnoringArrays({}, brick.props[key as string], brick.mobileProps?.[key as string] ?? {});
}
