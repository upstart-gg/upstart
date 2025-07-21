import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { toast } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { renderIcon } from "../utils/icon-resolver";

const Button = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const classes = Object.values(styles);

  const handelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (editable) {
      console.warn("Form is editable, submission is disabled");
      toast(`This form is not clickable in edit mode but will lead to form submission when published.`, {
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

  return (
    <div className={tx("flex flex-1")}>
      <button
        type="button"
        className={tx(classes, props.color, props.size, "flex-1 w-full")}
        data-text-editable={editable ?? false}
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          handelClick(e);
        }}
      >
        {props.label}
      </button>
    </div>
  );
});

export default Button;
