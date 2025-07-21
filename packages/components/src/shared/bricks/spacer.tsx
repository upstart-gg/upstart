import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/spacer.manifest";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Divider = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable, selected }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <div
      ref={ref}
      className={tx(
        "flex-grow flex-shrink-0 @mobile:w-full h-full",
        editable &&
          "outline-dotted -outline-offset-1 outline-transparent hover:(striped-bg outline-black/10) group-hover/section:(striped-bg outline-black/10) transition-colors duration-150",
        selected && "striped-bg ",
        ...Object.values(styles),
      )}
    />
  );
});

export default Divider;
