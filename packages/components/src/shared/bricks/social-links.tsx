import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/social-links.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const SocialLinks = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a social</div>;
});

export default SocialLinks;
