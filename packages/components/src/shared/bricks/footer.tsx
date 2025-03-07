import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a footer</div>;
});

export default Footer;
