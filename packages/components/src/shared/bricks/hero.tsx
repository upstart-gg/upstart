import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import TextContent from "../components/TextContent";
import { tx } from "@upstart.gg/style-system/twind";
import { isTextContentEmpty } from "../utils/text-content";
import BrickRoot from "../components/BrickRoot";
import { useBrickProps } from "../hooks/use-brick-props";

export default function Hero(_props: BrickProps<Manifest>) {
  const { brick, editable, selected } = _props;
  const props = useBrickProps(_props);
  const styles = useBrickStyle<Manifest>(brick);

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx("flex-col gap-[1.5rem] flex-grow", Object.values(styles))}
    >
      <TextContent
        as="h1"
        propPath="content"
        brickId={brick.id}
        content={props.content}
        textSizeMode="hero"
        editable={editable}
        noTextType
      />
      <TextContent
        as="p"
        propPath="tagline"
        className={tx(
          "tagline text-2xl font-bold text-balance",
          // When editing, hide tagline if empty but show it on hover
          editable && isTextContentEmpty(props.tagline) && !selected
            ? "opacity-0 hover:opacity-80"
            : "opacity-80",
        )}
        brickId={brick.id}
        content={props.tagline}
        editable={editable}
      />
    </BrickRoot>
  );
}
