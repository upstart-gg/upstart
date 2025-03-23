import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/image.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Image = forwardRef<HTMLImageElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const { props } = brick;
  const className = useBrickStyle(brick);
  const { src, alt } = props.image;

  console.log("image brick", { brick, className });

  return (
    <div className={tx(apply("flex items-center justify-center h-full w-full"), className)}>
      <img
        src={src}
        ref={ref}
        alt={alt}
        className={tx(apply("max-h-full min-w-1 min-h-1 brick-content select-none pointer-events-none"))}
      />
    </div>
  );
});

export default Image;
