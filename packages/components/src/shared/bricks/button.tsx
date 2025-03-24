import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <button
      type="button"
      className={tx(styles.default)}
      data-text-editable={props.editable ?? false}
      ref={ref}
    >
      {props.label}
    </button>
  );
});

export default Button;
