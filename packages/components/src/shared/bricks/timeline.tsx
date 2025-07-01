import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/timeline.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Timeline = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <span>Timeline</span>;
});

export default Timeline;
