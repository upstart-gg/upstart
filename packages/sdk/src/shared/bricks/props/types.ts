import type { BrickManifest } from "~/shared/brick-manifest";

export type BrickProps<Manifest extends BrickManifest> = Manifest["props"] & {
  mobileOverride: Partial<Manifest["props"]>;
};
