import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const classes = Object.values(styles);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      e.preventDefault();
      return;
    }
    if (props.linkToUrlOrPageId) {
      if (props.linkToUrlOrPageId.startsWith("http")) {
        window.open(props.linkToUrlOrPageId, "_blank");
      } else {
        // Handle page navigation logic here
        console.log(`Navigate to page ID: ${props.linkToUrlOrPageId}`);
      }
    }
  };

  return (
    <button
      type="button"
      className={tx(
        classes,
        props.color,
        props.size,
        "flex-grow shrink-0 h-full font-medium min-w-fit text-nowrap min-h-fit",
        editable && "pointer-events-none",
      )}
      data-prevented-by-editor={editable ? "true" : "false"}
      ref={ref}
      onClick={handleClick}
    >
      {props.label}
    </button>
  );
});

export default Button;
