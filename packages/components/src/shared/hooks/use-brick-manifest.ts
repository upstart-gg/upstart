import type { BrickManifest } from "@upstart.gg/sdk/bricks";
import type { Brick } from "@upstart.gg/sdk/bricks";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/index";
import { useMemo } from "react";

export function useBrickManifest<T extends BrickManifest>(brickType: Brick["type"]): T {
  return useMemo(() => manifests[brickType] as T, [brickType]);
}
