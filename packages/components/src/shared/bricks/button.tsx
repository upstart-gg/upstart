import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";
import { useSitemap } from "~/editor/hooks/use-page-data";

export default function Button({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const classes = Object.values(styles);
  const sitemap = useSitemap();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      e.preventDefault();
      return;
    }
    if (props.linkToUrlOrPageId) {
      if (props.linkToUrlOrPageId.startsWith("http")) {
        window.open(props.linkToUrlOrPageId, "_blank");
      } else {
        const page = sitemap.find((p) => p.id === props.linkToUrlOrPageId);
        if (page) {
          window.location.href = page.path; // Navigate to the page URL if it exists
        }
      }
    }
  };

  return (
    <BrickRoot
      brick={brick}
      manifest={manifest}
      editable={editable}
      as="button"
      type="button"
      className={tx(
        classes,
        "btn",
        css({
          "&:hover": {
            filter: "brightness(1.15)",
          },
        }),
        editable && "pointer-events-none",
      )}
      data-prevented-by-editor={editable ? "true" : "false"}
      onClick={handleClick}
    >
      {props.label}
    </BrickRoot>
  );
}
