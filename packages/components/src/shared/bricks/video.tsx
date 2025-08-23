import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/video.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import ReactPlayer from "react-player/lazy";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickRoot from "../components/BrickRoot";

export default function Video({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  return (
    <BrickRoot
      brick={brick}
      editable={editable}
      manifest={manifest}
      className={tx("relative", Object.values(styles))}
    >
      {/* Use an absolute div to allow for drag-and-drop when in edit mode */}
      {editable && <div className="absolute inset-0" />}
      <ReactPlayer url={props.url} width="100%" height="100%" />
    </BrickRoot>
  );
}
