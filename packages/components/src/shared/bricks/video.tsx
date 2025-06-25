import { forwardRef, type ComponentProps } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/video.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import ReactPlayer from "react-player/lazy";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Video = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  return (
    <div ref={ref} className={tx("max-h-full flex-1", Object.values(styles))}>
      <ReactPlayer url={props.url} width="100%" height="100%" />
    </div>
  );
});

export default Video;
