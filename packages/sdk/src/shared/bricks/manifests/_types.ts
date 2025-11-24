import type { BrickProps } from "../props/types";
import type { BrickManifest } from "../types";

export type BrickExample<Manifest extends BrickManifest> = {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
  mobileProps?: Partial<BrickProps<Manifest>["brick"]["props"]>;
};
