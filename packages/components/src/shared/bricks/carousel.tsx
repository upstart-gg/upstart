import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/carousel.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Carousel = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a card</div>;
});

export default Carousel;
