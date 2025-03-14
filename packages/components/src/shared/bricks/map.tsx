import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const WidgetMap = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a map</div>;
});

export default WidgetMap;
