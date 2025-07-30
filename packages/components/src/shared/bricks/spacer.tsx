import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/spacer.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickRoot from "../components/BrickRoot";

export default function Spacer({ brick, editable, selected }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      data-mobile-hidden
      className={tx(
        "@mobile:hidden h-full",
        editable &&
          "outline-dotted -outline-offset-1 outline-transparent hover:(striped-bg outline-black/10) group-hover/section:(striped-bg outline-black/10) transition-colors duration-150",
        selected && "striped-bg ",
        ...Object.values(styles),
      )}
    />
  );
}
