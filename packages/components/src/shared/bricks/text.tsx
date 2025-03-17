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
  const styles = useBrickStyle<Manifest>(brick);
  return (
    <div className={tx("flex-1", ...Object.values(styles))}>
      <TextContent
        ref={ref}
        propPath="content"
        // className={tx("flex-1", ...styles)}
        brickId={brick.id}
        content={props.content}
        editable={editable}
      />
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default Text;
