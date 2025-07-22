import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { toast } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { InlineIcon } from "@iconify/react/dist/iconify.js";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const classes = Object.values(styles);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      // toast(`This button is not clickable in edit mode`, {
      //   id: `button-no-click-toast`,
      //   style: {
      //     minWidth: "max-content",
      //   },
      // });
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
      className={tx(classes, props.color, props.size, "btn h-full w-full font-medium")}
      data-prevented-by-editor={editable ? "true" : "false"}
      ref={ref}
      onClick={handleClick}
    >
      {props.label}
    </button>
  );
});

export default Button;
