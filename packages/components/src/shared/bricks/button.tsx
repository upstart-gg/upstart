import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import clsx from "clsx";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <button
      type="button"
      className={clsx("btn", styles.default, props.variants)}
      data-text-editable={props.editable ?? false}
      ref={ref}
    >
      {props.label}
    </button>
  );
});

export default Button;
