import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/carousel.manifest";
import type { BrickWithProps } from "@upstart.gg/sdk/shared/bricks";

const Carousel = forwardRef<HTMLDivElement, BrickWithProps<Manifest>>(({ props }, ref) => {
  props = { ...Value.Create(manifest.props), ...props };

  return <div>Im a card</div>;
});

export default Carousel;
