import type { BrickManifest } from "~/shared/brick-manifest";
import type { Brick } from "~/shared/bricks";

export type BrickProps<Manifest extends BrickManifest> = Manifest["props"] & {
  id: Brick["id"];
  mobileOverride: Partial<Manifest["props"]>;
};
