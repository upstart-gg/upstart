import { forwardRef } from "react";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  const className = useBrickStyle<Manifest>(brick);
  return (
    <div
      ref={ref}
      className={tx(className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: brick.props.content }}
    />
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeIgnoringPaths(Text, ["brick.props.content"]);
