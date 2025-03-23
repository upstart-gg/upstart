import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/image.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Image = forwardRef<HTMLImageElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const { props } = brick;
  const { image: imageStyles, ...containerStyles } = useBrickStyle(brick);
  const { src, alt } = props.image;

  return (
    <div
      className={tx(apply("flex items-center justify-center h-full w-full"), Object.values(containerStyles))}
    >
      <img
        src={src}
        ref={ref}
        alt={alt}
        className={tx(
          apply("max-h-full w-full h-full min-w-1 min-h-1 select-none pointer-events-none"),
          imageStyles,
        )}
      />
    </div>
  );
});

export default Image;
