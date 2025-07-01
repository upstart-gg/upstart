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
        "flex-grow flex-shrink-0 @mobile:w-full",
        editable &&
          "hover:(striped-bg bg-gray-100) group-hover/section:(striped-bg bg-gray-100) transition-colors duration-[200ms] delay-[100ms]",
        selected && "striped-bg bg-gray-100",
        ...Object.values(styles),
      )}
    />
  );
});

export default Divider;
