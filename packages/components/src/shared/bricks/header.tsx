import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/header.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { getBrickManifestDefaults } from "@upstart.gg/sdk/shared/brick-manifest";

const defaults = getBrickManifestDefaults(manifest);

const Header = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...defaults.props, ...props };

  const className = useBrickStyle(props);

  return <div className={className}>Im a header</div>;
});

export default Header;
