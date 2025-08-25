import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/html.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickRoot from "../components/BrickRoot";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";

export default function Html({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle(brick);
  return (
    <BrickRoot brick={brick} editable={editable} manifest={manifest} className={tx(Object.values(styles))}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Purpose is to render HTML content */}
      <div dangerouslySetInnerHTML={{ __html: props.html }} />
    </BrickRoot>
  );
}
