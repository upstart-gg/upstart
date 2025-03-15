import { forwardRef } from "react";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { TextContent } from "../components/TextContent";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const { props } = brick;
  const className = useBrickStyle<Manifest>(brick);
  console.log("renering text brick", props);
  return (
    <TextContent
      ref={ref}
      propPath="content"
      className={tx(className)}
      brickId={brick.id}
      content={props.content}
      editable={editable}
    />
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeIgnoringPaths(Text, ["brick.props.content"]);
