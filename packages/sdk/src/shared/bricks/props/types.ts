import type { BrickManifest } from "~/shared/brick-manifest";

export type BrickProps<M extends BrickManifest> = M["props"] & {
  id: string;
  mobileProps: Partial<M["props"]>;
};
