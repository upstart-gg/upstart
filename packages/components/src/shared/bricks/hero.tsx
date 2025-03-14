import { forwardRef } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import { TextContent } from "../components/TextContent";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const className = useBrickStyle<Manifest>(brick);
  const props = brick.props;

  return (
    <TextContent
      as="h1"
      propPath="brand.name"
      className={tx("hero", className)}
      brickId={brick.id}
      content={props.content}
      editable={editable}
      inline
    />
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeIgnoringPaths(Hero, ["brick.props.content"]);
