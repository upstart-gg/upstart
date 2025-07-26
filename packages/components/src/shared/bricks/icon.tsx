import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/icon.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

export default function Icon({ brick }: BrickProps<Manifest>) {
  return <span>Icon</span>;
}
