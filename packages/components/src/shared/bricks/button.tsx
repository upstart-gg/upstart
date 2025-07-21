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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      toast(`This button is not clickable in edit mode`, {
        id: `button-no-click-toast`,
        style: {
          minWidth: "max-content",
        },
      });
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

  // Check if icon should be displayed on left or right
  const variants = Array.isArray(props.variants) ? props.variants : [];
  const hasIconLeft = variants.includes("btn-icon-left");
  const hasIconRight = variants.includes("btn-icon-right");
  const iconElement = props.icon ? <InlineIcon icon={props.icon} className="w-5 h-5" /> : null;

  return (
    <div className={tx("flex flex-1", props.justifyContent)}>
      <button
        type="button"
        className={tx("btn", styles.default, props.variants, props.round)}
        data-prevented-by-editor={editable ? "true" : "false"}
        ref={ref}
        onClick={handleClick}
      >
        {hasIconLeft && iconElement && <span className="mr-2">{iconElement}</span>}
        {props.label}
        {hasIconRight && iconElement && <span className="ml-2">{iconElement}</span>}
        {!hasIconLeft && !hasIconRight && iconElement && <span className="mr-2">{iconElement}</span>}
      </button>
    </div>
  );
});

export default Button;
