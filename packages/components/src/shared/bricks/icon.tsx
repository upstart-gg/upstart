import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/icon.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Icon = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <span>Icon</span>;
});

export default Icon;
