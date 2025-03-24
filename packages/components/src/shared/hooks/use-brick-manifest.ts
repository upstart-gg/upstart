import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";

export function useBrickManifest<T extends BrickManifest>(brickType: Brick["type"]): T {
  return manifests[brickType] as T;
}
