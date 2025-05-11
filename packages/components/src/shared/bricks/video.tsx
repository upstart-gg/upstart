import { forwardRef, type ComponentProps } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/video.manifest";
import { tx, css } from "@upstart.gg/style-system/twind";

const Video = forwardRef<HTMLImageElement, Manifest["props"] & ComponentProps<"img">>((props, ref) => {
  const { alt, className, id, ...attrs } = props.brick.props;
  return <img {...attrs} ref={ref} alt={alt} className={tx("max-h-full", className)} />;
});

export default Video;
