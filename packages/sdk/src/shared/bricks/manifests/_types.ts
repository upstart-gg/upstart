import type { BrickManifest } from "~/shared/brick-manifest";
import type { BrickProps } from "../props/types";

export type BrickExample<Manifest extends BrickManifest> = {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
  mobileProps?: Partial<BrickProps<Manifest>["brick"]["props"]>;
};
