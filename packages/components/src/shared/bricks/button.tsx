import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";

export default function Button({ brick, editable }: BrickProps<Manifest>) {
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
        // TODO: Handle internal page navigation
        // Handle page navigation logic here
        console.log(`Navigate to page ID: ${props.linkToUrlOrPageId}`);
      }
    }
  };

  return (
    <BrickRoot
      manifest={manifest}
      editable={editable}
      as="button"
      type="button"
      className={tx(
        classes,
        "font-medium min-h-fit max-h-fit flex items-center text-center justify-center flex-wrap text-ellipsis py-[0.55em] px-[1em]",
        css({
          "&:hover": {
            filter: "brightness(1.15)",
          },
        }),
        // editable && "pointer-events-none",
      )}
      data-prevented-by-editor={editable ? "true" : "false"}
      onClick={handleClick}
    >
      {props.label}
    </BrickRoot>
  );
}
