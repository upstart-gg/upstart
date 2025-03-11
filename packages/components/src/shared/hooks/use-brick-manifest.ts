import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";

export function useBrickManifest(brickOrType: Brick | Brick["type"]): BrickManifest {
  const type = typeof brickOrType === "string" ? brickOrType : brickOrType.type;
  return manifests[type];
}
