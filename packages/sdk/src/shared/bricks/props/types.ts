import type { Static } from "@sinclair/typebox";
import type { BrickManifest } from "~/shared/brick-manifest";
import type { Brick } from "~/shared/bricks";

export type BrickProps<T extends BrickManifest> = {
  brick: Omit<Brick, "props" | "mobileProps"> & {
    props: Static<T["props"]>;
    mobileProps: Partial<Static<T["props"]>>;
  };
  editable?: boolean;
  className?: string;
  selected?: boolean;
};
