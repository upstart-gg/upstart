import { useBrickStyle } from "../hooks/use-brick-style";
import { type Manifest, manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import TextContent from "../components/TextContent";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";

/**
 * Text brick
 */
export default function Text({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);

  return (
    <BrickRoot
      brick={brick}
      editable={editable}
      manifest={manifest}
      className={tx("flex grow h-full", classes)}
    >
      <TextContent
        propPath="content"
        className={tx("text-pretty grow")}
        brickId={brick.id}
        content={props.content}
        editable={editable}
      />
    </BrickRoot>
  );
}
