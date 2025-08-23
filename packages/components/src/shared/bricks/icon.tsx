import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/icon.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickRoot from "../components/BrickRoot";
import { InlineIcon } from "@iconify/react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";

export default function Icon({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle(brick);
  return (
    <BrickRoot brick={brick} editable={editable} manifest={manifest} className={tx(Object.values(styles))}>
      <InlineIcon icon={props.icon} width={props.size} height={props.size} />
    </BrickRoot>
  );
}
