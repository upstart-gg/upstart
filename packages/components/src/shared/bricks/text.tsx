import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { TextContent } from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);

  return (
    <div className={tx("flex-inherit", ...classes)}>
      <TextContent
        ref={ref}
        propPath="content"
        className="first-child:first-line:leading-[100%]"
        brickId={brick.id}
        content={props.content ?? "Your text here..."}
        editable={editable}
      />
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default Text;
