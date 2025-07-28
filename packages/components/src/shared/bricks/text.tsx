import { useBrickStyle } from "../hooks/use-brick-style";
import { type Manifest, manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import TextContent from "../components/TextContent";
import { tx } from "@upstart.gg/style-system/twind";
import { useColorPreset } from "../hooks/use-color-preset";
import BrickRoot from "../components/BrickRoot";

/**
 * Text brick
 */
export default function Text({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const presetClasses = useColorPreset<Manifest>(brick);

  return (
    <BrickRoot manifest={manifest} className={tx("flex", classes, presetClasses.main)}>
      <TextContent
        propPath="content"
        className={tx("first-child:first-line:leading-[100%] text-wrap")}
        brickId={brick.id}
        content={props.content}
        editable={editable}
      />
    </BrickRoot>
  );
}
