import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const className = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <button type="button" className={className} data-text-editable={props.editable ?? false} ref={ref}>
      {props.label}
    </button>
  );
});

export default Button;
