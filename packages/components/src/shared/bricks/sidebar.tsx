import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/sidebar.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Sidebar = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a sidebar</div>;
});

export default Sidebar;
