import { forwardRef } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import { TextContent } from "../components/TextContent";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  const classes = Object.values(styles);

  return (
    <div className={tx("flex-1", ...classes)}>
      <TextContent
        as="h1"
        propPath="brand.name"
        className={tx("hero grow flex-wrap text-wrap")}
        brickId={brick.id}
        content={props.content}
        textSizeMode="hero"
        editable={editable}
        noTextType
      />
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeIgnoringPaths(Hero, ["brick.props.content"]);
