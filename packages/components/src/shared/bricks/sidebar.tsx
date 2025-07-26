import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/sidebar.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickRoot from "../components/BrickRoot";

export default function Sidebar({ brick, editable }: BrickProps<Manifest>) {
  return <BrickRoot>Im a sidebar</BrickRoot>;
}
