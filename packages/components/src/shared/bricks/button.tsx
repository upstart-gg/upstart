import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, css } from "@upstart.gg/style-system/twind";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  return (
    <div className={tx("flex flex-1", props.justifyContent)}>
    <button
      type="button"
      className={tx("btn", styles.default, props.variants)}
      data-text-editable={props.editable ?? false}
      ref={ref}
    >
      {props.label}
    </button>
    </div>
  );
});

export default Button;
