import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/countdown.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const CountDown = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  return <div>Im a CountDown</div>;
});

export default CountDown;
