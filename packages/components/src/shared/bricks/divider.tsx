import { forwardRef, type ComponentProps } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/divider.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Divider = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <div
      ref={ref}
      className={tx(
        {
          "h-px": props.orientation === "horizontal",
          "w-px": props.orientation === "vertical",
        },
        props.orientation === "horizontal" && (props.size ? `w-[${props.size}]` : "w-full"),
        props.orientation === "vertical" && (props.size ? `h-[${props.size}]` : "h-full"),
        props.color,
        Object.values(styles),
      )}
    />
  );
});

export default Divider;
